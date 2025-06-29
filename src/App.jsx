import { useState } from "react";
import Header from "./components/Header";
import InputSection from "./components/InputSection";
import OutputSection from "./components/OutputSection";
import Footer from "./components/Footer";

function App() {
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState("");

  async function handleAnalyze(inputText) {
    // 🔧 Replace with your real API calls
    const mockResults = [
      { model: "Azure AI", sentiment: "Neutral", confidence: "78%" },
      { model: "FinBERT", sentiment: "Positive", confidence: "91%", explanation: "Beat earnings" },
      { model: "SVM", sentiment: "Neutral" },
      { model: "Keyword", sentiment: "Positive", explanation: "Strong growth" },
      { model: "GPT API", sentiment: "Positive", confidence: "88%", explanation: "Optimistic tone" }
    ];

    setResults(mockResults);

    // Determine overall (e.g., majority vote)
    const sentimentCounts = mockResults.reduce((acc, cur) => {
      acc[cur.sentiment] = (acc[cur.sentiment] || 0) + 1;
      return acc;
    }, {});
    const overall = Object.entries(sentimentCounts).sort((a, b) => b[1] - a[1])[0][0];
    setSummary(overall);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto p-6">
          <Header />
          <InputSection onAnalyze={handleAnalyze} />
          <OutputSection summary={summary} results={results} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
