# Unit 2

## Node Test Runner Example Repository

An example was prepared, with a simple express API + additional utilities. The goal is to showcase the ease of use and benefits of of Node Test Runner.

We can see the project's original README (unit2.md) describing features, installation and usage, and another document (activity.md) detailing a list of activities for us to follow with the repository.

Below is a quick summary of the project's main features and tests.

## What it does

qrService.js (create a QR code artifact with a timestamp, single output or batch)
server.js (Express API that uses qrService.js to generate artifacts when calling single or batch endpoint)
pdfGenerator.js (takes existing output artifacts to create a PDF summary)

## Tests

There are 3 test files that we are focusing on in this repository:

- qrService.test.js (test base functionality)
- server.test.js (API Calling QRService)
- integration.test.js (Test API Flow as a whole, with artifact transformation and PDF Validation)


## qrService.test.js

 - cleanup hook: "before" testing.
 - Tests:
 - "createSingleQR generates valid result"
 - "createBatchQR generates correct number of QR codes"
 - "createBatchQR throws error for count > 100"
 - "createBatchQR throws error for count < 1"
 - "batch files have unique timestamps"

 # server.test.js

- cleanup hook: "before" testing.
- Tests:
- "GET /qr returns QR code image"
- "POST /qr/batch with valid count generates QR codes"
- "POST /qr/batch with invalid count returns 400"
- "POST /qr/batch with count > 100 returns 400"
- "POST /qr/batch with count < 1 returns 400"
- "Generated files are saved to filesystem"

# integration.test.js

- cleanup hook: "before" testing.
- Complete workflow tests:
- "GET /qr - Single QR code generation"
- "POST /qr/batch - Batch QR code generation (5 codes)"
- "Integration Summary - Filesystem validation and PDF generation"
