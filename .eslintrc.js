/*
👋 Hi! This file was autogenerated by tslint-to-eslint-config.
https://github.com/typescript-eslint/tslint-to-eslint-config

It represents the closest reasonable ESLint configuration to this
project's original TSLint configuration.

We recommend eventually switching this configuration to extend from
the recommended rulesets in typescript-eslint.
https://github.com/typescript-eslint/tslint-to-eslint-config/blob/master/docs/FAQs.md

Happy linting! 💖
*/
module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    plugins: [
        'eslint-plugin-react',
        '@typescript-eslint',
        '@typescript-eslint/tslint',
        'eslint-plugin-import',
        'etc',
    ],
    root: true,
    rules: {
        '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
        '@typescript-eslint/dot-notation': 'error',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/naming-convention': [
            'off',
            {
                selector: 'variable',
                format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
                leadingUnderscore: 'forbid',
                trailingUnderscore: 'forbid',
            },
        ],
        '@typescript-eslint/no-array-constructor': 'off',
        '@typescript-eslint/no-dynamic-delete': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-namespace': 'error',
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/quotes': 'off',
        '@typescript-eslint/typedef': [
            'error',
            {
                parameter: true,
            },
        ],
        'brace-style': ['error', '1tbs'],
        'comma-dangle': 'off',
        curly: 'error',
        'dot-notation': 'off',
        'eol-last': 'off',
        eqeqeq: ['off', 'always'],
        'guard-for-in': 'error',
        'id-denylist': 'error',
        'id-match': 'error',
        indent: 'off',
        'max-len': 'off',
        'no-array-constructor': 'off',
        'no-bitwise': 'off',
        'no-caller': 'error',
        'no-console': [
            'error',
            {
                allow: [
                    'warn',
                    'dir',
                    'timeLog',
                    'assert',
                    'clear',
                    'count',
                    'countReset',
                    'group',
                    'groupEnd',
                    'table',
                    'dirxml',
                    'error',
                    'groupCollapsed',
                    'Console',
                    'profile',
                    'profileEnd',
                    'timeStamp',
                    'context',
                ],
            },
        ],
        'no-constant-condition': 'error',
        'no-control-regex': 'error',
        'no-debugger': 'error',
        'no-duplicate-case': 'error',
        'no-empty': 'off',
        'no-empty-function': 'off',
        'no-eval': 'error',
        'no-extra-bind': 'error',
        'no-fallthrough': 'error',
        'no-invalid-regexp': 'error',
        'no-multi-str': 'error',
        'no-new-func': 'error',
        'no-new-wrappers': 'error',
        'no-octal': 'error',
        'no-octal-escape': 'error',
        'no-redeclare': 'off',
        'no-regex-spaces': 'error',
        'no-restricted-syntax': [
            'error',
            {
                message: 'Forbidden call to document.cookie',
                selector: 'MemberExpression[object.name="document"][property.name="cookie"]',
            },
        ],
        'no-sparse-arrays': 'error',
        'no-trailing-spaces': 'error',
        'no-underscore-dangle': 'off',
        'no-unused-expressions': 'off',
        'no-unused-labels': 'error',
        'no-with': 'error',
        quotes: 'off',
        'react/no-danger': 'error',
        'use-isnan': 'error',
        '@typescript-eslint/tslint/config': [
            'error',
            {
                rules: {
                    whitespace: [
                        true,
                        'check-branch',
                        'check-decl',
                        'check-operator',
                        'check-separator',
                        'check-type',
                    ],
                },
            },
        ],
        'import/no-duplicates': 'error',
        'prefer-const': 'error',
        'no-var': 'error',
        'etc/no-const-enum': ['error', { allowLocal: true }],
    },
};
