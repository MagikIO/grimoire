import { CSSVars as CSS } from './CSSVars'

export class MagikComponentStyle {
  public base: ReturnType<typeof CSS>
  public vars: Record<string, string>
  public light?: Record<string, string>
  public dark?: Record<string, string>

  constructor({ base, vars, theme }: iComponentDescriptor['style']) {
    this.base = base(CSS)
    this.vars = vars
    this.light = theme?.light
    this.dark = theme?.dark
  }
}

export interface iComponentDescriptor<
  Name extends string = string,
  ElIs extends 'custom-element' | 'extends-element' = 'custom-element' | 'extends-element',
  ElConstructor extends CustomElementConstructor = CustomElementConstructor
> {
  name: Name
  type: ElIs
  element: ElConstructor
  extendsEl?: string
  style: {
    base: (CSSVars: typeof CSS) => ReturnType<typeof CSS>
    vars: Record<string, string>
    theme?: { light: Record<string, string>, dark: Record<string, string> }
  }
}

export class ComponentDescriptor<
  Name extends string = string,
  ElIs extends 'custom-element' | 'extends-element' = 'custom-element' | 'extends-element',
  ElConstructor extends CustomElementConstructor = CustomElementConstructor
> {
  public name: Name
  public element: ElConstructor
  public type: ElIs
  public style: MagikComponentStyle
  public extendsEl?: string

  constructor({ name, element, type, style, extendsEl }: iComponentDescriptor<Name, ElIs, ElConstructor>) {
    this.name = name
    this.element = element
    this.type = type
    this.style = new MagikComponentStyle(style)
    this.extendsEl = extendsEl
  }
}
