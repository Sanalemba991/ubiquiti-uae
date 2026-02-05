import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import SubCategoryClient from './SubCategoryClient';
import { generateSubCategoryMetadata } from '@/utils/seo';

interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
  category: {
    id: string;
    name: string;
    slug: string;
    navbarCategory: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image1: string;
}

type Props = {
  params: Promise<{ navbarSlug: string; categorySlug: string; subCategorySlug: string }>;
};

// Add this for production builds
export const dynamicParams = true;

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

async function getProducts(subCategorySlug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { navbarSlug, categorySlug, subCategorySlug } = await params;
  const subCategoriesResult = await getSubCategories(categorySlug);

  if (!subCategoriesResult?.success) {
    return {
      title: 'SubCategory Not Found | Ubiquiti UAE',
      description: 'The subcategory you are looking for does not exist.',
    };
  }

  const allSubCategories: SubCategory[] = subCategoriesResult.data || [];
  const currentSubCategory = allSubCategories.find(
    (sub: SubCategory) => sub.slug === subCategorySlug
  );

  if (!currentSubCategory) {
    return {
      title: 'SubCategory Not Found | Ubiquiti UAE',
      description: 'The subcategory you are looking for does not exist.',
    };
  }

  const categoryName = currentSubCategory.category?.name || 'Products';

  return generateSubCategoryMetadata(
    navbarSlug,
    categorySlug,
    subCategorySlug,
    categoryName,
    currentSubCategory.name,
    currentSubCategory.description,
    currentSubCategory.image
  );
}

export default async function SubCategoryPage({ params }: Props) {
  const { navbarSlug, categorySlug, subCategorySlug } = await params;

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