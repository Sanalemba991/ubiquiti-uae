import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import CategoryPageClient from './CategoryPageClient';
import { generateCategoryMetadata } from '@/utils/seo';

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

type Props = {
  params: Promise<{ navbarSlug: string; categorySlug: string }>;
};

// Add this for production builds
export const dynamicParams = true;

async function getCategories(navbarSlug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  
  if (!apiUrl) {
    console.error('NEXT_PUBLIC_API_URL is not defined');
    return null;
  }
  
  try {
    const res = await fetch(
      `${apiUrl}/api/category/by-navbar/${navbarSlug}`,
      { 
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return null;
  }
}

async function getSubCategories(categorySlug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  
  if (!apiUrl) {
    console.error('NEXT_PUBLIC_API_URL is not defined');
    return null;
  }
  
  try {
    const res = await fetch(
      `${apiUrl}/api/subcategory/by-category/${categorySlug}`,
      { 
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return null;
  }
}

// Optional: Pre-generate static params for better performance
export async function generateStaticParams() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) return [];
  
  try {
    // Fetch all your navbar/category combinations here
    // This is optional but improves performance
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { navbarSlug, categorySlug } = await params;
  const categoriesResult = await getCategories(navbarSlug);

  if (!categoriesResult?.success) {
    return {
      title: 'Category Not Found | Ubiquiti UAE',
      description: 'The category you are looking for does not exist.',
    };
  }

  const categories: Category[] = categoriesResult.data || [];
  const currentCategory = categories.find(cat => cat.slug === categorySlug);

  if (!currentCategory) {
    return {
      title: 'Category Not Found | Ubiquiti UAE',
      description: 'The category you are looking for does not exist.',
    };
  }

  return generateCategoryMetadata(
    navbarSlug,
    categorySlug,
    currentCategory.name,
    currentCategory.description,
    currentCategory.image
  );
}

export default async function CategoryPage({ params }: Props) {
  const { navbarSlug, categorySlug } = await params;

  const [categoriesResult, subCategoriesResult] = await Promise.all([
    getCategories(navbarSlug),
    getSubCategories(categorySlug),
  ]);

  if (!categoriesResult?.success) {
    notFound();
  }

  const categories: Category[] = categoriesResult.data || [];
  const navbarCategory: NavbarCategory | null = categoriesResult.navbarCategory || null;
  const subCategories: SubCategory[] = subCategoriesResult?.success ? subCategoriesResult.data : [];

  const currentCategory = categories.find(cat => cat.slug === categorySlug);

  if (!currentCategory) {
    notFound();
  }

  return (
    <CategoryPageClient
      currentCategory={currentCategory}
      categories={categories}
      subCategories={subCategories}
      navbarCategory={navbarCategory}
      navbarSlug={navbarSlug}
      categorySlug={categorySlug}
    />
  );
}