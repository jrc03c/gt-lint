// gtlint.config.js - Example configuration file
// Copy this to gtlint.config.js and customize as needed

export default {
  // Lint rules configuration
  // Values: 'error', 'warn', 'off'
  rules: {
    'no-undefined-vars': 'error',
    'no-unused-vars': 'warn',
    'valid-keyword': 'error',
    'valid-sub-keyword': 'error',
    'no-invalid-goto': 'error',
    'indent-style': 'error',
    'no-unclosed-string': 'error',
    'no-unclosed-bracket': 'error',
  },

  // Formatter configuration
  format: {
    blankLinesBetweenBlocks: 1,
    spaceAroundOperators: true,
    spaceAfterComma: true,
    spaceAroundArrow: true,
    trimTrailingWhitespace: true,
    insertFinalNewline: true,
  },

  // Files/directories to ignore
  ignore: [
    '**/node_modules/**',
    '**/dist/**',
    '**/*.min.gt',
  ],
};
