import { notFound } from 'next/navigation';
import ProductClient from './ProductClient';
interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  keyFeatures: string[];
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;
  navbarCategory: {
    _id: string;
    name: string;
    slug: string;
  };
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
  subcategory?: {
    _id: string;
    name: string;
    slug: string;
    category: {
      _id: string;
      name: string;
      slug: string;
    };
  };
}

async function getProduct(productSlug: string): Promise<Product | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/product/by-slug/${productSlug}`, {
      cache: 'no-store', // or 'force-cache' for static generation
    });

    if (!res.ok) return null;

    const result = await res.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getRelatedProducts(product: Product): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const relatedQuery = product.subcategory 
      ? `subcategory=${product.subcategory._id}`
      : `category=${product.category._id}`;
    
    const res = await fetch(`${baseUrl}/api/product?${relatedQuery}`, {
      cache: 'no-store',
    });

    if (!res.ok) return [];

    const result = await res.json();
    
    if (result.success) {
      const filtered = result.data.filter((p: Product) => p._id !== product._id);
      return filtered.slice(0, 3);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

export default async function ProductPage({
  params,
}: {
  params: { 
    navbarSlug: string;
    categorySlug: string;
    subCategorySlug?: string;
    productSlug: string;
  };
}) {
  const product = await getProduct(params.productSlug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product);

  return (
    <ProductClient
      product={product}
      relatedProducts={relatedProducts}
      navbarSlug={params.navbarSlug}
      categorySlug={params.categorySlug}
     
    />
  );
}

// Optional: Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { productSlug: string };
}) {
  const product = await getProduct(params.productSlug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image1],
    },
  };
}