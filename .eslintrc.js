module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
    },
    extends: [
        // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
        // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
        'plugin:vue/essential',
        // https://github.com/standard/standard/blob/master/docs/RULES-en.md
        'standard'
    ],
    plugins: [
        'vue'
    ],
    rules: {
        // allow async-await
        'generator-star-spacing': 'off',
        'semi': ['error', 'always'],
        'indent': 0,
        'space-before-function-paren': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        "vue/no-parsing-error": [2, {"x-invalid-end-tag": false}]
    }
};
