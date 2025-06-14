import React, { useState } from "react";
import "../../css/flipcard.css";

const FlipCard = ({ contact }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className={`flip-card ${isFlipped ? "flipped" : ""}`} 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flip-card-inner">
        {/* Front Side */}
        <div className="flip-card-front">
          <div className="icon-container">
            <span className="contact-icon">{contact.icon}</span>
          </div>
          <h3>{contact.title}</h3>
        </div>
        {/* Back Side */}
        <div className="flip-card-back">
          {contact.details.map((detail, idx) =>
            typeof detail === "string" ? (
              <p key={idx} className="detail-text">{detail}</p>
            ) : (
              <p key={idx} className="contact-number">
                <span className="label">{detail.label}</span> {detail.value}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
