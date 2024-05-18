import { CSSVars as CSS } from './CSSVars'

export interface iComponentDescriptor<
  Name extends string = string,
  ElIs extends 'custom-element' | 'extends-element' = 'custom-element' | 'extends-element',
  ElConstructor extends CustomElementConstructor = CustomElementConstructor
> {
  name: Name
  element: ElConstructor
  type: ElIs
  extendsEl?: string
  styleVars: (CSSVars: typeof CSS) => ReturnType<typeof CSS>,
  style: (CSSVars: typeof CSS) => ReturnType<typeof CSS>,
}

export class ComponentDescriptor<
  Name extends string = string,
  ElIs extends 'custom-element' | 'extends-element' = 'custom-element' | 'extends-element',
  ElConstructor extends CustomElementConstructor = CustomElementConstructor
> {
  public name: Name
  public element: ElConstructor
  public type: ElIs
  public style: ReturnType<typeof CSS>
  public styleVars: ReturnType<typeof CSS>
  public extendsEl?: string

  constructor({ name, element, type, style, styleVars, extendsEl }: iComponentDescriptor<Name, ElIs, ElConstructor>) {
    this.name = name
    this.element = element
    this.type = type
    this.style = style(CSS)
    this.styleVars = styleVars(CSS)
    this.extendsEl = extendsEl
  }
}
