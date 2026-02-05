'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaFolder, FaBox, FaChevronRight, FaHome } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Variants } from 'framer-motion';

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
}

interface NavbarCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface CategoryPageClientProps {
  currentCategory: Category;
  categories: Category[];
  subCategories: SubCategory[];
  navbarCategory: NavbarCategory | null;
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

// Animated Card Component
const AnimatedCard = ({
  item,
  index,
  isSubCategory = false,
  href
}: {
  item: SubCategory | Category;
  index: number;
  isSubCategory?: boolean;
  href: string;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={index}
    >
      <motion.div
        variants={cardHoverVariants}
        initial="initial"
        whileHover="hover"
        className="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-blue-300 transition-all duration-300"
      >
        <Link href={href} className="block">
          {/* Image Section */}
          <div className="relative h-32 bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
            {item.image ? (
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full h-full"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <motion.div
                  className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center"
                  whileHover={{
                    scale: 1.1,
                    rotate: 5
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {isSubCategory ? (
                    <FaFolder className="w-10 h-10 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  ) : (
                    <FaBox className="w-10 h-10 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  )}
                </motion.div>
              </div>
            )}
          </div>

          {/* Enhanced Content Section */}
          <div className="p-7">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1 min-w-0">
                <motion.h3
                  className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2 mb-2"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.h3>

                {item.description && (
                  <motion.p
                    className="text-sm text-slate-600 leading-relaxed line-clamp-2"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.description}
                  </motion.p>
                )}
              </div>

              <motion.div
                className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-all duration-300"
                whileHover={{
                  scale: 1.1,
                  rotate: 5
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 10
                }}
              >
                <FaChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors duration-300" />
              </motion.div>
            </div>

            {/* Progress Bar */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 transform origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
};

const ProductShowcase = ({
  item,
  index,
  isSubCategory = false,
  href
}: {
  item: SubCategory | Category;
  index: number;
  isSubCategory?: boolean;
  href: string;
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
      className="group p-4"
    >
      <Link href={href} className="block">
        {/* Main Card Container */}
        <motion.div
          className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-200/60 "
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}

          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {item.image ? (
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
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                {/* Gradient Overlay */}


                {/* Description Overlay */}
                {item.description && (
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      y: isHovered ? 0 : 30
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >

                    <p className="text-white text-sm md:text-base leading-relaxed mt-3 mb-6 font-light max-w-xs drop-shadow-lg">
                      {item.description}
                    </p>



                  </motion.div>
                )}



              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8">
                <motion.div
                  className="bg-white rounded-2xl shadow-lg p-8"
                  animate={{
                    scale: isHovered ? 1.15 : 1,
                    rotate: isHovered ? 8 : 0
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {isSubCategory ? (
                    <FaFolder className="w-16 h-16 text-slate-300 group-hover:text-blue-500 transition-colors duration-300" />
                  ) : (
                    <FaBox className="w-16 h-16 text-slate-300 group-hover:text-blue-500 transition-colors duration-300" />
                  )}
                </motion.div>
              </div>
            )}
          </div>

          {/* Title Section */}
          <div className="p-6 relative transition-colors duration-300" style={{
            backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.6)' : 'transparent'
          }}>

            <motion.h3
              className="text-lg font-bold leading-tight line-clamp-2 mb-2"
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

export default function CategoryPageClient({
  currentCategory,
  categories,
  subCategories,
  navbarCategory,
  navbarSlug,
  categorySlug,
}: CategoryPageClientProps) {
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
  const contentOpacity = Math.min(1, scrollY / 300);

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
            <source src="https://ui.com/microsite/static/cg-1-DEvu98aB.mp4" type="video/mp4" />
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
            className="max-w-2xl text-left"
          >
            {/* Breadcrumb (added) */}
           

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {currentCategory.name}
            </motion.h1>

            {currentCategory.description && (
              <motion.p
                className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                {currentCategory.description}
              </motion.p>
            )}

            {/* Call to Action Button */}
          </motion.div>
        </div>

        {/* Scroll Indicator (added) */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <button
              onClick={() => {
                const el = document.getElementById('subcategories');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
                }
              }}
              className="flex flex-col items-center text-white/80 hover:text-white transition-colors cursor-pointer focus:outline-none group"
              aria-label="Scroll to subcategories"
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
      <div id="subcategories" className="relative bg-gradient-to-br from-slate-50 to-slate-100">
        
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
            
            <span className="text-blue-500 font-semibold">{currentCategory.name}</span>
          </motion.nav>

          {/* Sub-Categories Section */}
          {subCategories.length > 0 && (
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
                    Sub-Categories
                  </h2>
                  <p className="text-lg text-slate-600 max-w-2xl">
                    Explore detailed topics within <span className='text-blue-500'>{currentCategory.name}</span>
                  </p>
                </div>
                <motion.div
                  className="flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md border border-slate-200 self-start md:self-auto"
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className="text-2xl font-bold text-slate-900">
                    {subCategories.length}
                  </span>
                  <span className="text-sm text-slate-600 font-medium">Available</span>
                </motion.div>
              </motion.div>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0"
                variants={containerVariants}
              >
                {subCategories.map((subCat, index) => (
                  <ProductShowcase
                    key={subCat.id}
                    item={subCat}
                    index={index}
                    isSubCategory={true}
                    href={`/${navbarSlug}/${categorySlug}/${subCat.slug}`}
                  />
                ))}
              </motion.div>
            </motion.section>
          )}

          {/* Related Categories Section */}
          {categories.length > 1 && (
            <motion.section
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
                    Related Categories
                  </h2>
                  <p className="text-lg text-slate-600 max-w-2xl">
                    Discover more categories you might be interested in
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0"
                variants={containerVariants}
              >
                {categories
                  .filter(cat => cat.id !== currentCategory.id)
                  .slice(0, 6)
                  .map((cat, index) => (
                    <ProductShowcase
                      key={cat.id}
                      item={cat}
                      index={index + subCategories.length}
                      isSubCategory={false}
                      href={`/${navbarSlug}/${cat.slug}`}
                    />
                  ))}
              </motion.div>

              {categories.length > 7 && (
                <motion.div
                  className="mt-16 text-center"
                  variants={itemVariants}
                >
                  <Link
                    href={`/${navbarSlug}`}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <motion.span
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      View All {categories.length - 1} Categories
                      <FaChevronRight className="w-4 h-4" />
                    </motion.span>
                  </Link>
                </motion.div>
              )}
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
}