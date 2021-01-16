module.exports = {
  env: {
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {

    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 6,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-underscore-dangle': ['off', { allow: ['_id'] }],
  },
};
