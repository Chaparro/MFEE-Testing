# MFEE Intermediate Testing Topics
## A Quick Refresher

| Type | Description | Example |
|---|---|---|
| unit | the smallest bit of code you can isolate | `const sum = (a, b) => a + b` |
| component | a unit + dependencies | `const arithmetic = (op = sum, a, b) => ops[op](a, b)` | 
| integration | components fitting together | - | 
| end-to-end (e2e) | app + external data stores, delivery, etc | A fake user (ex a Webdriverio agent) literally using an app connected to real external systems. |

---

# What’s a Test Runner?

A test runner is a tool that automates the process of executing tests in the development of software, ensuring that code changes do not break existing functionality.

It allows developers to run tests across different environments and conditions systematically.

Test runners can be part of a larger **test framework** or standalone tools.

---

# Usual features of a Test Runner

<div class="dense">

- **Test Discovery:** Automatically detecting and running all test cases within specified directories or files.
- **Test Organization:** Allowing tests to be grouped, categorized, or tagged for selective execution.
- **Result Reporting:** Providing detailed reports on test outcomes, including successes, failures, and exceptions.
- **Integration Support:** Offering compatibility with Continuous Integration (CI) systems for automated testing within development pipelines.

</div>

---

# Node.js Test Runner: A Modern Testing Solution for Developers

## What is Node.js Test Runner?

Node.js Test Runner is a built-in testing framework that was introduced as an experimental feature in Node.js 18 and stabilized in Node.js 20. 

It represents a significant shift in the Node.js ecosystem by providing native testing capabilities directly in the runtime, eliminating the need for external testing libraries like Jest, Mocha, or Jasmine for many common testing scenarios. This native approach aligns with the broader trend of reducing external dependencies and leveraging platform-native features.

---

## Key Features & Benefits

### 1. **Zero Dependencies**

**What it means**: The test runner is built directly into the Node.js runtime, requiring no additional npm packages or external libraries.

**Benefits**:

- Reduces bundle size and dependency management overhead
- Eliminates security vulnerabilities from third-party testing packages
- Faster installation times for new projects
- No version compatibility issues between testing framework and Node.js
- Simplified package.json with fewer devDependencies

**Impact**: Projects can start testing immediately after Node.js installation without any setup overhead.

---

### 2. **Native ES Modules Support**

**What it means**: The test runner works seamlessly with modern JavaScript ES modules (`import`/`export`) without requiring additional configuration or transpilation.

**Benefits**:

- No need for complex Babel configurations or module transformation
- Direct support for `import` statements in test files
- Works with both `.js` and `.mjs` file extensions
- Supports dynamic imports for advanced testing scenarios
- Future-proof as ES modules become the standard

**Example**:

```javascript
import { test } from 'node:test';
import { strictEqual } from 'node:assert';
import { myFunction } from '../src/utils.js';

test('myFunction should return expected value', () => {
  strictEqual(myFunction(5), 10);
});
```

---

### 3. **Built-in Assertion Library**

**What it means**: Node.js includes a comprehensive `node:assert` module with various assertion methods for testing different conditions.

**Available assertions**:

- `strictEqual()`, `deepStrictEqual()` for value comparisons
- `throws()`, `doesNotThrow()` for error testing
- `match()` for regex pattern matching
- `ok()` for truthiness testing

**Benefits**:

- No need to learn external assertion library APIs
- Consistent behavior across Node.js versions
- Optimized error messages and stack traces
- Type-safe assertions when using TypeScript

**Example**:

```javascript
import { deepStrictEqual, throws } from 'node:assert';

deepStrictEqual(actualObject, expectedObject);
throws(() => riskyFunction(), /Expected error message/);
```

---

### 4. **Parallel Test Execution**

**What it means**: Tests run concurrently by default, utilizing multiple CPU cores to execute test files simultaneously.

**Performance benefits**:

- Significantly faster test suite execution (often 2-4x speedup)
- Better utilization of multi-core systems
- Automatic load balancing across available cores
- Configurable concurrency levels for fine-tuning

**Configuration options**:

