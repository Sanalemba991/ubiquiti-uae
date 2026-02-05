"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';
import dynamic from 'next/dynamic';
import React from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

// Dynamically import Cloud component to avoid client/server mismatch
const CloudComponent = dynamic(() => import('./cloud-gateways'), { ssr: false });

// Categories data moved here (or keep in separate file)
const categories = [
    {
        id: 1,
        title: <>Intrusion Detection &<span className="text-blue-600"> Prevention</span></>,
        subtitle: "Secure Cloud Connectivity",
        description:
            "Intrusion Detection & Prevention UniFi's IDS/IPS guards against potential threats inside and outside the network. This system swiftly detects and blocks suspicious activity that may signal compromise, using a real-time database of known threats.",
        video: "/video/cloud/cloud1.mp4",
        alignLeft: true
    },
    {
        id: 2,
        title: <>Application-Aware <span className="text-blue-600">Firewall</span></>,
        subtitle: "Network Infrastructure",
        description: "Accurately detects and blocks traffic directed at specific applications, websites, and IP addresses. Easily block specific targets that might pose security threats at the network, VLAN, and client device level.",
        video: "/video/cloud/cloud2.mp4",
        alignLeft: false
    },
    {
        id: 3,
        title: <>One-Click WiFi & <span className="text-blue-600">VPN Client </span></>,
        subtitle: "Wireless Solutions",
        description: "UniFi Identity delivers seamless network and physical access. Grant users permissions and IT access with one click.With One-Click VPN, users access your network without credentials - no more VPN configuration nightmares.",
        video: "/video/cloud/cloud3.mp4",
        alignLeft: true
    },
    {
        id: 4,
        title: <>ISP Health<span className="text-blue-600"> Monitoring </span></>,
        subtitle: "Integrated Protection",
        description: "The UniFi Site Manager dashboard at unifi.ui.com features ISP health metrics for quick, insightful monitoring across sites. Receive real-time email and app alerts for site ISP health, with push notifications settings customizable for each site.",
        video: "/video/cloud/cloud4.mp4",
        alignLeft: false
    },
    {
        id: 5,
        title: <>Content<span className="text-blue-600"> Filtering </span></>,
        subtitle: "Advanced Web Security",
        description: "Block traffic to over 100 categories of malicious, explicit, or unwanted content from your UniFi Network. With just a few clicks, stop traffic to sites linked to spyware, adult content, social media, and more.",
        video: "/video/cloud/cloud5.mp4",
        alignLeft: true
    }
];

// Cloud Component with video features
const Cloud = () => {
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
                        High-Performance Cloud Infrastructure
                    </motion.h2>
                    <motion.p
                        variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
                        custom={0.2}
                        initial="hidden"
                        animate={isHeaderInView ? "visible" : "hidden"}
                        className="text-lg md:text-xl text-blue-700 font-medium mb-6"
                    >
                        Ultra-Low Latency Global Connectivity
                    </motion.p>
                    <motion.div
                        variants={shouldReduceMotion ? reducedMotionVariants : textVariants}
                        custom={0.4}
                        initial="hidden"
                        animate={isHeaderInView ? "visible" : "hidden"}
                        className="max-w-4xl mx-auto"
                    >
                        <p className="text-base text-gray-700 leading-relaxed mb-4">
                            Advanced cloud infrastructure powered by globally distributed edge nodes, intelligent load balancing, and adaptive traffic optimization. Engineered to deliver sub-10ms latency with enterprise-grade encryption and automated failover capabilities.
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

// Main CloudGatewaysClient Component
const CloudGatewaysClient = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        setIsClient(true);
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    // Auto-play video when component mounts
    useEffect(() => {
        if (videoRef.current && isClient) {
            videoRef.current.play().catch(error => {
                console.log('Video autoplay failed:', error);
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
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants: Variants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                delay: 0.8,
                duration: 0.4
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2
            }
        }
    };

    // Don't render video until client-side to avoid hydration mismatch
    if (!isClient) {
        return (
            <section className="relative w-full h-screen flex items-center justify-start overflow-hidden">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-900 to-gray-800" />
                <div className="relative z-10 text-white px-4 md:px-8 text-left max-w-2xl mt-32 md:mt-40">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        Cloud <span className='text-blue-600'>Gateways</span>
                    </h1>
                    <p className="text-lg md:text-xl mb-6">
                        Secure Cloud Connectivity.
                    </p>
                    <p className="text-lg md:text-xl mb-6">
                        Enterprise-grade cloud gateways with advanced security protocols and high-performance routing for seamless cloud application access.
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
                        src="/video/cloud/cloud.mp4"
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
                        Cloud <span className='text-blue-600'>Gateways</span>
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl mb-6"
                        variants={itemVariants}
                    >
                        Secure Cloud Connectivity.
                    </motion.p>
                    <motion.p
                        className="text-lg md:text-xl mb-6"
                        variants={itemVariants}
                    >
                        Enterprise-grade cloud gateways with advanced security protocols and high-performance routing for seamless cloud application access.
                    </motion.p>
                </motion.div>
            </section>

            {/* Cloud Features Section */}
            <Cloud />
        </>
    );
};

export default CloudGatewaysClient;