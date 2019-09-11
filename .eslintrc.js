module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: 'aqua',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
};