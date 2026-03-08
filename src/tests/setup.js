import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
class IntersectionObserver {
    constructor(callback) {
        this.callback = callback;
        this.elements = new Set();
    }

    observe(element) {
        this.elements.add(element);
        this.callback([{
            target: element,
            isIntersecting: true,
            intersectionRatio: 1
        }]);
    }

    unobserve() {}
    disconnect() {}
}

window.IntersectionObserver = IntersectionObserver;

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
    }))
});

// Mock window.scrollTo
window.scrollTo = vi.fn();