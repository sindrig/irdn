module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": ["error", 4],
        "react/jsx-indent": ["error", 4],
        "react/no-unescaped-entities": [0],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    },
    "globals": {
        "document": true,
    },
};