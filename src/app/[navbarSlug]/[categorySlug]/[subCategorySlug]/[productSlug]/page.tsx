import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductClient from './ProductClient';
import { generateProductMetadata } from '@/utils/seo';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  key_features: string[];
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;
  navbar_category: {
    id: string;
    name: string;
    slug: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
    navbar_category: {
      id: string;
      name: string;
      slug: string;
    };
  };
  subcategory?: {
    id: string;
    name: string;
    slug: string;
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

type Props = {
  params: Promise<{
    navbarSlug: string;
    categorySlug: string;
    subCategorySlug?: string;
    productSlug: string;
  }>;
};

// Add this for production builds
export const dynamicParams = true;

async function getProduct(productSlug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  
  if (!apiUrl) {
    console.error('NEXT_PUBLIC_API_URL is not defined');
    return null;
  }
  
  try {
    const res = await fetch(
      `${apiUrl}/api/product/by-slug/${productSlug}`,
      { 
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
    
    if (!res.ok) return null;
    
    const result = await res.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(product: Product) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  
  if (!apiUrl) {
    console.error('NEXT_PUBLIC_API_URL is not defined');
    return [];
  }
  
  try {
    const relatedQuery = product.subcategory 
      ? `subcategory=${product.subcategory.id}`
      : `category=${product.category.id}`;
    
    const res = await fetch(
      `${apiUrl}/api/product?${relatedQuery}`,
      { 
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (!res.ok) return [];

    const result = await res.json();
    
    if (result.success) {
      const filtered = result.data.filter((p: Product) => p.id !== product.id);
      return filtered.slice(0, 3);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// Optional: Pre-generate static params for better performance
export async function generateStaticParams() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) return [];
  
  try {
    // Fetch all your product slugs here
    // This is optional but improves performance
    return [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { navbarSlug, categorySlug, subCategorySlug, productSlug } = await params;
  const product = await getProduct(productSlug);

  if (!product) {
    return {
      title: 'Product Not Found | Ubiquiti UAE',
      description: 'The product you are looking for does not exist.',
    };
  }

  return generateProductMetadata(
    navbarSlug,
    categorySlug,
    subCategorySlug,
    productSlug,
    product.name,
    product.description,
    product.image1,
    product.key_features
  );
}

export default async function ProductPage({ params }: Props) {
  const { navbarSlug, categorySlug, productSlug } = await params;

  const [product, relatedProducts] = await Promise.all([
    getProduct(productSlug),
    // We'll get related products after we have the product data
    Promise.resolve([]),
  ]);

  if (!product) {
    notFound();
  }

  // Now get related products with the product data
  const finalRelatedProducts = await getRelatedProducts(product);

  return (
    <ProductClient
      product={product}
      relatedProducts={finalRelatedProducts}
      navbarSlug={navbarSlug}
      categorySlug={categorySlug}
    />
  );
}