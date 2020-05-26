module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jquery: true
  },
  plugins: [
    'eslint-plugin-html',
    'hbs'
  ],
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module'
  },
  rules: {
      "hbs/check-hbs-template-literals": 2
  }
}
