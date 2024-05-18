import { Mote } from '@magik_io/mote';
import type { ComponentDescriptor } from './processing/ComponentDescriptor';

export type GrimoireTemplateNames = ['slide-toggle'];
const GrimoireImportMap: Record<GrimoireTemplateNames[number], () => Promise<{ default: ComponentDescriptor }>> = {
  'slide-toggle': () => import('./components/SlideToggle'),
}

export default class Grimoire {
  static styleBlocks = [] as string[];
  static styleVarBlocks = [] as Array<{ component: string, styleVars: Record<string, string> }>

  protected static Adorn() {
    new Mote('style').html(Grimoire.styleBlocks.join('')).appendToHead();
  }

  protected static asAbove(component: ComponentDescriptor) {
    component.styleVars.originalString.forEach((styleBlock) => {
      Grimoire.styleBlocks.push(styleBlock);
    });

    component.style.originalString.forEach((styleBlock) => {
      Grimoire.styleBlocks.push(styleBlock);
    });

    Grimoire.styleVarBlocks.push({ styleVars: component.styleVars.extractedVariables, component: component.name })

    return this;
  }

  protected static soBelow(component: ComponentDescriptor) {
    switch (component.type) {
      case 'custom-element':
        customElements.define(component.name, component.element);
        break;
      case 'extends-element':
        customElements.define(component.name, component.element, { extends: component.extendsEl });
        break;
      default: throw new Error(`Type ${component.type} not found`);
    }

    return this;
  }

  public static async Define(...components: GrimoireTemplateNames) {
    for await (const componentName of components) {
      const importFunction = GrimoireImportMap[componentName];
      if (!importFunction) throw new Error(`[GRIMOIRE] ~> Component ${componentName} not found`);

      const { default: component } = await importFunction();
      if (!component) throw new Error(`[GRIMOIRE] ~> Component ${componentName} not found`);

      Grimoire.asAbove(component).soBelow(component)
    }

    Grimoire.Adorn();

    return this.styleVarBlocks;
  }

  public static async Hint(...components: GrimoireTemplateNames) {
    const StylesVarsPerComponent = await Promise.all(components.map(async (componentName) => {
      const importFunction = GrimoireImportMap[componentName];
      if (!importFunction) throw new Error(`[GRIMOIRE] ~> Component ${componentName} not found`);

      const { default: component } = await importFunction();
      if (!component) throw new Error(`[GRIMOIRE] ~> Component ${componentName} not found`);

      return { component: component.name, styles: component.styleVars };
    }))

    return StylesVarsPerComponent;
  }
}
