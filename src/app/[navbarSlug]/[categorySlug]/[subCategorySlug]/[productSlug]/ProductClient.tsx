'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaHome, FaCheckCircle, FaEnvelope, FaTimes, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Variants } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  key_features: string[];
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;
  navbar_category: {
    id: string;
    name: string;
    slug: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    navbar_category: {
      id: string;
      name: string;
      slug: string;
    };
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

interface ProductPageClientProps {
  product: Product;
  relatedProducts: Product[];
  navbarSlug: string;
  categorySlug: string;
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.6
    }
  }
};

const cardHoverVariants: Variants = {
  initial: {
    scale: 1,
    y: 0
  },
  hover: {
    scale: 1.02,
    y: -8,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const contentSlideIn: Variants = {
  hidden: {
    opacity: 0,
    x: -50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.8
    }
  }
};

const RelatedProductCard = ({
  product,
  index,
  navbarSlug,
  categorySlug
}: {
  product: Product;
  index: number;
  navbarSlug: string;
  categorySlug: string;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={index}
      className="group p-2 sm:p-3 md:p-4"
    >
      <Link
        href={product.subcategory
          ? `/${product.navbar_category.slug}/${product.category.slug}/${product.subcategory.slug}/${product.slug}`
          : `/${product.navbar_category.slug}/${product.category.slug}/${product.slug}`
        }
        className="block"
      >
        <motion.div
          className="relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-200/60"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Image Container */}
          <div className="relative h-40 sm:h-44 md:h-48 lg:h-52 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: isHovered ? 1.08 : 1,
                filter: isHovered ? 'brightness(0.4)' : 'brightness(1)'
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Image
                src={product.image1}
                alt={product.name}
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Description Overlay */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 30
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <p className="text-white text-xs sm:text-sm md:text-base leading-relaxed mt-2 sm:mt-3 mb-4 sm:mb-6 font-light max-w-xs drop-shadow-lg line-clamp-4 sm:line-clamp-none">
                {product.description}
              </p>
            </motion.div>
          </div>

          {/* Title Section */}
          <div className="p-3 sm:p-4 md:p-6 relative transition-colors duration-300" style={{
            backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.6)' : 'transparent'
          }}>
            <motion.h3
              className="text-sm sm:text-base md:text-lg font-bold leading-tight line-clamp-2 mb-1 sm:mb-2"
              animate={{
                x: isHovered ? 4 : 0,
                opacity: isHovered ? 0 : 1,
                height: isHovered ? 0 : 'auto',
                color: isHovered ? '#000000' : '#000000'
              }}
              transition={{ duration: 0.3 }}
            >
              {product.name}
            </motion.h3>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default function ProductClient({
  product,
  relatedProducts,
  navbarSlug,
  categorySlug,
}: ProductPageClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    mobile: '',
    description: '',
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const videoOpacity = Math.max(0.2, 1 - scrollY / 600);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/product-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: product.name,
          ...enquiryForm,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Your message has been sent successfully! We will soon reach out to you.');
        setIsEnquiryModalOpen(false);
        setEnquiryForm({ name: '', email: '', mobile: '', description: '' });
      } else {
        toast.error(data.error || 'Failed to submit enquiry');
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const images = [product.image1, product.image2, product.image3, product.image4].filter((img): img is string => Boolean(img));

  return (
    <div className="min-h-screen">
      {/* Enhanced Full Banner Video Hero */}
      <div className="relative h-screen overflow-hidden">
        {/* Video Background */}
        <div
          className="absolute inset-0"
          style={{ opacity: videoOpacity }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="https://ui.com/microsite/static/physical-security-1-Cz6S4fvO.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/10" />
        </div>

        {/* Enhanced Hero Content - Left Aligned with proper z-index */}
        <div className="relative h-full flex items-center px-6 lg:px-12 z-10">
          <motion.div
            ref={heroRef}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={contentSlideIn}
            className="max-w-3xl text-left"
          >
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {product.name}
            </motion.h1>

            {product.description && (
              <motion.p
                className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {product.description}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <button
              onClick={() => {
                const el = document.getElementById('product-details');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                }
              }}
              className="flex flex-col items-center text-white/80 hover:text-white transition-colors cursor-pointer focus:outline-none group"
              aria-label="Scroll to product details"
            >
              <span className="text-xs font-medium mb-2 uppercase tracking-wider group-hover:text-white">Scroll Down</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <FaChevronRight className="w-4 h-4 rotate-90" />
              </motion.div>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          {/* Breadcrumb Navigation */}
          <motion.nav
  className="inline-flex items-center gap-x-1 sm:gap-x-1.5 text-[9px] sm:text-xs bg-white/80 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 sm:py-1.5 mb-6 sm:mb-10 md:mb-12"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 0.6 }}
>
  <Link
    href="/"
    className="text-slate-600 hover:text-slate-900 transition-colors flex items-center group flex-shrink-0"
  >
    <FaHome className="w-2 h-2 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform" />
  </Link>

  <FaChevronRight className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-slate-400 flex-shrink-0" />
  <Link
    href={`/${navbarSlug}/${categorySlug}`}
    className="text-slate-600 hover:text-slate-900 transition-colors font-medium text-[9px] sm:text-xs"
  >
    {product.category.name}
  </Link>
  {product.subcategory && (
    <>
      <FaChevronRight className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-slate-400 flex-shrink-0" />
      <Link
        href={`/${navbarSlug}/${categorySlug}/${product.subcategory.slug}`}
        className="text-slate-600 hover:text-slate-900 transition-colors font-medium text-[9px] sm:text-xs"
      >
        {product.subcategory.name}
      </Link>
    </>
  )}
  <FaChevronRight className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-slate-400 flex-shrink-0" />
  <span className="text-blue-600 font-semibold text-[9px] sm:text-xs">{product.name}</span>
</motion.nav>

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Product Images */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={containerVariants}
              className="space-y-6"
            >
              {/* Main Image */}
              <motion.div
                variants={itemVariants}
                className="relative h-[380px] bg-white rounded-xl overflow-hidden shadow-lg border border-slate-200"
              >
                <Image
                  src={images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                />
              </motion.div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-4 gap-4"
                >
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-24 bg-white border-2 rounded-xl overflow-hidden transition-all ${selectedImage === index
                        ? 'border-blue-500 ring-2 ring-blue-500/50'
                        : 'border-slate-200 hover:border-blue-500/50'
                        }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - Image ${index + 1}`}
                        fill
                        className="object-contain p-2"
                      />
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.div>



            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={containerVariants}
              className="flex flex-col"
            >
              {/* Product Title & Description Card */}
              <motion.div variants={itemVariants} className="mb-8  p-8 rounded-xl  ">
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2 leading-tight">
                  {product.name}
                </h1>

                {/* Subtitle (uses category / subcategory as fallback) */}
                <div className="text-sm text-slate-600 font-medium mb-4">
                  {product.subcategory?.name || product.category.name}
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6"></div>
                <p className="text-base text-slate-600 leading-relaxed mb-6">
                  {product.description}
                </p>
                {/* Compact bullet list to match screenshot */}
                {product.key_features && product.key_features.length > 0 && (
                  <ul className="list-disc pl-5 text-slate-700 space-y-2 mb-6">
                    {product.key_features.map((feature, idx) => (
                      <li key={idx} className="text-sm leading-relaxed">
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Prominent Shop Now CTA */}
                <div className="mt-2">
                  <button
                    onClick={() => setIsEnquiryModalOpen(true)}
                    className="px-4 py-1.5 border border-blue-600 text-black-600 hover:bg-blue-600 hover:text-white font-medium text-sm transition-colors duration-200 cursor-pointer"
                  >
                    Contact Us
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Enquiry Modal */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Product Enquiry</h2>
              <button
                onClick={() => setIsEnquiryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition p-2 rounded-lg hover:bg-slate-100"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEnquirySubmit} className="p-6 space-y-6">
              {/* Product Name (Read-only) */}
              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={product.name}
                  readOnly
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={enquiryForm.name}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={enquiryForm.email}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-2">
                  Mobile <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={enquiryForm.mobile}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, mobile: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={enquiryForm.description}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEnquiryModalOpen(false)}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}