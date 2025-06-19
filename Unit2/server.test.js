import { test, describe } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import fs from 'fs/promises';
import app from './server.js';
import path from 'path';

const QR_FOLDER = './qr-codes';

// Clean up before tests
test.before(async () => {
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

describe('QR Generator API', () => {
  
  test('GET /health returns OK status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    assert.strictEqual(response.body.status, 'OK');
    assert.ok(response.body.timestamp);
  });

  test('GET /qr returns QR code image', async () => {
    const response = await request(app)
      .get('/qr')
      .expect(200);
    
    assert.strictEqual(response.headers['content-type'], 'image/png');
    assert.ok(response.headers['content-disposition'].includes('filename='));
    assert.ok(response.body.length > 0);
  });

  test('POST /qr/batch with valid count generates QR codes', async () => {
    const count = 3;
    const response = await request(app)
      .post('/qr/batch')
      .send({ count })
      .expect(200);
    
    assert.strictEqual(response.body.count, count);
    assert.strictEqual(response.body.files.length, count);
    assert.ok(response.body.message.includes(`${count} QR codes`));
    
    // Verify batch numbering
    response.body.files.forEach((file, index) => {
      assert.strictEqual(file.batchNumber, index + 1);
      assert.ok(file.filename.includes(`batch-${index + 1}-`));
    });
  });

  test('POST /qr/batch without count returns 400', async () => {
    const response = await request(app)
      .post('/qr/batch')
      .send({})
      .expect(400);
    
    assert.ok(response.body.error.includes('Count is required'));
  });

  test('POST /qr/batch with invalid count returns 400', async () => {
    const response = await request(app)
      .post('/qr/batch')
      .send({ count: 'invalid' })
      .expect(400);
    
    assert.ok(response.body.error.includes('must be a number'));
  });

  test('POST /qr/batch with count > 100 returns 400', async () => {
    const response = await request(app)
      .post('/qr/batch')
      .send({ count: 101 })
      .expect(400);
    
    assert.ok(response.body.error.includes('between 1 and 100'));
  });

  test('POST /qr/batch with count < 1 returns 400', async () => {
    const response = await request(app)
      .post('/qr/batch')
      .send({ count: 0 })
      .expect(400);
    
    assert.ok(response.body.error.includes('between 1 and 100'));
  });

  test('Generated files are saved to filesystem', async () => {
    const count = 2;
    const response = await request(app)
      .post('/qr/batch')
      .send({ count })
      .expect(200);
    
    // Check if files exist
    for (const file of response.body.files) {
      try {
        const stats = await fs.stat(file.filepath);
        assert.ok(stats.isFile());
        assert.ok(stats.size > 0);
      } catch (error) {
        assert.fail(`File ${file.filepath} should exist`);
      }
    }
  });
});