export default function SentimentResultsTable({ results }) {
    return (
        <table className="w-full mt-4 text-sm border rounded overflow-hidden">
            <thead className="bg-gray-100 text-left">
                <tr>
                    <th className="p-2">Model</th>
                    <th className="p-2">Sentiment</th>
                    <th className="p-2">Confidence</th>
                </tr>
            </thead>
            <tbody>
                {results.map((r, idx) => (
                    <tr key={idx} className="border-t">
                        <td className="p-2">{r.model}</td>
                        <td className="p-2">{r.sentiment}</td>
                        <td className="p-2">{r.confidence || '—'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
