# Vue Reactively Tests

This directory contains comprehensive tests for all `@vue-reactively` packages. The tests are organized by package and use Vitest as the testing framework.

## Structure

```
test/
├── collections/              # Tests for @vue-reactively/collections
│   ├── getChildNodes.test.ts    # Utility function tests
│   ├── getItemCount.test.ts     # Utility function tests
│   ├── useCollection.test.ts    # Composable tests
│   ├── CollectionBuilder.test.ts # Core logic tests
│   ├── Item.test.ts            # Component tests
│   ├── Section.test.ts         # Component tests
│   └── index.test.ts           # Export validation tests
├── setup.ts                  # Global test setup
└── README.md                # This file
```

## Running Tests

### All Tests

```bash
npm test
```

### Watch Mode

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

### UI Mode

```bash
npm run test:ui
```

## Test Categories

### Unit Tests

- **Utility Functions**: Test individual utility functions like `getChildNodes`, `getItemCount`, etc.
- **Components**: Test Vue components like `Item` and `Section`
- **Composables**: Test Vue composables like `useCollection`
- **Core Logic**: Test complex classes like `CollectionBuilder`

### Integration Tests

- **Export Validation**: Ensure all packages export the expected API
- **Cross-package Integration**: Test how packages work together

### Coverage Goals

- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 95%+
- **Lines**: 90%+

## Test Utilities

### Setup

The `setup.ts` file provides global configuration for all tests:

- Mocks `process.env` for Node.js environment variables
- Configures Vue Test Utils global properties
- Sets up console mocking for warning tests

### Mocking Strategy

- **Console Methods**: Mocked to test warning behaviors
- **External Dependencies**: Mocked when needed for isolation
- **Vue Components**: Use Vue Test Utils for component testing

## Writing Tests

### Best Practices

1. **Descriptive Names**: Use clear, descriptive test names
2. **Arrange-Act-Assert**: Follow the AAA pattern
3. **Isolation**: Each test should be independent
4. **Edge Cases**: Test both happy path and edge cases
5. **Async/Await**: Use proper async handling for async operations

### Example Test Structure

```typescript
import { describe, it, expect, vi } from "vitest";
import { ComponentUnderTest } from "@vue-reactively/package";

describe("ComponentUnderTest", () => {
  describe("methodName", () => {
    it("should handle normal case correctly", () => {
      // Arrange
      const input = "test input";

      // Act
      const result = ComponentUnderTest.methodName(input);

      // Assert
      expect(result).toBe("expected output");
    });

    it("should handle edge case", () => {
      // Test edge cases
    });
  });
});
```

### Mock Guidelines

```typescript
// Mock external dependencies
vi.mock("@external/package", () => ({
  method: vi.fn().mockReturnValue("mocked value"),
}));

// Mock console methods for testing warnings
const originalWarn = console.warn;
beforeEach(() => {
  console.warn = vi.fn();
});

afterEach(() => {
  console.warn = originalWarn;
});
```

## Debugging Tests

### VS Code Configuration

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Tests",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["--run"],
  "console": "integratedTerminal"
}
```

### Browser Debugging

Use `--ui` flag to run tests in browser UI for debugging:

```bash
npm run test:ui
```

## Continuous Integration

Tests run automatically on:

- Pull requests
- Main branch commits
- Release branches

Minimum requirements for CI to pass:

- All tests must pass
- Coverage thresholds must be met
- No linting errors
- TypeScript compilation successful

## Contributing

When adding new features:

1. Write tests first (TDD approach recommended)
2. Ensure all existing tests pass
3. Add tests for new functionality
4. Update documentation if needed
5. Verify coverage meets requirements

When fixing bugs:

1. Write a failing test that reproduces the bug
2. Fix the bug
3. Ensure the test now passes
4. Verify no regression in other tests
