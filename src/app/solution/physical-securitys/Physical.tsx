"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Variants } from "framer-motion";
import { useInView, useReducedMotion } from 'framer-motion';
import React from 'react';

// Categories data
const categories = [
    {
        id: 1,
        title: <>Alarm <span className="text-blue-600">Manager</span></>,
        subtitle: "Secure Cloud Connectivity",
        description: "Alarm Manager powers seamless if-this-then-that automations within UniFi and beyond—set granular triggers and actions, like playing a prerecorded message on a loud-speaker when a camera detects motion.",
        video: "/video/physicall/physical1.mp4",
        alignLeft: true
    },
    {
        id: 2,
        title: <>AI <span className="text-blue-600">Analytics</span></>,
        subtitle: "Network Infrastructure",
        description: "UniFi Protect leverages edge computing for on-camera AI. Instantly search footage with Smart Detections, set alerts via Alarm Manager, and receive real-time facial-recognition notifications - all processed securely your local infrastructure.",
        video: "/video/physicall/physical2.mp4",
        alignLeft: false
    },
    {
        id: 3,
        title: <>No Licensing <span className="text-blue-600">Fees</span></>,
        subtitle: "Wireless Solutions",
        description: "Run 4 or 4,000 cameras - licensing is still $0. UniFi Protect handles all AI and recording on your local UNVR or Enterprise NVR, eliminating cloud fees, subscriptions, and paid AI add-ons.",
        video: "/video/physicall/physical3.mp4",
        alignLeft: true
    },
    {
        id: 4,
        title: <>Touch <span className="text-blue-600"> Pass </span></>,
        subtitle: "Integrated Protection",
        description: "UniFi's Port Manager provides an intuitive way to configure VLANs, PoE settings, and link aggregation—all from a centralized interface. Make quick changes without digging through complex settings.",
        video: "/video/physicall/physical4.mp4",
        alignLeft: false
    },
    {
        id: 5,
        title: <>Usability <span className="text-blue-600"> Enhancements </span></>,
        subtitle: "Advanced Web Security",
        description: "New event playback with keyboard shortcuts for precise frame-by-frame analysis, plus enhanced capabilities for quickly retrieving recordings of relevant people and license plates.",
        video: "/video/physicall/physical5.mp4",
        alignLeft: true
    }
];

