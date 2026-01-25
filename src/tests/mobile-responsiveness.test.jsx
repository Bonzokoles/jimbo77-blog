import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import '@testing-library/jest-dom';

const renderWithRouter = (Component) => {
    return render(
        <BrowserRouter>
            <Component />
        </BrowserRouter>
    );
};

describe('Mobile Responsiveness', () => {
    const breakpoints = [
        { name: 'Small Mobile', width: 320, height: 568 },
        { name: 'iPhone X', width: 375, height: 667 },
        { name: 'Galaxy S9', width: 360, height: 640 },
        { name: 'Pixel 6', width: 412, height: 915 }
    ];

    breakpoints.forEach(({ name, width, height }) => {
        describe(`Layout on ${name} screen`, () => {
            beforeEach(() => {
                Object.defineProperty(window, 'innerWidth', { 
                    writable: true, 
                    value: width 
                });
                Object.defineProperty(window, 'innerHeight', { 
                    writable: true, 
                    value: height 
                });
                window.dispatchEvent(new Event('resize'));
            });

            it('Renders main navigation', () => {
                renderWithRouter(Home);
                const navLinks = screen.getAllByRole('link', { name: /Read Article/i });
                expect(navLinks.length).toBeGreaterThan(0);
            });

            it('Renders search input', () => {
                renderWithRouter(Home);
                const searchInput = screen.getByPlaceholderText(/Szukaj artykułów.../i);
                expect(searchInput).toBeInTheDocument();
            });

            it('Grid layout adapts to mobile', () => {
                const { container } = renderWithRouter(Home);
                const gridContainer = container.querySelector('.grid');
                expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
            });

            it('Blog cards layout checks', () => {
                renderWithRouter(Home);
                const blogCards = screen.getAllByRole('link', { name: /Read Article/i });
                
                // Check blog cards exist and total is at least 1
                expect(blogCards.length).toBeGreaterThan(0);
            });
        });
    });
});