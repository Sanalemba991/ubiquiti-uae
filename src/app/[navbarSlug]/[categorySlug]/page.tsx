'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
}

interface NavbarCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

export default function CategoryPage() {
  const params = useParams();
  const navbarSlug = params.navbarSlug as string;
  const categorySlug = params.categorySlug as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [navbarCategory, setNavbarCategory] = useState<NavbarCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch categories and subcategories in parallel
        const [categoriesRes, subCategoriesRes] = await Promise.all([
          fetch(`/api/category/by-navbar/${navbarSlug}`),
          fetch(`/api/subcategory/by-category/${categorySlug}`)
        ]);

        const categoriesResult = await categoriesRes.json();
        const subCategoriesResult = await subCategoriesRes.json();

        if (categoriesResult.success) {
          setCategories(categoriesResult.data);
          setNavbarCategory(categoriesResult.navbarCategory);
        }

        if (subCategoriesResult.success) {
          setSubCategories(subCategoriesResult.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (navbarSlug && categorySlug) {
      fetchData();
    }
  }, [navbarSlug, categorySlug]);

  const currentCategory = categories.find(cat => cat.slug === categorySlug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Category Not Found</h1>
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        {currentCategory.image ? (
          <Image
            src={currentCategory.image}
            alt={currentCategory.name}
            fill
            className="object-cover opacity-40"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-16">
          <Link
            href={`/${navbarSlug}`}
            className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors"
          >
            <FaArrowLeft />
            <span>Back to {navbarCategory?.name}</span>
          </Link>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {currentCategory.name}
          </h1>
          
          {currentCategory.description && (
            <p className="text-xl text-slate-300 max-w-3xl">
              {currentCategory.description}
            </p>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">
            Welcome to {currentCategory.name}
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            This is the category page for {currentCategory.name}. 
            {currentCategory.description && ` ${currentCategory.description}`}
          </p>
        </div>

        {/* Sub-Categories Section */}
        {subCategories.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8">
              Sub-Categories
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subCategories.map((subCat) => (
                <Link
                  key={subCat._id}
                  href={`/${navbarSlug}/${categorySlug}/${subCat.slug}`}
                  className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
                >
                  <div className="relative h-48 bg-slate-950">
                    {subCat.image ? (
                      <Image
                        src={subCat.image}
                        alt={subCat.name}
                        fill
                        className="object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl text-slate-700">📁</div>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {subCat.name}
                    </h3>
                    {subCat.description && (
                      <p className="text-slate-400 text-sm line-clamp-2">
                        {subCat.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other Categories in this Navbar Category */}
        {categories.length > 1 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">
              Other Categories in {navbarCategory?.name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories
                .filter(cat => cat._id !== currentCategory._id)
                .map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/${navbarSlug}/${cat.slug}`}
                    className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
                  >
                    <div className="relative h-48 bg-slate-950">
                      {cat.image ? (
                        <Image
                          src={cat.image}
                          alt={cat.name}
                          fill
                          className="object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-6xl text-slate-700">📦</div>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="text-slate-400 text-sm line-clamp-2">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
