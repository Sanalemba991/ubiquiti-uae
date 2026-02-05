'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaFolder, FaChevronRight, FaHome } from 'react-icons/fa';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Variants } from 'framer-motion';

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

interface NavbarCategoryPageClientProps {
  categories: Category[];
  navbarCategory: NavbarCategory;
  navbarSlug: string;
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

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Category Card Component
const CategoryCard = ({
  category,
  index,
  navbarSlug
}: {
  category: Category;
  index: number;
  navbarSlug: string;
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
      <Link href={`/${navbarSlug}/${category.slug}`} className="block">
        <motion.div
          className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-200/60"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {category.image ? (
              <>
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    scale: isHovered ? 1.08 : 1,
                    filter: isHovered ? 'brightness(0.4)' : 'brightness(1)'
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>

                {/* Description Overlay */}
                {category.description && (
                  <motion.div
                    className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      y: isHovered ? 0 : 30
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <p className="text-white text-sm leading-relaxed line-clamp-4 max-w-xs">
                      {category.description}
                    </p>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <motion.div
                  className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <FaFolder className="w-10 h-10 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </motion.div>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <motion.h3
                  className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  {category.name}
                </motion.h3>
              </div>

              <motion.div
                className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-all duration-300"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
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
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default function NavbarCategoryPageClient({
  categories,
  navbarCategory,
  navbarSlug
}: NavbarCategoryPageClientProps) {
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header Section */}
      <motion.div
        className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.2),transparent_50%)]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center gap-2 text-sm mb-8"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <Link
              href="/"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <FaHome className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <FaChevronRight className="w-3 h-3 text-slate-500" />
            <span className="text-blue-400 font-medium">{navbarCategory.name}</span>
          </motion.nav>

          {/* Title */}
          <motion.div
            className="max-w-4xl"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                {navbarCategory.name}
              </span>
            </h1>
            {navbarCategory.description && (
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
                {navbarCategory.description}
              </p>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-10 flex items-center gap-6"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
              <FaFolder className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">{categories.length} Categories</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {sortedCategories.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedCategories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                navbarSlug={navbarSlug}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaFolder className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Categories Found</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              There are no categories available in this section yet. Please check back later.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              <FaHome className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
