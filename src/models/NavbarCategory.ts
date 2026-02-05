import { supabaseAdmin } from '@/lib/supabase';
import { NavbarCategory, NavbarCategoryInsert, NavbarCategoryUpdate } from '@/lib/database.types';

// Helper to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// NavbarCategory operations
export const NavbarCategoryModel = {
  // Find all navbar categories
  async findAll(options?: { isActive?: boolean; orderBy?: 'order' | 'created_at' }) {
    let query = supabaseAdmin.from('navbar_categories').select('*');
    
    if (options?.isActive !== undefined) {
      query = query.eq('is_active', options.isActive);
    }
    
    query = query.order(options?.orderBy || 'order', { ascending: true });
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Find by ID
  async findById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('navbar_categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Find by slug
  async findBySlug(slug: string) {
    const { data, error } = await supabaseAdmin
      .from('navbar_categories')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Find by name (case-insensitive)
  async findByName(name: string) {
    const { data, error } = await supabaseAdmin
      .from('navbar_categories')
      .select('*')
      .ilike('name', name)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Create new navbar category
  async create(data: Omit<NavbarCategoryInsert, 'slug'>) {
    const slug = generateSlug(data.name);
    
    const { data: created, error } = await supabaseAdmin
      .from('navbar_categories')
      .insert({ ...data, slug })
      .select()
      .single();
    
    if (error) throw error;
    return created;
  },

  // Update navbar category
  async update(id: string, data: NavbarCategoryUpdate) {
    const updateData = { ...data };
    if (data.name) {
      updateData.slug = generateSlug(data.name);
    }
    
    const { data: updated, error } = await supabaseAdmin
      .from('navbar_categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updated;
  },

  // Delete navbar category
  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('navbar_categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Count navbar categories
  async count(options?: { isActive?: boolean }) {
    let query = supabaseAdmin.from('navbar_categories').select('*', { count: 'exact', head: true });
    
    if (options?.isActive !== undefined) {
      query = query.eq('is_active', options.isActive);
    }
    
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }
};

export default NavbarCategoryModel;
