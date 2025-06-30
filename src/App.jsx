import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import SentimentAnalysis from './components/SentimentAnalysis'

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
