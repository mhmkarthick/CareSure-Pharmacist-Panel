export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: '#14243A', 700: '#1D3150' },
        primary: {
          DEFAULT: '#0E7C7E',
          hover: '#0B6668',
          soft: '#E7F3F3',
          ink: '#0B6668',
          bright: '#3FB8B9',
        },
        canvas: '#F5F7FA',
        faint: '#F8FAFC',
        viewer: '#E6EAF0',
        ink: '#202B3C',
        muted: '#64748B',
        line: { DEFAULT: '#E2E8F0', strong: '#CBD5E1' },
        success: { DEFAULT: '#16865B', soft: '#E8F5EE', ink: '#0F6B48' },
        warning: { DEFAULT: '#B7791F', soft: '#FBF3E4', ink: '#8A5A12' },
        danger: { DEFAULT: '#C73E4D', hover: '#AE3341', soft: '#FBECEE', ink: '#A8303E' },
        info: { DEFAULT: '#2F6FB0', soft: '#EAF2FB', ink: '#245A91' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
};
