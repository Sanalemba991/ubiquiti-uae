"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';
import Physical from './Physical';
const Page = () => {
    const [isMobile, setIsMobile] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
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
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log('Video autoplay failed:', error);
            });
        }
    }, []);

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

    return (
        <>
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
                        src="https://ui.com/microsite/static/physical-security-3-CAzcETco.mp4"
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        preload="metadata"
                    />

                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/40"></div>
                </motion.div>

                {/* Content Section - Changed to left alignment */}
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
                     Physical<span className='text-blue-500'>Security</span> 
                    </motion.h1>
                    <motion.p
                        className="text-lg md:text-xl mb-6"
                        variants={itemVariants}
                    >Integrated Protection
                    </motion.p>
                    <motion.p
                        className="text-lg md:text-xl mb-6"
                        variants={itemVariants}
                    >
                       Comprehensive security systems combining access control, surveillance, and monitoring with network integration.
                    </motion.p>

                </motion.div>
            </section>

            {/* Big gap between sections */}

<Physical/>
     
        </>
    );
};

export default Page;