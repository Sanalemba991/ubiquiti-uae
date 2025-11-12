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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/category/by-navbar/${navbarSlug}`,
    { cache: 'no-store' }
  );
  
  if (!res.ok) return null;
  return res.json();
}

async function getSubCategories(categorySlug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/subcategory/by-category/${categorySlug}`,
    { cache: 'no-store' }
  );
  
  if (!res.ok) return null;
  return res.json();
}

export default async function CategoryPage({
  params,
}: {
  params: { navbarSlug: string; categorySlug: string };
}) {
  const { navbarSlug, categorySlug } = params;

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
}