'use client';
import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, MapPin, Mail, Phone } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  category: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  subCategories?: SubCategory[];
}

export default function UniFiNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch categories and subcategories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingCategories(true);
        
        // Fetch categories and subcategories in parallel
        const [categoriesRes, subCategoriesRes] = await Promise.all([
          fetch('/api/category'),
          fetch('/api/subcategory')
        ]);
        
        const categoriesResult = await categoriesRes.json();
        const subCategoriesResult = await subCategoriesRes.json();
        
        if (categoriesResult.success && categoriesResult.data) {
          const cats = categoriesResult.data;
          
          // Get subcategories
          const subCats = subCategoriesResult.success ? subCategoriesResult.data : [];
          
          // Group subcategories by category
          const catsWithSubCategories = cats.map((cat: Category) => ({
            ...cat,
            subCategories: subCats.filter((subCat: any) => 
              subCat.category?._id === cat._id || 
              subCat.category === cat._id
            )
          }));
          
          setCategories(catsWithSubCategories);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchData();
  }, []);

  const shouldShowWhiteBg = isScrolled || isHovered || isMobileMenuOpen;

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  const handleActionClick = (type: string) => {
    switch (type) {
      case 'location':
        window.open('https://maps.google.com', '_blank');
        break;
      case 'email':
        window.location.href = 'mailto:info@unifi.com';
        break;
      case 'call':
        window.location.href = 'tel:+96050 966 4956';
        break;
      default:
        break;
    }
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Check if a category page is active
  const isCategoryActive = (catSlug: string) => {
    return pathname.startsWith(`/${catSlug}`);
  };

  const actionItems = [
    { icon: MapPin, label: 'Location', type: 'location' },
    { icon: Mail, label: 'Email', type: 'email' },
    { icon: Phone, label: 'Call', type: 'call' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${shouldShowWhiteBg ? 'bg-white shadow-md' : 'bg-transparent'
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left Section - Logo and Nav Items */}
            <div className="flex items-center space-x-10">
              {/* Logo */}
              <div className="flex items-center">
                <button
                  onClick={() => handleNavigation('/')}
                  className={`text-xl font-bold transition-colors cursor-pointer ${shouldShowWhiteBg ? 'text-gray-900' : 'text-white'
                    }`}
                >
                 Ubiquiti
                </button>
              </div>
              {/* Desktop Navigation Items */}
              <div className="hidden lg:flex items-center space-x-1">
                {/* Home Link */}
                <button
                  onClick={() => handleNavigation('/')}
                  className={`text-sm font-medium transition-colors cursor-pointer rounded-lg px-4 py-2 mx-1 ${shouldShowWhiteBg
                    ? isActivePath('/')
                      ? 'bg-gray-100 text-gray-600'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    : isActivePath('/')
                      ? 'bg-gray-200/20 text-white'
                      : 'text-white hover:text-gray-200 hover:bg-white/10'
                    }`}
                >
                  Home
                </button>

                {/* Categories with Dropdowns */}
                {categories.map((cat) => (
                  <div 
                    key={cat._id} 
                    className="relative group"
                    onMouseEnter={() => setOpenDropdown(cat._id)}
                    onMouseLeave={() => {
                      setOpenDropdown(null);
                    }}
                  >
                    <button
                      onClick={() => {
                        if (cat.subCategories && cat.subCategories.length > 0) {
                          setOpenDropdown(openDropdown === cat._id ? null : cat._id);
                        } else {
                          handleNavigation(`/${cat.slug}`);
                        }
                      }}
                      className={`text-sm font-medium transition-colors cursor-pointer rounded-lg px-4 py-2 mx-1 flex items-center space-x-1 ${shouldShowWhiteBg
                        ? (isCategoryActive(cat.slug) || openDropdown === cat._id)
                          ? 'bg-gray-100 text-blue-600'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                        : (isCategoryActive(cat.slug) || openDropdown === cat._id)
                          ? 'bg-gray-200/20 text-blue-400'
                          : 'text-white hover:text-blue-400 hover:bg-white/10'
                        }`}
                    >
                      <span>{cat.name}</span>
                    </button>

                    {/* Dropdown Menu - Full width, grid cards (no borders, larger images) */}
                    {cat.subCategories && cat.subCategories.length > 0 && openDropdown === cat._id && (
                      <div
                        className="fixed left-0 right-0 top-14 z-50 bg-white shadow-xl"
                        onMouseEnter={() => setOpenDropdown(cat._id)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <div className="w-full">
                          <div className="max-w-7xl mx-auto px-6 py-2">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                              {cat.subCategories.map((subCat) => (
                                <button
                                  key={subCat._id}
                                  onClick={() => {
                                    handleNavigation(`/${cat.slug}/${subCat.slug}`);
                                    setOpenDropdown(null);
                                  }}
                                  className="flex flex-col items-center text-center p-4 bg-white rounded-l hover:shadow-md transition-all duration-150 cursor-pointer group/subcategory"
                                >
                                  <div className=" bg-transparent overflow-hidden flex items-center justify-center">
                                    {subCat.image ? (
                                      <img
                                        src={subCat.image}
                                        alt={subCat.name}
                                        className="w-full h-full object-contain"
                                      />
                                    ) : (
                                      <div className="text-gray-400 text-xs">No Image</div>
                                    )}
                                  </div>

                                 <h4 className="text-sm font-semibold text-gray-900 group-hover/subcategory:text-blue-600 transition-colors">
                                    {subCat.name}
                                  </h4>

                                  {subCat.description && (
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-3">
                                      {subCat.description}
                                    </p>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Right Section - Action Icons */}
            <div className="flex items-center space-x-6">
              {/* Action Icons */}
              <div className="hidden md:flex items-center space-x-5">
                {actionItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => handleActionClick(item.type)}
                      className={`p-2 transition-all duration-200 cursor-pointer rounded-lg ${shouldShowWhiteBg
                        ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        : 'text-white hover:text-blue-400 hover:bg-blue-500/10'
                        }`}
                      title={item.label}
                    >
                      <IconComponent className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
              {/* Mobile Menu Button */}
              <button
                className={`md:hidden p-2 transition-colors rounded-lg cursor-pointer ${shouldShowWhiteBg
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
                  }`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          {/* Mobile Menu */}
          <div
            className={`lg:hidden transition-all duration-300 overflow-y-auto ${isMobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            <div className="py-4 border-t border-gray-200">
              {/* Home */}
              <div className="border-b border-gray-100">
                <button
                  onClick={() => handleNavigation('/')}
                  className={`block w-full text-left py-3 font-medium transition-colors cursor-pointer rounded-lg mx-2 my-1 px-3 ${isActivePath('/')
                    ? 'bg-gray-50 text-gray-600 border border-gray-200'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  Home
                </button>
              </div>

              {/* Categories */}
              {categories.map((cat) => (
                <div key={cat._id} className="border-b border-gray-100 last:border-b-0">
                  <div className="flex flex-col">
                    <button
                      onClick={() => {
                        if (cat.subCategories && cat.subCategories.length > 0) {
                          setOpenDropdown(openDropdown === cat._id ? null : cat._id);
                        } else {
                          handleNavigation(`/${cat.slug}`);
                        }
                      }}
                      className={`flex items-center justify-between w-full text-left py-3 font-medium transition-colors cursor-pointer rounded-lg mx-2 my-1 px-3 ${isCategoryActive(cat.slug)
                        ? 'bg-gray-50 text-gray-600 border border-gray-200'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                      <span>{cat.name}</span>
                      {cat.subCategories && cat.subCategories.length > 0 && (
                        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === cat._id ? 'rotate-180' : ''}`} />
                      )}
                    </button>

                    {/* Mobile Dropdown */}
                    {cat.subCategories && cat.subCategories.length > 0 && openDropdown === cat._id && (
                      <div className="ml-4 pb-2">
                        {/* Category Overview in Mobile */}
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex flex-col items-center text-center">
                            {cat.image && (
                              <div className="w-24 h-24 bg-white rounded-lg overflow-hidden mb-3">
                                <img 
                                  src={cat.image} 
                                  alt={cat.name}
                                  className="w-full h-full object-contain p-2"
                                />
                              </div>
                            )}
                            <h3 className="font-bold text-base text-gray-900 mb-1">{cat.name}</h3>
                            {cat.description && (
                              <p className="text-xs text-gray-600">
                                {cat.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Subcategories */}
                        {cat.subCategories.map((subCat) => (
                          <div key={subCat._id} className="mb-3">
                            <button
                              onClick={() => {
                                handleNavigation(`/${cat.slug}/${subCat.slug}`);
                                setOpenDropdown(null);
                              }}
                              className="block w-full text-left"
                            >
                              <div className="p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                                <div className="flex items-center space-x-3">
                                  {subCat.image && (
                                    <div className="w-12 h-12 bg-gray-50 rounded overflow-hidden flex-shrink-0">
                                      <img 
                                        src={subCat.image} 
                                        alt={subCat.name}
                                        className="w-full h-full object-contain p-1"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm text-gray-900 mb-0.5">
                                      {subCat.name}
                                    </h4>
                                    {subCat.description && (
                                      <p className="text-xs text-gray-500 line-clamp-2">
                                        {subCat.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Mobile Action Items */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4 py-3 px-2">
                  {actionItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleActionClick(item.type)}
                        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                      >
                        <IconComponent className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}