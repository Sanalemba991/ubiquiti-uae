"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.3
        }
    }
};

const fadeInLeft: Variants = {
    hidden: { 
        opacity: 0, 
        x: -60,
        transition: { duration: 0.8, ease: "easeOut" }
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const fadeInRight: Variants = {
    hidden: { 
        opacity: 0, 
        x: 60,
        transition: { duration: 0.8, ease: "easeOut" }
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    }
};

const AnimatedSection = ({ 
    children, 
    variants = fadeInUp, 
    className = "",
    delay = 0 
}: { 
    children: React.ReactNode; 
    variants?: Variants; 
    className?: string;
    delay?: number;
}) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
        rootMargin: '-50px 0px', // Adjust this to trigger earlier/later
    });

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

const About = () => {
    const goToProducts = () => {
        console.log('Navigate to products');
    };

    return (
        <>
            {/* Hero Section with Video Background - Full Screen */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Video Background */}
                <div className="absolute inset-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ filter: 'brightness(0.6)' }}
                    >
                        <source src="/video/about.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

         
             
               {/* Content - Aligned to Left */}
                <div className="relative z-10 text-left text-white max-w-6xl mx-auto px-4 w-full md:ml-4 lg:ml-8 mt-32 md:mt-40">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.h1 
                            variants={fadeInLeft} 
                            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-2xl"
                        >
                            About <span className='text-blue-500'>Ubiquiti</span>-UAE
                        </motion.h1>

                        <motion.p 
                            variants={fadeInLeft} 
                            className="text-base md:text-lg lg:text-xl mb-8 leading-relaxed max-w-2xl"
                        >Simplifying IT with advanced networking solutions for seamless connectivity and unified management.   </motion.p>

                        
                    </motion.div>
                </div>
            </section>

            {/* Who is Ubiquiti-UAE Section */}
            <section className="py-16 px-6 bg-gray-50 overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <AnimatedSection variants={fadeInLeft}>
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                <span className='text-blue-500'>Ubiquiti</span> Distributor in UAE
                            </h2>
                            <div className="w-16 h-1 bg-blue-500 mb-6"></div>
                        </AnimatedSection>

                        <AnimatedSection variants={fadeInRight} className="text-gray-700 leading-relaxed">
                            <p className="text-lg mb-6">
                                We are an authorized Ubiquiti distributor in the UAE, providing a complete range of genuine Ubiquiti products including UniFi networking equipment, security solutions, and smart device platforms. Our authorization ensures customers receive only original products backed by Ubiquiti's trusted warranty and support. As an official partner, we deliver reliable services, seamless supply, and tailored solutions to meet the growing digital infrastructure needs of businesses and individuals across the UAE.
                            </p>
                            
                        </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* Why Choose Ubiquiti-UAE Section */}
            <section className="py-16 px-6 bg-white overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <AnimatedSection className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Why Choose <span className='text-blue-500'>Ubiquiti</span>-UAE?
                        </h2>
                        <div className="w-16 h-1 bg-blue-500 mx-auto mb-6"></div>
                    </AnimatedSection>

                    <AnimatedSection variants={fadeInUp} className="text-gray-700 leading-relaxed mb-12">
                        <p className="text-lg mb-6">
                            Ubiquiti-UAE is the authorized distributor of Ubiquiti products in UAE. We can provide competitive prices for Ubiquiti UniFi, EdgeMax, and UISP products with comprehensive support services across Gulf countries. We are one of the largest stock-holding distributors of Ubiquiti products in the region. We provide an extensive range of Ubiquiti networking solutions and can deliver products within 24 hours in UAE, with shipments completed in 4-8 days throughout GCC Countries (Saudi Arabia, Bahrain, Qatar). Ubiquiti-UAE provides a variety of enterprise-grade wireless and wired networking products that utilize innovative and ground-breaking technology.
                        </p>
                    </AnimatedSection>

                    {/* Use Cases Grid */}
                    <AnimatedSection variants={staggerContainer}>
                        <motion.div variants={fadeInUp} className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Cloud Gateways</h3>
                            <p className="text-gray-700">
                                Seamless connectivity and constant communication are essential for boosting workplace productivity. Ubiquiti UniFi network solutions ensure uninterrupted high-performance coverage, effortless deployment through the unified management interface, smart remote management, and centralized control—empowering efficient operations at disruptive price points.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Switching</h3>
                            <p className="text-gray-700">
                                Hotel guests prioritize super-fast, secure, and stable wireless networks. Ubiquiti UniFi network solutions offer superior enterprise-class connectivity with seamless roaming, catering to diverse hospitality operations. The intuitive management platform simplifies operations and maintenance with centralized configuration and one-click optimization.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">WiFi</h3>
                            <p className="text-gray-700">
                                Fast, stable wireless networks are essential for interactive, immersive education. Ubiquiti UniFi network solutions enable seamless learning environments with high-density access point capabilities, robust security features, and comprehensive privacy protection—all managed through an elegant, unified interface.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Physical Security</h3>
                            <p className="text-gray-700">
                                Boosting transaction efficiency through digitalization is at the core of modern retail transformation. Ubiquiti UniFi network solutions ensure stable, reliable wired and wireless connections, support for point-of-sale systems, integrated security cameras, and comprehensive retail networking solutions—all unified in one powerful management platform.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Integrations</h3>
                            <p className="text-gray-700">
                                Ubiquiti UISP (UniFi Internet Service Provider) solutions provide powerful tools for managing and scaling ISP operations. With airMAX point-to-point and point-to-multipoint solutions, fiber connectivity options, and comprehensive network management software, ISPs can deliver reliable high-speed internet to customers efficiently and cost-effectively.
                            </p>
                        </motion.div>
                    </AnimatedSection>
                </div>
            </section>
        </>
    );
};

export default About;