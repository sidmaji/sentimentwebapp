import { useState } from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import InputSection from './components/InputSection'
import OutputSection from './components/OutputSection'

function App() {
    const [results, setResults] = useState([])
    const [summary, setSummary] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleAnalyze(inputText) {
        setLoading(true)

        try {
            // Define your API endpoints
            const apis = [
                {
                    name: 'Logistic Regression',
                    url: 'https://xb2ia3u3iycroj2mmiev7bk4si0iorlt.lambda-url.us-east-2.on.aws/',
                    hasConfidence: false,
                },
                {
                    name: 'FinBERT',
                    url: 'https://mhxhepiqzvuvi3gzinve6smcsu0uniij.lambda-url.us-east-2.on.aws/',
                    hasConfidence: true,
                },
                {
                    name: 'o4-mini',
                    url: 'https://oye2e3js2vb6fmvjffuz5m5p6i0ztcne.lambda-url.us-east-2.on.aws/',
                    hasConfidence: false,
                },
            ]

            // Make API calls in parallel
            const apiPromises = apis.map(async (api) => {
                try {
                    const response = await fetch(api.url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ text: inputText }),
                    })

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }

                    const data = await response.json()

                    // Format the result based on API response structure
                    return {
                        model: api.name,
                        sentiment: data.sentiment.charAt(0).toUpperCase() + data.sentiment.slice(1),
                        confidence: api.hasConfidence && data.confidence ? `${Math.round(data.confidence * 100)}%` : undefined,
                        explanation: undefined, // Your APIs don't provide explanations
                    }
                } catch (error) {
                    console.error(`Error calling ${api.name} API:`, error)
                    return {
                        model: api.name,
                        sentiment: 'Error',
                        confidence: undefined,
                        explanation: `API call failed: ${error.message}`,
                    }
                }
            })

            const apiResults = await Promise.all(apiPromises)
            setResults(apiResults)

            // Determine overall sentiment (majority vote)
            const sentimentCounts = apiResults.reduce((acc, cur) => {
                if (cur.sentiment !== 'Error') {
                    acc[cur.sentiment] = (acc[cur.sentiment] || 0) + 1
                }
                return acc
            }, {})

            const overall = Object.entries(sentimentCounts).length > 0 ? Object.entries(sentimentCounts).sort((a, b) => b[1] - a[1])[0][0] : 'Unknown'

            setSummary(overall)
        } catch (error) {
            console.error('Error in handleAnalyze:', error)
            setResults([])
            setSummary('')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
            <div className="flex-1">
                <div className="max-w-4xl mx-auto p-6">
                    <Header />
                    <InputSection onAnalyze={handleAnalyze} loading={loading} />
                    <OutputSection summary={summary} results={results} loading={loading} />
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default App
