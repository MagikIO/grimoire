export interface iComponentDescriptor<
  Name extends string = string,
  ElIs extends 'custom-element' | 'extends-element' = 'custom-element' | 'extends-element',
  ElConstructor extends CustomElementConstructor = CustomElementConstructor,
  Styles extends Record<string, string> = Record<string, string>
> {
  name: Name
  element: ElConstructor
  type: ElIs
  extendsEl?: string
  styleVars?: Styles
}

export class ComponentDescriptor<
  Name extends string = string,
  ElIs extends 'custom-element' | 'extends-element' = 'custom-element' | 'extends-element',
  ElConstructor extends CustomElementConstructor = CustomElementConstructor,
  Styles extends Record<string, string> = Record<string, string>
> implements iComponentDescriptor<Name, ElIs, ElConstructor, Styles> {
  public name: Name
  public element: ElConstructor
  public type: ElIs
  public extendsEl?: string
  public styleVars?: Styles

  constructor({ name, element, type, styleVars, extendsEl }: iComponentDescriptor<Name, ElIs, ElConstructor, Styles>) {
    this.name = name
    this.element = element
    this.type = type
    this.styleVars = styleVars
    this.extendsEl = extendsEl
  }
}
