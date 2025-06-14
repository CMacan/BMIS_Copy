import React, { useState } from "react";
import { usePage } from "@inertiajs/react";
import HeaderLayout from "@/Layouts/HeaderLayout"
import Landingbg from "../../Layouts/landingbg";
import ContactInfo from "../../Components/ContactInfo";
import FooterLayout from "../../Layouts/FooterLayout";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { Navigation,Pagination, Autoplay, EffectCoverflow } from "swiper/modules";
import { Card, CardContent, CardHeader, CardTitle } from "../../Components/Card";
import "../../../css/about.css";


const About = () => {
    const { barangay } = usePage().props; // Get barangay data
    const [activeTab, setActiveTab] = useState("vision")
    const defaultValues = [
      "Passion to Serve",
      "Excellence",
      "Integrity",
      "Commitment",
      "Collaboration"
  ];

    const tabs = [
        {
          id: "vision",
          content:  barangay?.bar_vision,
         
        },
        {
          id: "mission",
          content: barangay?.bar_mission,
        },

        
        {
          id: "core values",
          content: (
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 justify-items-start">
              {(barangay && barangay.bar_value && barangay.bar_value.length > 0 ? barangay.bar_value : defaultValues).map((value, index) => (
                <li key={index}>{value.trim()}</li>
              ))}
            </ul>
          ),
        }
    ];
  

    const sectors = [
      {
        title: "SENIOR CITIZENS",
        icon: "/images/SeniorCitezen.png",
        raNumber: "R.A. 9994",
        description: "The Expanded Senior Citizens Act of 2010",
      },
      {
        title: "SAWANG CALERO PWD",
        icon:"/images/pwd.png",
        raNumber: "R.A. 10754",
        description: "Benefits and Privileges of Persons with Disability (PWD)",
      },
      {
        title: "SACA SOLO PARENTS",
        icon:"/images/Soloparent.png",
        raNumber: "R.A. 8972",
        description: "Solo Parent's Welfare Act",
      },
      {
        title: "SACABABAYENAN",
        icon:"/images/women.png",
        raNumber: "R.A. 9710",
        description: "Magna Carta of Women Of 2009",
      },
      {
        title: "SAWANG CALERO ERPAT",
        icon:"/images/erpat.png",
        description: "Empowerment and Reaffirmation of Paternal Abilities Training (ERPAT)",
      },
      {
        title: "SACALGBT",
        icon:"/images/lgbt.png",
        description: "Cebu City Ordinance 2660 Sexual Orientation Gender Identity Expression Sexual Characteristic (SOGIESC)",
      },
      
    ];
    
      

    const laws = [
      {
        icon:"/images/RA7610.png",
        raNumber: "R.A. 7610",
        description: "Special Protection of Children Against Child Abuse, Exploitation, & Discrimination Act",

      },
      {
        icon:"/images/RA7192.png",
        raNumber: "R.A. 7192",
        description: "Women in Development and Nation Building Act",
      },
      {
        icon:"/images/RA9710.png",
        raNumber: "R.A. 9710",
        description: "Magna Carta of Women of 2009",
      },
      {
        icon:"/images/RA7877.png",
        raNumber: "R.A. 7877",
        description: "Anti-Sexual Harassment Act of 1995",
      },
      {
        icon:"/images/RA8353.png",
        raNumber: " R.A. 8505  ",
        description: " Rape Victim Assistance and Protection Act of 1998",
      },
      {
        icon:"/images/RA10627.png",
        raNumber: "R.A. 10627",
        description: "Anti-Bullying Act of 2013",
      },

      {
        icon:"/images/RA11313.png",
        raNumber: "R.A. 11313",
        description: "Safe Spaces Act (Bawal Bastos Law)",

      },
      {
        icon:"/images/RA11310.png",
        raNumber: "R.A. 11310",
        description: "Pantawid Pamilyang Pilipino Program (4Ps) Act",
      },
      {
        icon:"/images/RA9262.png",
        raNumber: "R.A. 9262",
        description: "Anti-Violence Against Women and Their Children Act of 2004",
      },
      {
        icon:"/images/RA8353.png",
        raNumber: "R.A. 8353 ",
        description: "Anti-Rape Law of 1997",
      },
      {
        icon:"/images/RA10175.png",
        raNumber: "R.A. 10175",
        description: "Cybercrime Prevention Act of 2012",
      },
    ];


    


    return (
        <HeaderLayout>
             {/* Hero Section */}
             <Landingbg height="min-h-[40vh]" />


          <section className="py-5 mx-auto max-w-5xl ">
                <h2 className="text-[23px] font-bold text-center my-10 font-['Poppins'] text-[#021D7D]">
                  BARANGAY SAWANG CALERO GENDER AND DEVELOPMENT SECTORS
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                  {sectors.map((sector, index) => (
                    <Card
                      key={index}
                      className="w-[300px] h-[250px] flex flex-col bg-gradient-to-b  shadow-lg rounded-xl border  text-center relative group"
                    >
                      <CardHeader className="flex flex-col justify-center text-base font-semibold">
                        <img src={sector.icon} className="w-25 h-24 p-5 mx-auto" alt={sector.title} />
                        <CardTitle>{sector.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="absolute inset-0 bg-white bg-opacity-90 flex flex-col justify-center items-center text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 rounded-xl">
                        <p className="text-sm font-semibold text-gray-600 mb-2">{sector.raNumber}</p>
                        <p className="text-gray-500 text-sm ">{sector.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
 
              
              {/* History about  Barangay */}
              <div className="py-16 bg-gray-50 px-20">
              <h2 className="text-[25px] font-bold text-left text-[#021D7D] ml-12  mb-10 font-['Poppins'] border-solid border-[#021D7D] ">
                  History of Barangay Sawang Calero
                  </h2>
                  <div className="mx-20 text-[16px] ">
                  <p className="text-gray-600 leading-relaxed tracking-wide text-justify">
                  Barangay Sawang Calero, formerly known as Poblacion, is a historic coastal community in Cebu City. The name "Sawang Calero" is derived from the Filipino words "Sawang" (creek) and "Calero" (canal), reflecting the barangay's historical reliance on waterways for transportation and trade. Originally a rural area focused on fishing and farming, it became an independent barangay on April 15, 1942, as Cebu City underwent rapid urbanization. Over time, it has evolved into a more urbanized area, with a blend of residential, commercial, and industrial zones, owing to its strategic location near Osmeña Boulevard and the port area.
                  As of the 2020 Census, Sawang Calero has a population of 7,676, making it one of the more densely populated barangays in Cebu City. Despite its growth, the barangay faces challenges common to rapidly urbanizing coastal areas, such as informal settlements and environmental risks like flooding. Local initiatives, including shoreline cleanups, drainage improvements, and road maintenance, have been crucial in addressing these challenges and ensuring that the barangay remains a livable community despite its spatial constraints.
                  Furthermore, the establishment of the Little Lambs Center in 2006 by the Missionaries of the Poor marked a significant development in the barangay’s social welfare efforts. The center provides essential support to children with disabilities, exemplifying the barangay’s commitment to social services and community welfare. Through continued collaboration with neighboring barangays like Duljo Poblacion and San Nicolas Central, Sawang Calero has strengthened its resilience and fostered progress in both social and environmental aspects, contributing to the broader development of Cebu City.</p>
                    <p className="text-gray-600">
                      Barangay: Sawang Calero<br />
                      City: Cebu City<br />
                      Region: REGION VII
                  </p>
                  </div>
              </div>

              {/* Vision|Mission|Core Values */}
              <div className="about-container">
                <div className="about-button">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-10 py-4 rounded-md text-[16px] transition-colors font-semibold ${
                        activeTab === tab.id ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100 font-semibold"
                      }`}
                    >
                      {tab.id.toUpperCase()}
                    </button>
                  ))}
                </div>
          
                <div className="text-center space-y-10 text-[16px]">
                  <p className="text-gray-600">
                    We are determined to continue pushing boundaries and making an impact in our community. Let's take a look at
                    what we have been working on and what our future plans are.
                  </p>
          
                  <div className="bg-blue-50 p-8 rounded-lg">
                    <p className="text-gray-800 whitespace-pre-line text-left ml-20">{tabs.find((tab) => tab.id === activeTab)?.content}</p>
                  </div>
                </div>
              </div>   
          
   

      {/*LAWS & POLICIES */}
      <section className=" bg-white-100  mx-20 my-20">
                <div className="mx-5">
                    <Swiper
                        modules={[Navigation,Autoplay,Pagination]}
                        slidesPerView={5}
                        spaceBetween={5}
                        loop={true}
                        autoplay={{ delay: 2000}}
                        navigation
                        pagination={{ clickable: true }}
                        centeredSlides={true}
                        breakpoints={{
                            640: { slidesPerView: 2 },
                            768: { slidesPerView: 3 },
                            1024: { slidesPerView: 5 },
                        }}
                         className="swiper"
                    >
                        {laws.map((law, index) => (
                            <SwiperSlide key={index} className="mb-10">
                                 <div
                                 className="w-[210px] h-[250px] flex flex-col  shadow-lg border border-gray-200 justify-center items-center text-center rounded-none relative"
                                 style={{
                                  background: `linear-gradient(rgba(0, 30, 118, 0.7), rgba(14, 0, 118, 0.81)), url("/images/abogado.jpg")`,
                                   backgroundSize: "cover",
                                   backgroundPosition: "center",
                                   backgroundRepeat: "no-repeat"
                                 }}
                               >
                                      <img src={law.icon} className="w-[130px] h-[50px] object-contain justify-center mb-5 bg-white" />
                                    <div className="flex flex-col items-center ">
                                        {law.raNumber && <p className="font-semibold text-yellow-300 mb-2 mt-2 text-[14px] text-center w-full">{law.raNumber}</p>}
                                    </div>
                                    <div className="px-8 py-2">
                                        <p className="text-white text-[12px] leading-snug text-center w-full min-h-[60px] ">{law.description}</p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>


           {/* Footer */}
            {/* Contact Info Section */}
             <ContactInfo />
               {/* Footer*/}
            <FooterLayout/>    
        </HeaderLayout> 

    )
}

export default About;   