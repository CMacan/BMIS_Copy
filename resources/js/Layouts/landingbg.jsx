import React from "react";
import LandingBackground from "./LandingBackground";
import LandingForeground from "./LandingForeground";
import "../../css/landingbg.css";

const Landingbg = ({ height = "min-h-[80vh]" }) => {
  return (
    <div className={`landingbg-container relative w-full h-full ${height} overflow-hidden`}>
      <LandingBackground />
      <LandingForeground />
    </div>
  );
};

export default Landingbg;
