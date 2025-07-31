export default function SentimentSummary({ overall }) {
    const color = overall === 'Positive' ? 'text-green-600' : overall === 'Negative' ? 'text-red-600' : 'text-gray-500'

    return (
        <div className="mt-6 text-lg font-semibold">
            Overall Sentiment: <span className={color}>{overall || '–'}</span>
        </div>
    )
}
