import QRCode from 'qrcode';
import fs from 'fs/promises';
import path from 'path';

const QR_FOLDER = './qr-codes';

// Ensure QR codes directory exists
async function ensureQRDirectory() {
  try {
    await fs.access(QR_FOLDER);
  } catch {
    await fs.mkdir(QR_FOLDER, { recursive: true });
  }
}

// Generate timestamp for QR content and filename
function generateTimestamp() {
  return new Date().toISOString();
}

// Create filename from timestamp
function createFilename(timestamp, prefix = '') {
  const cleanTimestamp = timestamp.replace(/[:.]/g, '-');
  return `${prefix}${cleanTimestamp}.png`;
}

// Generate QR code as buffer
async function generateQRBuffer(content) {
  return await QRCode.toBuffer(content, {
    type: 'png',
    width: 300,
    margin: 2
  });
}

// Save QR buffer to file
async function saveQRToFile(buffer, filename) {
  const filepath = path.join(QR_FOLDER, filename);
  await fs.writeFile(filepath, buffer);
  return filepath;
}

// Generate single QR code
export async function createSingleQR() {
  await ensureQRDirectory();
  
  const timestamp = generateTimestamp();
  const filename = createFilename(timestamp);
  const qrBuffer = await generateQRBuffer(timestamp);
  const filepath = await saveQRToFile(qrBuffer, filename);
  
  return {
    timestamp,
    filename,
    filepath,
    qrData: qrBuffer
  };
}

// Generate batch of QR codes
export async function createBatchQR(count) {
  if (count < 1 || count > 100) {
    throw new Error('Count must be between 1 and 100');
  }
  
  await ensureQRDirectory();
  
  const results = [];
  
  for (let i = 1; i <= count; i++) {
    const timestamp = generateTimestamp();
    const filename = createFilename(timestamp, `batch-${i}-`);
    const qrBuffer = await generateQRBuffer(timestamp);
    const filepath = await saveQRToFile(qrBuffer, filename);
    
    results.push({
      timestamp,
      filename,
      filepath,
      batchNumber: i
    });
  }
  
  return results;
}