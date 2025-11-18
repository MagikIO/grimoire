import { describe, it, expect } from 'vitest';
import { CSSVars } from '../CSSVars';

describe('CSSVars', () => {
  it('should extract CSS variables from template string', () => {
    const result = CSSVars`
      .component {
        --my-var: red;
        --another-var: 10px;
        color: var(--my-var);
      }
    `;

    expect(result.extractedVariables).toEqual({
      'my-var': 'red',
      'another-var': '10px',
    });
  });

  it('should preserve original template string', () => {
    const cssString = `
      .test {
        --test-var: blue;
      }
    ` as any;

    const result = CSSVars(cssString);

    expect(result.originalString).toBe(cssString);
  });

  it('should handle CSS variables with complex values', () => {
    const result = CSSVars`
      .component {
        --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        --calc-value: calc(100% - 2rem);
      }
    `;

    expect(result.extractedVariables).toEqual({
      'gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'shadow': '0 4px 6px rgba(0, 0, 0, 0.1)',
      'calc-value': 'calc(100% - 2rem)',
    });
  });

  it('should handle CSS variables with URL values', () => {
    const result = CSSVars`
      .component {
        --bg-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg'%3e%3c/svg%3e");
        --bg-color: #fff;
      }
    `;

    expect(result.extractedVariables).toHaveProperty('bg-image');
    expect(result.extractedVariables).toHaveProperty('bg-color', '#fff');
  });

  it('should handle empty CSS string', () => {
    const result = CSSVars`
      .component {
        color: red;
      }
    `;

    expect(result.extractedVariables).toEqual({});
  });

  it('should handle multiple CSS variables on same line', () => {
    const result = CSSVars`
      .component { --var1: red; --var2: blue; }
    `;

    expect(result.extractedVariables).toEqual({
      'var1': 'red',
      'var2': 'blue',
    });
  });

  it('should trim whitespace from variable values', () => {
    const result = CSSVars`
      .component {
        --spaced-var:    lots of spaces   ;
        --normal-var: normal;
      }
    `;

    expect(result.extractedVariables['spaced-var']).toBe('lots of spaces');
    expect(result.extractedVariables['normal-var']).toBe('normal');
  });

  it('should handle CSS variables with dashes and underscores in names', () => {
    const result = CSSVars`
      .component {
        --component-main_color: #000;
        --component-bg-color_dark: #fff;
      }
    `;

    expect(result.extractedVariables).toEqual({
      'component-main_color': '#000',
      'component-bg-color_dark': '#fff',
    });
  });
});
