import { useState } from "react";
import SampleInputs from "./SampleInputs";
import AnalyzeButton from "./AnalyzeButton";

export default function InputSection({ onAnalyze }) {
  const [inputText, setInputText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onAnalyze(inputText);
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6 transition-colors duration-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Enter Financial Text
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <SampleInputs onSelect={setInputText} />
        <textarea
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
          placeholder="Enter financial news, earnings report, or market commentary..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows="4"
        />
        <AnalyzeButton
          type="submit"
          disabled={!inputText.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
        >
          Analyze Sentiment
        </AnalyzeButton>
      </form>
    </section>
  );
}
