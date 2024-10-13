import { Mote } from '@magik_io/mote';
import type { ComponentDescriptor } from './processing/ComponentDescriptor';
import type { ESig } from './components/ESig';
import type { SlideToggle } from './components/SlideToggle';

export type GrimoireTemplateNames = 'slide-toggle' | 'e-sig';

declare global {
  interface HTMLTagElementMap {
    'slide-toggle': SlideToggle;
    'e-sig': ESig;
  }
}

const GrimoireImportMap = {
  'slide-toggle': () => import('./components/SlideToggle'),
  'e-sig': () => import('./components/ESig')
} as const;

type CustomChroma = { dark: string; light: string; }

export class Grimoire {
  static activeComponents: Array<ComponentDescriptor> = [];
  static chroma: 'browser' | 'class' | CustomChroma | false = 'browser';
  public static Configure({ chroma = 'browser' }: { chroma: 'browser' | 'class' | CustomChroma | false }) {
    Grimoire.chroma = chroma;
    return this;
  }

  protected static Night() {
    if (!Grimoire.chroma) return '';
    if (Grimoire.chroma === 'browser') return `@media (prefers-color-scheme: dark) {`
    if (Grimoire.chroma === 'class') return `body.dark {`
    if (Grimoire.chroma.dark) return `body.${Grimoire.chroma.dark} {`
    return '';
  }

  protected static Day() {
    if (!Grimoire.chroma) return '';
    if (Grimoire.chroma === 'browser') return `@media (prefers-color-scheme: light) {`
    if (Grimoire.chroma === 'class') return `body.light {`
    if (Grimoire.chroma.light) return `body.${Grimoire.chroma.light} {`
    return '';
  }

  protected static ExtractStyles(component: ComponentDescriptor) {
    const { name, style: { vars, dark, light, base } } = component;
    function RecordToCSS(record?: Record<string, string>) {
      if (!record) return '';
      return Object.entries(record).map(([key, value]) => `  ${key}: ${value};`).join('\n')
    }

    return ({
      component: name,
      vars: RecordToCSS(vars),
      dark: RecordToCSS(dark),
      light: RecordToCSS(light),
      base: base.originalString.join('')
    })
  }

  protected static Adorn() {
    /** Now we need to extract the following from each activate component:
     * 1. The Base Style
     * 2. The Base Variables
     * 3. The Dark & Light Styles
     * 
     * Then we will combine them into a single style block taking care too:
     * 1. Make only one `Day` and `Night` block, combining all the dark and light styles
     * 2. Combine all the variables into a single block in the :root
     * 3. Combine all the base styles into a single block
     * */
    const styleVarBlocks = Grimoire.activeComponents.map(Grimoire.ExtractStyles);

    const combinedVars = styleVarBlocks.map(({ vars }) => vars).join('\n');
    const combinedDark = styleVarBlocks.map(({ dark }) => dark).join('\n');
    const combinedLight = styleVarBlocks.map(({ light }) => light).join('\n');
    const combinedBase = styleVarBlocks.map(({ base }) => base).join('\n');

    let cssString = `
:root {
  ${combinedVars}
}
`
    if (combinedDark.length > 0 && Grimoire.chroma !== false) {
      cssString += `
${Grimoire.Night()}
  :root {
    ${combinedDark}
  }
}
`}
    if (combinedLight.length > 0) {
      cssString += `
${Grimoire.Day()}
  :root {
    ${combinedLight}
  }
}
`}
    cssString += `
${combinedBase}
`
    new Mote('style').html(cssString).appendTo(document.head);
  }

  protected static asAbove(component: ComponentDescriptor) {
    Grimoire.activeComponents.push(component);
    return this;
  }

  protected static soBelow(component: ComponentDescriptor) {
    switch (component.type) {
      case 'custom-element': {
        customElements.define(component.name, component.element);
        break;
      }
      case 'extends-element': {
        customElements.define(component.name, component.element, { extends: component.extendsEl });
        break;
      }
      default: throw new Error(`Type ${component.type} not found`);
    }

    return this;
  }

  public static async Define(...components: Array<GrimoireTemplateNames>) {
    await Promise.all(components.map(async (componentName) => {

      const importFunction = GrimoireImportMap[componentName];
      if (!importFunction) throw new Error(`[GRIMOIRE] ~> Component ${componentName} not found`);

      const { default: component } = await importFunction();
      if (!component) throw new Error(`[GRIMOIRE] ~> Component ${componentName} not found`);
      console.log(component)

      Grimoire.asAbove(component).soBelow(component)
    }));

    Grimoire.Adorn();

    return Grimoire.activeComponents.map(c => Grimoire.ExtractStyles(c))
  }
}
