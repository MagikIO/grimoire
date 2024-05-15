interface ComponentDescriptor {
  name: string;
  constructor: CustomElementConstructor;
  type: 'custom-element' | 'extends-element';
  extends?: string;
}


const Components = {
  SlideToggle: './slideToggle/SlideToggle',
}

export default async function DefineGrimoire(...components: Array<keyof typeof Components>) {
  for await (const component of components) {
    const { default: componentModule } = await import(Components[component]);
    const { name, constructor, type, extends: extendsElement } = componentModule as ComponentDescriptor;
    switch (type) {
      case 'custom-element':
        customElements.define(name, constructor);
        break;
      case 'extends-element':
        customElements.define(name, constructor, { extends: extendsElement });
        break;
    }
  }
}

