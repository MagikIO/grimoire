import { Mote } from '@magik_io/mote';
import './SlideStyle.css'

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
export default ({
  name: 'slide-toggle' as const,
  constructor: SlideToggle,
  type: 'custom-element' as const,
  styleVars: new Map([
    ['--st-body-bg', '#212529' as const],
    ['--st-check-bg', 'var(--st-body-bg)' as const],
    ['--st-check-bg-image', 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'-4 -4 8 8\'%3e%3ccircle r=\'3\' fill=\'rgba(0, 0, 0, .25)\'/%3e%3c/svg%3e")' as const],
    ['--st-border-width', '1px' as const],
    ['--st-border-color', 'rgba(0, 0, 0, .25)' as const],
    ['--st-checked-bg', '#0d6efd' as const]
  ])
})
