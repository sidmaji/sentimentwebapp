export default function AnalyzeButton({ disabled, onClick }) {
    return (
        <div className="mt-4">
            <button onClick={onClick} disabled={disabled} className={`px-6 py-2 rounded text-white font-medium ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                🔍 Analyze Sentiment
            </button>
        </div>
    )
}
