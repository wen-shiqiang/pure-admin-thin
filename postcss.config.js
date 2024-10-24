// @ts-check

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    "postcss-import": {},
    "tailwindcss/nesting": {},
    // "postcss-prefix-selector": {
    // prefix: ".MMS",
    // transform(prefix, selector, prefixedSelector) {
    // if (selector.startsWith("html") || selector.startsWith("body")) {
    // return `${prefix} ${selector}`;
    // }
    // return prefixedSelector;
    // }
    // },
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {})
  }
};
