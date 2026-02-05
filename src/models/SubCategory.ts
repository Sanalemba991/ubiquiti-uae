import { supabaseAdmin } from '@/lib/supabase';
import { SubCategory, SubCategoryInsert, SubCategoryUpdate, SubCategoryWithCategory } from '@/lib/database.types';

// Helper to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// SubCategory operations
export const SubCategoryModel = {
  // Find all subcategories with category and navbar populated
  async findAll(options?: { 
    isActive?: boolean; 
    categoryId?: string;
    orderBy?: 'created_at' | 'name' 
  }) {
    let query = supabaseAdmin
      .from('subcategories')
      .select(`
        *,
        category:categories(
          *,
          navbar_category:navbar_categories(*)
        )
      `);
    
    if (options?.isActive !== undefined) {
      query = query.eq('is_active', options.isActive);
    }
    
    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }
    
    query = query.order(options?.orderBy || 'created_at', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    return data as SubCategoryWithCategory[];
  },

  // Find by ID with relations populated
  async findById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('subcategories')
      .select(`
        *,
        category:categories(
          *,
          navbar_category:navbar_categories(*)
        )
      `)
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data as SubCategoryWithCategory | null;
  },

  // Find by slug with relations populated
  async findBySlug(slug: string) {
    const { data, error } = await supabaseAdmin
      .from('subcategories')
      .select(`
        *,
        category:categories(
          *,
          navbar_category:navbar_categories(*)
        )
      `)
      .eq('slug', slug)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data as SubCategoryWithCategory | null;
  },

  // Find by name and category (case-insensitive)
  async findByNameAndCategory(name: string, categoryId: string) {
    const { data, error } = await supabaseAdmin
      .from('subcategories')
      .select('*')
      .ilike('name', name)
      .eq('category_id', categoryId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Find subcategories by category slug
  async findByCategorySlug(categorySlug: string, options?: { isActive?: boolean }) {
    // First get the category
    const { data: category, error: catError } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();
    
    if (catError && catError.code !== 'PGRST116') throw catError;
    if (!category) return [];
    
    let query = supabaseAdmin
      .from('subcategories')
      .select(`
        *,
        category:categories(
          *,
          navbar_category:navbar_categories(*)
        )
      `)
      .eq('category_id', category.id);
    
    if (options?.isActive !== undefined) {
      query = query.eq('is_active', options.isActive);
    }
    
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    return data as SubCategoryWithCategory[];
  },

  // Create new subcategory
  async create(data: Omit<SubCategoryInsert, 'slug'>) {
    const slug = generateSlug(data.name);
    
    const { data: created, error } = await supabaseAdmin
      .from('subcategories')
      .insert({ ...data, slug })
      .select(`
        *,
        category:categories(
          *,
          navbar_category:navbar_categories(*)
        )
      `)
      .single();
    
    if (error) throw error;
    return created as SubCategoryWithCategory;
  },

  // Update subcategory
  async update(id: string, data: SubCategoryUpdate) {
    const updateData = { ...data };
    if (data.name) {
      updateData.slug = generateSlug(data.name);
    }
    
    const { data: updated, error } = await supabaseAdmin
      .from('subcategories')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:categories(
          *,
          navbar_category:navbar_categories(*)
        )
      `)
      .single();
    
    if (error) throw error;
    return updated as SubCategoryWithCategory;
  },

  // Delete subcategory
  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('subcategories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Count subcategories
  async count(options?: { isActive?: boolean; categoryId?: string }) {
    let query = supabaseAdmin.from('subcategories').select('*', { count: 'exact', head: true });
    
    if (options?.isActive !== undefined) {
      query = query.eq('is_active', options.isActive);
    }
    
    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId);
    }
    
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }
};

export default SubCategoryModel;
