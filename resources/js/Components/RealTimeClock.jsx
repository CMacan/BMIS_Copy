"use client"

import { useState, useEffect } from "react"

export default function RealTimeClock() {
  const [dateTime, setDateTime] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()

      const formattedDateTime = now.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })

      setDateTime(formattedDateTime)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return <span className="text-sm sm:text-sm font-medium">Philippine Standard Time: {dateTime}</span>
}

