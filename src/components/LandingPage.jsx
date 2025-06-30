import { useNavigate } from 'react-router-dom'
import ModelAnimation from './ModelAnimation'

const LandingPage = () => {
    const navigate = useNavigate()

    const models = [
        {
            name: 'Logistic Regression',
            description: 'Traditional ML approach for text classification',
            steps: [
                {
                    title: 'Text Vectorization',
                    code: `from sklearn.feature_extraction.text import TfidfVectorizer
vectorizer = TfidfVectorizer(max_features=5000)
text_vectors = vectorizer.fit_transform(financial_texts)`,
                },
                {
                    title: 'Model Training',
                    code: `from sklearn.linear_model import LogisticRegression
model = LogisticRegression()
model.fit(text_vectors, sentiment_labels)`,
                },
                {
                    title: 'Prediction',
                    code: `prediction = model.predict(new_text_vector)
sentiment = 'positive' if prediction[0] == 1 else 'negative'`,
                },
            ],
        },
        {
            name: 'FinBERT',
            description: 'Financial domain-specific BERT model',
            steps: [
                {
                    title: 'Text Tokenization',
                    code: `from transformers import AutoTokenizer
tokenizer = AutoTokenizer.from_pretrained('ProsusAI/finbert')
tokens = tokenizer(text, return_tensors='pt')`,
                },
                {
                    title: 'Model Inference',
                    code: `from transformers import AutoModelForSequenceClassification
model = AutoModelForSequenceClassification.from_pretrained('ProsusAI/finbert')
outputs = model(**tokens)`,
                },
                {
                    title: 'Confidence Scoring',
                    code: `import torch.nn.functional as F
probabilities = F.softmax(outputs.logits, dim=-1)
confidence = torch.max(probabilities).item()`,
                },
            ],
        },
        {
            name: 'o4-mini',
            description: 'Advanced language model for nuanced sentiment analysis',
            steps: [
                {
                    title: 'Prompt Engineering',
                    code: `prompt = f"""
Analyze the sentiment of this financial text:
"{text}"
Respond with: positive, negative, or neutral
"""`,
                },
                {
                    title: 'API Request',
                    code: `import openai
response = openai.ChatCompletion.create(
  model="o4-mini",
  messages=[{"role": "user", "content": prompt}]
)`,
                },
                {
                    title: 'Response Processing',
                    code: `sentiment = response.choices[0].message.content.strip().lower()
return {"sentiment": sentiment}`,
                },
            ],
        },
    ]

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex justify-center mb-8">
                        <div className="bg-blue-600 p-3 rounded-full">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">FinSentiment</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                        A system for LLM-powered financial sentiment analysis using multiple machine learning models to provide accurate and comprehensive sentiment predictions.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button onClick={() => navigate('/sentiment-analysis')} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
                            🔬 Showcase
                        </button>
                        <a
                            href="https://github.com/sidmaji/sentimentwebapp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                        >
                            📊 GitHub
                        </a>
                    </div>
                </div>
            </div>

            {/* Models Section */}
            <div className="py-20 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">How Our Models Work</h2>
                    <div className="space-y-8">
                        {models.map((model, index) => (
                            <ModelAnimation key={index} model={model} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPage
