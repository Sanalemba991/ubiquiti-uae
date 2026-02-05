import { supabaseAdmin } from '@/lib/supabase';
import { Notification, NotificationInsert, NotificationUpdate } from '@/lib/database.types';

type NotificationType = 'product' | 'product_enquiry' | 'contact_enquiry' | 'category' | 'subcategory' | 'navbar_category' | 'info' | 'success' | 'warning' | 'error';

// Notification operations
export const NotificationModel = {
  // Find all notifications
  async findAll(options?: { 
    read?: boolean;
    type?: NotificationType;
    orderBy?: 'created_at';
    limit?: number;
  }) {
    let query = supabaseAdmin.from('notifications').select('*');
    
    if (options?.read !== undefined) {
      query = query.eq('read', options.read);
    }
    
    if (options?.type) {
      query = query.eq('type', options.type);
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
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Create new notification
  async create(data: NotificationInsert) {
    const { data: created, error } = await supabaseAdmin
      .from('notifications')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return created;
  },

  // Update notification
  async update(id: string, data: NotificationUpdate) {
    const { data: updated, error } = await supabaseAdmin
      .from('notifications')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return updated;
  },

  // Mark all as read
  async markAllAsRead() {
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ read: true })
      .eq('read', false);
    
    if (error) throw error;
    return true;
  },

  // Delete notification
  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  },

  // Delete all read notifications
  async deleteAllRead() {
    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('read', true);
    
    if (error) throw error;
    return true;
  },

  // Count notifications
  async count(options?: { read?: boolean }) {
    let query = supabaseAdmin.from('notifications').select('*', { count: 'exact', head: true });
    
    if (options?.read !== undefined) {
      query = query.eq('read', options.read);
    }
    
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  }
};

export default NotificationModel;
