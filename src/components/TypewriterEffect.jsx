import { useEffect, useState } from 'react'

const TypewriterEffect = ({ text, onComplete, speed = 50 }) => {
    const [displayText, setDisplayText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayText((prev) => prev + text[currentIndex])
                setCurrentIndex((prev) => prev + 1)
            }, speed)

            return () => clearTimeout(timeout)
        } else if (onComplete) {
            onComplete()
        }
    }, [currentIndex, text, speed, onComplete])

    useEffect(() => {
        setDisplayText('')
        setCurrentIndex(0)
    }, [text])

    return (
        <pre className="text-green-400 text-sm font-mono">
            {displayText}
            <span className="animate-pulse">|</span>
        </pre>
    )
}

export default TypewriterEffect
