| Type | Description | Example |
|---|---|---|
| unit | the smallest bit of code you can isolate | `const sum = (a, b) => a + b` |
| component | a unit + dependencies | `const arithmetic = (op = sum, a, b) => ops[op](a, b)` | 
| integration | components fitting together | - | 
| end-to-end (e2e) | app + external data stores, delivery, etc | A fake user (ex a Webdriverio agent) literally using an app connected to real external systems. |