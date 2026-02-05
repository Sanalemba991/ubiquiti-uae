export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      navbar_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug?: string
          description?: string | null
          order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          navbar_category_id: string
          description: string | null
          image: string | null
          is_active: boolean
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug?: string
          navbar_category_id: string
          description?: string | null
          image?: string | null
          is_active?: boolean
          order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          navbar_category_id?: string
          description?: string | null
          image?: string | null
          is_active?: boolean
          order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_navbar_category_id_fkey"
            columns: ["navbar_category_id"]
            isOneToOne: false
            referencedRelation: "navbar_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      subcategories: {
        Row: {
          id: string
          name: string
          slug: string
          category_id: string
          description: string | null
          image: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug?: string
          category_id: string
          description?: string | null
          image?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          category_id?: string
          description?: string | null
          image?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          key_features: string[]
          image1: string
          image2: string | null
          image3: string | null
          image4: string | null
          navbar_category_id: string
          category_id: string
          subcategory_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug?: string
          description: string
          key_features?: string[]
          image1: string
          image2?: string | null
          image3?: string | null
          image4?: string | null
          navbar_category_id: string
          category_id: string
          subcategory_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          key_features?: string[]
          image1?: string
          image2?: string | null
          image3?: string | null
          image4?: string | null
          navbar_category_id?: string
          category_id?: string
          subcategory_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_navbar_category_id_fkey"
            columns: ["navbar_category_id"]
            isOneToOne: false
            referencedRelation: "navbar_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "subcategories"
            referencedColumns: ["id"]
          }
        ]
      }
      contact_enquiries: {
        Row: {
          id: string
          name: string
          email: string
          subject: string
          message: string
          status: 'pending' | 'contacted' | 'resolved'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subject: string
          message: string
          status?: 'pending' | 'contacted' | 'resolved'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subject?: string
          message?: string
          status?: 'pending' | 'contacted' | 'resolved'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_enquiries: {
        Row: {
          id: string
          product_name: string
          name: string
          email: string
          mobile: string
          description: string
          status: 'pending' | 'contacted' | 'resolved'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_name: string
          name: string
          email: string
          mobile: string
          description: string
          status?: 'pending' | 'contacted' | 'resolved'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_name?: string
          name?: string
          email?: string
          mobile?: string
          description?: string
          status?: 'pending' | 'contacted' | 'resolved'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          title: string
          message: string
          type: 'product' | 'product_enquiry' | 'contact_enquiry' | 'category' | 'subcategory' | 'navbar_category' | 'info' | 'success' | 'warning' | 'error'
          icon: string
          link: string | null
          read: boolean
          urgent: boolean
          related_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          message: string
          type: 'product' | 'product_enquiry' | 'contact_enquiry' | 'category' | 'subcategory' | 'navbar_category' | 'info' | 'success' | 'warning' | 'error'
          icon: string
          link?: string | null
          read?: boolean
          urgent?: boolean
          related_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          message?: string
          type?: 'product' | 'product_enquiry' | 'contact_enquiry' | 'category' | 'subcategory' | 'navbar_category' | 'info' | 'success' | 'warning' | 'error'
          icon?: string
          link?: string | null
          read?: boolean
          urgent?: boolean
          related_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      enquiry_status: 'pending' | 'contacted' | 'resolved'
      notification_type: 'product' | 'product_enquiry' | 'contact_enquiry' | 'category' | 'subcategory' | 'navbar_category' | 'info' | 'success' | 'warning' | 'error'
    }
  }
}

// Helper types for easier usage
export type NavbarCategory = Database['public']['Tables']['navbar_categories']['Row'];
export type NavbarCategoryInsert = Database['public']['Tables']['navbar_categories']['Insert'];
export type NavbarCategoryUpdate = Database['public']['Tables']['navbar_categories']['Update'];

export type Category = Database['public']['Tables']['categories']['Row'];
export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export type SubCategory = Database['public']['Tables']['subcategories']['Row'];
export type SubCategoryInsert = Database['public']['Tables']['subcategories']['Insert'];
export type SubCategoryUpdate = Database['public']['Tables']['subcategories']['Update'];

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export type ContactEnquiry = Database['public']['Tables']['contact_enquiries']['Row'];
export type ContactEnquiryInsert = Database['public']['Tables']['contact_enquiries']['Insert'];
export type ContactEnquiryUpdate = Database['public']['Tables']['contact_enquiries']['Update'];

export type ProductEnquiry = Database['public']['Tables']['product_enquiries']['Row'];
export type ProductEnquiryInsert = Database['public']['Tables']['product_enquiries']['Insert'];
export type ProductEnquiryUpdate = Database['public']['Tables']['product_enquiries']['Update'];

export type Notification = Database['public']['Tables']['notifications']['Row'];
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert'];
export type NotificationUpdate = Database['public']['Tables']['notifications']['Update'];

// Types with relations (for joined queries)
export interface CategoryWithNavbar extends Category {
  navbar_category?: NavbarCategory;
}

export interface SubCategoryWithCategory extends SubCategory {
  category?: CategoryWithNavbar;
}

export interface ProductWithRelations extends Product {
  navbar_category?: NavbarCategory;
  category?: Category;
  subcategory?: SubCategory | null;
}
