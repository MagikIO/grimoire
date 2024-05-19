import { Mote } from '@magik_io/mote';
import { ComponentDescriptor } from '../processing/ComponentDescriptor';

class ESig extends HTMLElement {
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
  constructor() { super(); }

  connectedCallback() {
    this.classList.add('ESignature')

    const icon = this.getAttribute('icon') || 'fas fa-cog';
    this.__icon.addClass(icon)

    const fontAttr = this.getAttribute('font');

    const font = (fontAttr)
      ? this.__meta.fonts.get(fontAttr) ?? 'dancing-script'
      : 'dancing-script';
    // Get the text content inside of the open and close tags
    const name = `${this.innerHTML}`.trim();
    this.innerHTML = '';

    this.__span.addClass(font)
    this.__span.textContent(name)
    this.__span.appendTo(this)
    this.__icon.appendTo(this)
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
      '--eSig-fonts': `@import url("https://fonts.googleapis.com/css?family=Dancing+Script|Great+Vibes|Homemade+Apple|Marck+Script|Sacramento|Satisfy")`
    },
    base: CSSVars => CSSVars`
    @import var(--eSig-fonts);
    @keyframes Rotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
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
    
      .dancing-script { font-family: 'Dancing Script', cursive; }
      .great-vibes { font-family: 'Great Vibes', cursive; }
      .homemade-apple { font-family: 'Homemade Apple', cursive; }
      .marck-script { font-family: 'Marck Script', cursive; }
      .sacramento { font-family: 'Sacramento', cursive; }
      .satisfy { font-family: 'Satisfy', cursive; }
    }`
  },
})
