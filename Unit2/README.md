# QR Generator API

A simple Express.js API for generating QR codes with timestamp data.

## Features

- **GET /qr** - Generate single QR code with current timestamp
- **POST /qr/batch** - Generate batch of QR codes (1-100)
- All QR codes are saved as PNG files to the filesystem
- Clean, testable architecture following SOLID principles

## Installation

```bash
npm install
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Testing
```bash
npm test
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

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## File Structure

```
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
- `supertest` - HTTP testing (dev dependency)