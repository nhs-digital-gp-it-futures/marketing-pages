module.exports = {
  "extends": "airbnb-base",
  "env": {
    "browser": true,
    "mocha": true,
    "node": true,
    "jest": true,
  },
  "rules": {
    "import/prefer-default-export": "off",
    "array-callback-return": "off",
    "linebreak-style": "off",
    "no-console": 1,
  },
  "globals": {
    "fixture": "readonly"
  },
  "overrides": [
    {
      "files": ["**/*ui.test.js"],
        "rules": {
          "newline-per-chained-call": 0
        }
      }
    ]
};

