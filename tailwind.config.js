/** @type {import('tailwindcss').Config} */

const createPxEntries = (size) => {
  return {
    0: '0',
    ...Array.from({ length: size + 1 }).reduce((acc, _, i) => {
      return { ...acc, [`${i}`]: `${i / 16}rem` };
    }),
  };
};

const PX_ENTRIES_10 = createPxEntries(10);
const PX_ENTRIES_100 = createPxEntries(100);
const PX_ENTRIES_1000 = createPxEntries(1000);

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    borderWidth: PX_ENTRIES_10,
    fontSize: PX_ENTRIES_100,
    // spacing values are inherited by the 'padding', 'margin', 'height', 'maxHeight', 'flex-basis', 'gap', 'inset', 'space', 'translate', 'scrollMargin', 'scrollPadding', and 'textIndent'.
    spacing: PX_ENTRIES_1000,
    fontWeight: {
      light: '200',
      DEFAULT: '300',
      medium: '400',
      semibold: '500',
      bold: '600',
    },
    zIndex: {
      zero: '0',
      first: '10',
      second: '20',
      third: '30',
      modal: '9990',
      toast: '9999', // Do not use!!
    },
    borderRadius: { 
      full: '50%',
    },
    colors: {
      transparent: 'transparent',
      red: {
        DEFAULT: 'var(--red-400)',
        0: 'var(--red-50)',
        1: 'var(--red-100)',
        2: 'var(--red-200)',
        3: 'var(--red-300)',
        5: 'var(--red-500)',
        6: 'var(--red-600)',
        7: 'var(--red-700)',
        8: 'var(--red-800)',
        9: 'var(--red-900)',
      },
      green: {
        DEFAULT: 'var(--green)',
        light: 'var(--green-light)',
      },
      purple: {
        DEFAULT: 'var(--purple)',
        light: 'var(--purple-light)',
      },
      violet: {
        DEFAULT: 'var(--violet)',
        light: 'var(--violet-light)',
      },
      pink: {
        DEFAULT: 'var(--pink)',
        light: 'var(--pink-light)',
        dark: 'var(--pink-dark)',
      },
      orange: {
        DEFAULT: 'var(--orange)',
        light: 'var(--orange-light)',
      },
      blue: {
        DEFAULT: 'var(--blue)',
        light: 'var(--blue-light)',
      },
      black: {
        DEFAULT: 'var(--black)',
        light: 'var(--black-light)',
        dark: 'var(--black-dark)',
      },
      white: 'var(--white)',
      gray: {
        0: 'var(--gray-50)',
        1: 'var(--gray-100)',
        2: 'var(--gray-200)',
        3: 'var(--gray-300)',
        4: 'var(--gray-400)',
        5: 'var(--gray-500)',
        6: 'var(--gray-600)',
        7: 'var(--gray-700)',
        8: 'var(--gray-800)',
      },
    },
    screens: {
      sm: { max: '768px' },
      md: { max: '1200px' },
      // => @media (max-width: 768px) { ... }
    },
    extend: {
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        bounce: {
          "0%": {
            transform: "translateY(-12%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
          "100%": {
            transform: "translateY(-12%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
        }
      },
      animation: {
        fadeIn: "fadeIn 2.5s linear",
        bounce: "bounce 1.2s linear infinite"
      },
    },
  },
  plugins: [],
};
