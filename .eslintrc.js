// https://eslint.org/docs/user-guide/configuring

module.exports = {
  "root": true,
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "env": {
    "browser": true,
    "es6": true,
  },
  "extends": [
    "airbnb"
  ],
  "plugins": [
    "react", "react-native"
  ],
  "globals": {
    "_": true,
  },
  // add your custom rules here
  "rules": {
    // allow async-await
    "strict": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "semi": [0, "never"],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
  }
}
