import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  { ignores: ['dist', '.vite', '.next', 'node_modules'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react/prop-types': 'off',
    },
  },
  // Server-side files run under Node/Edge runtimes where Next.js provides
  // `process` — allow it there, but keep client code honest.
  {
    files: [
      'src/app/api/**/*.js',
      'src/lib/**/*.js',
      'src/utils/**/*.js',
      'initDB.js',
      'next.config.mjs',
      'tailwind.config.js',
      'scripts/**/*.js',
      'scripts/**/*.mjs',
    ],
    languageOptions: {
      globals: { process: 'readonly' },
    },
  },
]
