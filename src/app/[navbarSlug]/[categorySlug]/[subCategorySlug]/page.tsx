'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaHome } from 'react-icons/fa';

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  category: {
    _id: string;
    name: string;
    slug: string;
    navbarCategory: {
      _id: string;
      name: string;
      slug: string;
    };
  };
}

export default function SubCategoryPage() {
  const params = useParams();
  const navbarSlug = params.navbarSlug as string;
  const categorySlug = params.categorySlug as string;
  const subCategorySlug = params.subCategorySlug as string;

  const [subCategory, setSubCategory] = useState<SubCategory | null>(null);
  const [allSubCategories, setAllSubCategories] = useState<SubCategory[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch subcategories and products in parallel
        const [subCategoriesRes, productsRes] = await Promise.all([
          fetch(`/api/subcategory/by-category/${categorySlug}`),
          fetch(`/api/product/by-subcategory/${subCategorySlug}`)
        ]);

        const subCategoriesResult = await subCategoriesRes.json();
        const productsResult = await productsRes.json();

        if (subCategoriesResult.success) {
          setAllSubCategories(subCategoriesResult.data);
          
          // Find the current subcategory
          const current = subCategoriesResult.data.find((sub: SubCategory) => sub.slug === subCategorySlug);
          setSubCategory(current || null);
        }

        if (productsResult.success) {
          setProducts(productsResult.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categorySlug && subCategorySlug) {
      fetchData();
    }
  }, [categorySlug, subCategorySlug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!subCategory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Sub-Category Not Found</h1>
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
        {subCategory.image ? (
          <Image
            src={subCategory.image}
            alt={subCategory.name}
            fill
            className="object-cover opacity-40"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-16">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
            <Link href="/" className="hover:text-purple-400 transition-colors flex items-center">
              <FaHome className="mr-1" />
              Home
            </Link>
            <span>/</span>
            <Link 
              href={`/${navbarSlug}`}
              className="hover:text-purple-400 transition-colors"
            >
              {subCategory.category.navbarCategory.name}
            </Link>
            <span>/</span>
            <Link 
              href={`/${navbarSlug}/${categorySlug}`}
              className="hover:text-purple-400 transition-colors"
            >
              {subCategory.category.name}
            </Link>
            <span>/</span>
            <span className="text-white">{subCategory.name}</span>
          </div>

          <Link
            href={`/${navbarSlug}/${categorySlug}`}
            className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors"
          >
            <FaArrowLeft />
            <span>Back to {subCategory.category.name}</span>
          </Link>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {subCategory.name}
          </h1>
          
          {subCategory.description && (
            <p className="text-xl text-slate-300 max-w-3xl">
              {subCategory.description}
            </p>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">
            About {subCategory.name}
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed mb-8">
            This is the sub-category page for {subCategory.name}. 
            {subCategory.description && ` ${subCategory.description}`}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-slate-950/50 rounded-xl border border-slate-800">
            <div>
              <p className="text-slate-400 text-sm mb-2">Category Path</p>
              <p className="text-white font-medium">
                {subCategory.category.navbarCategory.name} → {subCategory.category.name}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Sub-Category</p>
              <p className="text-white font-medium">{subCategory.name}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm mb-2">URL</p>
              <p className="text-purple-400 text-sm break-all">
                /{navbarSlug}/{categorySlug}/{subCategory.slug}
              </p>
            </div>
          </div>

        </div>

        {/* Products Section */}
        {products.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">
              Products in {subCategory.name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <Link
                  key={product._id}
                  href={`/${navbarSlug}/${categorySlug}/${subCategorySlug}/${product.slug}`}
                  className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
                >
                  <div className="relative h-64 bg-slate-950">
                    <Image
                      src={product.image1}
                      alt={product.name}
                      fill
                      className="object-contain p-6 opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other Sub-Categories */}
        {allSubCategories.length > 1 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">
              Other Sub-Categories in {subCategory.category.name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allSubCategories
                .filter(sub => sub._id !== subCategory._id)
                .map((sub) => (
                  <Link
                    key={sub._id}
                    href={`/${navbarSlug}/${categorySlug}/${sub.slug}`}
                    className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
                  >
                    <div className="relative h-48 bg-slate-950">
                      {sub.image ? (
                        <Image
                          src={sub.image}
                          alt={sub.name}
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
                        {sub.name}
                      </h3>
                      {sub.description && (
                        <p className="text-slate-400 text-sm line-clamp-2">
                          {sub.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href={`/${navbarSlug}/${categorySlug}`}
            className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  Browse {subCategory.category.name}
                </h3>
                <p className="text-slate-400 text-sm">
                  View all products in this category
                </p>
              </div>
              <div className="text-3xl group-hover:scale-110 transition-transform">
                📦
              </div>
            </div>
          </Link>

          <Link
            href={`/${navbarSlug}`}
            className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  Explore {subCategory.category.navbarCategory.name}
                </h3>
                <p className="text-slate-400 text-sm">
                  Discover more categories
                </p>
              </div>
              <div className="text-3xl group-hover:scale-110 transition-transform">
                🔍
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
