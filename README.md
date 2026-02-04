# GTLint

A linter and formatter for the [GuidedTrack](https://guidedtrack.com) language, inspired by ESLint and Prettier.

## Installation

Install GTLint via npm:

```bash
npm install gt-lint
```

Or use it directly with npx:

```bash
npx gt-lint --help
```

## Usage

### Command Line

GTLint provides two main commands: `lint` and `format`.

#### Linting

Check your GuidedTrack code for errors and style issues:

```bash
npx gtlint lint [options] [paths...]
```

**Examples:**

```bash
# Lint a single file
npx gtlint lint program.gt

# Lint all .gt files in a directory
npx gtlint lint src/

# Lint multiple files using glob patterns
npx gtlint lint "src/**/*.gt"

# Lint with a specific config file
npx gtlint lint --config custom-config.js src/
```

**Options:**

- `--config <path>` - Specify a configuration file (default: `gtlint.config.js`)
- `--fix` - Automatically fix problems where possible

#### Formatting

Automatically format your GuidedTrack code:

```bash
npx gtlint format [options] [paths...]
```

**Examples:**

```bash
# Format a single file
npx gtlint format program.gt

# Format all .gt files in a directory
npx gtlint format src/

# Check formatting without making changes
npx gtlint format --check "src/**/*.gt"
```

**Options:**

- `--config <path>` - Specify a configuration file
- `--check` - Check if files are formatted without making changes
- `--write` - Write formatted output to files (default behavior)

### VSCode Extension

GTLint provides a VSCode extension for an integrated development experience:

1. Install the extension from the `vscode-extension/` directory
2. Open any `.gt` file to see syntax highlighting
3. Linting diagnostics appear automatically in the editor
4. Errors and warnings are underlined in your code

## Configuration

Create a `gtlint.config.js` file in your project root to customize GTLint behavior:

```javascript
export default {
  rules: {
    'indent-style': 'error',
    'no-undefined-vars': 'error',
    'no-unused-vars': 'warn',
    'no-invalid-goto': 'error',
    'valid-keyword': 'error',
    'valid-sub-keyword': 'error',
    'no-unclosed-string': 'error',
    'no-unclosed-bracket': 'error',
    'no-single-quotes': 'warn'
  },
  formatter: {
    removeTrailingWhitespace: true,
    ensureNewlineAtEndOfFile: true,
    maxConsecutiveBlankLines: 2
  }
};
```

### Rule Severity Levels

- `'off'` or `0` - Disable the rule
- `'warn'` or `1` - Show as warning (doesn't fail linting)
- `'error'` or `2` - Show as error (fails linting)

## Available Rules

GTLint includes the following linting rules:

### Code Quality

- **`no-undefined-vars`** - Detects use of undefined variables
- **`no-unused-vars`** - Warns about variables that are defined but never used
- **`no-invalid-goto`** - Ensures `*goto:` statements reference valid `*label:` targets

### Syntax Validation

- **`valid-keyword`** - Validates that keywords are recognized GuidedTrack keywords
- **`valid-sub-keyword`** - Validates that sub-keywords are valid for their parent keyword
- **`no-unclosed-string`** - Detects unclosed string literals
- **`no-unclosed-bracket`** - Detects unclosed brackets, braces, or parentheses

### Style

- **`indent-style`** - Enforces tab-only indentation (GuidedTrack requirement)
- **`no-single-quotes`** - Enforces double quotes for string literals

## Disabling Rules

You can disable rules for specific lines or sections using inline comments:

```
-- gtlint-disable-next-line no-unused-vars
>> temp_variable = 42

-- gtlint-disable no-undefined-vars
>> x = some_undefined_var
>> y = another_undefined_var
-- gtlint-enable no-undefined-vars

-- gtlint-disable-line no-invalid-goto
*goto: some_label
```

**Directive comments:**

- `-- gtlint-disable` - Disable all rules for the rest of the file
- `-- gtlint-enable` - Re-enable all rules
- `-- gtlint-disable <rule>` - Disable a specific rule
- `-- gtlint-enable <rule>` - Re-enable a specific rule
- `-- gtlint-disable-line` - Disable rules for the current line
- `-- gtlint-disable-next-line` - Disable rules for the next line

## Declaring Program APIs

GuidedTrack programs designed to be called as sub-programs often expect to receive certain global variables as inputs and return certain global variables as outputs. Use API directives to declare these variables and suppress false warnings:

```
-- @expects: user_id, session_token
-- @returns: result_status, error_message

>> result_status = "success"

*if: user_id
	>> result_status = "authenticated"
*else
	>> result_status = "failed"
	>> error_message = "User ID not provided"
```

**API directive comments:**

- `-- @expects: var1, var2, ...` - Declare variables expected as inputs from parent program (suppresses `no-undefined-vars`)
- `-- @returns: var1, var2, ...` - Declare variables returned as outputs to parent program (suppresses `no-unused-vars`)

You can use multiple `@expects` or `@returns` directives if needed:

```
-- @expects: input1, input2
-- @expects: input3
-- @returns: output1
-- @returns: output2, output3
```

## Formatter Options

Configure the formatter in your `gtlint.config.js`:

```javascript
export default {
  formatter: {
    // Remove trailing whitespace from lines
    removeTrailingWhitespace: true,

    // Ensure file ends with a newline
    ensureNewlineAtEndOfFile: true,

    // Maximum number of consecutive blank lines allowed
    maxConsecutiveBlankLines: 2
  }
};
```

## Example

Here's a simple GuidedTrack program that passes all linting rules:

```
-- Welcome program
*program: Welcome Survey

>> user_name = ""

*question: What is your name?
	*save: user_name

*if: user_name
	Hello, {user_name}!
*else
	Hello there!

*question: How are you feeling today?
	*type: multiple choice
	*save: mood
	Great
	Good
	Okay
	Not great

*if: mood = "Great" or mood = "Good"
	Glad to hear it!

*label: end
Thank you for participating!
```

## Requirements

- Node.js 18.0.0 or higher

## About GuidedTrack

GuidedTrack is a domain-specific language for creating web apps, forms, and surveys. Learn more at [guidedtrack.com](https://guidedtrack.com) or check the [documentation](https://docs.guidedtrack.com).

## License

MIT
