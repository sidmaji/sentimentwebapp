export default function SampleInputs({ onSelect }) {
    const samples = [
        'Tesla beats Q2 earnings expectations',
        'Oil prices hit a three-month low',
        'Fed likely to hike interest rates again',
        'Apple stock dips after weak iPhone sales',
        'Inflation cooling raises market optimism',
        'Job growth slows as unemployment ticks up',
    ]

    return (
        <div className="flex flex-wrap gap-2 mt-4">
            {samples.map((text, idx) => (
                <button key={idx} onClick={() => onSelect(text)} className="bg-gray-100 px-3 py-1 rounded hover:bg-blue-100 text-sm">
                    {text}
                </button>
            ))}
        </div>
    )
}
