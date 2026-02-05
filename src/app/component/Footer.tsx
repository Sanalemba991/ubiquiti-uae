"use client";
import Logo from "../../../public/logoua.png";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FaInstagram, FaWhatsapp, FaFacebook } from "react-icons/fa";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  images: string[];
  categoryId: string;
  subCategoryId: string;
  sku: string;
  stock: number;
  isActive: boolean;
  features: string[];
  specifications: Record<string, string>;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  category: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  navbarCategory?: any;
  subCategories?: SubCategory[];
}

interface NavbarCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  categories?: any[];
}

export default function Footer() {
  const [featublueProducts, setFeatublueProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for categories data from previous footer
  const [categories, setCategories] = useState<Category[]>([]);
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>(
    []
  );
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch featublue products
  useEffect(() => {
    async function fetchFeatublueProducts() {
      try {
        setLoading(true);
        setError(null);

        const apiBase = (process.env.NEXT_PUBLIC_API_URL || "").replace(
          /\/$/,
          ""
        );
        const endpoint = apiBase
          ? `${apiBase}/api/products?featublue=true&limit=4`
          : "/api/products?featublue=true&limit=4";

        const res = await fetch(endpoint, {
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch products: ${res.status}`);
        }

        const data = await res.json();

        if (data.success) {
          const activeProducts = data.data
            .filter((product: Product) => product.isActive)
            .slice(0, 4);
          setFeatublueProducts(activeProducts);
        } else {
          throw new Error("Failed to load products");
        }
      } catch (error) {
        console.error("Error fetching featublue products:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load products"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchFeatublueProducts();
  }, []);

  // Fetch categories from previous footer
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingCategories(true);

        const [navbarRes, categoriesRes, subCategoriesRes] = await Promise.all([
          fetch("/api/navbar-category"),
          fetch("/api/category"),
          fetch("/api/subcategory"),
        ]);

        const navbarResult = await navbarRes
          .json()
          .catch(() => ({ success: false, data: [] }));
        const categoriesResult = await categoriesRes
          .json()
          .catch(() => ({ success: false, data: [] }));
        const subCategoriesResult = await subCategoriesRes
          .json()
          .catch(() => ({ success: false, data: [] }));

        const navbarCats =
          navbarResult.success && navbarResult.data ? navbarResult.data : [];
        setNavbarCategories(navbarCats);

        if (categoriesResult.success && categoriesResult.data) {
          const cats: Category[] = categoriesResult.data;
          const subCats: SubCategory[] =
            subCategoriesResult.success && subCategoriesResult.data
              ? subCategoriesResult.data
              : [];

          const catsWithSub = cats.map((cat) => ({
            ...cat,
            subCategories: subCats.filter(
              (sub) =>
                (typeof sub.category === "object" &&
                  sub.category !== null &&
                  (sub.category as any).id === cat.id) ||
                sub.category === cat.id ||
                sub.category === cat.slug
            ),
          }));

          setCategories(catsWithSub);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching footer categories:", error);
        setCategories([]);
        setNavbarCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

  const findNavbarSlugForCategory = (cat: Category): string | null => {
    if ((cat as any).navbarCategory) {
      const nc = (cat as any).navbarCategory;
      if (typeof nc === "string") {
        const found = navbarCategories.find(
          (n) => n.id === nc || n.id === (nc as any)?.id
        );
        return found ? found.slug : null;
      } else if (typeof nc === "object" && nc.slug) {
        return nc.slug;
      }
    }

    const foundNav = navbarCategories.find((nav) => {
      if (!nav.categories) return false;
      return nav.categories.some(
        (c: any) =>
          c === cat.id ||
          c === cat.slug ||
          (c && (c.id === cat.id || c.slug === cat.slug))
      );
    });
    if (foundNav) return foundNav.slug;

    return null;
  };

  const buildCategoryHref = (cat: Category) => {
    const parent = findNavbarSlugForCategory(cat);
    return parent ? `/${parent}/${cat.slug}` : `/${cat.slug}`;
  };

  return (
    <footer className="bg-gray-300 text-white">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Company Info - Column 1 */}
          <div className="animate-slideUp">
            <div className="flex items-center mb-3">
              <div className="border-gray-400 pl-2 flex items-center">
                <Image src={Logo} alt="Ubiquiti UAE" width={250} height={40} />
              </div>
            </div>
            <p className="text-gray-600 text-xs leading-relaxed mb-3 max-w-xs">
              Ubiquiti UAE is the largest distributor of all kind of Ubiquiti
              products in the surveillance market of Dubai UAE & Middle East.
              Follow us on social media to get to know about our latest product
              line.
            </p>

            {/* Social Media Links - Added here */}
            <div className="flex gap-4 mt-4">
              {/* Instagram */}
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200"
                aria-label="Visit our Instagram"
              >
                {/* Replace with your Instagram logo image or use react-icons */}
                <FaInstagram className="w-6 h-6 text-pink-600" />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/+971050 966 4956"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200"
                aria-label="Contact us on WhatsApp"
              >
                <FaWhatsapp className="w-6 h-6 text-green-500" />
              </a>

              {/* Facebook */}
              <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200"
                aria-label="Visit our Facebook page"
              >
                <FaFacebook className="w-6 h-6 text-blue-600" />
              </a>
            </div>
          </div>

          {/* Quick Links - Column 2 */}
          <div className="animate-slideUp animation-delay-200">
            <h3 className="text-sm font-semibold text-black mb-3">
              Quick Links
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-blue-500 text-xs font-bold">•</span>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-400 transition-all duration-200 text-xs hover:translate-x-1"
                >
                  Home
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500 text-xs font-bold">•</span>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-blue-400 transition-all duration-200 text-xs hover:translate-x-1"
                >
                  About Us
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500 text-xs font-bold">•</span>
                <Link
                  href="/solution"
                  className="text-gray-600 hover:text-blue-400 transition-all duration-200 text-xs hover:translate-x-1"
                >
                  Solutions
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500 text-xs font-bold">•</span>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-blue-400 transition-all duration-200 text-xs hover:translate-x-1"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          {/* Categories (Previously Featublue Products) - Column 3 */}
          <div className="animate-slideUp animation-delay-400">
            <h3 className="text-sm font-semibold text-black mb-3">Products</h3>
            <div className="space-y-2">
              {isLoadingCategories ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 animate-pulse"
                  >
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    <div className="h-3 bg-gray-600 rounded w-32"></div>
                  </div>
                ))
              ) : categories.length > 0 ? (
                categories.slice(0, 6).map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2 group"
                  >
                    <span className="text-blue-500 text-xs font-bold transition-transform duration-200">
                      •
                    </span>
                    <Link
                      href={buildCategoryHref(category)}
                      className="text-gray-600 hover:text-blue-400 transition-all duration-200 text-xs hover:translate-x-1 line-clamp-1"
                      title={category.name}
                    >
                      {category.name}
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-gray-600 text-xs flex items-center space-x-2">
                  <span>📦</span>
                  <span>No categories found</span>
                </div>
              )}
            </div>

            {/* View All Categories Link */}
          </div>

          {/* Get In Touch - Column 4 */}
          <div className="animate-slideUp animation-delay-600">
            <h3 className="text-sm font-semibold text-black mb-3">
              Get In Touch
            </h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 group">
                <span className="text-blue-500 font-bold text-xs transition-transform duration-200 group-hover:scale-110">
                  ✉
                </span>
                <Link
                  href="mailto:sales@ubiquiti-uae.com "
                  className="text-gray-600 hover:text-blue-400 transition-all duration-200 text-xs hover:translate-x-1"
                >
                  sales@ubiquiti-uae.com 
                </Link>
              </div>
              <div className="flex items-center space-x-2 group">
                <span className="text-blue-500 font-bold text-xs transition-transform duration-200 group-hover:scale-110">
                  📞
                </span>
                <Link
                  href="tel:+971050 966 4956"
                  className="text-gray-600 hover:text-blue-400 transition-all duration-200 text-xs hover:translate-x-1"
                >
                  +971050 966 4956
                </Link>
              </div>
              <div className="flex items-center space-x-2 group">
                <span className="text-blue-500 font-bold text-xs transition-transform duration-200 group-hover:scale-110">
                  🏢
                </span>
                <span className="text-gray-600 text-xs">
                  Office: 9AM - 6PM (GMT+4)
                </span>
              </div>
            </div>

            {/* Emergency Support */}
          </div>

          {/* Our Location - Column 5 */}
          <div className="animate-slideUp animation-delay-800">
            <h3 className="text-sm font-semibold text-black mb-3">
              Our Location
            </h3>
            <p className="text-gray-600 text-xs mb-3 leading-relaxed">
              Visit us at our Dubai office for all your surveillance and
              security needs.
            </p>
            <div className="h-24 bg-gray-700 rounded-lg overflow-hidden shadow-lg mb-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d185.85699190367959!2d55.30896546588453!3d25.27341693672885!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d48ffab5a65%3A0x8c2898929d4589f7!2sLovosis%20Technology%20L.L.C!5e1!3m2!1sen!2sin!4v1764833527855!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Dubai Office Location"
              />
            </div>
            <div className="flex items-center space-x-2 text-gray-600  text-xs">
              <span>📍</span>
              <span>Lovosis Technology L.L.C</span>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
      </div>

      {/* Bottom section - Copyright and Poweblue By centeblue vertically */}
      <div className="relative bg-gray-300 animate-fadeIn overflow-hidden">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col items-center justify-center text-center space-y-1">
            {/* Your content */}
            <p className="text-gray-600 text-xs">
              © 2025 Ubiquiti UAE. All rights reserved.
            </p>
          </div>
        </div>

        {/* Partial top border with gradient or limited width */}
        <div className="absolute top-0 left-1/9 right-1/9 h-px bg-gray-400"></div>
      </div>

      {/* Enhanced Animations */}
      <style jsx>{`
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        .animation-delay-800 {
          animation-delay: 0.8s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Line clamp utility for category names */
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </footer>
  );
}
