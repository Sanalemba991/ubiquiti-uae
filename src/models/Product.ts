import { supabaseAdmin } from '@/lib/supabase';
import { Product, ProductInsert, ProductUpdate, ProductWithRelations } from '@/lib/database.types';

// Helper to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Product operations
export const ProductModel = {
  // Find all products with relations populated
  async findAll(options?: { 
    isActive?: boolean; 
    navbarCategoryId?: string;
    categoryId?: string;
    subcategoryId?: string;
    orderBy?: 'created_at' | 'name';
    limit?: number;
  }) {
    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        navbar_category:navbar_categories(*),
        category:categories(*),
        subcategory:subcategories(*)
      `);
    
    if (options?.isActive !== undefined) {
      query = query.eq('is_active', options.isActive);
    }
    
    if (options?.navbarCategoryId) {
      query = query.eq('navbar_category_id', options.navbarCategoryId);
    }
    
    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }
    
    if (options?.subcategoryId) {
      query = query.eq('subcategory_id', options.subcategoryId);
    }
    
    query = query.order(options?.orderBy || 'created_at', { ascending: false });
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as ProductWithRelations[];
  },

  // Find by ID with relations populated
  async findById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        navbar_category:navbar_categories(*),
        category:categories(*),
        subcategory:subcategories(*)
      `)
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data as ProductWithRelations | null;
  },

  // Find by slug with full nested relations
  async findBySlug(slug: string) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        *,
        navbar_category:navbar_categories(*),
        category:categories(
          *,
          navbar_category:navbar_categories(*)
        ),
        subcategory:subcategories(
          *,
          category:categories(*)
        )
      `)
      .eq('slug', slug)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data as ProductWithRelations | null;
  },

  // Find products by category slug
  async findByCategorySlug(categorySlug: string, options?: { isActive?: boolean }) {
    // First get the category
    const { data: category, error: catError } = await supabaseAdmin
      .from('categories')
      .select('id, navbar_category_id')
      .eq('slug', categorySlug)
      .single();
    
    if (catError && catError.code !== 'PGRST116') throw catError;
    if (!category) return { products: [], category: null };
    
    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        navbar_category:navbar_categories(*),
        category:categories(*),
        subcategory:subcategories(*)
      `)
      .eq('category_id', category.id);
    
    if (options?.isActive !== undefined) {
      query = query.eq('is_active', options.isActive);
    }
    
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    
    return { 
      products: data as ProductWithRelations[], 
      category 
    };
  },

  // Find products by subcategory slug
  async findBySubcategorySlug(subcategorySlug: string, options?: { isActive?: boolean }) {
    // First get the subcategory
    const { data: subcategory, error: subError } = await supabaseAdmin
      .from('subcategories')
      .select(`
        *,
        category:categories(
          *,
          navbar_category:navbar_categories(*)
        )
      `)
      .eq('slug', subcategorySlug)
      .single();
    
    if (subError && subError.code !== 'PGRST116') throw subError;
    if (!subcategory) return { products: [], subcategory: null };
    
    let query = supabaseAdmin
      .from('products')
      .select(`
        *,
        navbar_category:navbar_categories(*),
        category:categories(*),
        subcategory:subcategories(*)
      `)
      .eq('subcategory_id', subcategory.id);
    
    if (options?.isActive !== undefined) {
      query = query.eq('is_active', options.isActive);
    }
    
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    
    return { 
      products: data as ProductWithRelations[], 
      subcategory 
    };
  },

  // Find by name in category (case-insensitive)
  async findByNameInCategory(name: string, categoryId: string, subcategoryId?: string) {
    let query = supabaseAdmin
      .from('products')
      .select('*')
      .ilike('name', name)
      .eq('category_id', categoryId);
    
    if (subcategoryId) {
      query = query.eq('subcategory_id', subcategoryId);
    }
    
    const { data, error } = await query.single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Create new product
  async create(data: Omit<ProductInsert, 'slug'>) {
    const slug = generateSlug(data.name);
    
    const { data: created, error } = await supabaseAdmin
      .from('products')
      .insert({ ...data, slug })
      .select(`
        *,
        navbar_category:navbar_categories(*),
        category:categories(*),
        subcategory:subcategories(*)
      `)
      .single();
    
    if (error) throw error;
    return created as ProductWithRelations;
  },

  // Update product
  async update(id: string, data: ProductUpdate) {
    const updateData = { ...data };
    if (data.name) {
      updateData.slug = generateSlug(data.name);
    }
    
    const { data: updated, error } = await supabaseAdmin
      .from('products')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        navbar_category:navbar_categories(*),
        category:categories(*),
        subcategory:subcategories(*)
      `)
      .single();
    
    if (error) throw error;
    return updated as ProductWithRelations;
  },

  // Delete product
  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Count products
  async count(options?: { 
    isActive?: boolean; 
    categoryId?: string;
    subcategoryId?: string;
  }) {
    let query = supabaseAdmin.from('products').select('*', { count: 'exact', head: true });
    
    if (options?.isActive !== undefined) {
      query = query.eq('is_active', options.isActive);
    }
    
    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }
    
    if (options?.subcategoryId) {
      query = query.eq('subcategory_id', options.subcategoryId);
    }
    
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },

  // Get products grouped by category (for dashboard)
  async getProductsByCategory() {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select(`
        category_id,
        category:categories(name)
      `);
    
    if (error) throw error;
    
    // Group and count by category
    const grouped: { [key: string]: { name: string; count: number } } = {};
    data?.forEach((product: any) => {
      const catId = product.category_id;
      const catName = product.category?.name || 'Unknown';
      if (!grouped[catId]) {
        grouped[catId] = { name: catName, count: 0 };
      }
      grouped[catId].count++;
    });
    
    return Object.values(grouped);
  }
};

export default ProductModel;
