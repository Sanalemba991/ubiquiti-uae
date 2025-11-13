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

// Add this for production builds
export const dynamicParams = true;

async function getSubCategories(categorySlug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
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

async function getProducts(subCategorySlug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.error('NEXT_PUBLIC_API_URL is not defined');
    return [];
  }
  
  try {
    const res = await fetch(
      `${apiUrl}/api/product/by-subcategory/${subCategorySlug}`,
      { 
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!res.ok) return [];
    
    const result = await res.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Optional: Pre-generate static params for better performance
export async function generateStaticParams() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) return [];
  
  try {
    // Fetch all your navbar/category/subcategory combinations here
    // This is optional but improves performance
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function SubCategoryPage({
  params,
}: {
  params: { navbarSlug: string; categorySlug: string; subCategorySlug: string };
}) {
  const { navbarSlug, categorySlug, subCategorySlug } = params;

  const [subCategoriesResult, products] = await Promise.all([
    getSubCategories(categorySlug),
    getProducts(subCategorySlug),
  ]);

  if (!subCategoriesResult?.success) {
    notFound();
  }

  const allSubCategories: SubCategory[] = subCategoriesResult.data || [];
  
  // Find the current subcategory
  const currentSubCategory = allSubCategories.find(
    (sub: SubCategory) => sub.slug === subCategorySlug
  );

  if (!currentSubCategory) {
    notFound();
  }

  return (
    <SubCategoryClient
      subCategory={currentSubCategory}
      allSubCategories={allSubCategories}
      products={products}
      navbarSlug={navbarSlug}
      categorySlug={categorySlug}
      subCategorySlug={subCategorySlug}
    />
  );
}