import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { classifyAnimalImage, screenSkinConditionImage, getModelArchitectureDetails } from './server/ml-service.js';
import { generateChatResponse } from './server/gemini.js';
import { 
  getAllHealthRecords, 
  getHealthRecordById, 
  saveHealthRecord, 
  deleteHealthRecord, 
  getNearbyVeterinarians, 
  getDashboardStats 
} from './server/db.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT||3000;

// Enable JSON body parsing with large payload limit for base64 images
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// -----------------------------------------------------------------------------
// REST API ENDPOINTS
// -----------------------------------------------------------------------------

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'AI Livestock Health Monitoring & Veterinary Assistance System',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
});

// 1. Animal Type Classification API (Cattle vs. Buffalo)
app.post('/api/classify-animal', (req, res) => {
  try {
    const { image, modelArch } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required (data URL or base64)' });
    }

    const result = classifyAnimalImage(image, { modelArch });
    result.imageUrl = image;

    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/classify-animal:', error);
    res.status(500).json({ error: 'Failed to process animal classification', details: error.message });
  }
});

// 2. Skin Condition Screening API
app.post('/api/skin-screen', (req, res) => {
  try {
    const { image, animalType } = req.body;
    if (!image) {
      return res.status(400).json({ error: 'Image data is required (data URL or base64)' });
    }

    const result = screenSkinConditionImage(image, animalType || 'Cattle');
    result.originalImageUrl = image;

    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/skin-screen:', error);
    res.status(500).json({ error: 'Failed to process skin screening', details: error.message });
  }
});

// 3. Livestock AI Chatbot API (Powered by Google Gemini 3.8 Flash)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], context = {} } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'User message is required' });
    }

    const { text, suggestedQuestions } = await generateChatResponse(message, history, context);

    res.json({
      reply: text,
      suggestedQuestions,
      timestamp: new Date().toISOString(),
      model: 'gemini-3.8-flash'
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Chatbot processing failed', details: error.message });
  }
});

// 4. Health History Records API
app.get('/api/health-history', (req, res) => {
  try {
    const records = getAllHealthRecords();
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve health records', details: error.message });
  }
});

app.get('/api/health-history/:id', (req, res) => {
  try {
    const record = getHealthRecordById(req.params.id);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(record);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve health record', details: error.message });
  }
});

app.post('/api/health-history', (req, res) => {
  try {
    const newRecord = saveHealthRecord(req.body);
    res.status(201).json(newRecord);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to save health record', details: error.message });
  }
});

app.delete('/api/health-history/:id', (req, res) => {
  try {
    const deleted = deleteHealthRecord(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Record not found or already removed' });
    }
    res.json({ success: true, message: 'Record deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete health record', details: error.message });
  }
});

// 5. Veterinary Finder API
app.get('/api/veterinarians/nearby', (req, res) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : undefined;
    const radius = req.query.radius ? parseInt(req.query.radius as string) : 25;

    const clinics = getNearbyVeterinarians(lat, lon, radius);
    res.json(clinics);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve nearby veterinarians', details: error.message });
  }
});

// 6. Dashboard Aggregated Metrics
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const stats = getDashboardStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve dashboard stats', details: error.message });
  }
});

// 7. Model Architecture Info (For Academic Presentation & Viva)
app.get('/api/ml/model-info', (req, res) => {
  try {
    const info = getModelArchitectureDetails();
    res.json(info);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve model info', details: error.message });
  }
});

// -----------------------------------------------------------------------------
// VITE MIDDLEWARE & STATIC SERVING
// -----------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Livestock Health AI server running at http://localhost:${PORT}`);
  });
}

startServer();
