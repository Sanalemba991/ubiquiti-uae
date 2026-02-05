import { MetadataRoute } from 'next';

const BASE_URL = 'https://ubiquiti-uae.com';

async function getNavbarCategories() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return [];

  try {
    const res = await fetch(`${apiUrl}/api/navbar-category`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const result = await res.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching navbar categories:', error);
    return [];
  }
}

async function getCategories(navbarSlug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return [];

  try {
    const res = await fetch(`${apiUrl}/api/category/by-navbar/${navbarSlug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const result = await res.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function getSubCategories(categorySlug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return [];

  try {
    const res = await fetch(`${apiUrl}/api/subcategory/by-category/${categorySlug}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];
    const result = await res.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}

async function getProducts(subCategorySlug: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return [];

  try {
    const res = await fetch(
      `${apiUrl}/api/product/by-subcategory/${subCategorySlug}`,
      {
        next: { revalidate: 3600 },
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static pages
  const staticPages = [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${BASE_URL}/about`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/contact`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${BASE_URL}/solution`, priority: 0.9, changeFrequency: 'daily' as const },
  ];

  sitemapEntries.push(...staticPages);

  // Get all navbar categories
  const navbarCategories = await getNavbarCategories();

  for (const navbar of navbarCategories) {
    // Add navbar level URL
    sitemapEntries.push({
      url: `${BASE_URL}/${navbar.slug}`,
      lastModified: new Date().toISOString(),
      priority: 0.9,
      changeFrequency: 'daily' as const,
    });

    // Get categories for this navbar
    const categories = await getCategories(navbar.slug);

    for (const category of categories) {
      // Add category level URL
      sitemapEntries.push({
        url: `${BASE_URL}/${navbar.slug}/${category.slug}`,
        lastModified: new Date().toISOString(),
        priority: 0.85,
        changeFrequency: 'daily' as const,
      });

      // Get subcategories for this category
      const subCategories = await getSubCategories(category.slug);

      for (const subCategory of subCategories) {
        // Add subcategory level URL
        sitemapEntries.push({
          url: `${BASE_URL}/${navbar.slug}/${category.slug}/${subCategory.slug}`,
          lastModified: new Date().toISOString(),
          priority: 0.8,
          changeFrequency: 'daily' as const,
        });

        // Get products for this subcategory
        const products = await getProducts(subCategory.slug);

        for (const product of products) {
          // Add product level URL
          sitemapEntries.push({
            url: `${BASE_URL}/${navbar.slug}/${category.slug}/${subCategory.slug}/${product.slug}`,
            lastModified: new Date().toISOString(),
            priority: 0.7,
            changeFrequency: 'weekly' as const,
          });
        }
      }
    }
  }

  return sitemapEntries;
}
