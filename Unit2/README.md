# QR Generator API

A simple Express.js API for generating QR codes with timestamp data.
Meant to be tested with Node Test Runner.

## Features

- **GET /qr** - Generate single QR code with current timestamp
- **POST /qr/batch** - Generate batch of QR codes (1-100)
- All QR codes are saved as PNG files to the filesystem
- PDF generation utility

## Installation

```bash
npm install
```

## Usage

### Run Tests with Node Test Runner
```bash
npm run test
```

### Run Integration Test
```bash
npm run test:integration
```

### Clean Output Folder
```bash
npm run clean
```

### Generate PDF Output
```bash
npm run pdf
```

## API Endpoints

### GET /qr
Returns a QR code image containing the current timestamp.

**Response:** PNG image file

### POST /qr/batch
Generates multiple QR codes with batch numbering.

**Request Body:**
```json
{
  "count": 5
}
```

**Response:**
```json
{
  "message": "Successfully generated 5 QR codes",
  "count": 5,
  "files": [
    {
      "filename": "batch-1-2024-01-01T12-00-00-000Z.png",
      "filepath": "./qr-codes/batch-1-2024-01-01T12-00-00-000Z.png",
      "batchNumber": 1
    }
  ]
}
```


## File Structure

```
src
├── server.js          # Express app and routes
├── qrService.js       # QR generation logic
├── server.test.js     # Test suite
├── package.json       # Dependencies and scripts
└── qr-codes/         # Generated QR code files (auto-created)
```

## Architecture Principles

- **KISS**: Simple, readable code without unnecessary complexity
- **YAGNI**: Only implements required features
- **SOLID**: Single responsibility, dependency injection, clean interfaces

## Dependencies

- `express` - Web framework
- `qrcode` - QR code generation
- `pdfkit` - PDF utilities
- `supertest` - HTTP testing (dev dependency)