import { useEffect, useState } from 'react'

const TypewriterEffect = ({ text, onComplete, speed = 50, canSkip = true }) => {
    const [displayText, setDisplayText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isComplete, setIsComplete] = useState(false)

    const completeAnimation = () => {
        setDisplayText(text)
        setCurrentIndex(text.length)
        setIsComplete(true)
        if (onComplete) {
            onComplete()
        }
    }

    useEffect(() => {
        if (currentIndex < text.length && !isComplete) {
            const timeout = setTimeout(() => {
                setDisplayText((prev) => prev + text[currentIndex])
                setCurrentIndex((prev) => prev + 1)
            }, speed)

            return () => clearTimeout(timeout)
        } else if (currentIndex >= text.length && !isComplete) {
            setIsComplete(true)
            if (onComplete) {
                onComplete()
            }
        }
    }, [currentIndex, text, speed, onComplete, isComplete])

    useEffect(() => {
        setDisplayText('')
        setCurrentIndex(0)
        setIsComplete(false)
    }, [text])

    return (
        <div className="relative">
            <pre className="bg-gray-900 text-green-400 text-sm font-mono whitespace-pre-wrap p-4 rounded">
                {displayText}
                {!isComplete && <span className="animate-pulse text-green-400">|</span>}
            </pre>
            {canSkip && !isComplete && (
                <button onClick={completeAnimation} className="absolute top-2 right-2 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded transition-colors duration-200">
                    Skip
                </button>
            )}
        </div>
    )
}

export default TypewriterEffect
