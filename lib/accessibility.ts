/**
 * Accessibility Utilities
 * ARIA helpers, keyboard navigation, and screen reader support
 */

// Keyboard navigation helpers
export const KeyboardKeys = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  TAB: 'Tab',
  HOME: 'Home',
  END: 'End',
} as const;

export type KeyboardKey = typeof KeyboardKeys[keyof typeof KeyboardKeys];

// Check if key matches
export function isKey(event: KeyboardEvent | React.KeyboardEvent, key: KeyboardKey): boolean {
  return event.key === key;
}

// Check if any modifier key is pressed
export function hasModifier(event: KeyboardEvent | React.KeyboardEvent): boolean {
  return event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;
}

// Handle keyboard event with specific keys
export function onKeyDown(
  event: KeyboardEvent | React.KeyboardEvent,
  handlers: Partial<Record<KeyboardKey, (event: KeyboardEvent | React.KeyboardEvent) => void>>
): void {
  const handler = handlers[event.key as KeyboardKey];
  if (handler) {
    handler(event);
  }
}

// Focus trap for modals and dialogs
export function createFocusTrap(element: HTMLElement): {
  activate: () => void;
  deactivate: () => void;
} {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  let previousActiveElement: HTMLElement | null = null;

  const getFocusableElements = (): HTMLElement[] => {
    return Array.from(element.querySelectorAll(focusableSelectors));
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isKey(event, KeyboardKeys.TAB)) return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  return {
    activate: () => {
      previousActiveElement = document.activeElement as HTMLElement;
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
      document.addEventListener('keydown', handleKeyDown);
    },
    deactivate: () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    },
  };
}

// Skip to content link helper
export function skipToContent(contentId: string): void {
  const content = document.getElementById(contentId);
  if (content) {
    content.tabIndex = -1;
    content.focus();
    content.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Announce to screen readers
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement is made
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Generate unique ID for ARIA relationships
let idCounter = 0;
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${++idCounter}`;
}

// ARIA label helpers
export function getAriaLabel(label: string, description?: string): {
  'aria-label': string;
  'aria-describedby'?: string;
} {
  const result: { 'aria-label': string; 'aria-describedby'?: string } = {
    'aria-label': label,
  };

  if (description) {
    const descId = generateId('desc');
    result['aria-describedby'] = descId;
  }

  return result;
}

// Check if element is visible
export function isElementVisible(element: HTMLElement): boolean {
  return !!(
    element.offsetWidth ||
    element.offsetHeight ||
    element.getClientRects().length
  );
}

// Get next/previous focusable element
export function getNextFocusableElement(
  currentElement: HTMLElement,
  direction: 'next' | 'previous' = 'next'
): HTMLElement | null {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  const focusableElements = Array.from(
    document.querySelectorAll<HTMLElement>(focusableSelectors)
  ).filter(isElementVisible);

  const currentIndex = focusableElements.indexOf(currentElement);
  if (currentIndex === -1) return null;

  const nextIndex =
    direction === 'next'
      ? (currentIndex + 1) % focusableElements.length
      : (currentIndex - 1 + focusableElements.length) % focusableElements.length;

  return focusableElements[nextIndex];
}

// Roving tabindex for keyboard navigation in lists
export function createRovingTabindex(container: HTMLElement, itemSelector: string) {
  const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
  let currentIndex = 0;

  const setFocus = (index: number) => {
    items.forEach((item, i) => {
      if (i === index) {
        item.tabIndex = 0;
        item.focus();
      } else {
        item.tabIndex = -1;
      }
    });
    currentIndex = index;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    let newIndex = currentIndex;

    switch (event.key) {
      case KeyboardKeys.ARROW_DOWN:
      case KeyboardKeys.ARROW_RIGHT:
        event.preventDefault();
        newIndex = (currentIndex + 1) % items.length;
        break;
      case KeyboardKeys.ARROW_UP:
      case KeyboardKeys.ARROW_LEFT:
        event.preventDefault();
        newIndex = (currentIndex - 1 + items.length) % items.length;
        break;
      case KeyboardKeys.HOME:
        event.preventDefault();
        newIndex = 0;
        break;
      case KeyboardKeys.END:
        event.preventDefault();
        newIndex = items.length - 1;
        break;
      default:
        return;
    }

    setFocus(newIndex);
  };

  // Initialize
  setFocus(0);
  container.addEventListener('keydown', handleKeyDown);

  return {
    destroy: () => {
      container.removeEventListener('keydown', handleKeyDown);
    },
  };
}

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Check if user prefers dark mode
export function prefersDarkMode(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Focus visible utility (only show focus outline for keyboard users)
export function setupFocusVisible(): void {
  let hadKeyboardEvent = false;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (isKey(event, KeyboardKeys.TAB)) {
      hadKeyboardEvent = true;
    }
  };

  const handleMouseDown = () => {
    hadKeyboardEvent = false;
  };

  const handleFocus = (event: FocusEvent) => {
    const target = event.target as HTMLElement;
    if (hadKeyboardEvent && target) {
      target.classList.add('focus-visible');
    } else {
      target.classList.remove('focus-visible');
    }
  };

  const handleBlur = (event: FocusEvent) => {
    const target = event.target as HTMLElement;
    if (target) {
      target.classList.remove('focus-visible');
    }
  };

  document.addEventListener('keydown', handleKeyDown, true);
  document.addEventListener('mousedown', handleMouseDown, true);
  document.addEventListener('focus', handleFocus, true);
  document.addEventListener('blur', handleBlur, true);
}

// ARIA live region helper
export function createLiveRegion(priority: 'polite' | 'assertive' = 'polite'): {
  element: HTMLElement;
  announce: (message: string) => void;
  destroy: () => void;
} {
  const element = document.createElement('div');
  element.setAttribute('role', 'status');
  element.setAttribute('aria-live', priority);
  element.setAttribute('aria-atomic', 'true');
  element.className = 'sr-only';
  document.body.appendChild(element);

  return {
    element,
    announce: (message: string) => {
      element.textContent = message;
    },
    destroy: () => {
      document.body.removeChild(element);
    },
  };
}

// Screen reader only text utility
export const srOnlyStyles = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
} as const;

// Get accessible name for element
export function getAccessibleName(element: HTMLElement): string {
  return (
    element.getAttribute('aria-label') ||
    element.getAttribute('aria-labelledby') ||
    element.textContent ||
    ''
  ).trim();
}

// Validate ARIA attributes
export function validateAriaAttributes(element: HTMLElement): string[] {
  const warnings: string[] = [];

  // Check for aria-label or aria-labelledby on interactive elements
  const interactiveRoles = ['button', 'link', 'checkbox', 'radio', 'textbox'];
  const role = element.getAttribute('role');

  if (
    interactiveRoles.includes(role || '') &&
    !element.hasAttribute('aria-label') &&
    !element.hasAttribute('aria-labelledby') &&
    !element.textContent?.trim()
  ) {
    warnings.push(`Interactive element missing accessible name: ${role}`);
  }

  // Check for aria-expanded on expandable elements
  if (element.hasAttribute('aria-controls') && !element.hasAttribute('aria-expanded')) {
    warnings.push('Element with aria-controls should have aria-expanded');
  }

  return warnings;
}
