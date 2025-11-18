import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentDescriptor, MagikComponentStyle } from '../ComponentDescriptor';
import { CSSVars } from '../CSSVars';

describe('MagikComponentStyle', () => {
  it('should process style configuration correctly', () => {
    const styleConfig = {
      base: (CSS: typeof CSSVars) => CSS`
        .test {
          --test-var: red;
        }
      `,
      vars: {
        '--my-var': 'blue',
      },
      theme: {
        light: { '--bg': '#fff' },
        dark: { '--bg': '#000' },
      },
    };

    const style = new MagikComponentStyle(styleConfig);

    expect(style.vars).toEqual({ '--my-var': 'blue' });
    expect(style.light).toEqual({ '--bg': '#fff' });
    expect(style.dark).toEqual({ '--bg': '#000' });
    expect(style.base).toBeDefined();
    expect(style.base.originalString).toBeDefined();
  });

  it('should handle missing theme', () => {
    const styleConfig = {
      base: (CSS: typeof CSSVars) => CSS`.test {}`,
      vars: {},
    };

    const style = new MagikComponentStyle(styleConfig);

    expect(style.light).toBeUndefined();
    expect(style.dark).toBeUndefined();
  });
});

describe('ComponentDescriptor', () => {
  class TestComponent extends HTMLElement {
    connectedCallback() {
      this.textContent = 'Test Component';
    }
  }

  it('should create a custom element descriptor', () => {
    const descriptor = new ComponentDescriptor({
      name: 'test-component',
      element: TestComponent,
      type: 'custom-element',
      style: {
        base: (CSS) => CSS`.test { color: red; }`,
        vars: { '--test': 'value' },
      },
    });

    expect(descriptor.name).toBe('test-component');
    expect(descriptor.element).toBe(TestComponent);
    expect(descriptor.type).toBe('custom-element');
    expect(descriptor.style).toBeInstanceOf(MagikComponentStyle);
    expect(descriptor.extendsEl).toBeUndefined();
  });

  it('should create an extends element descriptor', () => {
    class FancyButton extends HTMLButtonElement {}

    const descriptor = new ComponentDescriptor({
      name: 'fancy-button',
      element: FancyButton as any,
      type: 'extends-element',
      extendsEl: 'button',
      style: {
        base: (CSS) => CSS`.fancy { }`,
        vars: {},
      },
    });

    expect(descriptor.type).toBe('extends-element');
    expect(descriptor.extendsEl).toBe('button');
  });

  it('should process style configuration through MagikComponentStyle', () => {
    const descriptor = new ComponentDescriptor({
      name: 'styled-component',
      element: TestComponent,
      type: 'custom-element',
      style: {
        base: (CSS) => CSS`
          .styled {
            --base-var: 10px;
          }
        `,
        vars: {
          '--custom-var': 'red',
        },
        theme: {
          light: { '--theme-light': '#fff' },
          dark: { '--theme-dark': '#000' },
        },
      },
    });

    expect(descriptor.style.vars).toEqual({ '--custom-var': 'red' });
    expect(descriptor.style.light).toEqual({ '--theme-light': '#fff' });
    expect(descriptor.style.dark).toEqual({ '--theme-dark': '#000' });
    expect(descriptor.style.base.extractedVariables).toHaveProperty('base-var', '10px');
  });

  it('should handle complex CSS in base styles', () => {
    const descriptor = new ComponentDescriptor({
      name: 'complex-component',
      element: TestComponent,
      type: 'custom-element',
      style: {
        base: (CSS) => CSS`
          .complex {
            --var1: red;
            --var2: blue;
            background: var(--var1);
            color: var(--var2);
          }

          .complex:hover {
            --var1: green;
          }
        `,
        vars: {},
      },
    });

    expect(descriptor.style.base.extractedVariables).toHaveProperty('var1');
    expect(descriptor.style.base.extractedVariables).toHaveProperty('var2');
  });

  it('should type-check component names', () => {
    const descriptor = new ComponentDescriptor<'my-component'>({
      name: 'my-component',
      element: TestComponent,
      type: 'custom-element',
      style: {
        base: (CSS) => CSS``,
        vars: {},
      },
    });

    // TypeScript should enforce this is 'my-component'
    const name: 'my-component' = descriptor.name;
    expect(name).toBe('my-component');
  });

  it('should type-check element types', () => {
    const descriptor = new ComponentDescriptor<
      'test-el',
      'custom-element',
      typeof TestComponent
    >({
      name: 'test-el',
      element: TestComponent,
      type: 'custom-element',
      style: {
        base: (CSS) => CSS``,
        vars: {},
      },
    });

    expect(descriptor.element).toBe(TestComponent);
  });
});
