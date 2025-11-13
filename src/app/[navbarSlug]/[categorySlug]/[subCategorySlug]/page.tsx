import { notFound } from 'next/navigation';
import SubCategoryClient from './SubCategoryClient';

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

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image1: string;
}

async function getSubCategories(categorySlug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/subcategory/by-category/${categorySlug}`,
    { cache: 'no-store' }
  );
  
  if (!res.ok) return null;
  
  const result = await res.json();
  return result.success ? result.data : null;
}

async function getProducts(subCategorySlug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/product/by-subcategory/${subCategorySlug}`,
    { cache: 'no-store' }
  );
  
  if (!res.ok) return [];
  
  const result = await res.json();
  return result.success ? result.data : [];
}

export default async function SubCategoryPage({
  params,
}: {
  params: { navbarSlug: string; categorySlug: string; subCategorySlug: string };
}) {
  const { navbarSlug, categorySlug, subCategorySlug } = params;

  // Fetch data in parallel on the server
  const [allSubCategories, products] = await Promise.all([
    getSubCategories(categorySlug),
    getProducts(subCategorySlug),
  ]);

  if (!allSubCategories) {
    notFound();
  }

  // Find the current subcategory
  const subCategory = allSubCategories.find(
    (sub: SubCategory) => sub.slug === subCategorySlug
  );

  if (!subCategory) {
    notFound();
  }

  return (
    <SubCategoryClient
      subCategory={subCategory}
      allSubCategories={allSubCategories}
      products={products}
      navbarSlug={navbarSlug}
      categorySlug={categorySlug}
      subCategorySlug={subCategorySlug}
    />
  );
}