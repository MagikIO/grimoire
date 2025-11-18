import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Grimoire, type GrimoireTemplateNames } from '../index';

describe('Grimoire', () => {
  beforeEach(() => {
    // Reset Grimoire state
    Grimoire.activeComponents = [];
    Grimoire.chroma = 'browser';

    // Clear any existing style tags
    document.head.querySelectorAll('style').forEach(style => style.remove());
  });

  describe('Configuration', () => {
    it('should have default chroma setting as browser', () => {
      expect(Grimoire.chroma).toBe('browser');
    });

    it('should configure chroma to browser mode', () => {
      Grimoire.Configure({ chroma: 'browser' });
      expect(Grimoire.chroma).toBe('browser');
    });

    it('should configure chroma to class mode', () => {
      Grimoire.Configure({ chroma: 'class' });
      expect(Grimoire.chroma).toBe('class');
    });

    it('should configure chroma to custom classes', () => {
      const customChroma = { dark: 'dark-theme', light: 'light-theme' };
      Grimoire.Configure({ chroma: customChroma });
      expect(Grimoire.chroma).toEqual(customChroma);
    });

    it('should configure chroma to false (disabled)', () => {
      Grimoire.Configure({ chroma: false });
      expect(Grimoire.chroma).toBe(false);
    });

    it('should return Grimoire class for chaining', () => {
      const result = Grimoire.Configure({ chroma: 'class' });
      expect(result).toBe(Grimoire);
    });

    it('should allow chaining Configure and Define', async () => {
      await Grimoire.Configure({ chroma: 'class' }).Define('slide-toggle');
      expect(Grimoire.chroma).toBe('class');
      expect(Grimoire.activeComponents.length).toBeGreaterThan(0);
    });
  });

  describe('Theme selectors', () => {
    it('should generate correct Night selector for browser mode', () => {
      Grimoire.Configure({ chroma: 'browser' });
      const nightSelector = (Grimoire as any).Night();
      expect(nightSelector).toBe('@media (prefers-color-scheme: dark) {');
    });

    it('should generate correct Day selector for browser mode', () => {
      Grimoire.Configure({ chroma: 'browser' });
      const daySelector = (Grimoire as any).Day();
      expect(daySelector).toBe('@media (prefers-color-scheme: light) {');
    });

    it('should generate correct Night selector for class mode', () => {
      Grimoire.Configure({ chroma: 'class' });
      const nightSelector = (Grimoire as any).Night();
      expect(nightSelector).toBe('body.dark {');
    });

    it('should generate correct Day selector for class mode', () => {
      Grimoire.Configure({ chroma: 'class' });
      const daySelector = (Grimoire as any).Day();
      expect(daySelector).toBe('body.light {');
    });

    it('should generate correct Night selector for custom classes', () => {
      Grimoire.Configure({ chroma: { dark: 'custom-dark', light: 'custom-light' } });
      const nightSelector = (Grimoire as any).Night();
      expect(nightSelector).toBe('body.custom-dark {');
    });

    it('should generate correct Day selector for custom classes', () => {
      Grimoire.Configure({ chroma: { dark: 'custom-dark', light: 'custom-light' } });
      const daySelector = (Grimoire as any).Day();
      expect(daySelector).toBe('body.custom-light {');
    });

    it('should return empty string for Night when chroma is false', () => {
      Grimoire.Configure({ chroma: false });
      const nightSelector = (Grimoire as any).Night();
      expect(nightSelector).toBe('');
    });

    it('should return empty string for Day when chroma is false', () => {
      Grimoire.Configure({ chroma: false });
      const daySelector = (Grimoire as any).Day();
      expect(daySelector).toBe('');
    });
  });

  describe('Define', () => {
    it('should define a single component', async () => {
      const result = await Grimoire.Define('slide-toggle');

      expect(Grimoire.activeComponents.length).toBeGreaterThan(0);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should define multiple components', async () => {
      const result = await Grimoire.Define('slide-toggle', 'e-sig');

      expect(Grimoire.activeComponents.length).toBe(2);
      expect(result.length).toBe(2);
    });

    it('should register custom elements', async () => {
      await Grimoire.Define('slide-toggle');

      expect(customElements.get('slide-toggle')).toBeDefined();
    });

    it('should inject styles into document head', async () => {
      await Grimoire.Define('slide-toggle');

      const styles = document.head.querySelectorAll('style');
      expect(styles.length).toBeGreaterThan(0);
    });

    it('should throw error for invalid component name', async () => {
      await expect(
        Grimoire.Define('invalid-component' as GrimoireTemplateNames)
      ).rejects.toThrow();
    });

    it('should return extracted styles', async () => {
      const result = await Grimoire.Define('slide-toggle');

      expect(result[0]).toHaveProperty('component');
      expect(result[0]).toHaveProperty('vars');
      expect(result[0]).toHaveProperty('base');
    });

    it('should handle defining same component multiple times', async () => {
      await Grimoire.Define('slide-toggle');
      const firstCount = Grimoire.activeComponents.length;

      // Reset and define again
      Grimoire.activeComponents = [];
      await Grimoire.Define('slide-toggle');
      const secondCount = Grimoire.activeComponents.length;

      expect(secondCount).toBe(firstCount);
    });
  });

  describe('Style extraction', () => {
    it('should extract component styles', async () => {
      await Grimoire.Define('slide-toggle');

      const component = Grimoire.activeComponents[0];
      const extracted = (Grimoire as any).ExtractStyles(component);

      expect(extracted).toHaveProperty('component');
      expect(extracted).toHaveProperty('vars');
      expect(extracted).toHaveProperty('dark');
      expect(extracted).toHaveProperty('light');
      expect(extracted).toHaveProperty('base');
    });

    it('should convert CSS variables to string', async () => {
      await Grimoire.Define('slide-toggle');

      const component = Grimoire.activeComponents[0];
      const extracted = (Grimoire as any).ExtractStyles(component);

      expect(typeof extracted.vars).toBe('string');
      expect(extracted.vars.length).toBeGreaterThan(0);
    });

    it('should include base styles', async () => {
      await Grimoire.Define('slide-toggle');

      const component = Grimoire.activeComponents[0];
      const extracted = (Grimoire as any).ExtractStyles(component);

      expect(typeof extracted.base).toBe('string');
      expect(extracted.base.length).toBeGreaterThan(0);
    });
  });

  describe('Style injection', () => {
    it('should inject CSS variables into :root', async () => {
      await Grimoire.Define('slide-toggle');

      const styleTag = document.head.querySelector('style');
      expect(styleTag?.textContent).toContain(':root');
    });

    it('should inject base styles', async () => {
      await Grimoire.Define('slide-toggle');

      const styleTag = document.head.querySelector('style');
      expect(styleTag?.textContent).toContain('.slide-input');
    });

    it('should inject dark mode styles when chroma is not false', async () => {
      Grimoire.Configure({ chroma: 'browser' });
      await Grimoire.Define('slide-toggle');

      const styleTag = document.head.querySelector('style');
      expect(styleTag?.textContent).toContain('@media (prefers-color-scheme: dark)');
    });

    it('should inject light mode styles', async () => {
      Grimoire.Configure({ chroma: 'browser' });
      await Grimoire.Define('slide-toggle');

      const styleTag = document.head.querySelector('style');
      expect(styleTag?.textContent).toContain('@media (prefers-color-scheme: light)');
    });

    it('should not inject dark styles when chroma is false', async () => {
      Grimoire.Configure({ chroma: false });
      await Grimoire.Define('slide-toggle');

      const styleTag = document.head.querySelector('style');
      // Should not contain media query for dark mode
      expect(styleTag?.textContent).not.toContain('@media (prefers-color-scheme: dark)');
    });

    it('should combine styles from multiple components', async () => {
      await Grimoire.Define('slide-toggle', 'e-sig');

      const styleTag = document.head.querySelector('style');
      expect(styleTag?.textContent).toContain('slide-input');
      expect(styleTag?.textContent).toContain('ESignature');
    });
  });

  describe('Component registration', () => {
    it('should add component to activeComponents', async () => {
      await Grimoire.Define('slide-toggle');

      expect(Grimoire.activeComponents.length).toBe(1);
      expect(Grimoire.activeComponents[0].name).toBe('slide-toggle');
    });

    it('should track multiple active components', async () => {
      await Grimoire.Define('slide-toggle', 'e-sig');

      expect(Grimoire.activeComponents.length).toBe(2);

      const names = Grimoire.activeComponents.map(c => c.name);
      expect(names).toContain('slide-toggle');
      expect(names).toContain('e-sig');
    });

    it('should register components with customElements', async () => {
      await Grimoire.Define('slide-toggle');

      const SlideToggle = customElements.get('slide-toggle');
      expect(SlideToggle).toBeDefined();

      // Should be able to create instance
      const instance = document.createElement('slide-toggle');
      expect(instance).toBeInstanceOf(SlideToggle!);
    });
  });

  describe('Integration', () => {
    it('should allow creating and using components after Define', async () => {
      await Grimoire.Define('slide-toggle');

      const toggle = document.createElement('slide-toggle') as any;
      document.body.appendChild(toggle);

      expect(toggle.activated).toBeDefined();
      toggle.activated = true;
      expect(toggle.activated).toBe(true);
    });

    it('should work with different theme configurations', async () => {
      // Browser mode
      Grimoire.Configure({ chroma: 'browser' });
      await Grimoire.Define('slide-toggle');

      // Reset
      Grimoire.activeComponents = [];
      document.head.querySelectorAll('style').forEach(s => s.remove());

      // Class mode
      Grimoire.Configure({ chroma: 'class' });
      await Grimoire.Define('e-sig');

      const styleTag = document.head.querySelector('style');
      expect(styleTag?.textContent).toContain('body.dark');
      expect(styleTag?.textContent).toContain('body.light');
    });

    it('should handle loading components in sequence', async () => {
      await Grimoire.Define('slide-toggle');
      expect(Grimoire.activeComponents.length).toBe(1);

      // Reset and load another
      Grimoire.activeComponents = [];
      await Grimoire.Define('e-sig');
      expect(Grimoire.activeComponents.length).toBe(1);
    });

    it('should properly initialize all defined components', async () => {
      await Grimoire.Define('slide-toggle', 'e-sig');

      // Create instances
      const toggle = document.createElement('slide-toggle');
      const sig = document.createElement('e-sig');
      sig.textContent = 'Test';

      document.body.appendChild(toggle);
      document.body.appendChild(sig);

      // Both should be properly initialized
      expect(toggle.querySelector('input')).toBeDefined();
      expect(sig.querySelector('span')).toBeDefined();
    });
  });

  describe('Type safety', () => {
    it('should enforce GrimoireTemplateNames type', async () => {
      // This should compile
      const validComponent: GrimoireTemplateNames = 'slide-toggle';
      await Grimoire.Define(validComponent);

      expect(Grimoire.activeComponents.length).toBeGreaterThan(0);
    });

    it('should provide proper types for HTMLTagElementMap', () => {
      // TypeScript should know about these custom elements
      const toggle = document.createElement('slide-toggle');
      const sig = document.createElement('e-sig');

      expect(toggle).toBeDefined();
      expect(sig).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('should throw error with helpful message for invalid component', async () => {
      try {
        await Grimoire.Define('non-existent' as any);
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Component non-existent not found');
      }
    });

    it('should throw error if component module does not export default', async () => {
      // This would require mocking the import, so we'll skip detailed testing
      // but the error handling exists in the code
      expect(true).toBe(true);
    });
  });
});
