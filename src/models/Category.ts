import { supabaseAdmin } from '@/lib/supabase';
import { Category, CategoryInsert, CategoryUpdate, CategoryWithNavbar } from '@/lib/database.types';

// Helper to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Category operations
export const CategoryModel = {
  // Find all categories with navbar category populated
  async findAll(options?: { 
    isActive?: boolean; 
    navbarCategoryId?: string;
    orderBy?: 'order' | 'created_at' 
  }) {
    let query = supabaseAdmin
      .from('categories')
      .select(`
        *,
        navbar_category:navbar_categories(*)
      `);
    
    if (options?.isActive !== undefined) {
      query = query.eq('is_active', options.isActive);
    }
    
    if (options?.navbarCategoryId) {
      query = query.eq('navbar_category_id', options.navbarCategoryId);
    }
    
    query = query.order(options?.orderBy || 'order', { ascending: true });
    
    const { data, error } = await query;
    if (error) throw error;
    return data as CategoryWithNavbar[];
  },

  // Find by ID with navbar category populated
  async findById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select(`
        *,
        navbar_category:navbar_categories(*)
      `)
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data as CategoryWithNavbar | null;
  },

  // Find by slug with navbar category populated
  async findBySlug(slug: string) {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select(`
        *,
        navbar_category:navbar_categories(*)
      `)
      .eq('slug', slug)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data as CategoryWithNavbar | null;
  },

  // Find by name and navbar category (case-insensitive)
  async findByNameAndNavbar(name: string, navbarCategoryId: string) {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*')
      .ilike('name', name)
      .eq('navbar_category_id', navbarCategoryId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Find categories by navbar category slug
  async findByNavbarSlug(navbarSlug: string, options?: { isActive?: boolean }) {
    // First get the navbar category
    const { data: navbarCat, error: navError } = await supabaseAdmin
      .from('navbar_categories')
      .select('id')
      .eq('slug', navbarSlug)
      .single();
    
    if (navError && navError.code !== 'PGRST116') throw navError;
    if (!navbarCat) return [];
    
    let query = supabaseAdmin
      .from('categories')
      .select(`
        *,
        navbar_category:navbar_categories(*)
      `)
      .eq('navbar_category_id', navbarCat.id);
    
    if (options?.isActive !== undefined) {
      query = query.eq('is_active', options.isActive);
    }
    
    query = query.order('order', { ascending: true });
    
    const { data, error } = await query;
    if (error) throw error;
    return data as CategoryWithNavbar[];
  },

  // Create new category
  async create(data: Omit<CategoryInsert, 'slug'>) {
    const slug = generateSlug(data.name);
    
    const { data: created, error } = await supabaseAdmin
      .from('categories')
      .insert({ ...data, slug })
      .select(`
        *,
        navbar_category:navbar_categories(*)
      `)
      .single();
    
    if (error) throw error;
    return created as CategoryWithNavbar;
  },

  // Update category
  async update(id: string, data: CategoryUpdate) {
    const updateData = { ...data };
    if (data.name) {
      updateData.slug = generateSlug(data.name);
    }
    
    const { data: updated, error } = await supabaseAdmin
      .from('categories')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        navbar_category:navbar_categories(*)
      `)
      .single();
    
    if (error) throw error;
    return updated as CategoryWithNavbar;
  },

  // Delete category
  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Count categories
  async count(options?: { isActive?: boolean; navbarCategoryId?: string }) {
    let query = supabaseAdmin.from('categories').select('*', { count: 'exact', head: true });
    
    if (options?.isActive !== undefined) {
      query = query.eq('is_active', options.isActive);
    }
    
    if (options?.navbarCategoryId) {
      query = query.eq('navbar_category_id', options.navbarCategoryId);
    }
    
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }
};

export default CategoryModel;
