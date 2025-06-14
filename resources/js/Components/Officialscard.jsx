import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { Pagination, EffectCoverflow, Autoplay  } from "swiper/modules";

const defaultOfficials = [
  { id: 1, prof_picture: "", prof_fname: "", prof_mname: "", prof_lname: "", bar_off_position: "Captain" },
  { id: 2, prof_picture: "", prof_fname: "", prof_mname: "", prof_lname: "", bar_off_position: "Councilor" },
  { id: 3, prof_picture: "", prof_fname: "", prof_mname: "", prof_lname: "", bar_off_position: "Councilor" },
  { id: 4, prof_picture: "", prof_fname: "", prof_mname: "", prof_lname: "", bar_off_position: "Councilor" },
  { id: 5, prof_picture: "", prof_fname: "", prof_mname: "", prof_lname: "", bar_off_position: "Councilor" },
];

export default function Officials({ barangay_official = [] }) {

  console.log("Received officials data:", barangay_official);

  let officialsToDisplay = barangay_official && barangay_official.length > 0
    ? barangay_official
    : defaultOfficials;

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="relative flex items-center py-5 my-5">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-black text-[30px] font-bold">Barangay Officials</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={3}
        initialSlide={officialsToDisplay.findIndex(official => official.bar_off_position === "Captain")}
        loop={true}
        coverflowEffect={{
          rotate: 0,
          stretch: 0, 
          depth: 100,
          modifier: 2.5,
          slideShadows: false,
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000,  disableOnInteraction: false,}}
        modules={[Pagination, EffectCoverflow, Autoplay]}
        className="mySwiper"
      >
        {officialsToDisplay.map((official) => (
          <SwiperSlide key={official.id} className="p-4 bg-white shadow-xl rounded-xl text-center mb-20">
            <img 
              src={official.prof_picture || "/images/default-profile.jpg"} 
              alt={`Official ${official.prof_fname} ${official.prof_lname}`} 
              className="w-24 h-24 rounded-full mx-auto mb-2" 
            />
            <h3 className="font-semibold text-[18px]">
              {`${official.prof_fname || "Lorem"} ${official.prof_mname || "Ipsom"} ${official.prof_lname || "Dolar"}`}
            </h3>
            <p className="text-gray-500 text-[15px]">{official.bar_off_position}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