```bash
# Control concurrency level
node --test --test-concurrency=4

# Run tests sequentially if needed
node --test --test-concurrency=1
```

**Important**: Tests should be written to be independent and not rely on shared state.

---

### 5. **TypeScript Support**

**What it means**: The test runner can execute TypeScript test files when combined with appropriate loaders or transpilers.

**Setup approaches**:

- Using `--loader` flag with ts-node or tsx
- Transpiling to JavaScript first
- Using Bun or Deno as alternative runtimes

**Benefits**:

- Type safety in test files
- IntelliSense and autocomplete support
- Catch type errors at test-time
- Consistent tooling with TypeScript applications

**Example setup**:

```bash
# Using tsx loader
node --loader tsx --test src/**/*.test.ts

# Using ts-node
node --loader ts-node/esm --test
```

---

### 6. **Watch Mode**

**What it means**: Built-in file watching that automatically re-runs tests when source files or test files change.

**Features**:

- Monitors all relevant files in the project
- Intelligent re-running of affected tests only
- Configurable file patterns and ignore rules
- Real-time feedback during development

**Usage**:

```bash
# Basic watch mode
node --test --watch

# Watch with specific patterns
node --test --watch src/**/*.test.js

# Watch with ignore patterns
node --test --watch --ignore=node_modules/**
```

**Developer experience**: Provides immediate feedback loop similar to modern frontend development tools.

---

### 7. **Test Coverage Reports**

**What it means**: Native code coverage collection and reporting without additional tools like nyc or istanbul.

**Coverage types supported**:

- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

**Output formats**:

- Console summary
- Detailed file-by-file reports
- Integration with coverage visualization tools

**Usage**:

```bash
# Enable coverage
node --experimental-test-coverage --test

# Coverage with specific thresholds
node --experimental-test-coverage --test-coverage-threshold=80
```

**Benefits**: Eliminates need for separate coverage tools and provides native integration.

---

### 8. **Flexible Test Discovery**

**What it means**: Automatic detection of test files based on configurable naming patterns and directory structures.

**Default patterns**:

- Files ending with `.test.js`, `.test.mjs`, `.test.cjs`
- Files in `test/` directories
- Files ending with `.spec.js` (configurable)

**Customization options**:

```bash
# Specific file patterns
node --test "src/**/*.test.js"

# Multiple patterns
node --test "tests/**/*.js" "src/**/*.spec.js"

# Exclude patterns
node --test --test-ignore="**/fixtures/**"
```

**Benefits**: Reduces configuration overhead while providing flexibility for different project structures.

---

### 9. **Nested Test Organization**

**What it means**: Support for hierarchical test organization using describe/it style syntax for better test structuring.

**Organizational benefits**:

- Logical grouping of related tests
- Better test output readability
- Shared setup and teardown for test groups
- Easier navigation in large test suites

**Example structure**:

```javascript
import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

describe('Calculator', () => {
  describe('addition', () => {
    it('should add positive numbers', () => {
      strictEqual(add(2, 3), 5);
    });

    it('should handle negative numbers', () => {
      strictEqual(add(-2, 3), 1);
    });
  });

  describe('multiplication', () => {
    it('should multiply correctly', () => {
      strictEqual(multiply(3, 4), 12);
    });
  });
});
```

---

### 10. **Snapshot Testing**

**What it means**: Built-in capability to capture and compare object snapshots for testing UI components and data structures.

**Use cases**:

- Testing React/Vue component output
- API response validation
- Configuration file testing
- Complex object structure validation

**Workflow**:

1. Generate initial snapshots
2. Compare future test runs against snapshots
3. Update snapshots when intentional changes occur

**Example**:

```javascript
import { test } from 'node:test';
import { snapshot } from 'node:assert';

test('component renders correctly', () => {
  const rendered = renderComponent({ name: 'John', age: 30 });
  snapshot(rendered);
});
```

**Benefits**: Catches unintended changes in complex data structures without manual assertion writing.

---

### 11. **Test Filtering**

**What it means**: Ability to run specific tests or test suites based on names, patterns, or tags without running the entire test suite.

**Filtering options**:

