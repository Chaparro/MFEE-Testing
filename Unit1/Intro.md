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


# Popular examples

<div class="dense">

- Test runners are tools designed to execute your test suites and report the results. They are essential in automating the testing process.
- Python: `pytest` is widely appreciated for its powerful features and simple syntax, making it suitable for both simple and complex projects.
- Java: `JUnit` is the de facto standard for unit testing in Java development, known for its rich annotation-based configuration.
- JavaScript: `Jest` is a flexible test framework with a focus on asynchronous testing, offering rich features for running tests in Node.js and the browser.
- .NET: `NUnit` is a popular choice for .NET developers, similar to JUnit but with a focus on the .NET framework.
</div>

Choosing the right test runner involves considering the programming language, project complexity, and specific requirements.

---

# Test runner VS Testing Framework

<div class="dense">

- Test Runner: A tool that executes tests and reports the results. It is responsible for loading your test code, running it, and then providing feedback.
- Testing Framework: Provides the structure and guidelines for writing tests. It includes assertions, test cases, and test suites, but doesn't run tests by itself.
- The main difference lies in their roles; while a testing framework defines how to write tests, a test runner actually executes them.
- Some tools, like `pytest` and `Jest`, combine both functionalities, acting as both test runners and frameworks.
</div>