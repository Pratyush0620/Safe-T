import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import im1 from "../assets/1.png"
import im2 from "../assets/2.png"
import im3 from "../assets/3.png"
import im4 from "../assets/4.png"
import im5 from "../assets/5.png"
import im6 from "../assets/6.png"
import im7 from "../assets/7.png"
import im8 from "../assets/8.png"



gsap.registerPlugin(ScrollTrigger);

const ParallaxSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftBackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leftFrontRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightBackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightFrontRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Left side parallax
      leftBackRefs.current.forEach((ref, index) => {
        gsap.to(ref, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          },
          y: -50 - (index * 20),
        });
      });

      leftFrontRefs.current.forEach((ref, index) => {
        gsap.to(ref, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 0.5,
          },
          y: -100 - (index * 30),
        });
      });

      // Right side parallax
      rightBackRefs.current.forEach((ref, index) => {
        gsap.to(ref, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          },
          y: -50 - (index * 20),
        });
      });

      rightFrontRefs.current.forEach((ref, index) => {
        gsap.to(ref, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 0.5,
          },
          y: -100 - (index * 30),
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
      <div ref={sectionRef} className="relative min-h-screen overflow-hidden">
        {/* Left Section */}
        <div className="absolute left-0 top-0 w-full md:w-1/3 h-full">
          {/* Background Cards */}
          <div
              ref={el => leftBackRefs.current[0] = el}
              className="absolute top-[30%] left-[19vw] w-64 h-64 bg-blue-100 rounded-lg shadow-lg transform -rotate-6 z-10 md:left-[19vw]"
          >
            <img src={im1} className="h-full w-full"/>
          </div>
          <div
              ref={el => leftBackRefs.current[1] = el}
              className="absolute top-[60%] left-[19vw] w-56 h-[20vw] bg-indigo-100 rounded-lg shadow-lg transform -rotate-3 z-10 md:left-[19vw]"
          >
            <img src={im2} className="h-full w-full"/>
          </div>

          {/* Foreground Cards */}
          <div
              ref={el => leftFrontRefs.current[0] = el}
              className="absolute top-[25%] left-16 w-[15vw] h-72 bg-blue-200 rounded-lg shadow-xl transform rotate-3 z-20 md:left-16"
          >
            <img src={im3} className="h-full w-full"/>
          </div>
          <div
              ref={el => leftFrontRefs.current[2] = el}
              className="absolute top-[70%] left-8 w-[15vw] h-[20vw] bg-cyan-200 rounded-lg shadow-xl transform rotate-12 z-20 md:left-8"
          >
            <img src={im4} className="h-full w-full"/>
          </div>
        </div>

        {/* Middle Section */}
        <div className="absolute left-1/3 w-full md:w-1/3 h-full flex items-center justify-center px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Safe-T<span className="font-thin">ech</span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Empowering well-being and safety with Safe-T, one worker at a time.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="absolute right-0 top-0 w-full md:w-1/3 h-full">
          {/* Background Cards */}
          <div
              ref={el => rightBackRefs.current[0] = el}
              className="absolute top-[30%] right-[19vw] w-64 h-64 bg-purple-100 rounded-lg shadow-lg transform rotate-6 z-10 md:right-[19vw]"
          >
            <img src={im5} className="h-full w-full"/>
          </div>
          <div
              ref={el => rightBackRefs.current[1] = el}
              className="absolute top-[60%] right-[19vw] w-56 h-[20vw] bg-pink-100 rounded-lg shadow-lg transform rotate-3 z-10 md:right-[19vw]"
          >
            <img src={im6} className="h-full w-full"/>
          </div>

          {/* Foreground Cards */}
          <div
              ref={el => rightFrontRefs.current[0] = el}
              className="absolute top-[25%] right-16 w-[15vw] h-72 bg-purple-200 rounded-lg shadow-xl transform -rotate-3 z-20 md:right-16"
          >
            <img src={im7} className="h-full w-full"/>
          </div>
          <div
              ref={el => rightFrontRefs.current[2] = el}
              className="absolute top-[70%] right-8 w-[15vw] h-[20vw] bg-rose-200 rounded-lg shadow-xl transform -rotate-12 z-20 md:right-8"
          >
            <img src={im8} className="h-full w-full"/>
          </div>
        </div>
      </div>
  );
};

export default ParallaxSection;