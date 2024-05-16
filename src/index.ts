interface ComponentDescriptor {
  name: string;
  constructor: CustomElementConstructor;
  type: 'custom-element' | 'extends-element';
  extends?: string;
}

export type ComponentNames = ['SlideToggle'];
const componentImportMap: Record<ComponentNames[number], () => Promise<{ default: ComponentDescriptor }>> = {
  'SlideToggle': () => import('./slideToggle/SlideToggle'),
};

function defineElement(component: ComponentDescriptor) {
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

export default async function DefineGrimoire(...components: Array<ComponentNames[number]>) {
  for await (const componentName of components) {
    try {
      const importFunction = componentImportMap[componentName];
      if (!importFunction) throw new Error(`Component ${componentName} not found`);

      const { default: component } = await importFunction();
      if (!component) throw new Error(`Component ${componentName} not found`);

      defineElement(component);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        throw new Error(`[GRIMOIRE] ~> Error: ${error.message}`);
      }
      throw new Error(`[GRIMOIRE] ~> Error: ${error}`);
    }
  }
}
