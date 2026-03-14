import js from '@eslint/js';
import globals from 'globals';
import jestPlugin from 'eslint-plugin-jest';
import importPlugin from 'eslint-plugin-import';

export default [
  // Базовые правила ESLint
  js.configs.recommended,

  // Основная конфигурация для всех JS файлов
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      }
    },
    plugins: {
      import: importPlugin,
      jest: jestPlugin
    },
    rules: {
      // Отступы - 2 пробела
      'indent': ['error', 2],

      // Кавычки - одинарные
      'quotes': ['error', 'single'],

      // Точки с запятой - обязательны
      'semi': ['error', 'always'],

      // Максимальная длина строки
      'max-len': ['warn', {
        code: 120,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true
      }],

      // Запретить console.log
      'no-console': ['warn', {
        allow: ['warn', 'error']
      }],

      // Предпочитать const
      'prefer-const': 'error',

      // Запретить неиспользуемые переменные
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],

      // Разрешить for...of циклы
      'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],

      // Разрешить использование "_"
      'no-underscore-dangle': ['error', {
        allow: ['_'],
        allowAfterThis: true
      }],

      // Порядок импортов
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always'
      }],

      // Отключаем проблемные правила
      'import/extensions': 'off',
      'class-methods-use-this': 'off',
      'no-new': 'off',
      'import/prefer-default-export': 'off',

      // Правила для импортов
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: [
          '**/*.test.js',
          '**/tests/**/*.js',
          'jest.config.cjs',
          'eslint.config.js'
        ]
      }]
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js'],
          moduleDirectory: ['node_modules', 'src']
        }
      }
    }
  },

  // Конфигурация для тестовых файлов
  {
    files: ['**/*.test.js', '**/tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    rules: {
      'import/no-extraneous-dependencies': 'off',
      'max-len': ['warn', { code: 150 }],
      'no-unused-expressions': 'off',
      'global-require': 'off',
      'no-return-assign': 'off',
      'no-param-reassign': 'off'
    }
  },

  // Игнорируемые файлы
  {
    ignores: [
      'node_modules/**',
      'coverage/**',
      'dist/**'
    ]
  }
];