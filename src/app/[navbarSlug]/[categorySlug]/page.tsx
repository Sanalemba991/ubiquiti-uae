import { notFound } from 'next/navigation';
import CategoryPageClient from './CategoryPageClient';

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

async function getCategories(navbarSlug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(
      `${baseUrl}/api/category/by-navbar/${navbarSlug}`,
      { 
        cache: 'no-store',
        // Add timeout for Vercel
        next: { revalidate: 0 }
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
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const res = await fetch(
      `${baseUrl}/api/subcategory/by-category/${categorySlug}`,
      { 
        cache: 'no-store',
        next: { revalidate: 0 }
      }
    );
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return null;
  }
}

export default async function CategoryPage({
  params,
}: {
  params: { navbarSlug: string; categorySlug: string };
}) {
  const { navbarSlug, categorySlug } = params;

  try {
    // Fetch data in parallel on the server
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

    // Pass data to client component
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
  } catch (error) {
    console.error('Error in CategoryPage:', error);
    notFound();
  }
}