'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaFolder, FaBox, FaChevronRight, FaHome, FaArrowLeft } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Variants } from 'framer-motion';
import Ban from "../../../../../public/ban.png"

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  category: {
    id: string;
    name: string;
    slug: string;
    navbarCategory: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image1: string;
}

interface SubCategoryClientProps {
  subCategory: SubCategory;
  allSubCategories: SubCategory[];
  products: Product[];
  navbarSlug: string;
  categorySlug: string;
  subCategorySlug: string;
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

// Product Showcase Component
const ProductShowcase = ({
  item,
  index,
  isSubCategory = false,
  href
}: {
  item: Product | SubCategory;
  index: number;
  isSubCategory?: boolean;
  href: string;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [isHovered, setIsHovered] = useState(false);

  const imageUrl = 'image1' in item ? item.image1 : item.image;
  const description = item.description;

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={index}
      className="group p-2 sm:p-3 md:p-4"
    >
      <Link href={href} className="block">
        {/* Main Card Container */}
        <motion.div
          className="relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-200/60"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Image Container */}
          <div className="relative h-40 sm:h-44 md:h-48 lg:h-52 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {imageUrl ? (
              <>
                {/* Main Product Image */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    scale: isHovered ? 1.08 : 1,
                    filter: isHovered ? 'brightness(0.4)' : 'brightness(1)'
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Image
                    src={imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                {/* Description Overlay */}
                {description && (
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
                      {description}
                    </p>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-4 sm:p-6 md:p-8">
                <motion.div
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8"
                  animate={{
                    scale: isHovered ? 1.15 : 1,
                    rotate: isHovered ? 8 : 0
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {isSubCategory ? (
                    <FaFolder className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-slate-300 group-hover:text-blue-500 transition-colors duration-300" />
                  ) : (
                    <FaBox className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-slate-300 group-hover:text-blue-500 transition-colors duration-300" />
                  )}
                </motion.div>
              </div>
            )}
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
              {item.name}
            </motion.h3>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default function SubCategoryClient({
  subCategory,
  allSubCategories,
  products,
  navbarSlug,
  categorySlug,
  subCategorySlug,
}: SubCategoryClientProps) {
  const [scrollY, setScrollY] = useState(0);
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const videoOpacity = Math.max(0.2, 1 - scrollY / 600);

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
              {subCategory.name}
            </motion.h1>

            {subCategory.description && (
              <motion.p
                className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {subCategory.description}
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
                const el = document.getElementById('products');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                }
              }}
              className="flex flex-col items-center text-white/80 hover:text-white transition-colors cursor-pointer focus:outline-none group"
              aria-label="Scroll to products"
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
      <div id="products" className="relative bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 lg:py-28">
          {/* Breadcrumb Navigation */}
          <motion.nav
            className="inline-flex items-center gap-x-1 sm:gap-x-1.5 text-[10px] sm:text-xs bg-white/80 backdrop-blur-sm rounded-full px-2.5 sm:px-3 py-1.5 mb-8 sm:mb-10 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Link 
              href="/" 
              className="text-slate-600 hover:text-slate-900 transition-colors flex items-center group flex-shrink-0"
            >
              <FaHome className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform" />
            </Link>
            
            <FaChevronRight className="w-2 h-2 text-slate-400 flex-shrink-0" />
            <Link 
              href={`/${navbarSlug}/${categorySlug}`}
              className="text-slate-600 hover:text-slate-900 transition-colors font-medium text-[10px] sm:text-xs"
            >
              {subCategory.category.name}
            </Link>
            <FaChevronRight className="w-2 h-2 text-slate-400 flex-shrink-0" />
            <span className="text-blue-600 font-semibold text-[10px] sm:text-xs">{subCategory.name}</span>
          </motion.nav>

          {/* Products Section */}
          {products.length > 0 && (
            <motion.section
              className="mb-24"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={containerVariants}
            >
              <motion.div
                className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6"
                variants={itemVariants}
              >
                <div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-3 tracking-tight">
                    Products in <span className='text-blue-500'>{subCategory.name}</span>
                  </h2>
                  <p className="text-lg text-slate-600 max-w-2xl">
                    Discover our collection of products in this <span className='text-blue-500'>{subCategory.name}</span> sub-category
                  </p>
                </div>
                <motion.div
                  className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-slate-200 self-start md:self-auto"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className="text-2xl font-bold text-slate-900">
                    {products.length}
                  </span>
                  <span className="text-sm text-slate-600 font-medium">Products</span>
                </motion.div>
              </motion.div>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0"
                variants={containerVariants}
              >
                {products.map((product, index) => (
                  <ProductShowcase
                    key={product.id}
                    item={product}
                    index={index}
                    isSubCategory={false}
                    href={`/${navbarSlug}/${categorySlug}/${subCategorySlug}/${product.slug}`}
                  />
                ))}
              </motion.div>
            </motion.section>
          )}         
        </div>
      </div>
    </div>
  );
}