import { useState } from 'react'
import TypewriterEffect from './TypewriterEffect'

const ModelAnimation = ({ model }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [completedSteps, setCompletedSteps] = useState([])
    const [showNextButton, setShowNextButton] = useState(false)

    const handlePlay = () => {
        setIsPlaying(true)
        setCurrentStep(0)
        setCompletedSteps([])
        setShowNextButton(false)
        setIsExpanded(true)
    }

    const handleStepComplete = () => {
        setCompletedSteps((prev) => [...prev, currentStep])
        setShowNextButton(true)
    }

    const handleNext = () => {
        if (currentStep < model.steps.length - 1) {
            setCurrentStep(currentStep + 1)
            setShowNextButton(false)
        } else {
            setIsPlaying(false)
            setShowNextButton(false)
        }
    }

    const handleStepClick = (stepIndex) => {
        if (completedSteps.includes(stepIndex)) {
            setCurrentStep(stepIndex)
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{model.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{model.description}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handlePlay()
                            }}
                            disabled={isPlaying}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        >
                            <span>{isPlaying ? '⏸️' : '▶️'}</span>
                            <span>Play</span>
                        </button>
                        <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="px-6 pb-6">
                    {/* Step Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {model.steps.map((step, index) => (
                            <div
                                key={index}
                                onClick={() => handleStepClick(index)}
                                className={`relative bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-2 transition-all duration-300 cursor-pointer ${
                                    isPlaying && index === currentStep
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : completedSteps.includes(index)
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30'
                                        : 'border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                                }`}
                            >
                                {/* Step Number */}
                                <div
                                    className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${
                                        isPlaying && index === currentStep
                                            ? 'bg-blue-500 text-white'
                                            : completedSteps.includes(index)
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                                    }`}
                                >
                                    {completedSteps.includes(index) ? '✓' : index + 1}
                                </div>

                                {/* Step Content */}
                                <div className="pt-2">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{step.explanation}</p>
                                </div>

                                {/* Progress Indicator */}
                                {isPlaying && index === currentStep && <div className="absolute inset-0 rounded-lg border-2 border-blue-500 animate-pulse" />}
                            </div>
                        ))}
                    </div>

                    {/* Code Display - Show completed steps and current playing step */}
                    <div className="space-y-6">
                        {model.steps.map((step, index) => {
                            const shouldShow = completedSteps.includes(index) || (isPlaying && index === currentStep)
                            if (!shouldShow) return null

                            return (
                                <div key={`step-${index}-${step.title}`} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Step {index + 1}: {step.title}
                                        </h4>
                                        {completedSteps.includes(index) && <span className="text-green-500 text-sm">✓ Completed</span>}
                                    </div>
                                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                                        {isPlaying && index === currentStep ? (
                                            <TypewriterEffect text={step.code} onComplete={handleStepComplete} speed={30} canSkip={true} />
                                        ) : (
                                            <pre className="bg-gray-900 text-green-400 text-sm font-mono whitespace-pre-wrap p-4 rounded">{step.code}</pre>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Next Button */}
                    {showNextButton && (
                        <div className="flex justify-center mt-6">
                            <button onClick={handleNext} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2">
                                <span>{currentStep < model.steps.length - 1 ? 'Next Step' : 'Complete'}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default ModelAnimation
