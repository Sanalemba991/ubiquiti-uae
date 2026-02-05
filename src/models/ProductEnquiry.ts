import { supabaseAdmin } from '@/lib/supabase';
import { ProductEnquiry, ProductEnquiryInsert, ProductEnquiryUpdate } from '@/lib/database.types';

// ProductEnquiry operations
export const ProductEnquiryModel = {
  // Find all product enquiries
  async findAll(options?: { 
    status?: 'pending' | 'contacted' | 'resolved';
    orderBy?: 'created_at';
    limit?: number;
  }) {
    let query = supabaseAdmin.from('product_enquiries').select('*');
    
    if (options?.status) {
      query = query.eq('status', options.status);
    }
    
    query = query.order(options?.orderBy || 'created_at', { ascending: false });
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Find by ID
  async findById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('product_enquiries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Create new product enquiry
  async create(data: ProductEnquiryInsert) {
    const { data: created, error } = await supabaseAdmin
      .from('product_enquiries')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return created;
  },

  // Update product enquiry
  async update(id: string, data: ProductEnquiryUpdate) {
    const { data: updated, error } = await supabaseAdmin
      .from('product_enquiries')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updated;
  },

  // Delete product enquiry
  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('product_enquiries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Count product enquiries
  async count(options?: { status?: 'pending' | 'contacted' | 'resolved' }) {
    let query = supabaseAdmin.from('product_enquiries').select('*', { count: 'exact', head: true });
    
    if (options?.status) {
      query = query.eq('status', options.status);
    }
    
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },

  // Get enquiries by date range (for dashboard charts)
  async getByDateRange(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabaseAdmin
      .from('product_enquiries')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    // Group by date
    const grouped: { [key: string]: number } = {};
    data?.forEach((item: any) => {
      const date = new Date(item.created_at).toISOString().split('T')[0];
      grouped[date] = (grouped[date] || 0) + 1;
    });
    
    return Object.entries(grouped).map(([date, count]) => ({ date, count }));
  }
};

export default ProductEnquiryModel;
