import fs from 'fs/promises';
import path from 'path';
import { createWriteStream } from 'fs';
import PDFDocument from 'pdfkit';

const QR_FOLDER = './qr-codes';
const OUTPUT_FOLDER = './pdf-output';
const PDF_FILENAME = 'qr-codes-collection.pdf';

// Ensure output directory exists
async function ensureOutputDirectory() {
  try {
    await fs.access(OUTPUT_FOLDER);
  } catch {
    await fs.mkdir(OUTPUT_FOLDER, { recursive: true });
  }
}

// Get all PNG files from QR codes directory
async function getQRCodeFiles() {
  try {
    const files = await fs.readdir(QR_FOLDER);
    return files
      .filter(file => file.toLowerCase().endsWith('.png'))
      .sort(); // Sort alphabetically for consistent ordering
  } catch (error) {
    throw new Error(`Could not read QR codes directory: ${error.message}`);
  }
}

// Extract metadata from filename
function extractMetadata(filename) {
  const nameWithoutExt = filename.replace('.png', '');
  
  // Check if it's a batch file
  const batchMatch = nameWithoutExt.match(/^batch-(\d+)-(.+)$/);
  if (batchMatch) {
    const [, batchNumber, timestampPart] = batchMatch;
    
    // Try to parse timestamp, fallback to filename if it fails
    let displayTime;
    try {
      // Convert format: 2024-01-01T12-00-00-000Z -> 2024-01-01T12:00:00.000Z
      const fixedTimestamp = timestampPart
        .replace(/T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/, 'T$1:$2:$3.$4Z');
      
      const date = new Date(fixedTimestamp);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      displayTime = date.toLocaleString();
    } catch {
      displayTime = filename;
    }
    
    return {
      type: 'batch',
      batchNumber: parseInt(batchNumber),
      displayTime,
      displayName: `Batch #${batchNumber}`
    };
  }
  
  // Regular timestamp file
  let displayTime;
  try {
    // Convert format: 2024-01-01T12-00-00-000Z -> 2024-01-01T12:00:00.000Z
    const fixedTimestamp = nameWithoutExt
      .replace(/T(\d{2})-(\d{2})-(\d{2})-(\d{3})Z/, 'T$1:$2:$3.$4Z');
    
    const date = new Date(fixedTimestamp);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    displayTime = date.toLocaleString();
  } catch {
    displayTime = filename;
  }
  
  return {
    type: 'single',
    displayTime,
    displayName: 'Single QR'
  };
}

// Generate PDF with all QR codes
async function generateQRCodesPDF() {
  console.log('Starting PDF generation...');
  
  await ensureOutputDirectory();
  const qrFiles = await getQRCodeFiles();
  
  if (qrFiles.length === 0) {
    throw new Error('No QR code files found in the qr-codes directory');
  }
  
  console.log(`Found ${qrFiles.length} QR code files`);
  
  // Create PDF document with smaller margins
  const doc = new PDFDocument({ 
    size: 'A4',
    margin: 30,  // Reduced margins from 50 to 30
    info: {
      Title: 'QR Codes Collection',
      Author: 'QR Generator API',
      Subject: 'Generated QR Codes',
      Creator: 'QR Generator Utility'
    }
  });
  
  const outputPath = path.join(OUTPUT_FOLDER, PDF_FILENAME);
  const stream = createWriteStream(outputPath);
  doc.pipe(stream);
  
  // Add compact title section
  doc.fontSize(16)
     .text('QR Codes Collection', { align: 'center' })
     .fontSize(8)
     .text(`Generated: ${new Date().toLocaleDateString()} | Total: ${qrFiles.length}`, { align: 'center' })
     .moveDown(0.5);
  
  // Calculate ultra-compact layout for 15-20 QRs per page
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const pageHeight = doc.page.height - doc.page.margins.top - doc.page.margins.bottom;
  const titleHeight = 40; // Reserve space for title
  const availableHeight = pageHeight - titleHeight;
  
  const qrSize = 80; // Slightly smaller QR code size
  const spacing = 10; // Consistent spacing
  const textHeight = 16; // Minimal text height
  
  const itemsPerRow = Math.floor(pageWidth / (qrSize + spacing));
  const itemHeight = qrSize + textHeight + spacing;
  const rowsPerPage = Math.floor(availableHeight / itemHeight);
  const itemsPerPage = itemsPerRow * rowsPerPage;
  
  console.log(`Layout details:`);
  console.log(`- Page size: ${pageWidth}x${pageHeight}`);
  console.log(`- Available height after title: ${availableHeight}`);
  console.log(`- Item size: ${qrSize}x${itemHeight} (including text)`);
  console.log(`- Grid: ${itemsPerRow} cols x ${rowsPerPage} rows = ${itemsPerPage} items per page`);
  
  let currentX = doc.page.margins.left;
  let currentY = doc.y + 10; // Small gap after title
  let itemsInCurrentRow = 0;
  let itemsInCurrentPage = 0;
  
  // Process each QR code file
  for (let i = 0; i < qrFiles.length; i++) {
    const filename = qrFiles[i];
    const filepath = path.join(QR_FOLDER, filename);
    const metadata = extractMetadata(filename);
    
    console.log(`Processing ${i + 1}/${qrFiles.length}: ${filename}`);
    
    // Check if we need a new page
    if (itemsInCurrentPage >= itemsPerPage) {
      doc.addPage();
      currentX = doc.page.margins.left;
      currentY = doc.page.margins.top;
      itemsInCurrentRow = 0;
      itemsInCurrentPage = 0;
    }
    
    // Check if we need a new row
    if (itemsInCurrentRow >= itemsPerRow) {
      currentX = doc.page.margins.left;
      currentY += itemHeight;
      itemsInCurrentRow = 0;
    }
    
    try {
      // Add QR code image
      doc.image(filepath, currentX, currentY, { width: qrSize, height: qrSize });
      
      // Add minimal metadata text below QR code
      const textY = currentY + qrSize + 1;
      doc.fontSize(6)
         .text(metadata.displayName, currentX, textY, { width: qrSize, align: 'center' })
         .fontSize(5)
         .text(metadata.displayTime.length > 20 ? metadata.displayName : metadata.displayTime, currentX, textY + 8, { 
           width: qrSize, 
           align: 'center' 
         });
      
      currentX += qrSize + spacing;
      itemsInCurrentRow++;
      itemsInCurrentPage++;
      
    } catch (error) {
      console.warn(`Failed to process ${filename}: ${error.message}`);
    }
  }
  
  // Finalize PDF
  doc.end();
  
  // Wait for PDF to be written
  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
  
  console.log(`PDF generated successfully: ${outputPath}`);
  return outputPath;
}

// Main execution function
async function main() {
  console.log('🚀 Starting PDF generator...');
  try {
    const outputPath = await generateQRCodesPDF();
    console.log(`✅ PDF created: ${outputPath}`);
    
    // Get file stats
    const stats = await fs.stat(outputPath);
    console.log(`📄 Size: ${(stats.size / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.error('❌ Error generating PDF:', error.message);
    process.exit(1);
  }
}

// Run if called directly
console.log('📋 Module loaded, checking execution context...');
console.log('🔍 import.meta.url:', import.meta.url);
console.log('🔍 process.argv[1]:', process.argv[1]);

if (process.argv[1] && process.argv[1].endsWith('pdfGenerator.js')) {
  console.log('✨ Running as main module');
  main();
} else {
  console.log('📦 Loaded as module');
}

export { generateQRCodesPDF };