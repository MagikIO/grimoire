import { Mote } from '@magik_io/mote';
import { ComponentDescriptor } from '../processing/ComponentDescriptor';

export class SlideToggle extends HTMLElement {
  protected __meta = { checked: false, label: '', idPrefix: 'slide-toggle' }
  protected __template = new Mote('template').addClass('SlideToggle')
  protected __input = new Mote('input').addClass('slide-input')
  protected __label = new Mote('label')

  public get activated() { return this.__meta.checked }
  public set activated(value: boolean) {
    this.__meta.checked = value
    this.__input?.check(value)
    this.dispatchEvent(new CustomEvent('change', { detail: { checked: value } }))
  }

  constructor() { super(); }

  connectedCallback() {
    // Assign meta
    this.__meta.checked = (this.getAttribute('checked') ?? 'false') === 'true'
    this.__meta.label = this.getAttribute('label') ?? ''
    this.__meta.idPrefix = this.getAttribute('name') ?? this.getAttribute('id') ?? `slide-toggle`
    // Set up the input
    this.__input.set({ type: `checkbox`, checked: this.activated }).addClass('slideInput')
    if (this.getAttribute('name')) {
      this.__input.name(this.getAttribute('name')!)
      this.__label.htmlFor(this.getAttribute('name')!);
    }
    // Set up the label text
    if (this.__meta.label?.length > 0) this.__label.textContent(this.__meta.label)

    // Add event listener
    this.addEventListener('click', () => { this.activated = !this.activated })

    this.__input.appendTo(this.__template.self())
    this.__label.appendTo(this.__template.self())
    this.__template.appendTo(this)
  }
}

/**
 * ## SlideToggle Magik Component
 * @element slide-toggle
 * @attr {string} [checked=false] - The initial state of the slide toggle
 * @attr {string} [label=''] - The label text for the slide toggle
 * @attr {string} [name='slide-toggle'] - The name of the input element
 * ---
 * ### Style Variables
 * @cssprop {color} [--st-body-bg=#212529] - The background color of the slide toggle
 * @cssprop {color} [--st-check-bg=var(--st-body-bg)] - The background color of the checkmark
 * @cssprop {image} [--st-check-bg-image=url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba(0, 0, 0, .25)'/%3e%3c/svg%3e")] - The background image of the checkmark
 * @cssprop {length} [--st-border-width=1px] - The border width of the slide toggle
 * @cssprop {color} [--st-border-color=rgba(0, 0, 0, .25)] - The border color of the slide toggle
 * @cssprop {color} [--st-checked-bg=#0d6efd] - The background color of the slide toggle when checked
 */
export default new ComponentDescriptor({
  name: 'slide-toggle',
  element: SlideToggle,
  type: 'custom-element',
  style: {
    base: CSSVars => CSSVars`
    .slide-input {
    --st-check-bg: var(--st-body-bg);
    flex-shrink: 0;
    width: 1em;
    height: 1em;
    margin-top: .25em;
    vertical-align: top;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: var(--st-check-bg);
    background-image: var(--st-check-bg-image);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    border: var(--st-border-width) solid var(--st-border-color);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .SlideToggle {
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
  
    font-size: 1rem;
    line-height: 1.5;
    color: #212529;
    text-align: left;
    box-sizing: border-box;
    display: block;
    min-height: 1.5rem;
    margin-bottom: .125rem;
    padding-left: 2.5em;
  
    & .slide-input {
      --st-switch-bg: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba%280, 0, 0, 0.25%29'/%3e%3c/svg%3e");
      width: 2em;
      margin-left: -2.5em;
      background-image: var(--st-switch-bg);
      background-position: left center;
      border-radius: 2em;
      transition: background-position .15s ease-in-out;
      float: left;
  
      &:focus {
        outline: 0;
        --st-check-bg: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 10 3 3 6-6'/%3e%3c/svg%3e");
      }
  
      &:checked {
        background-color: var(--st-checked-bg);
        border-color: var(--st-checked-bg);
        background-position: right center;
        --st-switch-bg: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23fff'/%3e%3c/svg%3e");
      }
  
      &[type='checkbox']:checked {
        --st-check-bg-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='m6 10 3 3 6-6'/%3e%3c/svg%3e");
      }
  
      &:not(:checked):not(:focus) {
        --st-switch-bg: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='rgba(255, 255, 255, 0.25)'/%3e%3c/svg%3e");
      }
    }
  
    & label {
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: transparent;
      box-sizing: border-box;
      display: inline-block;
      color: var(--st-color);
    }
  }`,
    vars: {
      '--st-check-bg': 'var(--st-body-bg)',
      '--st-check-bg-image': 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'-4 -4 8 8\'%3E%3Ccircle r=\'3\' fill=\'rgba(0, 0, 0,.25)\'/%3E%3C/svg%3E")',
      '--st-border-width': '1px',
      '--st-border-color': 'rgba(0, 0, 0, .25)',
    },
    theme: {
      light: { "--st-body-bg": '#212529', "--st-checked-bg": '#0d6efd', '--st-color': '#000' },
      dark: { "--st-body-bg": '#212529', "--st-checked-bg": '#0d6efd', '--st-color': '#FFF' },
    }
  },
})
