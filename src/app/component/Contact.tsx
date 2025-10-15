"use client";
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Building, Users, Target } from 'lucide-react';
import { Variants } from 'framer-motion';
import Image from 'next/image';

// Import your images
import Sam from "../../../public/contact/add (1).png";
import Ram from "../../../public/contact/add (2).png";
import { useInView } from 'react-intersection-observer';

export default function Contact() {
    const goToContact = () => {
        const formSection = document.getElementById('inquiry-form');
        if (formSection) {
            formSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const slideUp: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const slideInLeft: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const slideInRight: Variants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const scaleIn: Variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
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
            rootMargin: '-50px 0px',
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

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            console.log('Submitting form data:', formData);
            const response = await fetch('/api/contacts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            console.log('API response:', result);

            if (result.success) {
                alert(result.message || 'Thank you for your message. We will respond within 24 hours.');
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    company: '',
                    service: '',
                    subject: '',
                    message: ''
                });
            } else {
                alert(result.error || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Failed to send message. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const MapSection = () => {
        return (
            <section className="bg-transparent">
                <motion.div
                    variants={slideUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="container mx-auto px-4"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                            Visit Our <span className='text-blue-600'>Office</span>
                        </h2>
                        <p className="text-gray-600 text-sm">
                            25th St - Naif - Dubai - United Arab Emirates
                        </p>
                    </div>

                    <motion.div
                        variants={scaleIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-30px" }}
                        className="relative w-full h-[350px] rounded-lg overflow-hidden shadow-md"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1486.8524251489728!2d55.307987002385616!3d25.273703424847543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f432649d77a05%3A0x329bece680652a9d!2sDigital%20Link%20Technology%20LLC%20-%20UNV%20National%20Distributor%20in%20Dubai%2C%20UAE!5e1!3m2!1sen!2sin!4v1758793163694!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Office Location"
                            className="absolute inset-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent pointer-events-none" />
                    </motion.div>
                </motion.div>
            </section>
        );
    };

    return (
        <>
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
                        <source src="https://ui.com/microsite/static/cg-1-DEvu98aB.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>


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
                            Contact <span className='text-blue-500'>Ubiquiti</span>-UAE
                        </motion.h1>

                        <motion.p
                            variants={fadeInLeft}
                            className="text-base md:text-lg lg:text-xl mb-8 leading-relaxed max-w-2xl"
                        >
                            Have questions or need assistance? Our team is here to help you with product inquiries, technical support, or partnership opportunities. Reach out to us and experience seamless communication and dedicated support.
                        </motion.p>

                        <motion.button
                            onClick={goToContact}
                            className="border-2 border-blue-500 text-white/80 px-8 py-3 text-base font-medium hover:bg-blue-500 hover:text-white transition-all duration-300 ease-in-out cursor-pointer"
                        >
                            Get in Touch
                        </motion.button>
                    </motion.div>

                </div>
            </section>

            {/* Added ID to the form section */}
            <div id="inquiry-form" className="relative bg-transparent">
                {/* Background - Removed or made transparent */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                }}></div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
                    <div className="grid md:grid-cols-2 gap-6 items-start max-w-6xl w-full">
                        {/* Left Side - Compact Professional Content */}
                        <motion.div
                            variants={slideInLeft}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-4"
                         >
                            {/* Technical Support Card */}
                            <div className="relative rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 overflow-hidden">
                                <div className="absolute inset-0">
                                    <Image
                                        src={Sam}
                                        alt="Technical Support"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="relative z-10 p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Technical/Customer Support
                                        </h2>
                                    </div>
                                    <p className="text-gray-600 mb-3 text-xs leading-relaxed">
                                        For technical support, please visit our Help Center
                                    </p>
                                    <button className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded text-xs hover:bg-blue-50 transition-colors duration-200 font-medium">
                                        Help Center
                                    </button>
                                </div>
                            </div>

                            {/* Device Replacement Card */}
                            <div className="relative rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 overflow-hidden">
                                <div className="absolute inset-0">
                                    <Image
                                        src={Ram}
                                        alt="Technical Support"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="relative z-10 p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h2 className="text-lg font-semibold text-gray-800">
                                            Device Replacement
                                        </h2>
                                    </div>
                                    <p className="text-gray-600 mb-3 text-xs leading-relaxed">
                                        Submit and track device replacement requests through our RMA service.
                                    </p>
                                    <button className="px-4 py-2 bg-white border border-blue-600 text-blue-600 rounded text-xs hover:bg-blue-50 transition-colors duration-200 font-medium">
                                        Submit RMA Request
                                    </button>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Side - Form */}
                        <motion.div
                            variants={slideInRight}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="w-full max-w-md mx-auto"
                        >
                            <div className="backdrop-blur-lg bg-white/10 rounded-lg p-5 border border-white/20 shadow-md">
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    {/* Email and Name Row */}
                                    <div className="grid md:grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-gray-700 text-xs mb-1 font-medium">Email</label>
                                            <motion.input
                                                whileFocus={{ scale: 1.01 }}
                                                transition={{ duration: 0.2 }}
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 bg-white/95 rounded text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200 text-xs"
                                                placeholder="your@email.com"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-xs mb-1 font-medium">Full Name</label>
                                            <motion.input
                                                whileFocus={{ scale: 1.01 }}
                                                transition={{ duration: 0.2 }}
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 bg-white/95 rounded text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200 text-xs"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Phone and Company Row */}
                                    <div className="grid md:grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-gray-700 text-xs mb-1 font-medium">Phone</label>
                                            <motion.input
                                                whileFocus={{ scale: 1.01 }}
                                                transition={{ duration: 0.2 }}
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 bg-white/95 rounded text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200 text-xs"
                                                placeholder="+1 234 567 8900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-xs mb-1 font-medium">Company</label>
                                            <motion.input
                                                whileFocus={{ scale: 1.01 }}
                                                transition={{ duration: 0.2 }}
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2 bg-white/95 rounded text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200 text-xs"
                                                placeholder="Your Company"
                                            />
                                        </div>
                                    </div>

                                    {/* Service Dropdown */}
                                    <div>
                                        <label className="block text-gray-700 text-xs mb-1 font-medium">Service Interest</label>
                                        <motion.select
                                            whileFocus={{ scale: 1.01 }}
                                            transition={{ duration: 0.2 }}
                                            name="service"
                                            value={formData.service}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 bg-white/95 rounded text-gray-800 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200 text-xs"
                                        >
                                            <option value="">Select a service</option>
                                            <option value="technical-support">Technical Support</option>
                                            <option value="device-replacement">Device Replacement</option>
                                            <option value="partnership">Partnership</option>
                                            <option value="other">Other</option>
                                        </motion.select>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-gray-700 text-xs mb-1 font-medium">Subject</label>
                                        <motion.input
                                            whileFocus={{ scale: 1.01 }}
                                            transition={{ duration: 0.2 }}
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 bg-white/95 rounded text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200 text-xs"
                                            placeholder="Partnership Inquiry"
                                            required
                                        />
                                    </div>

                                    {/* Comment */}
                                    <div>
                                        <label className="block text-gray-700 text-xs mb-1 font-medium">Message</label>
                                        <motion.textarea
                                            whileFocus={{ scale: 1.01 }}
                                            transition={{ duration: 0.2 }}
                                            name="message"
                                            placeholder="Tell us about your business and partnership interests..."
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-3 py-2 bg-white/95 rounded text-gray-800 placeholder-gray-500 border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors duration-200 resize-none text-xs"
                                            required
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <motion.button
                                        whileHover={{
                                            scale: isSubmitting ? 1 : 1.01,
                                            backgroundColor: "#1d4ed8"
                                        }}
                                        whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                                        transition={{ duration: 0.2 }}
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                                    >
                                        {isSubmitting ? 'Sending...' : 'Submit Inquiry'}
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <MapSection />
            <div className='mb-10'>

            </div>
        </>
    );
}