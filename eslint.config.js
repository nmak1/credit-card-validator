module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'airbnb-base'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'jest'
  ],
  rules: {
    // Отступы - 2 пробела
    'indent': ['error', 2],

    // Кавычки - одинарные
    'quotes': ['error', 'single'],

    // Точки с запятой - обязательны
    'semi': ['error', 'always'],

    // Максимальная длина строки - 100 символов (увеличиваем для тестов)
    'max-len': ['warn', {
      'code': 120,  // Увеличили до 120
      'ignoreUrls': true,
      'ignoreStrings': true,
      'ignoreTemplateLiterals': true
    }],

    // Запретить console.log в продакшене
    'no-console': ['warn', {
      'allow': ['warn', 'error']
    }],

    // Предпочитать const если переменная не переназначается
    'prefer-const': 'error',

    // Запретить неиспользуемые переменные
    'no-unused-vars': ['error', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }],

    // Разрешить for...of циклы
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],

    // Разрешить использование "_" в качестве имени параметра
    'no-underscore-dangle': ['error', {
      'allow': ['_'],
      'allowAfterThis': true
    }],

    // Импорты должны быть в начале файла
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always'
    }],

    // Запретить экспорт по умолчанию в некоторых случаях
    'import/prefer-default-export': 'off',

    // Разрешить импорт devDependencies в тестах
    'import/no-extraneous-dependencies': ['error', {
      'devDependencies': [
        '**/*.test.js',
        '**/tests/**/*.js',
        '**/tests-puppeteer/**/*.js',
        'jest.config.js',
        '.eslintrc.js'
      ]
    }],

    // ОТКЛЮЧАЕМ проблемные правила для нашего проекта
    'import/extensions': 'off',  // Отключаем проверку расширений в импортах
    'class-methods-use-this': 'off',  // Отключаем требование использовать this в методах класса
    'no-new': 'off',  // Разрешаем new без присваивания

    // Jest специфичные правила
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error'
  },
  overrides: [
    {
      // Тестовые файлы имеют свои правила
      files: ['**/*.test.js', '**/tests/**/*.js', '**/tests-puppeteer/**/*.js'],
      env: {
        jest: true
      },
      rules: {
        // В тестах можно использовать любой тип импорта
        'import/no-extraneous-dependencies': 'off',

        // В тестах можно использовать describe/it с любой вложенностью
        'max-len': ['warn', { 'code': 150 }],  // Еще больше для тестов

        // Разрешить использование expect в тестах
        'no-unused-expressions': 'off',

        // Разрешить импорт без расширения в тестах
        'import/extensions': 'off',

        // Разрешить require в тестах Puppeteer
        'global-require': 'off',

        // Разрешить присваивание в стрелочных функциях для тестов
        'no-return-assign': 'off',

        // Разрешить изменение параметров в тестах
        'no-param-reassign': 'off'
      }
    }
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
        moduleDirectory: ['node_modules', 'src']
      }
    }
  }
};