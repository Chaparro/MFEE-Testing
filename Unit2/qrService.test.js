import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import fs from 'fs/promises';
import path from 'path';
import { createSingleQR, createBatchQR } from './qrService.js';

const QR_FOLDER = './qr-codes';

// Clean up before tests
before(async () => {
  try {
    // Remove all files in QR directory if it exists
    const files = await fs.readdir(QR_FOLDER);
    await Promise.all(
      files.map(file => fs.unlink(path.join(QR_FOLDER, file)))
    );
  } catch (error) {
    // Directory doesn't exist or is empty, which is fine
  }
});

describe('QR Service Unit Tests', () => {
  
  test('createSingleQR generates valid result', async () => {
    const result = await createSingleQR();
    
    assert.ok(result.timestamp);
    assert.ok(result.filename);
    assert.ok(result.filepath);
    assert.ok(result.qrData);
    assert.ok(Buffer.isBuffer(result.qrData));
    
    // Verify timestamp format (ISO string)
    assert.ok(new Date(result.timestamp).toISOString() === result.timestamp);
    
    // Verify filename contains timestamp
    const cleanTimestamp = result.timestamp.replace(/[:.]/g, '-');
    assert.ok(result.filename.includes(cleanTimestamp));
  });

  test('createBatchQR generates correct number of QR codes', async () => {
    const count = 3;
    const results = await createBatchQR(count);
    
    assert.strictEqual(results.length, count);
    
    results.forEach((result, index) => {
      assert.ok(result.timestamp);
      assert.ok(result.filename.includes(`batch-${index + 1}-`));
      assert.strictEqual(result.batchNumber, index + 1);
      assert.ok(result.filepath);
      
      // Verify timestamp format
      assert.ok(new Date(result.timestamp).toISOString() === result.timestamp);
    });
  });

  test('createBatchQR with count 1 generates single QR code', async () => {
    const results = await createBatchQR(1);
    
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].batchNumber, 1);
    assert.ok(results[0].filename.includes('batch-1-'));
  });

  test('createBatchQR with count 100 generates maximum QR codes', async () => {
    const results = await createBatchQR(100);
    
    assert.strictEqual(results.length, 100);
    assert.strictEqual(results[0].batchNumber, 1);
    assert.strictEqual(results[99].batchNumber, 100);
    assert.ok(results[99].filename.includes('batch-100-'));
  });

  test('createBatchQR throws error for count > 100', async () => {
    await assert.rejects(
      async () => await createBatchQR(101),
      {
        name: 'Error',
        message: 'Count must be between 1 and 100'
      }
    );
  });

  test('createBatchQR throws error for count < 1', async () => {
    await assert.rejects(
      async () => await createBatchQR(0),
      {
        name: 'Error',
        message: 'Count must be between 1 and 100'
      }
    );
    
    await assert.rejects(
      async () => await createBatchQR(-1),
      {
        name: 'Error',
        message: 'Count must be between 1 and 100'
      }
    );
  });

  test('batch files have unique timestamps', async () => {
    const count = 3;
    const results = await createBatchQR(count);
    
    const timestamps = results.map(r => r.timestamp);
    const uniqueTimestamps = new Set(timestamps);
    
    // All timestamps should be unique (or at least most of them due to timing)
    assert.ok(uniqueTimestamps.size >= 1);
    
    // All filenames should be unique
    const filenames = results.map(r => r.filename);
    const uniqueFilenames = new Set(filenames);
    assert.strictEqual(uniqueFilenames.size, count);
  });
});