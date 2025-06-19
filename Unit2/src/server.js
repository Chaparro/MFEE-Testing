import express from 'express';
import { createSingleQR, createBatchQR } from './qrService.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// GET endpoint - Generate single QR code
app.get('/qr', async (req, res) => {
  try {
    const result = await createSingleQR();
    
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `inline; filename="${result.filename}"`
    });
    
    res.send(result.qrData);
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// POST endpoint - Generate batch of QR codes
app.post('/qr/batch', async (req, res) => {
  try {
    const { count } = req.body;
    
    if (!count || typeof count !== 'number' || count > 100 || count < 1) {
      return res.status(400).json({ 
        error: 'Count is required and must be a number between 1 and 100' 
      });
    }
    
    const results = await createBatchQR(count);
    
    res.json({
      message: `Successfully generated ${count} QR codes`,
      count: results.length,
      files: results.map(r => ({
        filename: r.filename,
        filepath: r.filepath,
        batchNumber: r.batchNumber
      }))
    });
  } catch (error) {
    console.error('Error generating batch QR codes:', error);
    
    if (error.message.includes('Count must be between')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to generate QR codes' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`QR Generator API running on port ${PORT}`);
});

export default app;