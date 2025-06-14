"use client";

import { Link } from "react-router-dom";
import ContactInfo from "../../Components/ContactInfo";
import Officialscard from "@/Components/officialscard";
import { Card, CardContent, CardHeader, CardTitle } from "../../Components/Card";
import React, { useState } from "react";
import HeaderLayout from "../../Layouts/HeaderLayout";
import Landingbg from "../../Layouts/landingbg";
import "../../../css/landingpage.css";
import FooterLayout from "../../Layouts/FooterLayout";
import FeedbackForm from "./FeedbackForm";
import { FaUser } from "react-icons/fa";
import "../../../css/contact.css";

const FlipCard = ({ contact }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`flip-card ${isFlipped ? "flipped" : ""}`}
      onMouseEnter={() => setIsFlipped(true)}   // Open on hover
      onMouseLeave={() => setIsFlipped(false)} // Close when mouse leaves
    >
      <div className="flip-card-inner">
        {/* Front Side */}
        <div className="flip-card-front" 
            style={{ 
                backgroundImage: `linear-gradient(rgba(118, 0, 0, 0.6), rgba(118, 0, 0, 0.6)), url(${contact.image})`,
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}>
            
            {/* Icon Container */}
            <div className="icon-container">
                <div className="contact-icon">
                    <img src={contact.icon} alt="icon" className="contact-icon-img" />
                </div>
            </div>

            <h3>{contact.title}</h3>
        </div>

        {/* Back Side */}
        <div className="flip-card-back">
        <h3 className="back-title">{contact.title}</h3>
          <div className="details-container">
            {contact.details.map((detail, idx) =>
              typeof detail === "string" ? (
                <p key={idx} className="detail-text">{detail}</p>
              ) : (
                <p key={idx} className="contact-number">
                  <span className="label">{detail.label} :</span>   <span className="value">{detail.value}</span> 
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Landingpage = () => {

  const contacts = [
    {
      title: "BARANGAY HALL",
      image: "/images/brgy.jpg",
      icon: "/images/brgyicon.png",
      details: [
        "Barangay Child Protection Council and Women's Desk",
        { label: "Contact No.", value: "032 367 8311" },
        "Gender And Development Focal Person",
        { label: "Contact No.", value: "032 367 8311" },
        "SAWANG CALERO",
      ],
    },
    {
      title: "PULIS",
      image: "/images/police.jpg",
      icon: "/images/policeicon.png",
      details: [
        "Women and Children Protection Desk Philippine National Police",
        { label: "Contact No.", value: "0917 305 7348" },
        "WCPC",
        { label: "Contact No.", value: "0917 305 7348" },
        "Nearest Police Station",
        { label: "Contact No.", value: "STATION 6, CCPO" },
      ],
    },
    {
      title: "ABOGADO",
      image: "/images/abogado.jpg",
      icon: "/images/abgdoicon.png",
      details: [
        "Public Attorney's Office",
        { label: "Contact No.", value: "LAW INC. 410 8452" },
        "Commission on Human Rights",
        { label: "Contact No.", value: "0936 068 0982" },
      ],
    },
   
    {
      title: "DOKTOR",
      image: "/images/dctr.jpg",
      icon: "/images/dctricon.png",
      details: [
        "Barangay Health Center",
        { label: "Contact No.", value: "032 252 4241" },
        "DOCTOR AVAILABLE MON & WED",
        "DENTIST AVAILABLE LAST WEEK",
        "OF THE MONTH",
      ],
    },
    {
      title: "MAGTUTUDLO",
      image: "/images/edu.png",
      icon: "/images/tchricon.png",
      details: [
        "Principle / Guidance Conselor",
        { label: "Contact No.", value: "032 417 3933" },
        "SAWANG CALERO ELEMENTARY SCHOOL",
      ],
    },
    {
      title: "NGOs",
      image: "/images/ngo.jpg",
      icon: "/images/ngoicon.png",
      details: [
        { label: "Contact No.", value: "BIOLISIW 232 4272" },
        { label: "Contact No.", value: "LAW INC. 410 8452" },
      ],
    },
    {
      title: "SIMBAHAN",
      image: "/images/church.jpg",
      icon: "/images/chrcicon.png",
      details: [
        { label: "Contact No.", value: "032 216 0848" },
        "SAN NICOLAS PARISH",
      ],
    },
   
    {
      title: "HOSPITAL",
      image: "/images/hospital.jpg",
      icon: "/images/hspticon.png",
      details: [
        { label: "Contact No.", value: "032 254 0517" },
        "CEBU CITY HOSPITAL",
      ],
    },

    {
      title: "SOCIAL WORKER",
      image: "/images/sworker.jpg",
      icon: "/images/swrkicon.png",
      details: [
        "Municipal/City Social Welfare Office",
        { label: "Contact No.", value: "032 261 6408" },
        "DSWS",
      ],
    },
   
    {
      title: "MENTAL HEALTH PROFESSIONAL",
      image: "/images/mhp.jpg",
      icon: "/images/mhpicon.png",
      details: [
        { label: "Contact No.", value: "0929 287 3688" },
        "VICENTE SOTTO",
      ],
    },

   
  ];

  return (
    <HeaderLayout>
    
        <div className="body-container">
          {/* Hero Section */}
          <Landingbg  />

          {/* Barangay Officials  Section */}
          <Officialscard />
          
          {/* Emergency Section */}
          <div className="emergency-section">
            <div className="emergency-header">
              <h1>Emergency Contacts & Assistance</h1>
              <h2>Ang mga angay duolan kung ikaw anaa sa peligro, adunay namatikdan o nasinati ug pagpang-abuso.</h2>
              <p>Note: Aron maproteksyunan ang seguridad among paningkamotan ang tanang impormasyon nga gipaabot magpabilin nga confidential</p>
            </div>
            <div className="emergency-contain"> 
            <div className="emergency-grid">
              {contacts.map((contact, index) => (
                <FlipCard key={index} contact={contact} />
              ))}
            </div>
            </div>
          </div>

          {/* Feedback Form */}
          <FeedbackForm />

          {/* Contact Info Section */}
          <ContactInfo />

          {/* Footer */}
          <FooterLayout />
        
      </div>
    </HeaderLayout>
  );
};

export default Landingpage;
