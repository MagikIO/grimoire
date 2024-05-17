export interface ComponentDescriptor {
  name: string;
  constructor: CustomElementConstructor;
  type: 'custom-element' | 'extends-element';
  extends?: string;
}

export type GrimoireTemplateNames = ['slide-toggle'];
const GrimoireImportMap: Record<GrimoireTemplateNames[number], () => Promise<{ default: ComponentDescriptor }>> = {
  'slide-toggle': () => import('./slideToggle/SlideToggle'),
}

export default class Grimoire {
  protected static asAbove(component: ComponentDescriptor) {
    switch (component.type) {
      case 'custom-element':
        customElements.define(component.name, component.constructor);
        break;
      case 'extends-element':
        customElements.define(component.name, component.constructor, { extends: component.extends });
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
