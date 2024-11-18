# Library Dependency Resolver

A Node.js application that resolves transitive dependencies between software libraries. Given a list of direct dependencies between libraries, it outputs the complete set of dependencies for each library.

## Features

- Resolves direct and transitive dependencies between libraries
- Maintains input order in output
- Handles malformed input with clear error messages
- Supports both relative and absolute file paths
- Includes comprehensive test suite

## Installation

1. Clone this repository
2. Install dependencies:
```bash
npm init -y
npm install --save-dev mocha
```

## Usage

Run the program by providing an input file:
```bash
node index.js <input-file>
```

### Input Format
Each line in the input file must follow this format:
```
<library> depends on <space-separated-dependencies>
```

Example input:
```
X depends on Y R
Y depends on Z
```

Expected output:
```
X depends on Y R Z
Y depends on Z
```

## Edge Cases Handled

1. File Handling:
   - Empty files
   - Files with only empty lines
   - Non-existent files
   - Files with mixed line endings
   - Relative and absolute paths

2. Input Format:
   - Extra spaces between dependencies
   - Multiple spaces in "depends on" phrase
   - Special characters in library names (e.g., @version, #beta)
   - Version numbers in library names (e.g., jquery@3.6.0)
   - Empty lines between valid declarations

3. Dependencies:
   - Multiple dependencies for a single library
   - Transitive dependencies
   - Libraries that appear only as dependencies
   - Libraries with no dependencies
   - Duplicate dependencies

## Testing

Run the test suite:
```bash
npm test
```

The test suite includes cases for:
- Basic dependency resolution
- Complex dependency chains
- Special characters in library names
- Various edge cases
- Error conditions

## Assumptions

1. Input Format:
   - Each valid line must contain "depends on" (case insensitive)
   - Library names can contain any non-whitespace characters
   - Dependencies are space-separated

2. Dependencies:
   - No circular dependencies exist
   - Input order must be preserved in output
   - Duplicate dependencies are automatically handled (using Set)

3. File System:
   - Program has read access to input file
   - UTF-8 file encoding

## What It Doesn't Handle

1. Circular Dependencies:
   - No detection or prevention of circular references
   - Assumes dependencies form a directed acyclic graph

2. Performance Optimizations:
   - No caching of computed dependencies
   - May not be optimal for very large dependency trees

3. Advanced Features:
   - No version resolution
   - No conflict detection
   - No dependency validation beyond format checking

## Error Messages

The program provides clear error messages for:
- `"File not found: <filename>"` - When input file doesn't exist
- `"Invalid line format: <line>"` - When a line doesn't match expected format
- `"No valid dependency declarations found"` - For empty files or files with only empty lines

## Project Structure

```
.
├── dependencyResolver.js    # Core dependency resolution logic
├── index.js                # CLI interface
├── dependencyResolver.test.js # Test suite
└── package.json            # Project configuration
```

## Example

### Complex Input:
```
A depends on B C
B depends on C E
C depends on G
D depends on A F
E depends on F
F depends on H
```

### Output:
```
A depends on B C G E F H
B depends on C G E F H
C depends on G
D depends on A B C G E F H
E depends on F H
F depends on H
```

## Contributing

Feel free to submit issues and enhancement requests.

## License

MIT