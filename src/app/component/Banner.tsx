"use client";
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';

const Solution = () => {
    const [isMobile, setIsMobile] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const router = useRouter();

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

    const handleExploreClick = () => {
        router.push('/products');
    };

    // Auto-play video when component mounts
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log('Video autoplay failed:', error);
            });
        }
    }, []);

    // Animation variants for staggered entrance from left
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
        hidden: { x: -50, opacity: 0 }, // Changed to negative x (coming from left)
        visible: {
            x: 0,
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
                    src="/video/homeban.mp4"
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    preload="metadata"
                />

                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40"></div>
            </motion.div>


            {/* Content Section - Aligned to left */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="relative z-10 text-left text-white max-w-6xl mx-auto px-4 w-full md:ml-4 lg:ml-8 mt-32 md:mt-40 space-y-6"
            >
                <motion.h1
                    className="text-4xl md:text-6xl font-bold text-white tracking-tight"
                    variants={itemVariants}
                >
                    Ubiquiti <span className="text-blue-400">UAE</span>
                </motion.h1>

              

                <motion.p
                    className="text-lg md:text-xl text-white/80 max-w-2xl"
                    variants={itemVariants}
                >
                    Empower your business with next-generation digital technology designed for
                    performance, scalability, and innovation.
                </motion.p>

               
            </motion.div>
        </section>
    );
};

export default Solution;