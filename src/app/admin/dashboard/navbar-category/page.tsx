'use client';

import { useState, useEffect } from 'react';
import { FaBars, FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface NavbarCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  name: string;
  description: string;
  order: number;
  isActive: boolean;
}

export default function NavbarCategoryPage() {
  const [categories, setCategories] = useState<NavbarCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<NavbarCategory | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    order: 0,
    isActive: true,
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/navbar-category');
      const result = await response.json();

      if (result.success) {
        setCategories(result.data);
      } else {
        toast.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error fetching categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open modal for adding new category
  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      order: categories.length,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing category
  const handleEdit = (category: NavbarCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      order: category.order,
      isActive: category.isActive,
    });
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingCategory
        ? `/api/admin/navbar-category/${editingCategory._id}`
        : '/api/admin/navbar-category';
      
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message || `Category ${editingCategory ? 'updated' : 'created'} successfully!`);
        setIsModalOpen(false);
        fetchCategories();
      } else {
        toast.error(result.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form');
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/navbar-category/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Category deleted successfully!');
        fetchCategories();
      } else {
        toast.error(result.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category');
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white flex items-center">
              <FaBars className="mr-2 md:mr-3 text-purple-500 text-lg md:text-xl" />
              Navbar Categories
            </h1>
            <p className="text-slate-400 mt-1 text-sm md:text-base">Manage your navigation menu items</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition duration-200 shadow-lg shadow-purple-500/20 text-sm md:text-base whitespace-nowrap"
          >
            <FaPlus className="text-sm md:text-base" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-lg p-4 md:p-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-slate-950/60 border border-slate-800/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 text-sm md:text-base"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800/50 rounded-2xl shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">Loading categories...</div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FaBars className="text-4xl text-slate-600 mb-4" />
            <p className="text-slate-400">No categories found</p>
            <button 
              onClick={handleAddNew}
              className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
            >
              Create your first category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-950/60 to-slate-900/60">
                <tr>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                  <th className="hidden sm:table-cell px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Slug</th>
                  <th className="hidden lg:table-cell px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</th>
                  <th className="hidden md:table-cell px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Order</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-slate-950/60 transition duration-150">
                    <td className="px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-white">{category.name}</td>
                    <td className="hidden sm:table-cell px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-slate-400">{category.slug}</td>
                    <td className="hidden lg:table-cell px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-slate-400">
                      {category.description || '-'}
                    </td>
                    <td className="hidden md:table-cell px-3 md:px-6 py-3 md:py-4 text-xs md:text-sm text-slate-400">{category.order}</td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <span className={`px-2 md:px-3 py-1 text-xs font-semibold rounded-full ${
                        category.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 md:px-6 py-3 md:py-4">
                      <div className="flex items-center space-x-2 md:space-x-3">
                        <button 
                          onClick={() => handleEdit(category)}
                          className="text-blue-400 hover:text-blue-300 transition p-1"
                        >
                          <FaEdit size={16} className="md:w-[18px] md:h-[18px]" />
                        </button>
                        <button 
                          onClick={() => handleDelete(category._id)}
                          className="text-red-400 hover:text-red-300 transition p-1"
                        >
                          <FaTrash size={14} className="md:w-4 md:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg shadow-blue-500/20 p-5 md:p-6">
          <p className="text-xs md:text-sm opacity-90">Total Categories</p>
          <p className="text-2xl md:text-3xl font-bold mt-2">{categories.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-lg shadow-green-500/20 p-5 md:p-6">
          <p className="text-xs md:text-sm opacity-90">Active</p>
          <p className="text-2xl md:text-3xl font-bold mt-2">{categories.filter(c => c.isActive).length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-purple-500/20 p-5 md:p-6">
          <p className="text-xs md:text-sm opacity-90">Inactive</p>
          <p className="text-2xl md:text-3xl font-bold mt-2">{categories.filter(c => !c.isActive).length}</p>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800/50 p-4 md:p-6 flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition p-2"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500"
                  placeholder="e.g., Products"
                />
                <p className="text-xs text-slate-500 mt-1">Slug will be auto-generated from the name</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 min-h-[100px]"
                  placeholder="Brief description of this category..."
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-950/60 text-purple-500 focus:ring-2 focus:ring-purple-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-300">
                  Active (visible in navbar)
                </label>
              </div>

              {/* Buttons */}
              <div className="flex items-center space-x-3 pt-4 border-t border-slate-800/50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-purple-600 hover:to-indigo-700 transition duration-200 shadow-lg shadow-purple-500/20"
                >
                  <FaSave />
                  <span>{editingCategory ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
