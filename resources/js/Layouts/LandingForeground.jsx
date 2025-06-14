import React from "react";
import { usePage } from "@inertiajs/react";
import { TypingText } from "@/Components/TypingText";

const LandingForeground = () => {
  const { barangay } = usePage().props;
  const currentUrl = usePage().url;

  let displayText;

  if (currentUrl === "/") {
    return (
      <div className="foreground-wrapper relative z-10 min-h-[80dvh] grid place-items-center p-4 md:p-12">
        <div className="content-wrapper w-4/5">
          <div className="running-light"></div>
          <div className="flex flex-col md:flex-row items-center gap-20">
            <img
              src={barangay?.bar_logo ? `/${barangay.bar_logo}` : "/images/defaultlogo.jpg"}
              alt="Barangay Seal"
              className="w-[30%] h-auto rounded-full object-cover aspect-square shadow-md"
            />
            <div className="text-center md:text-left">
             <span className="title-text text-4xl md:text-[40px] font-bold tracking-wide">
                Barangay {barangay?.bar_name || "Leromitsom"}
              </span>
              <br />
              <TypingText
                text={barangay?.bar_motto || "Lorem Ipsum Dolor Sit"}
                className="uppercase subtitle-text text-xl md:text-xl text-center mt-4"
                showCursor={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  } else if (currentUrl.includes("/about")) {
    displayText = "ABOUT OUR BARANGAY";
  } else if (currentUrl.includes("/services")) {
    displayText = "BARANGAY SERVICES";
  } else if (currentUrl.includes("/announcements")) {
    displayText = "ANNOUNCEMENT & EVENTS";
  }

  return (
    <div className="foreground-wrapper relative z-10 min-h-[40dvh] grid place-items-center p-4 md:p-12">
      <div className="content-wrapper w-3/4">
      <div className="running-light"></div>
      <div className="flex flex-col md:flex-row items-center ">
        <div className="text-center  w-full">
        <h1 className="title-text text-[30px] font-bold"> {displayText}</h1>
        </div>
        </div>
        </div>
    </div>
  );
};

export default LandingForeground;
