# Contributing to Grimoire

Thank you for considering contributing to Grimoire! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Creating Components](#creating-components)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and considerate in your interactions.

### Our Standards

**Positive behaviors:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards others

**Unacceptable behaviors:**
- Harassment, trolling, or derogatory comments
- Publishing others' private information
- Any conduct inappropriate in a professional setting

## Getting Started

### Prerequisites

- Node.js 22.x or higher
- pnpm 9.x or higher
- Git
- A GitHub account
- A code editor (VS Code recommended)

### Recommended VS Code Extensions

- ESLint
- EditorConfig
- Magik Highlighting (`magikio.magik-highlighting`)

## Development Setup

1. **Fork the repository**

   Navigate to [https://github.com/MagikIO/grimoire](https://github.com/MagikIO/grimoire) and click the "Fork" button.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/grimoire.git
   cd grimoire
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/MagikIO/grimoire.git
   ```

4. **Install dependencies**

   ```bash
   pnpm install
   ```

5. **Start development server**

   ```bash
   pnpm dev
   ```

   This will start Vite's development server. Open your browser to the URL shown (typically `http://localhost:5173`).

## Project Structure

```
grimoire/
├── .vscode/              # VS Code settings and recommendations
├── dist/                 # Built files (generated)
├── docs/                 # Documentation
│   └── API.md           # API documentation
├── src/
│   ├── components/      # Component implementations
│   │   ├── ESig.ts     # Electronic signature component
│   │   └── SlideToggle.ts  # Toggle switch component
│   ├── processing/      # Core utilities
│   │   ├── ComponentDescriptor.ts  # Component descriptor class
│   │   └── CSSVars.ts  # CSS variable extraction utility
│   └── index.ts         # Main entry point
├── index.html           # Development demo page
├── package.json         # Package configuration
├── tsconfig.json        # TypeScript configuration
├── rollup.config.js     # Rollup build configuration
├── vite.config.js       # Vite development configuration
├── eslint.config.js     # ESLint configuration
├── CHANGELOG.md         # Version history
└── README.md            # Project overview
```

## Development Workflow

### Creating a Feature Branch

```bash
# Ensure you're on main and up to date
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name
```

### Branch Naming Conventions

- Features: `feature/description`
- Bug fixes: `fix/description`
- Documentation: `docs/description`
- Refactoring: `refactor/description`
- Performance: `perf/description`

### Making Changes

1. Make your changes in your feature branch
2. Test your changes locally with `pnpm dev`
3. Build to ensure no errors: `pnpm build`
4. Lint your code: `pnpm run lint` (if configured)

### Committing Changes

We follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
git commit -m "feat(components): add tooltip component"
git commit -m "fix(slide-toggle): resolve checked state sync issue"
git commit -m "docs(api): add examples for ESig component"
```

### Keeping Your Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch on upstream main
git rebase upstream/main

# If there are conflicts, resolve them and continue
git rebase --continue

# Force push to your fork (only for feature branches)
git push origin feature/your-feature-name --force
```

## Creating Components

### Component Checklist

When creating a new component, ensure you:

- [ ] Create component class extending `HTMLElement`
- [ ] Create component descriptor with styles
- [ ] Add component to import map in `src/index.ts`
- [ ] Add component name to `GrimoireTemplateNames` type
- [ ] Add component to global `HTMLTagElementMap`
- [ ] Document the component with JSDoc comments
- [ ] Add CSS variable documentation
- [ ] Create usage examples
- [ ] Test in both light and dark modes
- [ ] Ensure accessibility (ARIA attributes, keyboard support)

### Component Template

```typescript
import { Mote } from '@magik_io/mote';
import { ComponentDescriptor } from '../processing/ComponentDescriptor';

/**
 * ## MyComponent Magik Component
 * @element my-component
 * @attr {string} [myProp='default'] - Description of the property
 * ---
 * ### Style Variables
 * @cssprop {color} [--mc-bg=#ffffff] - Background color
 * @cssprop {length} [--mc-padding=1rem] - Padding
 */
export class MyComponent extends HTMLElement {
  protected __meta = {
    // Component metadata
  };

  constructor() {
    super();
  }

  connectedCallback() {
    // Setup component
  }

  disconnectedCallback() {
    // Cleanup
  }

  static get observedAttributes() {
    return ['my-prop'];
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    if (oldValue === newValue) return;
    // Handle attribute changes
  }
}

export default new ComponentDescriptor({
  name: 'my-component',
  element: MyComponent,
  type: 'custom-element',
  style: {
    base: CSSVars => CSSVars`
      .my-component {
        background: var(--mc-bg);
        padding: var(--mc-padding);
      }
    `,
    vars: {
      '--mc-padding': '1rem',
      '--mc-border-radius': '4px'
    },
    theme: {
      light: {
        '--mc-bg': '#ffffff',
        '--mc-color': '#000000'
      },
      dark: {
        '--mc-bg': '#1a1a1a',
        '--mc-color': '#ffffff'
      }
    }
  }
});
```

### Adding to Index

Update `src/index.ts`:

```typescript
// Add to GrimoireTemplateNames
export type GrimoireTemplateNames = 'slide-toggle' | 'e-sig' | 'my-component';

// Add to global interface
declare global {
  interface HTMLTagElementMap {
    'slide-toggle': SlideToggle;
    'e-sig': ESig;
    'my-component': MyComponent;
  }
}

// Add to import map
const GrimoireImportMap = {
  'slide-toggle': () => import('./components/SlideToggle'),
  'e-sig': () => import('./components/ESig'),
  'my-component': () => import('./components/MyComponent')
} as const;
```

## Coding Standards

### TypeScript

- **Strict mode**: Always use TypeScript strict mode
- **Type annotations**: Prefer explicit types for public APIs
- **Interfaces**: Use interfaces for object shapes
- **Type exports**: Export types that consumers might need

```typescript
// Good
export interface ComponentOptions {
  label: string;
  checked: boolean;
}

export class MyComponent extends HTMLElement {
  private options: ComponentOptions;

  public get isActive(): boolean {
    return this.options.checked;
  }
}

// Bad
export class MyComponent extends HTMLElement {
  private options; // No type

  public get isActive() { // No return type
    return this.options.checked;
  }
}
```

### Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Use semicolons
- **Line length**: Aim for 100 characters max
- **Naming**:
  - Classes: PascalCase
  - Functions/methods: camelCase
  - Constants: UPPER_SNAKE_CASE
  - Protected members: prefix with `__` (double underscore)
  - CSS variables: `--componentName-property`

```typescript
// Good
export class SlideToggle extends HTMLElement {
  protected __meta = { checked: false };
  private readonly MAX_RETRIES = 3;

  public get activated(): boolean {
    return this.__meta.checked;
  }

  protected handleClick(): void {
    // Implementation
  }
}
```

### CSS/Styling

- **CSS Variables**: Always use CSS custom properties for themeable values
- **Naming**: Use component prefix (`--componentName-property`)
- **Nesting**: Leverage CSS nesting when appropriate
- **Units**: Use `rem` for sizes, `dvw`/`dvh` for viewport units
- **Animations**: Prefer CSS animations over JavaScript
- **Theme support**: Always provide both light and dark variants

```typescript
style: {
  vars: {
    '--my-comp-padding': '1rem',
    '--my-comp-border-radius': '0.25rem'
  },
  theme: {
    light: { '--my-comp-bg': '#ffffff' },
    dark: { '--my-comp-bg': '#1a1a1a' }
  }
}
```

### Accessibility

- Use semantic HTML elements
- Provide ARIA labels when needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain sufficient color contrast

```typescript
// Good
this.__button.set({
  'role': 'button',
  'aria-label': 'Toggle menu',
  'tabindex': '0'
});

this.__button.on('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    this.handleClick();
  }
});
```

## Testing

### Manual Testing

1. Test in development mode: `pnpm dev`
2. Test the production build:
   ```bash
   pnpm build
   pnpm preview
   ```
3. Test in multiple browsers (Chrome, Firefox, Safari)
4. Test both light and dark modes
5. Test responsive behavior
6. Test keyboard navigation
7. Test with screen readers (if possible)

### Testing Checklist

- [ ] Component renders correctly
- [ ] All attributes work as expected
- [ ] Properties can be get/set programmatically
- [ ] Events fire correctly
- [ ] CSS variables can be overridden
- [ ] Works in light and dark modes
- [ ] No console errors or warnings
- [ ] No TypeScript errors
- [ ] Builds successfully
- [ ] Works in Chrome, Firefox, and Safari

## Documentation

### JSDoc Comments

All public APIs should have JSDoc comments:

```typescript
/**
 * MyComponent provides a custom element for...
 *
 * @element my-component
 * @attr {string} label - The label to display
 * @attr {boolean} [active=false] - Whether the component is active
 *
 * @fires change - Fired when the component state changes
 * @fires {CustomEvent<{value: string}>} select - Fired when an item is selected
 *
 * @cssprop [--mc-bg=#ffffff] - Background color
 * @cssprop [--mc-padding=1rem] - Padding
 *
 * @example
 * ```html
 * <my-component label="Hello" active="true"></my-component>
 * ```
 *
 * @example
 * ```typescript
 * const comp = document.querySelector('my-component');
 * comp.addEventListener('change', (e) => console.log(e));
 * ```
 */
export class MyComponent extends HTMLElement {
  /**
   * Gets the current active state
   * @returns {boolean} True if active
   */
  public get isActive(): boolean {
    return this.__meta.active;
  }
}
```

### README Updates

If your change affects the public API:

1. Update the main README.md with examples
2. Update docs/API.md with detailed API documentation
3. Add usage examples
4. Update the CHANGELOG.md

## Submitting Changes

### Pull Request Process

1. **Update documentation**
   - Update README.md if needed
   - Update API.md for API changes
   - Add JSDoc comments

2. **Update changelog**
   - Add entry to CHANGELOG.md under `[Unreleased]`
   - Follow the format: `- Description by @username`

3. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Fill out the PR template

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tested in multiple browsers
- [ ] CHANGELOG.md updated

## Testing
Describe how you tested these changes

## Screenshots (if applicable)
Add screenshots for UI changes
```

### Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, a maintainer will merge your PR
4. Your contribution will be included in the next release

## Release Process

*For maintainers:*

1. **Update version**
   ```bash
   pnpm version [major|minor|patch]
   ```

2. **Update CHANGELOG**
   - Move unreleased changes to new version section
   - Add release date
   - Add comparison links

3. **Build and test**
   ```bash
   pnpm build
   ```

4. **Publish**
   ```bash
   pnpm iterate
   ```
   This will:
   - Bump the minor version
   - Push to main with tags
   - Publish to npm with public access

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Email: Abourassa@AssetVal.com

## Recognition

Contributors will be recognized in:
- CHANGELOG.md
- GitHub contributors page
- Release notes

Thank you for contributing to Grimoire! 🎉
