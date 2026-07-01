module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: ['airbnb', 'airbnb/hooks'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'function-declaration',
        unnamedComponents: 'function-expression',
      },
    ],
    'no-console': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'always',
        jsx: 'never',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          '**/*.test.js',
          '**/*.test.jsx',
          '**/tests/**',
          '**/vite.config.js',
          '**/vitest.config.js',
        ],
      },
    ],
  },
  overrides: [
    {
      files: ['backend/**/*.js'],
      rules: {
        'import/prefer-default-export': 'off',
      },
    },
    {
      files: ['**/*.test.js', '**/*.test.jsx', 'frontend/tests/setup.js'],
      env: {
        jest: true,
      },
    },
    {
      files: ['vitest.config.js'],
      rules: {
        'import/no-unresolved': 'off',
      },
    },
  ],
  ignorePatterns: ['node_modules/', 'dist/', 'backend/uploads/'],
};
