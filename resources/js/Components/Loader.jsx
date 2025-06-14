"use client"

import { useState, useEffect } from "react"

export default function Loader({ isLoading = false, timeout = null, onTimeout = () => {}, containerStyle = {} }) {
  const [visible, setVisible] = useState(isLoading)

  // Handle prop changes
  useEffect(() => {
    setVisible(isLoading)
  }, [isLoading])

  // Handle timeout if provided
  useEffect(() => {
    let timer
    if (visible && timeout) {
      timer = setTimeout(() => {
        setVisible(false)
        onTimeout()
      }, timeout)
    }
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [visible, timeout, onTimeout])

  if (!visible) return null

  return (
    <div className="loader-container">
      <div className="loader">
        <div className="circle-container">
          <div className="circle circle-outer"></div>
          <div className="circle circle-middle"></div>
          <div className="circle circle-inner"></div>
        </div>
      </div>
      <style>{`
        .loader-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(3px);
          z-index: 9999;
          ${Object.entries(containerStyle)
            .map(([key, value]) => `${key}: ${value};`)
            .join(" ")}
        }
        
        .loader {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100px;
          height: 100px;
        }
        
        .circle-container {
          position: relative;
          width: 60px;
          height: 60px;
        }
        
        .circle {
          position: absolute;
          border-radius: 50%;
          border-style: solid;
          border-width: 3px;
          box-sizing: border-box;
        }
        
        .circle-outer {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-color: #FFD700 transparent #FFD700 transparent; /* Gold */
          animation: spin 1.5s linear infinite;
        }
        
        .circle-middle {
          top: 15%;
          left: 15%;
          width: 70%;
          height: 70%;
          border-color: transparent #CE1126 transparent #CE1126; /* Red */
          animation: spin-reverse 1.2s linear infinite;
        }
        
        .circle-inner {
          top: 30%;
          left: 30%;
          width: 40%;
          height: 40%;
          border-color: #0038A8 transparent #0038A8 transparent; /* Blue */
          animation: spin 0.9s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
      `}</style>
    </div>
  )
}

