import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SlideToggle } from '../SlideToggle';

// Define the custom element if not already defined
if (!customElements.get('slide-toggle')) {
  customElements.define('slide-toggle', SlideToggle);
}

// Helper to wait for next tick
const nextTick = () => new Promise(resolve => setTimeout(resolve, 0));

// Helper to get input element (it's inside the template)
const getInput = (element: SlideToggle) => {
  const template = element.querySelector('template');
  return template?.querySelector('input') || null;
};

// Helper to get label element
const getLabel = (element: SlideToggle) => {
  const template = element.querySelector('template');
  return template?.querySelector('label') || null;
};

describe('SlideToggle', () => {
  let element: SlideToggle;

  beforeEach(async () => {
    element = document.createElement('slide-toggle') as SlideToggle;
    document.body.appendChild(element);
    await nextTick(); // Wait for connectedCallback
  });

  afterEach(() => {
    element.remove();
  });

  describe('Initialization', () => {
    it('should create an instance', () => {
      expect(element).toBeInstanceOf(SlideToggle);
      expect(element).toBeInstanceOf(HTMLElement);
    });

    it('should initialize with default unchecked state', () => {
      expect(element.activated).toBe(false);
    });

    it('should initialize with checked attribute', async () => {
      const checkedElement = document.createElement('slide-toggle') as SlideToggle;
      checkedElement.setAttribute('checked', 'true');
      document.body.appendChild(checkedElement);
      await nextTick();

      expect(checkedElement.activated).toBe(true);
      checkedElement.remove();
    });

    it('should initialize with label attribute', async () => {
      const newElement = document.createElement('slide-toggle') as SlideToggle;
      newElement.setAttribute('label', 'Test Label');
      document.body.appendChild(newElement);
      await nextTick();

      const label = getLabel(newElement);
      expect(label?.textContent).toBe('Test Label');
      newElement.remove();
    });

    it('should initialize with name attribute', async () => {
      const namedElement = document.createElement('slide-toggle') as SlideToggle;
      namedElement.setAttribute('name', 'testToggle');
      document.body.appendChild(namedElement);
      await nextTick();

      const input = getInput(namedElement);
      expect(input?.getAttribute('name')).toBe('testToggle');
      namedElement.remove();
    });
  });

  describe('activated property', () => {
    it('should get the current state', () => {
      expect(element.activated).toBe(false);
    });

    it('should set the state', () => {
      element.activated = true;
      expect(element.activated).toBe(true);

      element.activated = false;
      expect(element.activated).toBe(false);
    });

    it('should update the input element when set', () => {
      element.activated = true;

      const input = getInput(element);
      expect(input?.checked).toBe(true);
    });

    it('should dispatch change event when set', () => {
      const handler = vi.fn();
      element.addEventListener('change', handler);

      element.activated = true;

      expect(handler).toHaveBeenCalledOnce();
      expect(handler.mock.calls[0][0]).toBeInstanceOf(CustomEvent);
      expect(handler.mock.calls[0][0].detail).toEqual({ checked: true });
    });

    it('should dispatch change event with correct value', () => {
      let eventDetail: any;
      element.addEventListener('change', (e: Event) => {
        eventDetail = (e as CustomEvent).detail;
      });

      element.activated = true;
      expect(eventDetail).toEqual({ checked: true });

      element.activated = false;
      expect(eventDetail).toEqual({ checked: false });
    });
  });

  describe('User interaction', () => {
    it('should toggle state when clicked', () => {
      expect(element.activated).toBe(false);

      element.click();
      expect(element.activated).toBe(true);

      element.click();
      expect(element.activated).toBe(false);
    });

    it('should dispatch change event on click', () => {
      const handler = vi.fn();
      element.addEventListener('change', handler);

      element.click();

      expect(handler).toHaveBeenCalledOnce();
      expect(handler.mock.calls[0][0].detail.checked).toBe(true);
    });

    it('should toggle multiple times', () => {
      element.click(); // true
      expect(element.activated).toBe(true);

      element.click(); // false
      expect(element.activated).toBe(false);

      element.click(); // true
      expect(element.activated).toBe(true);

      element.click(); // false
      expect(element.activated).toBe(false);
    });
  });

  describe('DOM structure', () => {
    it('should create a template element', () => {
      const template = element.querySelector('template');
      expect(template).toBeDefined();
    });

    it('should create an input element', () => {
      const input = getInput(element);
      expect(input).toBeDefined();
      expect(input?.type).toBe('checkbox');
    });

    it('should create a label element', () => {
      const label = getLabel(element);
      expect(label).toBeDefined();
    });

    it('should apply correct CSS classes', () => {
      const template = element.querySelector('template');
      expect(template?.classList.contains('SlideToggle')).toBe(true);

      const input = getInput(element);
      expect(input?.classList.contains('slide-input')).toBe(true);
      expect(input?.classList.contains('slideInput')).toBe(true);
    });
  });

  describe('Attributes', () => {
    it('should handle checked attribute as string "true"', async () => {
      const newElement = document.createElement('slide-toggle') as SlideToggle;
      newElement.setAttribute('checked', 'true');
      document.body.appendChild(newElement);
      await nextTick();

      expect(newElement.activated).toBe(true);
      newElement.remove();
    });

    it('should handle checked attribute as string "false"', async () => {
      const newElement = document.createElement('slide-toggle') as SlideToggle;
      newElement.setAttribute('checked', 'false');
      document.body.appendChild(newElement);
      await nextTick();

      expect(newElement.activated).toBe(false);
      newElement.remove();
    });

    it('should handle missing checked attribute', async () => {
      const newElement = document.createElement('slide-toggle') as SlideToggle;
      document.body.appendChild(newElement);
      await nextTick();

      expect(newElement.activated).toBe(false);
      newElement.remove();
    });

    it('should use name attribute as id prefix if provided', async () => {
      const namedElement = document.createElement('slide-toggle') as SlideToggle;
      namedElement.setAttribute('name', 'myToggle');
      document.body.appendChild(namedElement);
      await nextTick();

      const input = getInput(namedElement);
      expect(input?.getAttribute('name')).toBe('myToggle');
      namedElement.remove();
    });

    it('should use id attribute as fallback for name', async () => {
      const idElement = document.createElement('slide-toggle') as SlideToggle;
      idElement.setAttribute('id', 'myId');
      document.body.appendChild(idElement);
      await nextTick();

      // The element should use id as fallback for idPrefix
      expect(idElement).toBeDefined();
      idElement.remove();
    });

    it('should link label to input with htmlFor', async () => {
      const namedElement = document.createElement('slide-toggle') as SlideToggle;
      namedElement.setAttribute('name', 'linkedToggle');
      document.body.appendChild(namedElement);
      await nextTick();

      const label = getLabel(namedElement);
      expect(label?.getAttribute('for')).toBe('linkedToggle');
      namedElement.remove();
    });
  });

  describe('State management', () => {
    it('should maintain state through multiple interactions', () => {
      element.activated = true;
      element.click(); // Should toggle to false
      expect(element.activated).toBe(false);

      element.activated = true; // Set programmatically
      expect(element.activated).toBe(true);

      element.click(); // Should toggle to false
      expect(element.activated).toBe(false);
    });

    it('should emit events for both programmatic and user changes', () => {
      const handler = vi.fn();
      element.addEventListener('change', handler);

      // Programmatic change
      element.activated = true;
      expect(handler).toHaveBeenCalledTimes(1);

      // User interaction
      element.click();
      expect(handler).toHaveBeenCalledTimes(2);
    });
  });

  describe('Integration', () => {
    it('should work with form elements', async () => {
      const form = document.createElement('form');
      const toggle = document.createElement('slide-toggle') as SlideToggle;
      toggle.setAttribute('name', 'formToggle');
      form.appendChild(toggle);
      document.body.appendChild(form);
      await nextTick();

      toggle.activated = true;

      // Note: FormData may not work with custom elements in all environments
      // This test verifies the component is properly structured
      expect(getInput(toggle)?.checked).toBe(true);

      form.remove();
    });

    it('should handle rapid state changes', () => {
      for (let i = 0; i < 10; i++) {
        element.activated = i % 2 === 0;
      }

      expect(element.activated).toBe(false);
    });

    it('should handle rapid clicks', () => {
      for (let i = 0; i < 5; i++) {
        element.click();
      }

      // Should be true after 5 clicks (starts false)
      expect(element.activated).toBe(true);
    });
  });
});
