import { test, describe } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import fs from 'fs/promises';
import path from 'path';
import app from './server.js';
import { generateQRCodesPDF } from './pdfGenerator.js';

const QR_FOLDER = './qr-codes';
const PDF_OUTPUT_FOLDER = './pdf-output';
const PDF_FILENAME = 'qr-codes-collection.pdf';

// Clean up before tests
test.before(async () => {
  console.log('🧹 Cleaning up test environment...');
  
  // Clean QR codes directory
  try {
    const files = await fs.readdir(QR_FOLDER);
    await Promise.all(
      files.map(file => fs.unlink(path.join(QR_FOLDER, file)))
    );
  } catch (error) {
    // Directory doesn't exist or is empty, which is fine
  }
  
  // Clean PDF output directory
  try {
    const files = await fs.readdir(PDF_OUTPUT_FOLDER);
    await Promise.all(
      files.map(file => fs.unlink(path.join(PDF_OUTPUT_FOLDER, file)))
    );
  } catch (error) {
    // Directory doesn't exist or is empty, which is fine
  }
});

describe('QR Generator Integration Test - Complete Workflow', () => {
  let getRequestTime = 0;
  let postRequestTime = 0;
  let getResponseData = null;
  let postResponseData = null;

  test('GET /qr - Single QR code generation', async () => {
    console.log('📱 Testing GET /qr endpoint...');
    const startTime = Date.now();
    
    const response = await request(app)
      .get('/qr')
      .expect(200);
    
    getRequestTime = Date.now() - startTime;
    
    // Minimal validation
    assert.strictEqual(response.headers['content-type'], 'image/png');
    assert.ok(response.body.length > 0, 'QR code image should have content');
    
    getResponseData = {
      contentType: response.headers['content-type'],
      contentLength: response.body.length,
      filename: response.headers['content-disposition']?.match(/filename="([^"]+)"/)?.[1]
    };
  });

  test('POST /qr/batch - Batch QR code generation (5 codes)', async () => {
    console.log('📱 Testing POST /qr/batch endpoint...');
    const startTime = Date.now();
    
    const response = await request(app)
      .post('/qr/batch')
      .send({ count: 5 })
      .expect(200);
    
    postRequestTime = Date.now() - startTime;
    
    // Minimal validation
    assert.strictEqual(response.body.count, 5);
    assert.strictEqual(response.body.files.length, 5);
    
    postResponseData = response.body;
  });

  test('Integration Summary - File validation and PDF generation', async () => {
    console.log('🔍 Running integration summary test...');
    
    // Performance summary
    console.log(`📊 Performance Summary:`);
    console.log(`   GET /qr: ${getRequestTime}ms`);
    console.log(`   POST /qr/batch: ${postRequestTime}ms`);
    console.log(`   Total API time: ${getRequestTime + postRequestTime}ms`);
    
    // Validate filesystem - should have 6 files total (1 + 5)
    console.log('📁 Validating filesystem...');
    const qrFiles = await fs.readdir(QR_FOLDER);
    const pngFiles = qrFiles.filter(file => file.toLowerCase().endsWith('.png'));
    
    assert.strictEqual(pngFiles.length, 6, 'Should have exactly 6 PNG files (1 single + 5 batch)');
    console.log(`✅ Found ${pngFiles.length} QR code files in filesystem`);
    
    
    // Generate PDF and validate
    console.log('📄 Generating PDF...');
    const pdfStartTime = Date.now();
    
    const pdfPath = await generateQRCodesPDF();
    
    const pdfGenerationTime = Date.now() - pdfStartTime;
    
    // Validate PDF file exists and has content
    assert.ok(pdfPath, 'PDF generation should return a path');
    
    const pdfStats = await fs.stat(pdfPath);
    assert.ok(pdfStats.isFile(), 'PDF should be a file');
    assert.ok(pdfStats.size > 0, 'PDF should have content');
    
    // PDF should be reasonably sized (at least 10KB for 6 QR codes)
    const pdfSizeKB = pdfStats.size / 1024;
    assert.ok(pdfSizeKB >= 10, `PDF should be at least 10KB, got ${pdfSizeKB.toFixed(2)}KB`);
    
    console.log(`✅ PDF created successfully: ${pdfSizeKB.toFixed(2)}KB`);
    
    // Validate PDF is in correct location
    const expectedPdfPath = path.join(PDF_OUTPUT_FOLDER, PDF_FILENAME);
    assert.strictEqual(pdfPath, expectedPdfPath, 'PDF should be in expected location');
    
    // Final integration summary
    console.log('🎉 Integration test completed successfully!');
    console.log('📋 Summary:');
    console.log(`   ✅ GET /qr: ${getRequestTime}ms`);
    console.log(`   ✅ POST /qr/batch (5): ${postRequestTime}ms`);
    console.log(`   ✅ Files created: ${pngFiles.length} PNG files`);
    console.log(`   ✅ PDF generated: ${pdfSizeKB.toFixed(2)}KB in ${pdfGenerationTime}ms`);
    console.log(`   ⏱️  Total workflow time: ${getRequestTime + postRequestTime + pdfGenerationTime}ms`);
    
    // Assert final state
    assert.ok(getResponseData, 'GET request should have completed');
    assert.ok(postResponseData, 'POST request should have completed');
    assert.strictEqual(pngFiles.length, 6, 'Should have 6 total QR files');
    assert.ok(pdfStats.size > 10240, 'PDF should be substantial size');
  });
});