import { Mote } from '@magik_io/mote';
import { ComponentDescriptor } from '../processing/ComponentDescriptor';

export class ESig extends HTMLElement {
  protected __meta = {
    fonts: new Map([
      ['dancing-script', 'Dancing Script'],
      ['great-vibes', 'Great Vibes'],
      ['homemade-apple', 'Homemade Apple'],
      ['marck-script', 'Marck Script'],
      ['sacramento', 'Sacramento'],
      ['satisfy', 'Satisfy']
    ]),
    idPrefix: 'e-sig'
  }
  protected __span = new Mote('span');
  protected __icon = new Mote('i');
  protected __nameToRender = '';
  constructor() { super(); }

  connectedCallback() {
    this.classList.add('ESignature')

    const icon = this.getAttribute('icon') || 'fas fa-cog';
    this.__icon.addClass(icon).on('click', () => this.__showFontSelections())

    const fontAttr = this.getAttribute('font');

    const font = (fontAttr)
      ? this.__meta.fonts.get(fontAttr) ?? 'dancing-script'
      : 'dancing-script';
    // Get the text content inside of the open and close tags
    this.__nameToRender = `${this.innerHTML}`.trim();
    this.innerHTML = '';

    this.__span.addClass(font)
    this.__span.textContent(this.__nameToRender)
    this.__span.appendTo(this)
    this.__icon.appendTo(this)
  }

  protected __showFontSelections() {
    try {
      const selectionsContainer = new Mote('div');
      selectionsContainer.addClass('e-sig-font-selections');

      Array.from(this.__meta.fonts.keys()).forEach((font, index) => {
        const visualPicker = new Mote('div')
        visualPicker.on('click', (e) => {
          const input = e.target.querySelector('input');
          if (input) input.click();
        })

        const input = new Mote(`input#${this.__meta.idPrefix}-${index}`)
        input.set({ type: 'radio', name: 'eSigGeneratorFont', value: font })
        input.on('change', (e) => {
          this.__span.removeClass([...this.__meta.fonts.keys()])
          this.__span.addClass(e.target.value as string)
          selectionsContainer.remove()
        })

        const label = new Mote('label')
        label.textContent(this.__nameToRender).addClass(font).htmlFor(`${this.__meta.idPrefix}-${index}`)

        input.appendTo(visualPicker.element);
        label.appendTo(visualPicker.element);
        visualPicker.appendTo(selectionsContainer.element);
      })

      if (!this.parentElement) {
        throw new Error(`Parent element not found, unable to append font selections`)
      }

      selectionsContainer.appendTo(this.parentElement);
    } catch (error) {
      console.error(error)
    }
  }

  static get observedAttributes() { return ['font', 'icon']; }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    switch (name) {
      case 'font':
        if (this.__meta.fonts.has(newValue)) {
          this.__span.removeClass(oldValue).addClass(newValue);
        }
        break;
      case 'icon':
        this.__icon.removeClass(oldValue).addClass(newValue);
        break;
    }
  }
}

/**
 * ## ESig Magik Component
 * @element e-sig
 * ---
 * ### Style Variables
 * @cssprop {color} [--eSig-bg=#212529] - The background color of the e-sig
 */
export default new ComponentDescriptor({
  name: 'e-sig',
  element: ESig,
  type: 'custom-element',
  style: {
    theme: {
      light: {
        '--eSig-bg': '#f8f9fa',
        '--eSig-border-color': 'rgba(0, 0, 0, 0.25)',
        '--eSig-color': '#000'
      },
      dark: {
        '--eSig-bg': '#212529',
        '--eSig-border-color': 'rgba(255, 255, 255, 0.25)',
        '--eSig-color': '#fff'
      }
    },
    vars: {
      '--eSig-border-style': 'solid',
      '--eSig-border-radius': '0.25rem',
      '--eSig-border-width': '1px',
      '--eSig-line-height': '4rem',
      '--eSig-padding': '0.35rem',
      '--eSig-margin-bottom': '0.25rem',
      '--eSig-icon': 'fas fa-cog',
    },
    base: CSSVars => CSSVars`
    
    @keyframes Rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    :root {
      .dancing-script { font-family: 'Dancing Script', cursive; }
      .great-vibes { font-family: 'Great Vibes', cursive; }
      .homemade-apple { font-family: 'Homemade Apple', cursive; }
      .marck-script { font-family: 'Marck Script', cursive; }
      .sacramento { font-family: 'Sacramento', cursive; }
      .satisfy { font-family: 'Satisfy', cursive; }
    }

    .e-sig-font-selections {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;

      > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0.5rem;
        margin: 0.25rem;
        border-radius: 0.25rem;
        background-color: var(--eSig-bg);
        color: var(--eSig-color);
        cursor: pointer;
        font-size: larger;
        transition: all 0.25s ease-in-out;

        &:hover {
          background-color: #f8f9fa;
          color: #000;
        }

        input {
          display: none;
        }
      }
    }

    .ESignature {
      height: auto;
      max-height: 100%;
      max-width: 100%;
      padding: var(--eSig-padding);
      border: var(--eSig-border-width) var(--eSig-border-style) var(--eSig-border-color);
      background-color: var(--eSig-bg);
      line-height: var(--eSig-line-height);
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: var(--eSig-margin-bottom);
      display: flex;
      align-items: center;
      justify-content: center;
    
      span {
        color: var(--eSig-color);
        font-size: clamp(2rem, calc(2.25rem + (2.25 - 1.25) * (100vw - 768px)/(1920 - 768)), 3rem);
        text-wrap: balance;
      }

      i,svg {
        color: var(--eSig-color);
        font-size: clamp(1rem, calc(1.5rem + (2.25 - 1.25) * (100vw - 768px)/(1920 - 768)), 2rem);
        position: absolute;
        left: clamp(63dvw, 70dvw, 77dvw);
        top: 4.7dvh;

        &:hover {
          color: #5391c5;
          cursor: pointer;
          animation: Rotate 4s linear infinite;
        }
      }

    }`
  },
})
