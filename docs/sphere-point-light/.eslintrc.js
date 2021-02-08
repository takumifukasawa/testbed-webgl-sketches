module.exports = {
  extends: 'airbnb-base',
  settings: {
    'import/resolver': {
      node: {
        paths: ['./src/js'],
      },
    },
  },
  plugins: [
    'html'
  ],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
      },
    ],
    'no-param-reassign': ['off'],
    'no-mixed-operators': [
      "error",
      {
        "groups": [
          ["&", "|", "^", "~", "<<", ">>", ">>>"],
          ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
          ["&&", "||"],
          ["in", "instanceof"],
        ],
        "allowSamePrecedence": true,
      },
    ],
    'no-console': [
      'error',
      {
        allow: [
          'warn',
          'error',
        ],
      },
    ],
  },
  globals: {
    window: true,
    document: true,
    THREE: true,
    PIXI: true,
    dat: true,
    ga: true
  },
};
