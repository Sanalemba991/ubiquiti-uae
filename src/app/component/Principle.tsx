"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Prin from "../../../public/Principle.jpg"

const Principle = () => {
  const [isVisible, setIsVisible] = useState<{ [key: string]: boolean }>({});
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    const observers: { [key: string]: IntersectionObserver } = {};

    Object.keys(sectionRefs.current).forEach((key) => {
      if (sectionRefs.current[key]) {
        observers[key] = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsVisible((prev) => ({ ...prev, [key]: true }));
            }
          },
          { threshold: 0.2 }
        );
        observers[key].observe(sectionRefs.current[key]);
      }
    });

    return () => {
      Object.values(observers).forEach((observer) => observer.disconnect());
    };
  }, []);

  const setSectionRef = (key: string) => (el: HTMLElement | null) => {
    sectionRefs.current[key] = el;
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 overflow-hidden">
      {/* Hero Section */}
      <section className="text-black text-center pt-12 pb-8 px-4">
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Your Trusted Partner in{" "}
          Enterprise Networking <span className="text-blue-600">
            Solutions
          </span>
        </motion.h1>
      </section>

      {/* Main Content Section */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Text Content - Comes from left */}
            <motion.div
              ref={setSectionRef("content")}
              className="space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible.content ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Company Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible.content ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              >
                <p className="text-lg text-slate-700 leading-relaxed mb-6">
                  At{" "}
                  <span className="font-bold text-gray-800">
                     Ubiquiti UAE
                  </span>
                  , we deliver cutting-edge{" "}
                  <span className="font-semibold text-slate-800">
                    networking and connectivity solutions
                  </span>{" "}
                  across the United Arab Emirates. Specializing in{" "}
                  <span className="font-semibold text-gray-700">
                    enterprise WiFi, switching, routing, security
                  </span>
                  , and{" "}
                  <span className="font-semibold text-slate-800">
                    unified communication systems
                  </span>
                  , we serve businesses of all sizes—from{" "}
                  <span className="font-semibold text-gray-700">
                    small offices
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-gray-700">
                    large-scale deployments
                  </span>
                  .
                </p>
                <p className="text-lg text-slate-700 leading-relaxed">
                  Our commitment to innovation and reliability ensures{" "}
                  <span className="font-bold text-gray-800">
                    seamless connectivity
                  </span>{" "}
                  and powerful network infrastructure that drives your business forward with{" "}
                  <span className="font-semibold text-gray-700">
                    industry-leading performance and support
                  </span>
                  .
                </p>
              </motion.div>
            </motion.div>

            {/* Image - Comes from right */}
            <motion.div
              ref={setSectionRef("image")}
              className="flex justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible.image ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            >
              <div className="">
                <img
                  src={Prin.src}
                  alt="Network Infrastructure Solutions"
                  className="h-90 w-full object-contain rounded-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Principle;