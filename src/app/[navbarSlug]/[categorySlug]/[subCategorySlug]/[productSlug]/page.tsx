'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaHome, FaCheckCircle, FaEnvelope, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  keyFeatures: string[];
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;
  navbarCategory: {
    _id: string;
    name: string;
    slug: string;
  };
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
  subcategory?: {
    _id: string;
    name: string;
    slug: string;
    category: {
      _id: string;
      name: string;
      slug: string;
    };
  };
}

export default function ProductPage() {
  const params = useParams();
  const navbarSlug = params.navbarSlug as string;
  const categorySlug = params.categorySlug as string;
  const subCategorySlug = params.subCategorySlug as string;
  const productSlug = params.productSlug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({
    name: '',
    email: '',
    mobile: '',
    description: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch product by slug
        const productRes = await fetch(`/api/product/by-slug/${productSlug}`);
        const productResult = await productRes.json();

        if (productResult.success) {
          setProduct(productResult.data);
          
          // Fetch related products (same subcategory or category)
          const relatedQuery = productResult.data.subcategory 
            ? `subcategory=${productResult.data.subcategory._id}`
            : `category=${productResult.data.category._id}`;
          
          const relatedRes = await fetch(`/api/product?${relatedQuery}`);
          const relatedResult = await relatedRes.json();
          
          if (relatedResult.success) {
            // Filter out current product
            const filtered = relatedResult.data.filter((p: Product) => p._id !== productResult.data._id);
            setRelatedProducts(filtered.slice(0, 3)); // Show only 3 related products
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productSlug) {
      fetchData();
    }
  }, [productSlug]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!product) return;

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Product Not Found</h1>
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const images = [product.image1, product.image2, product.image3, product.image4].filter((img): img is string => Boolean(img));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <Link href="/" className="hover:text-purple-400 transition-colors flex items-center">
            <FaHome className="mr-1" />
            Home
          </Link>
          <span>/</span>
          <Link 
            href={`/${navbarSlug}`}
            className="hover:text-purple-400 transition-colors"
          >
            {product.navbarCategory.name}
          </Link>
          <span>/</span>
          <Link 
            href={`/${navbarSlug}/${categorySlug}`}
            className="hover:text-purple-400 transition-colors"
          >
            {product.category.name}
          </Link>
          {product.subcategory && (
            <>
              <span>/</span>
              <Link 
                href={`/${navbarSlug}/${categorySlug}/${subCategorySlug}`}
                className="hover:text-purple-400 transition-colors"
              >
                {product.subcategory.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-[500px] bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-8"
              />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-24 bg-slate-900/60 backdrop-blur-sm border rounded-lg overflow-hidden transition-all ${
                      selectedImage === index 
                        ? 'border-purple-500 ring-2 ring-purple-500/50' 
                        : 'border-slate-800/50 hover:border-purple-500/50'
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
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {product.name}
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Category Information */}
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-medium border border-purple-500/30">
                {product.navbarCategory.name}
              </span>
              <span className="px-4 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg text-sm font-medium border border-indigo-500/30">
                {product.category.name}
              </span>
              {product.subcategory && (
                <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium border border-blue-500/30">
                  {product.subcategory.name}
                </span>
              )}
            </div>

            {/* Key Features */}
            {product.keyFeatures && product.keyFeatures.length > 0 && (
              <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Key Features</h2>
                <ul className="space-y-3">
                  {product.keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contact Us Button */}
            <button
              onClick={() => setIsEnquiryModalOpen(true)}
              className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 shadow-lg shadow-purple-500/30 font-semibold text-lg"
            >
              <FaEnvelope />
              <span>Contact Us About This Product</span>
            </button>

            {/* Back Button */}
            <Link
              href={product.subcategory 
                ? `/${navbarSlug}/${categorySlug}/${subCategorySlug}`
                : `/${navbarSlug}/${categorySlug}`
              }
              className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <FaArrowLeft />
              <span>Back to {product.subcategory?.name || product.category.name}</span>
            </Link>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-white mb-8">
              Related Products
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  href={relatedProduct.subcategory
                    ? `/${relatedProduct.navbarCategory.slug}/${relatedProduct.category.slug}/${relatedProduct.subcategory.slug}/${relatedProduct.slug}`
                    : `/${relatedProduct.navbarCategory.slug}/${relatedProduct.category.slug}/${relatedProduct.slug}`
                  }
                  className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 group"
                >
                  <div className="relative h-64 bg-slate-950">
                    <Image
                      src={relatedProduct.image1}
                      alt={relatedProduct.name}
                      fill
                      className="object-contain p-6 opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {relatedProduct.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Modal */}
      {isEnquiryModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-800">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Product Enquiry</h2>
              <button 
                onClick={() => setIsEnquiryModalOpen(false)} 
                className="text-slate-400 hover:text-white transition"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEnquirySubmit} className="p-6 space-y-6">
              {/* Product Name (Read-only) */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  value={product?.name || ''}
                  readOnly
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 cursor-not-allowed"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={enquiryForm.name}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={enquiryForm.email}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Mobile <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={enquiryForm.mobile}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, mobile: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={enquiryForm.description}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEnquiryModalOpen(false)}
                  className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
