interface ComponentDescriptor {
  name: string;
  constructor: CustomElementConstructor;
  type: 'custom-element' | 'extends-element';
  extends?: string;
}

export type ComponentNames = ['SlideToggle'];

export default async function DefineGrimoire(...components: Array<ComponentNames[number]>) {
  for await (const componentName of components) {
    let component: ComponentDescriptor;
    try {
      switch (componentName) {
        case 'SlideToggle':
          component = (await import('./slideToggle/SlideToggle.js')).Template;
          break;
        default:
          throw new Error(`Component ${componentName} not found`);
      }
      if (!component) throw new Error(`Component ${component} not found`);
      const { name, constructor, type, extends: extendsElement } = component;
      switch (type) {
        case 'custom-element':
          customElements.define(name, constructor);
          break;
        case 'extends-element':
          customElements.define(name, constructor, { extends: extendsElement });
          break;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        throw new Error(`[GRIMOIRE] ~> Error: ${error.message}`);
      }
      throw new Error(`[GRIMOIRE] ~> Error: ${error}`);
    }
  }
}

