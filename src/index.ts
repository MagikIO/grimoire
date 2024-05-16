interface ComponentDescriptor {
  name: string;
  constructor: CustomElementConstructor;
  type: 'custom-element' | 'extends-element';
  extends?: string;
}

const Components = {
  SlideToggle: './slideToggle/SlideToggle.js',
}

export default async function DefineGrimoire(...components: Array<keyof typeof Components>) {
  for await (const component of components) {
    try {
      const componentModule = await import(`${Components[component]}`) as ComponentDescriptor;
      if (!componentModule) throw new Error(`Component ${component} not found`);
      const { name, constructor, type, extends: extendsElement } = componentModule;
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

