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

interface NavbarCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  categories?: Category[];
}

export default function UniFiNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allSubCategories, setAllSubCategories] = useState<SubCategory[]>([]);
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

  // Fetch navbar categories, categories, and subcategories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingCategories(true);
        
        // Fetch all data in parallel
        const [navbarRes, categoriesRes, subCategoriesRes] = await Promise.all([
          fetch('/api/navbar-category'),
          fetch('/api/category'),
          fetch('/api/subcategory')
        ]);
        
        const navbarResult = await navbarRes.json();
        const categoriesResult = await categoriesRes.json();
        const subCategoriesResult = await subCategoriesRes.json();
        
        if (navbarResult.success && navbarResult.data) {
          const navbarCats = navbarResult.data;
          
          if (categoriesResult.success && categoriesResult.data) {
            const cats = categoriesResult.data;
            setAllCategories(cats);
            
            // Get subcategories
            const subCats = subCategoriesResult.success ? subCategoriesResult.data : [];
            setAllSubCategories(subCats);
            
            // Group subcategories by category
            const catsWithSubCategories = cats.map((cat: Category) => ({
              ...cat,
              subCategories: subCats.filter((subCat: any) => 
                subCat.category?._id === cat._id || 
                subCat.category === cat._id
              )
            }));
            
            // Group categories by navbar category
            const navbarCatsWithCategories = navbarCats.map((navCat: NavbarCategory) => ({
              ...navCat,
              categories: catsWithSubCategories.filter((cat: Category) => 
                (cat as any).navbarCategory?._id === navCat._id || 
                (cat as any).navbarCategory === navCat._id
              )
            }));
            
            setNavbarCategories(navbarCatsWithCategories);
          } else {
            setNavbarCategories(navbarCats);
          }
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
        window.location.href = 'tel:+96050 966 4956';
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
  const isCategoryActive = (navCatSlug: string) => {
    return pathname.startsWith(`/${navCatSlug}`);
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
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo and Nav Items */}
            <div className="flex items-center space-x-10">
              {/* Logo */}
              <div className="flex items-center">
                <button
                  onClick={() => handleNavigation('/')}
                  className={`text-2xl font-bold transition-colors cursor-pointer ${shouldShowWhiteBg ? 'text-gray-900' : 'text-white'
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

                {/* Navbar Categories with Dropdowns */}
                {navbarCategories.map((navCat) => (
                  <div 
                    key={navCat._id} 
                    className="relative group"
                    onMouseEnter={() => setOpenDropdown(navCat._id)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      onClick={() => {
                        if (navCat.categories && navCat.categories.length > 0) {
                          setOpenDropdown(openDropdown === navCat._id ? null : navCat._id);
                        } else {
                          handleNavigation(`/${navCat.slug}`);
                        }
                      }}
                      className={`text-sm font-medium transition-colors cursor-pointer rounded-lg px-4 py-2 mx-1 flex items-center space-x-1 ${shouldShowWhiteBg
                        ? isCategoryActive(navCat.slug)
                          ? 'bg-gray-100 text-gray-600'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        : isCategoryActive(navCat.slug)
                          ? 'bg-gray-200/20 text-white'
                          : 'text-white hover:text-gray-200 hover:bg-white/10'
                        }`}
                    >
                      <span>{navCat.name}</span>
                      {navCat.categories && navCat.categories.length > 0 && (
                        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === navCat._id ? 'rotate-180' : ''}`} />
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    {navCat.categories && navCat.categories.length > 0 && openDropdown === navCat._id && (
                      <div className="absolute top-full left-0 mt-2 w-72 bg-white shadow-xl rounded-lg border border-gray-200 py-2 z-50">
                        {navCat.categories.map((cat) => (
                          <div key={cat._id} className="relative group/cat">
                            <button
                              onClick={() => {
                                handleNavigation(`/${navCat.slug}/${cat.slug}`);
                                setOpenDropdown(null);
                              }}
                              className="flex items-center justify-between w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <div className="flex-1">
                                <div className="font-medium">{cat.name}</div>
                                {cat.description && (
                                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                    {cat.description}
                                  </div>
                                )}
                              </div>
                              {cat.subCategories && cat.subCategories.length > 0 && (
                                <ChevronDown className="w-4 h-4 -rotate-90" />
                              )}
                            </button>
                            
                            {/* Subcategories Nested Dropdown */}
                            {cat.subCategories && cat.subCategories.length > 0 && (
                              <div className="hidden group-hover/cat:block absolute left-full top-0 ml-1 w-64 bg-white shadow-xl rounded-lg border border-gray-200 py-2 z-50">
                                {cat.subCategories.map((subCat) => (
                                  <button
                                    key={subCat._id}
                                    onClick={() => {
                                      handleNavigation(`/${navCat.slug}/${cat.slug}/${subCat.slug}`);
                                      setOpenDropdown(null);
                                    }}
                                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                  >
                                    <div className="font-medium">{subCat.name}</div>
                                    {subCat.description && (
                                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                        {subCat.description}
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
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
                        ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        : 'text-white hover:text-gray-200 hover:bg-white/10'
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

              {/* Navbar Categories */}
              {navbarCategories.map((navCat) => (
                <div key={navCat._id} className="border-b border-gray-100 last:border-b-0">
                  <div className="flex flex-col">
                    <button
                      onClick={() => {
                        if (navCat.categories && navCat.categories.length > 0) {
                          setOpenDropdown(openDropdown === navCat._id ? null : navCat._id);
                        } else {
                          handleNavigation(`/${navCat.slug}`);
                        }
                      }}
                      className={`flex items-center justify-between w-full text-left py-3 font-medium transition-colors cursor-pointer rounded-lg mx-2 my-1 px-3 ${isCategoryActive(navCat.slug)
                        ? 'bg-gray-50 text-gray-600 border border-gray-200'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                      <span>{navCat.name}</span>
                      {navCat.categories && navCat.categories.length > 0 && (
                        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === navCat._id ? 'rotate-180' : ''}`} />
                      )}
                    </button>

                    {/* Mobile Dropdown */}
                    {navCat.categories && navCat.categories.length > 0 && openDropdown === navCat._id && (
                      <div className="ml-4 pb-2">
                        {navCat.categories.map((cat) => (
                          <div key={cat._id}>
                            <button
                              onClick={() => {
                                handleNavigation(`/${navCat.slug}/${cat.slug}`);
                                setOpenDropdown(null);
                              }}
                              className="block w-full text-left py-2 px-4 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                            >
                              {cat.name}
                            </button>
                            
                            {/* Mobile Subcategories */}
                            {cat.subCategories && cat.subCategories.length > 0 && (
                              <div className="ml-4 mt-1 mb-2 space-y-1">
                                {cat.subCategories.map((subCat) => (
                                  <button
                                    key={subCat._id}
                                    onClick={() => {
                                      handleNavigation(`/${navCat.slug}/${cat.slug}/${subCat.slug}`);
                                      setOpenDropdown(null);
                                    }}
                                    className="block w-full text-left py-1.5 px-4 text-xs text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                                  >
                                    → {subCat.name}
                                  </button>
                                ))}
                              </div>
                            )}
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