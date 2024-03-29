module.exports = {
  root: true,
  env: {
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    sourceType: 'module'
  },
  ignorePatterns: [
    '/lib/**/*' // Ignore built files.
  ],
  plugins: [
    '@typescript-eslint',
    'import'
  ],
  rules: {
    'quotes': [2, 'single', 'avoid-escape'],
    'no-trailing-spaces': 0,
    'linebreak-style': 0,
    'import/no-unresolved': 0,
    'object-curly-spacing': [2, 'always'],
    'comma-dangle': ['error', 'never'],
    'new-cap': ['error', { 'capIsNew': false }],
    'indent': 0,
    'valid-jsdoc': 0,
    '@typescript-eslint/no-explicit-any': 'off',
    'max-len': ['warn', { 'code': 140 }]
  }
};
