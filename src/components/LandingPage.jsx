import { useNavigate } from 'react-router-dom'
import ModelAnimation from './ModelAnimation'

const LandingPage = () => {
    const navigate = useNavigate()

    const models = [
        {
            name: 'Logistic Regression',
            description: 'Traditional ML approach using TF-IDF vectorization and balanced classification',
            steps: [
                {
                    title: 'Data Preparation & Vectorization',
                    explanation: 'Load training data and convert text to numerical features using TF-IDF with n-grams',
                    code: `from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pandas as pd

# Load training and validation datasets
train_df = pd.read_csv("train.csv")
val_df = pd.read_csv("val.csv")

# Create TF-IDF vectorizer with n-gram features
vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
X_train = vectorizer.fit_transform(train_df["sentence"])
X_val = vectorizer.transform(val_df["sentence"])`,
                },
                {
                    title: 'Model Training',
                    explanation: 'Train logistic regression with balanced class weights to handle data imbalance',
                    code: `# Initialize and train logistic regression model
clf = LogisticRegression(max_iter=1000, class_weight="balanced")
clf.fit(X_train, train_df["label"])

# Make predictions on validation set
val_preds = clf.predict(X_val)`,
                },
                {
                    title: 'Evaluation & Model Saving',
                    explanation: 'Evaluate model performance and save both vectorizer and model for deployment',
                    code: `from sklearn.metrics import classification_report
import pickle

# Evaluate model performance
lr_results = per_source_metrics(val_df["label"], val_preds, val_df["source"])
print("Logistic Regression per-source metrics:")
for source, acc, f1 in lr_results:
    print(f"{source}: Accuracy={acc:.3f}, Macro-F1={f1:.3f}")
print("\\n" + classification_report(val_df["label"], val_preds))

# Save vectorizer and model for deployment
with open("vectorizer.pkl", "wb") as file:
    pickle.dump(vectorizer, file)

with open("logistic_regression_model.pkl", "wb") as file:
    pickle.dump(clf, file)`,
                },
            ],
        },
        {
            name: 'FinBERT',
            description: 'Financial domain-specific BERT model fine-tuned for financial sentiment analysis',
            steps: [
                {
                    title: 'Model Setup & Data Filtering',
                    explanation: 'Load pre-trained FinBERT model and prepare dataset excluding training data overlap',
                    code: `from transformers import pipeline
from sklearn.model_selection import train_test_split

# Initialize FinBERT sentiment analysis pipeline
sentiment_pipe = pipeline("text-classification", model="ProsusAI/finbert")

# Exclude financial phrasebank to avoid data leakage
no_fpb = pd.concat([twitter, fiqa], ignore_index=True)
finbert_train, finbert_val = train_test_split(
    no_fpb, test_size=0.1, stratify=no_fpb["label"], random_state=42
)`,
                },
                {
                    title: 'Batch Prediction',
                    explanation: 'Process validation texts through FinBERT pipeline for sentiment classification',
                    code: `# Prepare validation texts for batch processing
val_texts = finbert_val["sentence"].tolist()

# Run FinBERT sentiment analysis
results = sentiment_pipe(val_texts)
print(f"Processed {len(results)} sentences")
print("Sample results:", results[:5])

# Extract predicted labels
finbert_labels = [r["label"] for r in results]`,
                },
                {
                    title: 'Performance Evaluation',
                    explanation: 'Analyze FinBERT performance across different data sources and generate metrics',
                    code: `from sklearn.metrics import classification_report

# Calculate per-source performance metrics
finbert_results = per_source_metrics(
    finbert_val["label"], finbert_labels, finbert_val["source"]
)

print("\\nFinBERT per-source metrics:")
for source, acc, f1 in finbert_results:
    print(f"{source}: Accuracy={acc:.3f}, Macro-F1={f1:.3f}")

print("\\n" + classification_report(finbert_val["label"], finbert_labels))`,
                },
            ],
        },
        {
            name: 'o4-mini',
            description: 'Azure OpenAI GPT-4 mini model for contextual financial sentiment analysis',
            steps: [
                {
                    title: 'API Client Setup',
                    explanation: 'Configure Azure OpenAI client with deployment settings and authentication',
                    code: `from openai import AzureOpenAI

# Azure OpenAI configuration
endpoint = "https://your-endpoint.cognitiveservices.azure.com/"
model_name = "o4-mini"
deployment = "o4-mini"
api_version = "2024-12-01-preview"

# Initialize Azure OpenAI client
client = AzureOpenAI(
    api_version=api_version,
    azure_endpoint=endpoint,
    api_key="your-api-key",
)`,
                },
                {
                    title: 'Prompt Engineering',
                    explanation: 'Design system and user prompts for consistent sentiment classification',
                    code: `# Process each validation sentence
preds = []
val_sentences = val_df["sentence"].tolist()

for i, sentence in enumerate(val_sentences):
    print(f"Processing sentence {i+1}/{len(val_sentences)}")

    response = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a financial sentiment classifier. Respond with one word: neutral, positive, or negative.",
            },
            {
                "role": "user",
                "content": f"Classify the sentiment of this sentence as positive, neutral, or negative:\\n\\n{sentence}",
            },
        ],
        max_completion_tokens=10000,
        model=deployment,
    )`,
                },
                {
                    title: 'Response Processing',
                    explanation: 'Extract predictions and compare with ground truth labels for evaluation',
                    code: `    # Extract prediction from response
    prediction = response.choices[0].message.content.strip().lower()
    preds.append(prediction)

    # Log prediction vs actual for monitoring
    actual_label = val_df["label"].tolist()[i]
    print(f"o4-mini: {prediction}")
    print(f"actual: {actual_label}")
    print()

# Evaluate o4-mini performance
o4_results = per_source_metrics(val_df["label"], preds, val_df["source"])
print("\\no4-mini per-source metrics:")
for source, acc, f1 in o4_results:
    print(f"{source}: Accuracy={acc:.3f}, Macro-F1={f1:.3f}")`,
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
                            🔬 Sentiment Analysis
                        </button>
                        <button
                            onClick={() => navigate('/multivariate-forecasting')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                        >
                            📈 Multivariate Time Series Forecasting
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
                    <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-16">How the Models Work</h2>
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
