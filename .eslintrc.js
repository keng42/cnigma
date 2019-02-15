module.exports = {
  extends: ['plugin:prettier/recommended', 'airbnb-base', 'prettier'],
  plugins: ['import', 'prettier'],
  globals: {
    isArray: true,
    isBoolean: true,
    isNumber: true,
    isObject: true,
    isString: true,
    isDate: true,
    BN: true,
    KK: true,
    FF: true,
    UU: true,
    TG: true,
    funs: true,
    ravenCE: true,
  },
  env: {
    node: true,
    mocha: true,
    browser: true,
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
    'import/no-unresolved': [
      2,
      {
        commonjs: false,
        amd: true,
      },
    ],
    'no-console': 0,
    'no-param-reassign': [
      'error',
      {
        props: false,
      },
    ],
    'no-underscore-dangle': [
      'error',
      {
        allow: ['_id'],
      },
    ],
    'no-await-in-loop': 0, // 这个规则只是为了避免并行写成顺序执行的错误，用不上了
  },
};
