function OutputSection({ summary, results, loading }) {
    if (loading) {
        return (
            <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200">
                <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Analysis Results</h2>
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Analyzing sentiment...</span>
                </div>
            </section>
        )
    }

    if (!results.length) return null

    const getSentimentColor = (sentiment) => {
        switch (sentiment.toLowerCase()) {
            case 'positive':
                return 'text-green-600 dark:text-green-400'
            case 'negative':
                return 'text-red-600 dark:text-red-400'
            case 'neutral':
                return 'text-yellow-600 dark:text-yellow-400'
            case 'error':
                return 'text-red-600 dark:text-red-400'
            default:
                return 'text-gray-600 dark:text-gray-400'
        }
    }

    const getSentimentBg = (sentiment) => {
        switch (sentiment.toLowerCase()) {
            case 'positive':
                return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            case 'negative':
                return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            case 'neutral':
                return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
            default:
                return 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
        }
    }

    return (
        <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Analysis Results</h2>

            {/* Overall Summary */}
            <div className={`p-4 rounded-lg border mb-6 ${getSentimentBg(summary)}`}>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Overall Sentiment</h3>
                <span className={`text-lg font-bold ${getSentimentColor(summary)}`}>{summary}</span>
            </div>

            {/* Results Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 dark:border-gray-700 rounded-lg">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700">
                            <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Model</th>
                            <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Sentiment</th>
                            <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Confidence</th>
                            <th className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 font-medium text-gray-900 dark:text-white">{result.model}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3">
                                    <span className={`font-semibold ${getSentimentColor(result.sentiment)}`}>{result.sentiment}</span>
                                </td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-gray-700 dark:text-gray-300">{result.confidence || 'N/A'}</td>
                                <td className="border border-gray-200 dark:border-gray-600 px-4 py-3 text-gray-600 dark:text-gray-300 italic">{result.explanation || '—'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default OutputSection
