'use client';

import { useState, useEffect } from 'react';
import { FaSitemap, FaPlus, FaEdit, FaTrash, FaSearch, FaImage, FaTimes, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface Category {
  _id: string;
  name: string;
  slug: string;
  navbarCategory: {
    _id: string;
    name: string;
    slug: string;
  };
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  category: Category;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  name: string;
  category: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

export default function SubCategoryPage() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    description: '',
    image: '',
    order: 0,
    isActive: true,
  });

  // Fetch data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [subCategoriesRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/subcategory'),
        fetch('/api/admin/category')
      ]);

      const subCategoriesResult = await subCategoriesRes.json();
      const categoriesResult = await categoriesRes.json();

      if (subCategoriesResult.success) {
        setSubCategories(subCategoriesResult.data);
      }
      
      if (categoriesResult.success) {
        setCategories(categoriesResult.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error fetching data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormData((prev) => ({ ...prev, image: result.url }));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  // Open modal for adding
  const handleAddNew = () => {
    setEditingSubCategory(null);
    setFormData({
      name: '',
      category: categories[0]?._id || '',
      description: '',
      image: '',
      order: subCategories.length,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubCategory(null);
    setFormData({
      name: '',
      category: '',
      description: '',
      image: '',
      order: 0,
      isActive: true,
    });
  };

  // Open modal for editing
  const handleEdit = (subCategory: SubCategory) => {
    setEditingSubCategory(subCategory);
    setFormData({
      name: subCategory.name,
      category: subCategory.category._id,
      description: subCategory.description,
      image: subCategory.image,
      order: subCategory.order,
      isActive: subCategory.isActive,
    });
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    try {
      const url = editingSubCategory
        ? `/api/admin/subcategory/${editingSubCategory._id}`
        : '/api/admin/subcategory';
      
      const method = editingSubCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message || `Sub-category ${editingSubCategory ? 'updated' : 'created'} successfully!`);
        setIsModalOpen(false);
        fetchData();
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
    if (!confirm('Are you sure you want to delete this sub-category?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/subcategory/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Sub-category deleted successfully!');
        fetchData();
      } else {
        toast.error(result.error || 'Failed to delete sub-category');
      }
    } catch (error) {
      console.error('Error deleting sub-category:', error);
      toast.error('Error deleting sub-category');
    }
  };

  // Filter sub-categories
  const filteredSubCategories = subCategories.filter(subCat => {
    const matchesSearch = subCat?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || subCat.category._id === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FaSitemap className="mr-3 text-slate-400" />
              Sub Categories
            </h1>
            <p className="text-slate-400 mt-1">Manage your product sub-categories</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center space-x-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white px-6 py-3 rounded-lg hover:from-slate-600 hover:to-slate-700 transition duration-200 shadow-lg shadow-slate-900/50 border border-slate-600/50"
          >
            <FaPlus />
            <span>Add New Sub Category</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search sub-categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.navbarCategory.name} → {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub Categories Table */}
      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredSubCategories.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-slate-400">No sub-categories found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-950 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Slug</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredSubCategories.map((subCategory) => (
                  <tr key={subCategory._id} className="hover:bg-slate-950 transition duration-150">
                    <td className="px-6 py-4">
                      {subCategory.image ? (
                        <img 
                          src={subCategory.image} 
                          alt={subCategory.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                          <FaSitemap className="text-slate-600" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">{subCategory.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500">{subCategory.category.navbarCategory.name}</span>
                        <span className="px-3 py-1 bg-slate-950 rounded-full text-xs inline-block mt-1">
                          {subCategory.category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">{subCategory.slug}</td>
                    <td className="px-6 py-4 text-sm text-white">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold">
                        {subCategory.order}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${subCategory.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {subCategory.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(subCategory)}
                          className="text-blue-400 hover:text-blue-300 transition"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(subCategory._id)}
                          className="text-red-400 hover:text-red-300 transition"
                        >
                          <FaTrash size={18} />
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
          <p className="text-slate-400 text-sm">Total Sub-Categories</p>
          <p className="text-3xl font-bold mt-2 text-white">{subCategories.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
          <p className="text-slate-400 text-sm">Active</p>
          <p className="text-3xl font-bold mt-2 text-green-400">{subCategories.filter(c => c.isActive).length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
          <p className="text-slate-400 text-sm">Inactive</p>
          <p className="text-3xl font-bold mt-2 text-red-400">{subCategories.filter(c => !c.isActive).length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
          <p className="text-slate-400 text-sm">Parent Categories</p>
          <p className="text-3xl font-bold mt-2 text-white">{new Set(subCategories.map(c => c.category._id)).size}</p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-800">
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <FaSitemap className="mr-3 text-purple-500" />
                  {editingSubCategory ? 'Edit Sub Category' : 'Add New Sub Category'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-slate-400 hover:text-white transition"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Parent Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.navbarCategory.name} → {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Sub Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  required
                  placeholder="e.g., Indoor Cameras"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  rows={3}
                  placeholder="Brief description of this sub-category..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Sub Category Image
                </label>
                <div className="space-y-3">
                  {formData.image && (
                    <div className="relative inline-block">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border-2 border-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                    disabled={isUploading}
                  />
                  {isUploading && (
                    <p className="text-sm text-purple-400">Uploading image...</p>
                  )}
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-purple-500 bg-slate-950 border-slate-800 rounded focus:ring-purple-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-slate-300">
                  Active (visible on website)
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || isUploading}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Saving...' : editingSubCategory ? 'Update Sub Category' : 'Create Sub Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
