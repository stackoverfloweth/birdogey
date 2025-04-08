import config from '@kitbag/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...config,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': ['off'],
      "vue/component-tags-order": ["error", {
          order: [['script', 'template'], 'style'],
        },
      ],
    },
  },
]
