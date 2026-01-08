/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1893A0',
                    50: '#E8F7F8',
                    100: '#CFF0F2',
                    DEFAULT_TEAL: '#1893A0'
                },
                secondary: {
                    DEFAULT: '#F05426',
                    50: '#FDEDEB',
                    DEFAULT_ORANGE: '#F05426'
                },
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
            },
            borderRadius: {
                '3xl': '24px',
                '4xl': '32px',
            }
        },
    },
    plugins: [],
}
