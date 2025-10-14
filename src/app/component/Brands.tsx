"use client";
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';

// Sample logo data - replace with your actual logos
const logoData = {
  'All Industries': [
    { name: 'Maersk', category: ['All Industries', 'Hospitality', 'Enterprise Office'], logo: '🚢' },
    { name: 'Banff Sunshine', category: ['All Industries', 'Hospitality'], logo: '⛷️' },
    { name: 'Order.co', category: ['All Industries', 'Education', 'Hospitality'], logo: '📦' },
    { name: 'Crumbl Cookies', category: ['All Industries', 'Hospitality', 'Retail'], logo: '🍪' },
    { name: 'Hilton', category: ['All Industries', 'Hospitality'], logo: '🏨' },
    { name: 'CorePower Yoga', category: ['All Industries', 'Retail'], logo: '🧘' },
    { name: 'Rutgers', category: ['All Industries', 'Education'], logo: '🎓' },
    { name: 'NSD', category: ['All Industries', 'Education', 'Enterprise Office'], logo: '💼' },
    { name: 'IntelyCare', category: ['All Industries', 'Mission Critical'], logo: '⚕️' },
    { name: 'Bergdorf Goodman', category: ['All Industries', 'Retail'], logo: '👗' },
    { name: 'NBA', category: ['All Industries', 'Enterprise Office'], logo: '🏀' },
    { name: 'Fluidtruck', category: ['All Industries', 'Enterprise Office'], logo: '🚚' },
    { name: 'US Soccer', category: ['All Industries', 'Enterprise Office'], logo: '⚽' },
    { name: 'Hogsalt', category: ['All Industries', 'Hospitality'], logo: '🍽️' },
    { name: 'Apple', category: ['All Industries', 'Enterprise Office'], logo: '🍎' },
    { name: 'CloudKitchens', category: ['All Industries', 'Hospitality'], logo: '☁️' },
    { name: 'FedEx Forum', category: ['All Industries', 'Enterprise Office'], logo: '📮' },
    { name: 'Spinoso', category: ['All Industries', 'Retail'], logo: '🏪' },
    { name: 'Micro Center', category: ['All Industries', 'Retail'], logo: '💻' },
    { name: 'Dole', category: ['All Industries', 'Enterprise Office'], logo: '🍌' },
    { name: 'University of Virginia', category: ['All Industries', 'Education'], logo: '🏛️' },
    { name: 'Hawaii Prep Academy', category: ['All Industries', 'Education'], logo: '🌺' },
    { name: 'Lake Louise', category: ['All Industries', 'Hospitality'], logo: '⛰️' },
    { name: 'Microsoft', category: ['All Industries', 'Enterprise Office', 'Education'], logo: '💾' },
    { name: 'Blue Shield', category: ['All Industries', 'Mission Critical'], logo: '🛡️' },
    { name: 'Winter Park', category: ['All Industries', 'Hospitality'], logo: '⛷️' },
    { name: 'MLB', category: ['All Industries', 'Enterprise Office'], logo: '⚾' },
    { name: 'Venture Global LNG', category: ['All Industries', 'Mission Critical'], logo: '⚡' },
    { name: 'Humane', category: ['All Industries', 'Enterprise Office'], logo: '🤖' },
    { name: 'NASA', category: ['All Industries', 'Mission Critical', 'Education'], logo: '🚀' },
    { name: 'LexisNexis', category: ['All Industries', 'Enterprise Office'], logo: '⚖️' },
    { name: 'EVO', category: ['All Industries', 'Hospitality'], logo: '🎿' },
    { name: 'Subway', category: ['All Industries', 'Retail', 'Hospitality'], logo: '🥪' },
    { name: 'Kunes', category: ['All Industries', 'Retail'], logo: '🚗' },
    { name: 'Drake Software', category: ['All Industries', 'Enterprise Office'], logo: '💿' },
    { name: 'Planet', category: ['All Industries', 'Enterprise Office'], logo: '🌍' },
    { name: 'Austin FC', category: ['All Industries', 'Enterprise Office'], logo: '⚽' },
    { name: 'Crown', category: ['All Industries', 'Enterprise Office'], logo: '👑' },
    { name: 'XA', category: ['All Industries', 'Education'], logo: '❌' },
    { name: 'Johnson University', category: ['All Industries', 'Education'], logo: '📚' },
    { name: 'Houston', category: ['All Industries', 'Education'], logo: '🏈' },
    { name: 'Sandbox VR', category: ['All Industries', 'Retail'], logo: '🥽' },
  ]
};

export default function IndustryLeadersFilter() {
  const [activeFilter, setActiveFilter] = useState('All Industries');
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const categories = [
    'All Industries',
    'Education',
    'Hospitality',
    'Enterprise Office',
    'Retail',
    'Mission Critical'
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
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

  const filteredLogos = activeFilter === 'All Industries' 
    ? logoData['All Industries']
    : logoData['All Industries'].filter(logo => logo.category.includes(activeFilter));

  // Animation variants
  const containerVariants :Variants= {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants :Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const logoVariants :Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const filterVariants :Variants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div 
      ref={sectionRef}
      className="min-h-screen bg-white py-8 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.h1 
          className="text-3xl font-semibold text-center mb-10 text-gray-900"
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          Trusted by Industry Leaders
        </motion.h1>

        {/* Filter Tabs */}
        <motion.div 
          className="flex flex-wrap justify-center gap-6 mb-12 border-b border-gray-200"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeFilter === category
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              variants={filterVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
              {activeFilter === category && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  layoutId="activeFilter"
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Logo Grid */}
        <motion.div 
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-6 items-center"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {logoData['All Industries'].map((logo, index) => {
            const isActive = activeFilter === 'All Industries' || logo.category.includes(activeFilter);
            
            return (
              <motion.div
                key={`${logo.name}-${index}`}
                className={`flex items-center justify-center transition-all duration-500 ${
                  isActive ? 'grayscale-0 opacity-100' : 'grayscale opacity-30'
                }`}
                variants={logoVariants}
                whileHover={{ 
                  scale: 1.1,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="text-3xl">
                  {logo.logo}
                </div>
              </motion.div> 
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}