# Grimoire API Documentation

Complete API reference for Grimoire components and utilities.

## Table of Contents

- [Core API](#core-api)
  - [Grimoire Class](#grimoire-class)
  - [ComponentDescriptor](#componentdescriptor)
  - [CSSVars](#cssvars)
- [Components](#components)
  - [SlideToggle](#slidetoggle)
  - [ESig](#esig)
- [TypeScript Types](#typescript-types)

---

## Core API

### Grimoire Class

The main class for configuring and defining components.

#### Static Properties

##### `activeComponents`

```typescript
static activeComponents: Array<ComponentDescriptor>
```

Array of currently registered components.

##### `chroma`

```typescript
static chroma: 'browser' | 'class' | CustomChroma | false
```

Current theme configuration mode.

#### Static Methods

##### `Configure()`

```typescript
static Configure({
  chroma
}: {
  chroma: 'browser' | 'class' | CustomChroma | false
}): typeof Grimoire
```

Configure theme handling for components.

**Parameters:**
- `chroma`: Theme mode
  - `'browser'`: Use CSS media queries for system preference (default)
  - `'class'`: Use `.dark` and `.light` body classes
  - `CustomChroma`: Object with `{ dark: string, light: string }` for custom classes
  - `false`: Disable theming

**Returns:** The Grimoire class (chainable)

**Example:**
```typescript
// Use browser-based theming
Grimoire.Configure({ chroma: 'browser' });

// Use class-based theming
Grimoire.Configure({ chroma: 'class' });

// Use custom classes
Grimoire.Configure({
  chroma: {
    dark: 'theme-dark',
    light: 'theme-light'
  }
});

// Disable theming
Grimoire.Configure({ chroma: false });
```

##### `Define()`

```typescript
static async Define(
  ...components: Array<GrimoireTemplateNames>
): Promise<Array<ExtractedStyles>>
```

Load and register components.

**Parameters:**
- `...components`: Variable number of component names to register

**Returns:** Promise resolving to array of extracted style information

**Example:**
```typescript
// Define single component
await Grimoire.Define('slide-toggle');

// Define multiple components
await Grimoire.Define('slide-toggle', 'e-sig');

// With configuration
Grimoire.Configure({ chroma: 'class' });
const styles = await Grimoire.Define('slide-toggle', 'e-sig');
console.log(styles); // Array of style metadata
```

#### Protected Static Methods

These methods are used internally but documented for understanding:

##### `Night()`

```typescript
protected static Night(): string
```

Returns the appropriate CSS selector for dark mode based on `chroma` configuration.

##### `Day()`

```typescript
protected static Day(): string
```

Returns the appropriate CSS selector for light mode based on `chroma` configuration.

##### `ExtractStyles()`

```typescript
protected static ExtractStyles(component: ComponentDescriptor): {
  component: string;
  vars: string;
  dark: string;
  light: string;
  base: string;
}
```

Extract and format styles from a component descriptor.

##### `Adorn()`

```typescript
protected static Adorn(): void
```

Combine all component styles and inject into document head.

##### `asAbove()`

```typescript
protected static asAbove(component: ComponentDescriptor): typeof Grimoire
```

Register a component descriptor (chainable).

##### `soBelow()`

```typescript
protected static soBelow(component: ComponentDescriptor): typeof Grimoire
```

Define the custom element in the browser (chainable).

---

### ComponentDescriptor

A class that describes a custom element's configuration.

#### Constructor

```typescript
constructor({
  name,
  element,
  type,
  style,
  extendsEl
}: iComponentDescriptor)
```

**Parameters:**
- `name`: The HTML tag name for the component
- `element`: The class constructor extending HTMLElement
- `type`: Either `'custom-element'` or `'extends-element'`
- `style`: Style configuration object
  - `base`: Function returning CSS template with variables
  - `vars`: Record of CSS variable names to default values
  - `theme`: Optional object with `light` and `dark` theme variants
- `extendsEl`: (Optional) Native element to extend if type is `'extends-element'`

**Example:**
```typescript
import { ComponentDescriptor } from '@magik_io/grimoire';

export default new ComponentDescriptor({
  name: 'my-component',
  element: MyComponent,
  type: 'custom-element',
  style: {
    base: CSSVars => CSSVars`
      .my-component {
        background: var(--my-bg);
        color: var(--my-color);
      }
    `,
    vars: {
      '--my-bg': '#ffffff',
      '--my-padding': '1rem'
    },
    theme: {
      light: { '--my-color': '#000000' },
      dark: { '--my-color': '#ffffff' }
    }
  }
});
```

#### Properties

- `name: string` - Component tag name
- `element: CustomElementConstructor` - Element class
- `type: 'custom-element' | 'extends-element'` - Element type
- `style: MagikComponentStyle` - Processed style configuration
- `extendsEl?: string` - Native element being extended (if applicable)

---

### CSSVars

A template literal tag function for CSS with variable extraction.

```typescript
function CSSVars<T extends TemplateStringsArray>(
  cssString: T
): {
  originalString: T;
  extractedVariables: Record<string, string>;
}
```

**Parameters:**
- `cssString`: Template literal containing CSS

**Returns:** Object with original string and extracted CSS variables

**Example:**
```typescript
import { CSSVars } from '@magik_io/grimoire/dist/processing/CSSVars';

const result = CSSVars`
  .component {
    --my-var: red;
    --another-var: 10px;
    color: var(--my-var);
  }
`;

console.log(result.extractedVariables);
// { 'my-var': 'red', 'another-var': '10px' }
```

---

## Components

### SlideToggle

An animated toggle switch component.

#### HTML Tag

```html
<slide-toggle></slide-toggle>
```

#### Class

```typescript
class SlideToggle extends HTMLElement
```

#### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | string | `''` | Label text for the toggle |
| `checked` | string | `'false'` | Initial checked state ('true' or 'false') |
| `name` | string | - | Name attribute for the input |
| `id` | string | - | ID attribute for the input |

#### Properties

##### `activated`

```typescript
public get activated(): boolean
public set activated(value: boolean)
```

Get or set the toggle state. Setting this property dispatches a `change` event.

**Example:**
```typescript
const toggle = document.querySelector('slide-toggle');

// Get state
console.log(toggle.activated); // true or false

// Set state
toggle.activated = true;
```

#### Events

##### `change`

Fired when the toggle state changes (user click or programmatic change).

**Event Detail:**
```typescript
{
  checked: boolean
}
```

**Example:**
```typescript
toggle.addEventListener('change', (e) => {
  console.log('New state:', e.detail.checked);
});
```

#### CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--st-body-bg` | `#212529` | Body background color |
| `--st-checked-bg` | `#0d6efd` | Background when checked |
| `--st-color` | `#000` (light) / `#FFF` (dark) | Text color |
| `--st-check-bg` | `var(--st-body-bg)` | Checkbox background |
| `--st-check-bg-image` | SVG | Checkbox background image |
| `--st-border-width` | `1px` | Border width |
| `--st-border-color` | `rgba(0, 0, 0, .25)` | Border color |

#### Methods

##### `connectedCallback()`

```typescript
connectedCallback(): void
```

Called when element is inserted into the DOM. Sets up the toggle.

#### Protected Properties

- `__meta` - Internal metadata
- `__template` - Mote template wrapper
- `__input` - Mote input wrapper
- `__label` - Mote label wrapper

#### Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Custom styling */
    slide-toggle {
      --st-checked-bg: #28a745;
      --st-border-width: 2px;
    }
  </style>
</head>
<body>
  <slide-toggle
    label="Accept Terms"
    checked="false"
    name="terms">
  </slide-toggle>

  <script type="module">
    import { Grimoire } from '@magik_io/grimoire';

    await Grimoire.Define('slide-toggle');

    const toggle = document.querySelector('slide-toggle');

    toggle.addEventListener('change', (e) => {
      console.log('Terms accepted:', e.detail.checked);
    });

    // Programmatically toggle after 3 seconds
    setTimeout(() => {
      toggle.activated = true;
    }, 3000);
  </script>
</body>
</html>
```

---

### ESig

An electronic signature component with customizable fonts.

#### HTML Tag

```html
<e-sig>Signature Text</e-sig>
```

#### Class

```typescript
class ESig extends HTMLElement
```

#### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `font` | string | `'dancing-script'` | Font style for signature |
| `icon` | string | `'fas fa-cog'` | Font Awesome icon class |

#### Font Options

- `dancing-script` - Dancing Script cursive font
- `great-vibes` - Great Vibes cursive font
- `homemade-apple` - Homemade Apple cursive font
- `marck-script` - Marck Script cursive font
- `sacramento` - Sacramento cursive font
- `satisfy` - Satisfy cursive font

#### Static Properties

##### `observedAttributes`

```typescript
static get observedAttributes(): string[]
```

Returns `['font', 'icon']` - attributes that trigger `attributeChangedCallback`.

#### Methods

##### `connectedCallback()`

```typescript
connectedCallback(): void
```

Called when element is inserted into DOM. Sets up signature display and font picker.

##### `attributeChangedCallback()`

```typescript
attributeChangedCallback(
  name: string,
  oldValue: string,
  newValue: string
): void
```

Called when observed attributes change.

**Parameters:**
- `name`: Attribute name ('font' or 'icon')
- `oldValue`: Previous attribute value
- `newValue`: New attribute value

#### Protected Properties

- `__meta` - Internal metadata including font map and ID prefix
- `__span` - Mote span wrapper for signature text
- `__icon` - Mote icon wrapper
- `__nameToRender` - Cached signature text

#### Protected Methods

##### `__showFontSelections()`

```typescript
protected __showFontSelections(): void
```

Display font selection modal with interactive previews.

#### Events

No custom events. Uses standard DOM events for font selection.

#### CSS Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `--eSig-bg` | `#f8f9fa` (light) / `#212529` (dark) | Background color |
| `--eSig-border-color` | `rgba(0, 0, 0, 0.25)` (light) / `rgba(255, 255, 255, 0.25)` (dark) | Border color |
| `--eSig-color` | `#000` (light) / `#fff` (dark) | Text color |
| `--eSig-border-style` | `solid` | Border style |
| `--eSig-border-radius` | `0.25rem` | Border radius |
| `--eSig-border-width` | `1px` | Border width |
| `--eSig-line-height` | `4rem` | Line height |
| `--eSig-padding` | `0.35rem` | Padding |
| `--eSig-margin-bottom` | `0.25rem` | Bottom margin |

#### Complete Example

```html
<!DOCTYPE html>
<html>
<head>
  <link href="https://fonts.googleapis.com/css?family=Dancing+Script|Great+Vibes|Homemade+Apple|Marck+Script|Sacramento|Satisfy" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

  <style>
    e-sig {
      --eSig-bg: #fff;
      --eSig-color: #333;
      --eSig-border-color: #ccc;
    }
  </style>
</head>
<body>
  <div style="width: 500px; margin: 2rem auto;">
    <e-sig font="sacramento" icon="fas fa-pen">
      Dr. Jane Smith
    </e-sig>
  </div>

  <script type="module">
    import { Grimoire } from '@magik_io/grimoire';

    await Grimoire.Define('e-sig');

    const sig = document.querySelector('e-sig');

    // Change font programmatically
    setTimeout(() => {
      sig.setAttribute('font', 'great-vibes');
    }, 3000);
  </script>
</body>
</html>
```

---

## TypeScript Types

### GrimoireTemplateNames

```typescript
type GrimoireTemplateNames = 'slide-toggle' | 'e-sig';
```

Union type of all available component names.

### CustomChroma

```typescript
type CustomChroma = {
  dark: string;
  light: string;
};
```

Custom theme class configuration.

### HTMLTagElementMap

```typescript
declare global {
  interface HTMLTagElementMap {
    'slide-toggle': SlideToggle;
    'e-sig': ESig;
  }
}
```

Global interface extension for TypeScript DOM type checking.

### iComponentDescriptor

```typescript
interface iComponentDescriptor<
  Name extends string = string,
  ElIs extends 'custom-element' | 'extends-element' = 'custom-element' | 'extends-element',
  ElConstructor extends CustomElementConstructor = CustomElementConstructor
> {
  name: Name;
  type: ElIs;
  element: ElConstructor;
  extendsEl?: string;
  style: {
    base: (CSSVars: typeof CSS) => ReturnType<typeof CSS>;
    vars: Record<string, string>;
    theme?: {
      light: Record<string, string>;
      dark: Record<string, string>;
    };
  };
}
```

Interface for component descriptor configuration.

### MagikComponentStyle

```typescript
class MagikComponentStyle {
  public base: ReturnType<typeof CSS>;
  public vars: Record<string, string>;
  public light?: Record<string, string>;
  public dark?: Record<string, string>;
}
```

Processed style configuration class.

---

## Advanced Usage Patterns

### Creating Custom Components

```typescript
import { Mote } from '@magik_io/mote';
import { ComponentDescriptor } from '@magik_io/grimoire';

// 1. Create the component class
export class MyButton extends HTMLElement {
  protected __button = new Mote('button');

  connectedCallback() {
    const label = this.getAttribute('label') || 'Click me';
    this.__button
      .textContent(label)
      .on('click', () => this.handleClick())
      .appendTo(this);
  }

  protected handleClick() {
    this.dispatchEvent(new CustomEvent('myclick', {
      detail: { timestamp: Date.now() }
    }));
  }

  static get observedAttributes() {
    return ['label'];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === 'label' && oldValue !== newValue) {
      this.__button.textContent(newValue);
    }
  }
}

// 2. Create the descriptor
export default new ComponentDescriptor({
  name: 'my-button',
  element: MyButton,
  type: 'custom-element',
  style: {
    base: CSSVars => CSSVars`
      my-button button {
        background: var(--btn-bg);
        color: var(--btn-color);
        padding: var(--btn-padding);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: opacity 0.2s;
      }

      my-button button:hover {
        opacity: 0.8;
      }
    `,
    vars: {
      '--btn-padding': '0.5rem 1rem'
    },
    theme: {
      light: {
        '--btn-bg': '#007bff',
        '--btn-color': '#ffffff'
      },
      dark: {
        '--btn-bg': '#0056b3',
        '--btn-color': '#e0e0e0'
      }
    }
  }
});

// 3. Register in Grimoire's import map
// Add to src/index.ts:
// 'my-button': () => import('./components/MyButton')
```

### Extending Native Elements

```typescript
export class FancyButton extends HTMLButtonElement {
  connectedCallback() {
    this.classList.add('fancy-button');
    this.addEventListener('click', this.handleClick);
  }

  handleClick = () => {
    this.classList.add('clicked');
    setTimeout(() => this.classList.remove('clicked'), 300);
  }
}

export default new ComponentDescriptor({
  name: 'fancy-button',
  element: FancyButton,
  type: 'extends-element',
  extendsEl: 'button', // Extends native button
  style: {
    // ... style configuration
  }
});

// Usage:
// <button is="fancy-button">Click me</button>
```

---

## Best Practices

1. **Always await Define()**: Component registration is asynchronous
   ```typescript
   await Grimoire.Define('slide-toggle');
   ```

2. **Configure before Define()**: Set theme mode before loading components
   ```typescript
   Grimoire.Configure({ chroma: 'class' });
   await Grimoire.Define('slide-toggle');
   ```

3. **Use TypeScript types**: Leverage the provided type definitions
   ```typescript
   import type { GrimoireTemplateNames } from '@magik_io/grimoire';
   ```

4. **Lazy load components**: Only define components you use
   ```typescript
   // Only load what you need
   if (needsToggle) {
     await Grimoire.Define('slide-toggle');
   }
   ```

5. **CSS variable naming**: Follow the component prefix convention
   ```css
   --componentName-property: value;
   ```

---

## Error Handling

```typescript
try {
  await Grimoire.Define('invalid-component');
} catch (error) {
  console.error('Failed to load component:', error);
  // Error: [GRIMOIRE] ~> Component invalid-component not found
}
```

---

## Browser Compatibility

All APIs require:
- Custom Elements v1
- ES2022 syntax support
- Async/await
- Template literals
- CSS Custom Properties

Check compatibility before using:

```javascript
if ('customElements' in window) {
  await Grimoire.Define('slide-toggle');
} else {
  console.error('Custom Elements not supported');
}
```
