/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Deep Space / Modern Palette
                brand: {
                    dark: '#0f172a', // Slate 900
                    primary: '#6366f1', // Indigo 500
                    secondary: '#a855f7', // Purple 500
                    accent: '#ec4899', // Pink 500
                },
                surface: {
                    light: '#ffffff',
                    dark: '#1e293b', // Slate 800
                    glass: 'rgba(255, 255, 255, 0.1)',
                    glassDark: 'rgba(15, 23, 42, 0.6)',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'slow-spin': 'spin 20s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
