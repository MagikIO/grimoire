import { Mote } from '@magik_io/mote';
import { ulid } from 'ulid';

class SlideToggle extends HTMLElement {
  protected __template = document.createElement('template');
  protected __sRoot: ShadowRoot | undefined;
  protected __input: Mote<`input#${string}`, true> | undefined
  protected __label: Mote<"label", true> | undefined
  protected __style = `
  :host {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    text-align: left;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
    box-sizing: border-box;
    display: block;
    min-height: 1.5rem;
    margin-bottom: .125rem;
    padding-left: 2.5em;

    > input {
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: transparent;
      box-sizing: border-box;
      margin: 0;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      height: 1em;
      margin-top: .25em;
      vertical-align: top;
      background-color: #fff;
      background-repeat: no-repeat;
      background-size: contain;
      border: 1px solid rgba(0,0,0,.25);
      appearance: none;
      -webkit-print-color-adjust: exact;
      float: left;
      width: 2em;
      margin-left: -2.5em;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba%280, 0, 0, 0.25%29'/%3e%3c/svg%3e");
      background-position: left center;
      border-radius: 2em;
      transition: background-position .15s ease-in-out;
    }

    > label {
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: transparent;
      box-sizing: border-box;
      display: inline-block;
    }
  }`
  public activated = (this.getAttribute('checked') === 'true') || false

  constructor() {
    super();
  }

  protected __attachStyle(target: ShadowRoot) {
    if (!document.getElementById('SlideToggleStyle')) {
      new Mote('style#SlideToggleStyle').textContent(this.__style).appendTo(target)
    }
  }

  connectedCallback() {
    this.__sRoot = this.attachShadow({ mode: 'open' });
    this.__attachStyle(this.__sRoot);

    const id = (this.getAttribute('id'))
      ? `input-${this.getAttribute('id')}`
      : `slide-toggle-${ulid()}`

    this.__input = new Mote(`input#${id}`);
    this.__input.set({
      type: `checkbox`,
      checked: this.activated
    })
    this.__input.on('change', () => {
      this.activated = !this.activated
    })

    this.__label = new Mote(`label`)
    this.__label.set({ for: id, textContent: this.getAttribute('label') ?? '' })

    this.__input.appendTo(this.__sRoot)
    this.__label.appendTo(this.__sRoot)
  }
}


export default ({
  name: 'SlideToggle' as const,
  constructor: SlideToggle,
  type: 'custom-element' as const
})
