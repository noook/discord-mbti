module.exports = {
  root: true,
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'airbnb-base',
  ],
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'airbnb-typescript/base',
      ],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
      rules: {
        '@typescript-eslint/no-misused-new': 'off',
        'max-len': ['error', {
          code: 140,
        }],
        'no-param-reassign': ['error', { props: false }],
      },
    },
    {
      files: ['src/migration/*.ts'],
      rules: {
        'max-len': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
      },
    },
  ],
  rules: {
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
  },
};
