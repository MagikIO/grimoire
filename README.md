# Grimoire 📖

A lightweight, type-safe Web Component library built for the Genie ecosystem. Grimoire provides beautifully styled, customizable components with built-in dark/light theme support.

[![npm version](https://img.shields.io/npm/v/@magik_io/grimoire.svg)](https://www.npmjs.com/package/@magik_io/grimoire)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎨 **Theme-Aware**: Built-in dark/light mode support with flexible theming options
- 🔧 **Type-Safe**: Full TypeScript support with comprehensive type definitions
- 🪄 **Magik Integration**: Built on [@magik_io/mote](https://github.com/MagikIO/mote) for powerful DOM manipulation
- 📦 **Tree-Shakeable**: ES modules with dynamic imports for optimal bundle size
- 🎯 **Standards-Based**: Pure Web Components using Custom Elements API
- 💅 **CSS Variables**: Fully customizable via CSS custom properties

## Installation

```bash
# Using pnpm (recommended)
pnpm add @magik_io/grimoire

# Using npm
npm install @magik_io/grimoire

# Using yarn
yarn add @magik_io/grimoire
```

## Requirements

- Node.js 22.x or higher
- pnpm 9.x or higher (for development)

## Quick Start

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Grimoire Demo</title>
</head>
<body>
  <!-- Use components in your HTML -->
  <slide-toggle label="Enable notifications" checked="true"></slide-toggle>
  <e-sig>John Doe</e-sig>

  <script type="module">
    import { Grimoire } from '@magik_io/grimoire';

    // Define which components you want to use
    await Grimoire.Define('slide-toggle', 'e-sig');
  </script>
</body>
</html>
```

## Components

### SlideToggle

A beautiful, animated toggle switch component.

```html
<slide-toggle
  label="Dark Mode"
  checked="false"
  name="darkModeToggle">
</slide-toggle>
```

**Attributes:**
- `label` (string): The label text displayed next to the toggle
- `checked` (boolean): Initial checked state (default: `false`)
- `name` (string): Name attribute for the input element

**Properties:**
- `activated`: Get/set the toggle state programmatically

**Events:**
- `change`: Fired when the toggle state changes
  - `detail.checked`: Current checked state

**CSS Variables:**
```css
--st-body-bg: Background color
--st-checked-bg: Background color when checked
--st-border-width: Border width
--st-border-color: Border color
--st-color: Text color
--st-check-bg: Checkbox background
--st-check-bg-image: Checkbox background image
```

**Example:**
```javascript
const toggle = document.querySelector('slide-toggle');

// Listen for changes
toggle.addEventListener('change', (e) => {
  console.log('Toggle is now:', e.detail.checked);
});

// Programmatically control
toggle.activated = true;
```

### ESig

An elegant electronic signature component with multiple font choices.

```html
<e-sig font="dancing-script" icon="fas fa-pen">
  Antonio Bourassa
</e-sig>
```

**Attributes:**
- `font` (string): Font style for the signature
  - `dancing-script` (default)
  - `great-vibes`
  - `homemade-apple`
  - `marck-script`
  - `sacramento`
  - `satisfy`
- `icon` (string): Font Awesome icon class (default: `fas fa-cog`)

**CSS Variables:**
```css
--eSig-bg: Background color
--eSig-border-color: Border color
--eSig-border-style: Border style
--eSig-border-radius: Border radius
--eSig-border-width: Border width
--eSig-line-height: Line height
--eSig-padding: Padding
--eSig-margin-bottom: Bottom margin
--eSig-color: Text color
```

**Features:**
- Click the icon to open a font selection modal
- Interactive font preview
- Responsive scaling

**Note:** You'll need to include Google Fonts in your HTML:
```html
<link href="https://fonts.googleapis.com/css?family=Dancing+Script|Great+Vibes|Homemade+Apple|Marck+Script|Sacramento|Satisfy" rel="stylesheet">
```

## Theme Configuration

Grimoire provides flexible theming options:

### Browser-Based (Default)

Uses CSS media queries to detect system preferences:

```javascript
Grimoire.Configure({ chroma: 'browser' });
```

### Class-Based

Uses body classes (`.dark` and `.light`):

```javascript
Grimoire.Configure({ chroma: 'class' });
```

### Custom Classes

Define your own theme classes:

```javascript
Grimoire.Configure({
  chroma: {
    dark: 'my-dark-theme',
    light: 'my-light-theme'
  }
});
```

### Disabled Theming

Disable theme switching:

```javascript
Grimoire.Configure({ chroma: false });
```

## Advanced Usage

### Selective Component Loading

Only load the components you need to keep your bundle small:

```javascript
// Load only SlideToggle
await Grimoire.Define('slide-toggle');

// Load multiple components
await Grimoire.Define('slide-toggle', 'e-sig');
```

### Custom Styling

Override CSS variables globally or per-component:

```css
/* Global overrides */
:root {
  --st-checked-bg: #ff6b6b;
  --eSig-bg: #f0f0f0;
}

/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
  :root {
    --st-checked-bg: #ff4757;
    --eSig-bg: #2c2c2c;
  }
}

/* Component-specific overrides */
slide-toggle {
  --st-checked-bg: green;
}
```

### TypeScript Support

Full type definitions are included:

```typescript
import { Grimoire, type GrimoireTemplateNames } from '@magik_io/grimoire';

const components: GrimoireTemplateNames[] = ['slide-toggle', 'e-sig'];
await Grimoire.Define(...components);

// Type-safe component references
const toggle = document.querySelector('slide-toggle') as HTMLElement & {
  activated: boolean;
};
```

## Architecture

Grimoire uses a sophisticated component registration system:

1. **Dynamic Imports**: Components are loaded on-demand
2. **Style Extraction**: CSS is automatically extracted and injected
3. **Theme Management**: Automatic light/dark theme handling
4. **Custom Elements**: Standards-based Web Components

### Component Descriptor Pattern

Each component uses a `ComponentDescriptor` that defines:

- Component name and HTML tag
- Element class (extends `HTMLElement`)
- Style configuration (base styles, CSS variables, theme variants)
- Type of custom element

```typescript
export default new ComponentDescriptor({
  name: 'my-component',
  element: MyComponent,
  type: 'custom-element',
  style: {
    base: CSSVars => CSSVars`/* CSS */`,
    vars: { /* CSS variables */ },
    theme: {
      light: { /* light theme vars */ },
      dark: { /* dark theme vars */ }
    }
  }
});
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/MagikIO/grimoire.git
cd grimoire

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Build

```bash
# Build for production
pnpm build
```

### Publishing

```bash
# Bump version, push tags, and publish
pnpm iterate
```

## Browser Support

Grimoire supports all modern browsers that implement:

- Custom Elements v1
- ES2022
- CSS Custom Properties
- ES Modules

Tested on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Dependencies

- [@magik_io/mote](https://github.com/MagikIO/mote) - Lightweight DOM manipulation library
- [ulid](https://github.com/ulid/javascript) - Universally Unique Lexicographically Sortable Identifiers

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

[MIT](LICENSE) © Antonio B.

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a list of changes.

## Support

- 🐛 [Report a bug](https://github.com/MagikIO/grimoire/issues)
- 💡 [Request a feature](https://github.com/MagikIO/grimoire/issues)
- 📧 Contact: Abourassa@AssetVal.com

## Related Projects

- [@magik_io/mote](https://github.com/MagikIO/mote) - DOM manipulation library
- [@magik_io/lint_golem](https://github.com/MagikIO/lint_golem) - ESLint configuration

---

Made with ✨ by [MagikIO](https://github.com/MagikIO)
