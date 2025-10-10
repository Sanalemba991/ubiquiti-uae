"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface StatCardProps {
  number: number;
  label: string;
  index: number;
}

const StatCard = ({ number, label, index }: StatCardProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, number, {
        duration: 2,
        delay: index * 0.2,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, count, number, index]);

  return (
    <motion.div
      ref={ref}
      className="text-center text-white drop-shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.5,
        delay: index * 0.15,
        ease: "easeOut",
      }}
    >
      <motion.div
        className="text-4xl lg:text-5xl font-bold mb-1"
        initial={{ scale: 0.8 }}
        animate={isInView ? { scale: 1 } : { scale: 0.8 }}
        transition={{
          duration: 0.6,
          delay: index * 0.15 + 0.2,
          ease: "backOut",
        }}
        style={{ textShadow: "2px 2px 8px rgba(0, 0, 0, 0.8)" }}
      >
        +<motion.span>{rounded}</motion.span>
      </motion.div>
      <div
        className="text-lg lg:text-xl font-medium"
        style={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.7)" }}
      >
        {label}
      </div>
    </motion.div>
  );
};

const categories = [
  {
    id: "marine",
    label: "Marine Equipment",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Premium Marine Equipment Solutions",
    description: "We provide top-tier marine equipment including navigation systems, safety gear, and deck machinery. Our products meet international maritime standards and ensure vessel reliability.",
  },
  {
    id: "oilfield",
    label: "Oilfield Equipment",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    title: "Advanced Oilfield Equipment & Solutions",
    description: "Specializing in drilling equipment, wellhead systems, and production tools. Our oilfield solutions are designed for harsh environments and maximum uptime.",
  },
  {
    id: "valves",
    label: "Valves & Fittings",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    title: "Industrial Valves & Precision Fittings",
    description: "Comprehensive range of gate, globe, ball, and butterfly valves. Including stainless steel fittings, flanges, and gaskets for all industrial applications.",
  },
  {
    id: "pipe",
    label: "Pipe Repair Solutions",
    video: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    title: "Straub Pipe Repair & Maintenance",
    description: "Expert pipe repair clamps and couplings for emergency and permanent repairs. Straub certified solutions for all pipe materials and sizes.",
  },
];

export default function Principle() {
  const contentRef = useRef(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isContentInView = useInView(contentRef, { once: true });
  const [isSectionInView, setIsSectionInView] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentCategory = categories[activeCategory];

  // Intersection Observer for section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsSectionInView(true);
        }
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Auto-rotate every 6 seconds - only when section is in view
  useEffect(() => {
    if (!isSectionInView) return;

    const interval = setInterval(() => {
      setActiveCategory((prev) => (prev + 1) % categories.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isSectionInView]);

  useEffect(() => {
    if (videoRef.current && isSectionInView) {
      videoRef.current.load();
    }
  }, [activeCategory, isSectionInView]);

  // Animation variants for slow transitions
  const containerVariants : Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants : Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants : Variants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3
      }
    }
  };

  const contentVariants : Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.9,
        ease: "easeOut"
      }
    }
  };

  const videoVariants : Variants = {
    hidden: { opacity: 0, x: -50, scale: 1.05 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  return (
    <div 
      ref={sectionRef}
      className="py-12 bg-gray-50 overflow-hidden"
    >
      {/* Filter Buttons */}
      <motion.div
        className="container mx-auto px-4 mb-8"
        variants={containerVariants}
        initial="hidden"
        animate={isSectionInView ? "visible" : "hidden"}
      >
        <motion.div 
          className="flex flex-wrap gap-3 justify-center"
          variants={containerVariants}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(index)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 border border-gray-200 
                ${activeCategory === index
                  ? "text-[#0ea5e9]"
                  : "text-gray-600 hover:text-[#0ea5e9]"
                }`}
              variants={buttonVariants}
              
            >
              {category.label}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4">
          {/* Content Grid - Aligned at same height */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Side - Video Section */}
            <motion.div
              key={activeCategory}
              className="relative rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl"
              variants={videoVariants}
              initial="hidden"
              animate={isSectionInView ? "visible" : "hidden"}
            >
              {/* Background Video with Dark Overlay */}
              <video
                ref={videoRef}
                className="w-full h-auto object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={currentCategory.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/20" />
            </motion.div>

            {/* Right Side - Dynamic Content */}
            <motion.div
              key={`content-${activeCategory}`}
              ref={contentRef}
              className="space-y-6 lg:pt-0"
              variants={contentVariants}
              initial="hidden"
              animate={isSectionInView ? "visible" : "hidden"}
            >
              <motion.h1
                className="text-3xl lg:text-4xl font-bold leading-tight text-gray-900 pb-4 border-b-2 border-[#0ea5e9]"
                variants={itemVariants}
              >
                {currentCategory.title}
              </motion.h1>

              <motion.p
                className="text-lg text-gray-600 leading-relaxed"
                variants={itemVariants}
              >
                {currentCategory.description}
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}