import React from "react";
import "../../css/landingbg.css";

const LandingBackground = () => {
  return (
    <div className="background-wrapper absolute inset-0 z-0 pointer-events-none">
      {/* Enhanced Background Elements */}
      <div className="bg-pattern"></div>
      <div className="mesh-grid"></div>
      <div className="spiral-pattern"></div>

      {/* Circle Patterns */}
      <div className="circle-pattern">
        <div className="pattern-circle pattern-circle-1"></div>
        <div className="pattern-circle pattern-circle-2"></div>
        <div className="pattern-circle pattern-circle-3"></div>
      </div>

      {/* Background Circles */}
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>

      {/* Floating Dots */}
      <div className="floating-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default LandingBackground;
