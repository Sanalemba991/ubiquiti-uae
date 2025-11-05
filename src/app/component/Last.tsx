"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Last = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null); // Fixed type from HTMLIFrameElement to HTMLVideoElement
    const sectionRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        // Intersection Observer for detecting when section comes into view
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
            window.removeEventListener('resize', checkIsMobile);
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    const handleExploreClick = () => {
        router.push('/about');
    };

    const handleVideoLoad = () => {
        setIsVideoLoaded(true);
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.5,
                staggerChildren: 0.4 
            }
        }
    };

    const itemVariants: Variants = {
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

    const buttonVariants: Variants = {
        hidden: { scale: 0.9, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                delay: 1.2,
                duration: 0.6 
            }
        },
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.3
            }
        }
    };

    const videoVariants: Variants = {
        hidden: { opacity: 0, scale: 1.1 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 1.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <section 
            ref={sectionRef}
            className="relative w-full h-[400px] md:h-[500px] flex items-center justify-start overflow-hidden"
        >
            {/* Video Background */}
            <motion.div
                className="absolute inset-0 w-full h-full"
                variants={videoVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                <video
                    ref={videoRef}
                    src="https://ui.com/microsite/static/wifi-1-Nhn7hDnj.mp4"
                    className="absolute top-0 left-0 w-full h-full object-cover" // Added object-cover for better video scaling
                    style={{ 
                        filter: 'brightness(0.7)',
                        border: 'none',
                        transform: 'scale(1.5)',
                        pointerEvents: 'none'
                    }}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onLoadedData={handleVideoLoad} // Changed from onLoad to onLoadedData for video elements
                    title="Background Video"
                />
                
                {/* Dark overlay for better text visibility */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>
            </motion.div>

            {/* Text Content */}
            <motion.div
                className="relative px-8 py-8 max-w-md ml-8 md:ml-16 lg:ml-24 z-10"
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="text-left space-y-4"
                >
                    <motion.h1
                        className="text-3xl md:text-4xl font-bold text-white tracking-tight"
                        variants={itemVariants}
                    >
                        Networking, Physical Security, and More – Unified
                    </motion.h1>

                    <motion.p
                        className="text-sm md:text-base text-gray-200 max-w-lg leading-relaxed"
                        variants={itemVariants}
                    >
                        Seamless Connectivity for 18,000 Fans
                    </motion.p>

                    <motion.button
                        className="px-6 py-2 border-2 cursor-pointer border-blue-600 text-white/80 hover:bg-blue-600 hover:text-white font-medium transition-colors duration-300"
                        variants={buttonVariants}
                        whileHover="hover"
                        onClick={handleExploreClick}
                    >
                        About Us
                    </motion.button>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Last;