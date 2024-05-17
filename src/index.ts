import type { ComponentDescriptor } from './ComponentDescriptor';

export type GrimoireTemplateNames = ['slide-toggle'];
const GrimoireImportMap: Record<GrimoireTemplateNames[number], () => Promise<{ default: ComponentDescriptor }>> = {
  'slide-toggle': () => import('./slideToggle/SlideToggle'),
}

export default class Grimoire {
  protected static asAbove(component: ComponentDescriptor) {
    switch (component.type) {
      case 'custom-element':
        customElements.define(component.name, component.element);
        break;
      case 'extends-element':
        customElements.define(component.name, component.element, { extends: component.extendsEl });
        break;
      default: throw new Error(`Type ${component.type} not found`);
    }
  }

  public static async Define(...components: GrimoireTemplateNames) {
    for await (const componentName of components) {
      try {
        const importFunction = GrimoireImportMap[componentName];
        if (!importFunction) throw new Error(`Component ${componentName} not found`);

        const { default: component } = await importFunction();
        if (!component) throw new Error(`Component ${componentName} not found`);

        Grimoire.asAbove(component);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`[GRIMOIRE] ~> Error: ${error.message}`, error);
        }
        throw new Error(`[GRIMOIRE] ~> Error: ${error}`);
      }
    }
  }
}
