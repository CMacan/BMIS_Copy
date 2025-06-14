// import React from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import { Card, CardContent, CardHeader, CardTitle } from "./Card";

// const CustomSwiper = ({ items }) => {
//   return (
//     <Swiper
//       modules={[Navigation, Pagination, Autoplay]}
//       slidesPerView={1} // Adjust based on screen size
//       spaceBetween={20}
//       loop={true} // Infinite loop
//       autoplay={{ delay: 3000 }} // Auto-slide every 3 seconds
//       navigation
//       pagination={{ clickable: true }}
//       breakpoints={{
//         640: { slidesPerView: 2 },
//         768: { slidesPerView: 3 },
//         1024: { slidesPerView: 4 },
//       }}
//       className="swiper"
//     >
//       {items.map((item, index) => (
//         <SwiperSlide key={index} className="mb-10">
//           <Card className="w-[280px] h-[350px] flex flex-col bg-gradient-to-b from-red-100 to-blue-100 shadow-lg rounded-xl p-4 border border-yellow-200 justify-center text-center">
//             <CardHeader className="flex flex-col justify-center">
//               <img src={item.icon} className="w-45 h-25 p-5 mx-auto" alt={item.title} />
//               <CardTitle>{item.title}</CardTitle>
//             </CardHeader>
//             <CardContent className="text-center">
//               <p className="font-semibold text-gray-600 mb-2">{item.raNumber}</p>
//               <p className="text-gray-500 text-sm">{item.description}</p>
//             </CardContent>
//           </Card>
//         </SwiperSlide>
//       ))}
//     </Swiper>
//   );
// };

// export default CustomSwiper;
