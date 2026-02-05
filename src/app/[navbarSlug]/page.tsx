import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import NavbarCategoryPageClient from './NavbarCategoryPageClient';

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
  params: Promise<{ navbarSlug: string }>;
};

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

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { navbarSlug } = await params;
  const result = await getCategories(navbarSlug);

  if (!result?.success || !result.navbarCategory) {
    return {
      title: 'Not Found | Ubiquiti UAE',
      description: 'The page you are looking for does not exist.',
    };
  }

  const navbarCategory = result.navbarCategory;

  return {
    title: `${navbarCategory.name} | Ubiquiti UAE`,
    description: `Explore ${navbarCategory.name} products and categories at Ubiquiti UAE.`,
    openGraph: {
      title: `${navbarCategory.name} | Ubiquiti UAE`,
      description: `Explore ${navbarCategory.name} products and categories at Ubiquiti UAE.`,
      type: 'website',
    },
  };
}

export default async function NavbarCategoryPage({ params }: Props) {
  const { navbarSlug } = await params;

  const result = await getCategories(navbarSlug);

  if (!result?.success) {
    notFound();
  }

  const categories: Category[] = result.data || [];
  const navbarCategory: NavbarCategory | null = result.navbarCategory || null;

  if (!navbarCategory) {
    notFound();
  }

  return (
    <NavbarCategoryPageClient
      categories={categories}
      navbarCategory={navbarCategory}
      navbarSlug={navbarSlug}
    />
  );
}
