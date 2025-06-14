"use client"

import { useEffect, useState } from "react"
import PropTypes from "prop-types" 

export function TypingText({
  text,
  className = "",
  typingSpeed = 100,
  showCursor = true,
  restartInterval = 5000, // Default: 5 seconds
}) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  // Handle typing animation
  useEffect(() => {
    if (currentIndex >= text.length) return

    const timeout = setTimeout(() => {
      setDisplayedText((prev) => prev + text[currentIndex])
      setCurrentIndex((prev) => prev + 1)
    }, typingSpeed)

    return () => clearTimeout(timeout)
  }, [currentIndex, typingSpeed]) // Removed unnecessary dependencies

  // Handle restart interval
  useEffect(() => {
    if (!restartInterval || displayedText.length !== text.length) return

    const interval = setInterval(() => {
      setDisplayedText("")
      setCurrentIndex(0)
    }, restartInterval)

    return () => clearInterval(interval)
  }, [restartInterval, displayedText, text.length]) // Ensures restart only when text completes

  return (
    <p className={className}>
      {displayedText}
      {displayedText.length < text.length && showCursor && (
        <span className="ml-0.5 inline-block h-4 w-0.5 animate-blink bg-current"></span>
      )}
    </p>
  )
}

// Define PropTypes for validation
TypingText.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  typingSpeed: PropTypes.number,
  showCursor: PropTypes.bool,
  restartInterval: PropTypes.number,
}

export default TypingText
