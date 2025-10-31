/**
 * Animation Utilities
 * Reusable animation variants and helpers for Framer Motion and CSS
 */

// Check if animations should be reduced
export function shouldReduceMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// CSS Animation Classes
export const animations = {
  // Fade animations
  fadeIn: 'animate-fade-in',
  fadeOut: 'animate-fade-out',
  fadeInUp: 'animate-fade-in-up',
  fadeInDown: 'animate-fade-in-down',

  // Slide animations
  slideInLeft: 'animate-slide-in-left',
  slideInRight: 'animate-slide-in-right',
  slideInUp: 'animate-slide-in-up',
  slideInDown: 'animate-slide-in-down',

  // Scale animations
  scaleIn: 'animate-scale-in',
  scaleOut: 'animate-scale-out',

  // Bounce animations
  bounce: 'animate-bounce',
  bounceIn: 'animate-bounce-in',

  // Spin animations
  spin: 'animate-spin',
  pulse: 'animate-pulse',

  // Shake animation for errors
  shake: 'animate-shake',
} as const;

// Transition durations
export const durations = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
} as const;

// Easing functions
export const easings = {
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// Stagger children animation
export function staggerChildren(
  delay: number = 0.1,
  staggerDelay: number = 0.05
): React.CSSProperties {
  return {
    '--stagger-delay': `${delay}s`,
    '--stagger-increment': `${staggerDelay}s`,
  } as React.CSSProperties;
}

// Fade animations with configurable duration
export function fadeAnimation(
  direction: 'in' | 'out' = 'in',
  duration: number = durations.normal
): string {
  return `
    @keyframes fade-${direction} {
      from { opacity: ${direction === 'in' ? 0 : 1}; }
      to { opacity: ${direction === 'in' ? 1 : 0}; }
    }
    animation: fade-${direction} ${duration}ms ${easings.easeInOut};
  `;
}

// Slide animations
export function slideAnimation(
  direction: 'left' | 'right' | 'up' | 'down',
  distance: number = 20,
  duration: number = durations.normal
): React.CSSProperties {
  const transforms = {
    left: `translateX(-${distance}px)`,
    right: `translateX(${distance}px)`,
    up: `translateY(-${distance}px)`,
    down: `translateY(${distance}px)`,
  };

  return {
    animation: `slide-in-${direction} ${duration}ms ${easings.easeOut}`,
    '--start-transform': transforms[direction],
  } as React.CSSProperties;
}

// Scale animation
export function scaleAnimation(
  from: number = 0.9,
  to: number = 1,
  duration: number = durations.normal
): React.CSSProperties {
  return {
    animation: `scale ${duration}ms ${easings.spring}`,
    '--scale-from': from.toString(),
    '--scale-to': to.toString(),
  } as React.CSSProperties;
}

// Page transition variants (if using Framer Motion)
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

// Card hover animation
export const cardHover = {
  rest: { scale: 1, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' },
  hover: {
    scale: 1.02,
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.2 },
  },
};

// Button press animation
export const buttonPress = {
  scale: 0.95,
  transition: { duration: 0.1 },
};

// List item animation
export const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
};

// Modal animation
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

// Drawer animation (slide from side)
export const drawerVariants = {
  closed: { x: '-100%' },
  open: {
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

// Toast notification animation
export const toastVariants = {
  hidden: { opacity: 0, y: -50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 500, damping: 30 },
  },
  exit: {
    opacity: 0,
    x: 100,
    transition: { duration: 0.2 },
  },
};

// Skeleton pulse animation
export const skeletonPulse = {
  animate: {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Loading spinner animation
export const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Smooth height animation
export function smoothHeight(isOpen: boolean): React.CSSProperties {
  return {
    maxHeight: isOpen ? '1000px' : '0',
    opacity: isOpen ? 1 : 0,
    overflow: 'hidden',
    transition: `max-height ${durations.normal}ms ${easings.easeInOut}, opacity ${durations.fast}ms ${easings.easeInOut}`,
  };
}

// Scroll-triggered animation observer
export function observeScrollAnimation(
  element: HTMLElement,
  animationClass: string,
  threshold: number = 0.1
): IntersectionObserver {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );

  observer.observe(element);
  return observer;
}

// Parallax scroll effect
export function parallaxScroll(element: HTMLElement, speed: number = 0.5): () => void {
  const handleScroll = () => {
    const scrolled = window.pageYOffset;
    const yPos = -(scrolled * speed);
    element.style.transform = `translateY(${yPos}px)`;
  };

  window.addEventListener('scroll', handleScroll);

  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

// Animate number counter
export function animateNumber(
  element: HTMLElement,
  target: number,
  duration: number = 1000,
  easing: (t: number) => number = (t) => t
): void {
  const start = parseInt(element.textContent || '0', 10);
  const range = target - start;
  const startTime = performance.now();

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    const current = Math.floor(start + range * easedProgress);

    element.textContent = current.toString();

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}

// Ripple effect for buttons
export function createRipple(event: React.MouseEvent<HTMLElement>): void {
  const button = event.currentTarget;
  const ripple = document.createElement('span');

  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  const rect = button.getBoundingClientRect();
  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${event.clientX - rect.left - radius}px`;
  ripple.style.top = `${event.clientY - rect.top - radius}px`;
  ripple.classList.add('ripple');

  const existingRipple = button.querySelector('.ripple');
  if (existingRipple) {
    existingRipple.remove();
  }

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// CSS for ripple effect (add to globals.css)
export const rippleCSS = `
.ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
  transform: scale(0);
  animation: ripple-animation 600ms ease-out;
  pointer-events: none;
}

@keyframes ripple-animation {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
`;

// Smooth scroll to element
export function smoothScrollTo(
  target: HTMLElement | string,
  offset: number = 0,
  duration: number = 500
): void {
  const element =
    typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;

  if (!element) return;

  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
  const startPosition = window.pageYOffset;
  const distance = targetPosition - startPosition;
  const startTime = performance.now();

  const easeInOutQuad = (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const step = (currentTime: number) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutQuad(progress);

    window.scrollTo(0, startPosition + distance * ease);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
}
