module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "airbnb-base",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "indent": [2, "tab"],
        "no-tabs": 0,
        "comma-dangle": 0,
        "max-len": ["error", { "code": 120 }],
        "no-console": "off"
    }
};