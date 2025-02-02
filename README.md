# Sentiment Analysis App

A full-stack application that performs sentiment analysis using both a custom model (DistilBERT) and Llama 3 through Groq's API.

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- A Groq API key (set in `api/.env`)

## Installation

This project uses pnpm workspaces. To install all dependencies:

```bash
pnpm install
```

## Running Locally

1. Start the API server (in one terminal):
```bash
cd api
pnpm dev
```

2. Start the frontend app (in another terminal):
```bash
cd app
pnpm dev
```

The frontend will be available at `http://localhost:5173`
The API server will run on `http://localhost:3000`

## API Endpoints

### Analyze Sentiment
- **URL**: `POST http://localhost:3000/analyze`
- **Headers**: 
  ```
  Content-Type: application/json
  ```
- **Body**:
  ```json
  {
    "text": "Your text to analyze",
    "model": "custom" | "llama"
  }
  ```
- **Response**:
  ```json
  {
    "sentiment": "positive" | "negative",
    "confidence": 0.95 // number between 0 and 1
  }
  ```

### Example cURL Request

```bash
curl -X POST http://localhost:3000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "This is amazing!", "model": "custom"}'
```

## Models Available

1. **Custom Model** (`model: "custom"`): Uses a fine-tuned DistilBERT model trained on IMDB reviews
2. **Llama 3** (`model: "llama"`): Uses Groq's Llama 3 70B model for sentiment analysis

## Environment Variables

Create a `.env` file in the `api` directory with:
```
GROQ_API_KEY=your_api_key_here
```

## Error Handling

The API will return appropriate error messages with corresponding HTTP status codes:
- 400: Missing required fields or invalid model
- 500: Internal server error or model processing error 