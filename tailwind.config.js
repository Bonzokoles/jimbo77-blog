/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            borderRadius: {
                none: '0',
                sm: '1px',
                DEFAULT: '2px',
                md: '2px',
                lg: '2px',
                xl: '2px',
                '2xl': '2px', // Enforcing strict 2px for larger containers too
                '3xl': '4px', // Slightly larger for massive containers if needed, but keeping it tight
                full: '9999px',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                logo: ['SF TransRobotics', 'Inter', 'sans-serif'],
                display: ['Kenyan Coffee', 'sans-serif'],
            },
            colors: {
                primary: '#00f2fe',
                secondary: '#4facfe',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
