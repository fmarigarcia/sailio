module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // Reglas críticas del proyecto Sailio
    'no-console': 'error',
    'no-var': 'error',
    'no-unused-vars': 'off', // Desactivado en favor de @typescript-eslint
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    'complexity': ['error', 15],
    'max-lines': [
      'error',
      {
        max: 300,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
      rules: {
        'max-lines': 'off',
      },
    },
    {
      files: ['**/*.css', '**/*.scss'],
      rules: {
        'max-lines': 'off',
      },
    },
    {
      files: ['**/prisma/schema.prisma'],
      rules: {
        'max-lines': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '.next/',
    '*.config.js',
    '*.config.ts',
  ],
};
