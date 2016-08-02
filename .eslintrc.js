module.exports = {
  "extends": "google",
  "rules": {
    "max-len": ["error", 150],
    "no-trailing-spaces": "off",
    "space-in-parens": ["error", "always"],
    "keyword-spacing": ["error", { "before": true, "after": false, "overrides": { "else": { "after": true } } }]
  }
};
// module.exports = {
//     "env": {
//         "browser": true,
//         "node": true
//     },
//     "extends": "eslint:recommended",
//     "rules": {
//         "indent": [
//             "error",
//             2
//         ],
//         "linebreak-style": [
//             "error",
//             "unix"
//         ],
//         "quotes": [
//             "error",
//             "single"
//         ],
//         "semi": [
//             "error",
//             "always"
//         ],
//         "no-console": [
//             "off"
//         ]
//     }
// };
