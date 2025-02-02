import { useState } from 'react'

function App() {
  const [text, setText] = useState('')
  const [model, setModel] = useState('custom')
  const [result, setResult] = useState<{ sentiment: string; confidence: number } | null>(null)
  const [loading, setLoading] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const analyzeSentiment = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:3000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, model }),
      })
      const data = await response.json()
      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || 'An error occurred while analyzing the text')
        console.error('Error:', data.error)
      }
    } catch (error) {
      setError('Failed to connect to the server')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sentiment Analysis</h1>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        placeholder="Enter text to analyze..."
        rows={4}
      />

      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      >
        <option value="custom">Custom Model</option>
        <option value="llama">Llama 3</option>
      </select>

      <button
        onClick={analyzeSentiment}
        disabled={loading || !text}
        className="w-full bg-blue-500 text-white p-2 rounded mb-4 disabled:bg-gray-300"
      >
        {loading ? 'Analyzing...' : 'Analyze Sentiment'}
      </button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="border rounded p-4">
          <p>Sentiment: <span className="font-bold">{result.sentiment}</span></p>
          <p>Confidence: <span className="font-bold">{(result.confidence * 100).toFixed(2)}%</span></p>
        </div>
      )}
    </div>
  )
}

export default App
