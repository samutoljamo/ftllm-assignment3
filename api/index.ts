import express, { Express, Request, Response } from 'express';
import { pipeline } from '@huggingface/transformers';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();
app.use(express.json());

const customModel = await pipeline('sentiment-analysis', 'samutoljamo/imdb-distilbert');
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

app.use(cors());

app.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { text, model } = req.body;

    if (!text || !model) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    if (model === 'custom') {
      const result = (await customModel(text)).at(0);
      if(!result || Array.isArray(result)) {
        res.status(500).json({ error: 'Unexpected result from custom model' });
        return;
      }

      res.json({
        sentiment: result.label === 'LABEL_1' ? 'positive' : 'negative',
        confidence: result.score
      });
      return;
    } else if (model === 'llama') {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analyzer. Respond only with JSON in the format {"sentiment": "positive"|"negative", "confidence": 0.0-1.0}'
          },
          {
            role: 'user',
            content: text
          }
        ],
        model: 'llama-3.3-70b-versatile',
      });

      if (!completion.choices[0].message.content) {
        res.status(500).json({ error: 'No content returned from Groq' });
        return;
      }
      
      const result = JSON.parse(completion.choices[0].message.content);
      res.json(result);
      return;
    }

    res.status(400).json({ error: 'Invalid model specified' });
    return;
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