```bash
# Run tests matching pattern
node --test --test-name-pattern="should calculate"

# Run tests with specific tags
node --test --test-grep="@integration"

# Skip tests matching pattern
node --test --test-skip-pattern="@slow"
```

**Benefits**:

- Faster development cycles by running relevant tests only
- Better CI/CD pipeline optimization
- Easier debugging of specific test failures
- Support for test categorization (unit, integration, e2e)

**Development workflow**: Essential for large codebases where running all tests would be time-prohibitive.

---

### 12. **Mock Functions**

**What it means**: Native mocking capabilities for functions, modules, and timers without requiring external libraries like sinon.js.

**Mocking capabilities**:

- Function mocks with call tracking
- Module mocking for dependency injection
- Timer mocking for testing time-dependent code
- Spy functions for behavior verification

**Example usage**:

```javascript
import { test, mock } from 'node:test';
import { strictEqual } from 'node:assert';

test('function is called with correct arguments', () => {
  const mockFn = mock.fn();

  someFunction(mockFn);

  strictEqual(mockFn.mock.calls.length, 1);
  strictEqual(mockFn.mock.calls[0].arguments[0], 'expected-value');
});
```

**Benefits**: Reduces dependency on external mocking libraries while providing comprehensive mocking features.

---

### 13. **Performance Insights**

**What it means**: Built-in timing and performance metrics that help identify slow tests and optimize test suite performance.

**Metrics provided**:

- Individual test execution times
- Test suite duration
- Memory usage statistics
- Slowest tests identification

**Output example**:

```
✓ fast test (0.5ms)
✓ medium test (15ms)
✓ slow test (150ms) ⚠️

Total: 3 tests, 165.5ms
Slowest: slow test (150ms)
```

**Benefits**: Helps maintain fast test suites and identify performance bottlenecks early in development.

---

### 14. **CI/CD Integration**

**What it means**: Produces standard Test Anything Protocol (TAP) output format that integrates seamlessly with continuous integration and deployment pipelines.

**TAP output features**:

- Machine-readable test results
- Detailed failure information
- Standard format supported by most CI systems
- Compatibility with TAP processors and visualizers

**CI integration examples**:

```yaml
# GitHub Actions
- name: Run tests
  run: node --test --test-reporter=tap

# GitLab CI
test:
  script:
    - node --test --test-reporter=junit > test-results.xml
```

**Benefits**: Easy integration with existing CI/CD workflows and test result processing tools.

---

### 15. **Future-Proof**

**What it means**: Active development and maintenance by the Node.js core team ensures long-term stability and continuous feature evolution.

**Long-term advantages**:

- Guaranteed compatibility with future Node.js versions
- Regular security updates and bug fixes
- Feature development aligned with ecosystem needs
- No risk of package abandonment or maintenance issues

**Roadmap considerations**:

- Continued performance optimizations
- Additional assertion methods
- Enhanced debugging capabilities
- Better IDE integration

**Strategic benefits**: Investing in Node.js Test Runner reduces technical debt and provides a stable foundation for testing infrastructure.

---

## Quick Usage Examples

### Basic Test File

```javascript
import { test } from 'node:test';
import { strictEqual } from 'node:assert';

test('basic addition', () => {
  strictEqual(1 + 1, 2);
});

test('async operation', async () => {
  const result = await fetchData();
  strictEqual(result.status, 'success');
});
```

### Running Tests

```bash
# Run all tests
node --test

# Watch mode for development
node --test --watch

# With coverage reporting
node --experimental-test-coverage --test

# Specific test files
node --test src/utils.test.js src/api.test.js
```

---

## Bottom Line

Node.js Test Runner represents a paradigm shift toward simpler, more maintainable testing infrastructure. By providing comprehensive testing capabilities directly in the runtime, it reduces dependency bloat, eliminates configuration complexity, and ensures long-term stability. 

This makes it an ideal choice for new projects, teams seeking to reduce toolchain complexity, and organizations prioritizing maintainable testing infrastructure. While existing projects with complex testing setups might benefit from gradual migration, new projects can immediately leverage these native capabilities for more efficient and reliable testing workflows.