/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Poppins', 'sans-serif'],
            },
            colors: {
                primary: {
                    DEFAULT: '#FF642D', // Semrush Orange
                    hover: '#E55019',
                    dark: '#FF642D'
                },
                secondary: {
                    DEFAULT: '#9966FF', // Accent Purple
                    light: '#F3EFFF'
                },
                // Semrush-style dark theme colors
                midnight: {
                    DEFAULT: '#171A22',
                    lighter: '#2C3039',
                    card: '#1C1F26'
                },
                // Enterprise grays
                slate: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    800: '#1F2937',
                    900: '#111827'
                },
                accent: '#00C2C3', // Teal accent
                warning: '#FFA800',
                error: '#FF3D3D',

                'light-bg': '#F4F5F7', // Light SaaS background
                'dark-bg': '#111317',  // Deep dark background
                'light-text': '#171A22',
                'dark-text': '#FFFFFF',
                'light-card': '#FFFFFF',
                'dark-card': '#1C1F26',
            },
            boxShadow: {
                'soft': '0 4px 20px rgba(0,0,0,0.05)',
                'glow': '0 0 20px rgba(255, 100, 45, 0.3)',
            }
        }
    },
    plugins: [],
}