// Physical Component
const Physical = () => {
    const shouldReduceMotion = useReducedMotion();

    // Refs for each category section
    const categoryRefs = [
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null),
        useRef<HTMLDivElement>(null)
    ];

    // Video refs for each category
    const videoRefs = [
        useRef<HTMLVideoElement>(null),
        useRef<HTMLVideoElement>(null),
        useRef<HTMLVideoElement>(null),
        useRef<HTMLVideoElement>(null),
        useRef<HTMLVideoElement>(null)
    ];

    // Header ref and in-view detection
    const headerRef = useRef<HTMLDivElement>(null);
    const isHeaderInView = useInView(headerRef, { once: true, margin: "-50px" });

    // Check if each category is in view
    const isInView1 = useInView(categoryRefs[0], { once: true, margin: "-50px" });
    const isInView2 = useInView(categoryRefs[1], { once: true, margin: "-50px" });
    const isInView3 = useInView(categoryRefs[2], { once: true, margin: "-50px" });
    const isInView4 = useInView(categoryRefs[3], { once: true, margin: "-50px" });
    const isInView5 = useInView(categoryRefs[4], { once: true, margin: "-50px" });

    const inViewStates = [isInView1, isInView2, isInView3, isInView4, isInView5];

    // Play/pause videos based on viewport
    useEffect(() => {
        videoRefs.forEach((videoRef, index) => {
            if (videoRef.current) {
                if (inViewStates[index]) {
                    videoRef.current.play().catch(error => {
                        console.log('Video play failed:', error);
                    });
                } else {
                    videoRef.current.pause();
                }
            }
        });
    }, [inViewStates]);

    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const slideVariants: Variants = {
        hidden: (alignLeft: boolean) => ({
            opacity: 0,
            x: alignLeft ? -100 : 100,
            scale: 0.95
        }),
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const overlayVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
                delay: 0.1
            }
        }
    };

    const contentVariants: Variants = {
        hidden: (alignLeft: boolean) => ({
            opacity: 0,
            x: alignLeft ? -30 : 30
        }),
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.2
            }
        }
    };

    const textVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: (delay: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: delay
            }
        })
    };

    // Header variants
    const headerVariants: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    // Simplified variants for reduced motion
    const reducedMotionVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    return (
        <div className="bg-gradient-to-r from-blue-900/80 to-transparent overflow-hidden">
            <section className="py-16 bg-gray-100">
                <motion.div
                    ref={headerRef}
                    variants={shouldReduceMotion ? reducedMotionVariants : headerVariants}
                    initial="hidden"
                    animate={isHeaderInView ? "visible" : "hidden"}
                    className="text-center max-w-6xl mx-auto px-6 mb-16"
                >
                    <motion.h2
                        variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
                        custom={0}
                        initial="hidden"
                        animate={isHeaderInView ? "visible" : "hidden"}
                        className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                    >
                        Physical Security
                    </motion.h2>

                    <motion.p
                        variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
                        custom={0.2}
                        initial="hidden"
                        animate={isHeaderInView ? "visible" : "hidden"}
                        className="text-lg md:text-xl text-blue-700 font-medium mb-6"
                    >
                        Unified Protection Systems
                    </motion.p>

                    <motion.div
                        variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
                        custom={0.4}
                        initial="hidden"
                        animate={isHeaderInView ? "visible" : "hidden"}
                        className="max-w-4xl mx-auto"
                    >
                        <p className="text-base text-gray-700 leading-relaxed mb-4">
                            Advanced, fully integrated security solutions combining intelligent access control, high-definition surveillance, and real-time monitoring — seamlessly connected through a unified network infrastructure.
                        </p>
                    </motion.div>
                </motion.div>

                <div className="w-full flex flex-col gap-8">
                    {categories.map((category, index) => {
                        const isInView = inViewStates[index];

                        return (
                            <motion.div
                                key={category.id}
                                ref={categoryRefs[index]}
                                custom={category.alignLeft}
                                variants={shouldReduceMotion ? reducedMotionVariants : slideVariants}
                                initial="hidden"
                                animate={isInView ? "visible" : "hidden"}
                                className="relative bg-cover bg-center h-[70vh] w-full overflow-hidden"
                            >
                                {/* Background Video with Blackish Opacity */}
                                <div className="absolute inset-0 w-full h-full">
                                    <video
                                        ref={videoRefs[index]}
                                        src={category.video}
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover brightness-75 contrast-110"
                                        preload="metadata"
                                    />
                                </div>

                                {/* Dark Overlay for additional blackish effect */}
                                <div className="absolute inset-0 bg-black/30"></div>

                                {/* Gradient Overlay */}
                                <motion.div
                                    variants={shouldReduceMotion ? reducedMotionVariants : overlayVariants}
                                    initial="hidden"
                                    animate={isInView ? "visible" : "hidden"}
                                    className={`absolute inset-0 ${index % 2 === 1
                                            ? 'bg-gradient-to-l from-black/70 to-transparent'
                                            : 'bg-gradient-to-r from-black/70 to-transparent'
                                        }`}
                                />

                                {/* Content */}
                                <motion.div
                                    custom={category.alignLeft}
                                    variants={shouldReduceMotion ? reducedMotionVariants : contentVariants}
                                    initial="hidden"
                                    animate={isInView ? "visible" : "hidden"}
                                    className={`absolute inset-0 flex flex-col justify-center px-6 md:px-12 text-white ${category.alignLeft ? 'items-start' : 'items-end text-right'
                                        }`}
                                >
                                    <motion.h2
                                        custom={shouldReduceMotion ? 0 : 0.3}
                                        variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
                                        initial="hidden"
                                        animate={isInView ? "visible" : "hidden"}
                                        className="text-2xl md:text-4xl font-bold mb-3 text-white drop-shadow-lg"
                                    >
                                        {category.title}
                                    </motion.h2>

                                    <motion.p
                                        custom={shouldReduceMotion ? 0 : 0.4}
                                        variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
                                        initial="hidden"
                                        animate={isInView ? "visible" : "hidden"}
                                        className="text-base md:text-lg mb-3 text-gray-200"
                                    >
                                        {category.subtitle}
                                    </motion.p>

                                    <motion.p
                                        custom={shouldReduceMotion ? 0 : 0.5}
                                        variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
                                        initial="hidden"
                                        animate={isInView ? "visible" : "hidden"}
                                        className="text-sm md:text-base mb-6 opacity-90 max-w-lg leading-relaxed text-gray-300"
                                    >
                                        {category.description}
                                    </motion.p>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

// Main PhysicalSecurityClient Component
const PhysicalSecurityClient = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        setIsClient(true);
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);

        return () => {
            window.removeEventListener("resize", checkIsMobile);
        };
    }, []);

    // Auto-play video when component mounts
    useEffect(() => {
        if (videoRef.current && isClient) {
            videoRef.current.play().catch((error) => {
                console.log("Video autoplay failed:", error);
            });
        }
    }, [isClient]);

    // Animation variants for staggered entrance
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    // Don't render video until client-side to avoid hydration mismatch
    if (!isClient) {
        return (
            <section className="relative w-full h-screen flex items-center justify-start overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-900 to-gray-800" />
                <div className="relative z-10 text-white px-4 md:px-8 text-left max-w-2xl mt-32 md:mt-40">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Physical<span className="text-blue-500">Security</span>
                    </h1>
                    <p className="text-lg md:text-xl mb-6">
                        Integrated Protection
                    </p>
                    <p className="text-lg md:text-xl mb-6">
                        Comprehensive security systems combining access control, surveillance, and monitoring with network integration.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* Hero Section with Video Background */}
            <section className="relative w-full h-screen flex items-center justify-start overflow-hidden">
                {/* Background Video with fade-in animation */}
                <motion.div
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <video
                        ref={videoRef}
                        src="/video/physicall/physic.mp4"
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        preload="metadata"
                    />

                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/40"></div>
                </motion.div>

                {/* Content Section */}
                <motion.div
                    className="relative z-10 text-white px-4 md:px-8 text-left max-w-2xl mt-32 md:mt-40"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1
                        className="text-4xl md:text-6xl font-bold mb-4"
                        variants={itemVariants}
                    >
                        Physical<span className="text-blue-500">Security</span>
                    </motion.h1>
                    <motion.p className="text-lg md:text-xl mb-6" variants={itemVariants}>
                        Integrated Protection
                    </motion.p>
                    <motion.p className="text-lg md:text-xl mb-6" variants={itemVariants}>
                        Comprehensive security systems combining access control, surveillance, and monitoring with network integration.
                    </motion.p>
                </motion.div>
            </section>

            {/* Physical Security Features Section */}
            <Physical />
        </>
    );
};

export default PhysicalSecurityClient;