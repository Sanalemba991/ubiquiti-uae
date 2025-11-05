'use client';

import { useState, useEffect } from 'react';
import { FaList, FaPlus, FaEdit, FaTrash, FaSearch, FaImage, FaTimes, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Image from 'next/image';

interface NavbarCategory {
  _id: string;
  name: string;
  slug: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  navbarCategory: NavbarCategory;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  name: string;
  navbarCategory: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [filterNavbarCategory, setFilterNavbarCategory] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    navbarCategory: '',
    description: '',
    image: '',
    order: 0,
    isActive: true,
  });

  // Fetch categories and navbar categories
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch categories
      const categoriesRes = await fetch('/api/admin/category');
      const categoriesResult = await categoriesRes.json();
      
      // Fetch navbar categories
      const navbarRes = await fetch('/api/admin/navbar-category');
      const navbarResult = await navbarRes.json();

      if (categoriesResult.success) {
        setCategories(categoriesResult.data);
      }
      
      if (navbarResult.success) {
        setNavbarCategories(navbarResult.data);
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
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

  // Open modal for adding new category
  const handleAddNew = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      navbarCategory: navbarCategories[0]?._id || '',
      description: '',
      image: '',
      order: categories.length,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing category
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      navbarCategory: category.navbarCategory._id,
      description: category.description,
      image: category.image,
      order: category.order,
      isActive: category.isActive,
    });
    setIsModalOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.navbarCategory) {
      toast.error('Please select a navbar category');
      return;
    }

    try {
      const url = editingCategory
        ? `/api/admin/category/${editingCategory._id}`
        : '/api/admin/category';
      
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
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/category/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Category deleted successfully!');
        fetchData();
      } else {
        toast.error(result.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category');
    }
  };

  // Filter categories
  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesNavbar = !filterNavbarCategory || cat.navbarCategory._id === filterNavbarCategory;
    return matchesSearch && matchesNavbar;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FaList className="mr-3 text-purple-500" />
              Categories
            </h1>
            <p className="text-slate-400 mt-1">Manage your product categories</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition duration-200 shadow-lg shadow-purple-500/30"
          >
            <FaPlus />
            <span>Add New Category</span>
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
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500"
            />
          </div>
          <select
            value={filterNavbarCategory}
            onChange={(e) => setFilterNavbarCategory(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
          >
            <option value="">All Navbar Categories</option>
            {navbarCategories.map((navCat) => (
              <option key={navCat._id} value={navCat._id}>
                {navCat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-slate-400">Loading categories...</div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
          <FaList className="text-4xl text-slate-600 mb-4" />
          <p className="text-slate-400">No categories found</p>
          <button 
            onClick={handleAddNew}
            className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
          >
            Create your first category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category._id} className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition duration-300">
              <div className="relative h-48 bg-slate-950">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover opacity-70"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaImage className="text-4xl text-slate-700" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    category.isActive 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-xs text-purple-400 font-medium bg-purple-500/10 px-2 py-1 rounded">
                    {category.navbarCategory.name}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {category.description || 'No description'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                    /{category.slug}
                  </span>
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleEdit(category)}
                      className="text-blue-400 hover:text-blue-300 transition"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(category._id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 p-6">
          <p className="text-sm opacity-90">Total Categories</p>
          <p className="text-3xl font-bold mt-2">{categories.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 p-6">
          <p className="text-sm opacity-90">Active</p>
          <p className="text-3xl font-bold mt-2">{categories.filter(c => c.isActive).length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/30 p-6">
          <p className="text-sm opacity-90">Inactive</p>
          <p className="text-3xl font-bold mt-2">{categories.filter(c => !c.isActive).length}</p>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800/50 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800/50 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition p-2"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Navbar Category */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Navbar Category <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={formData.navbarCategory}
                  onChange={(e) => setFormData({ ...formData, navbarCategory: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                >
                  <option value="">Select Navbar Category</option>
                  {navbarCategories.map((navCat) => (
                    <option key={navCat._id} value={navCat._id}>
                      {navCat.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Category will be shown under this navbar item</p>
              </div>

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
                  placeholder="e.g., Access Points"
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
                  className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 min-h-[100px]"
                  placeholder="Brief description of this category..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Category Image
                </label>
                <div className="space-y-3">
                  {/* File Upload Button */}
                  <div className="flex items-center space-x-3">
                    <label className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                      <div className={`flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <FaImage />
                        <span>{isUploading ? 'Uploading...' : 'Upload from Computer'}</span>
                      </div>
                    </label>
                  </div>

                  {/* Or manual URL input */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-slate-900 text-slate-500">Or enter URL manually</span>
                    </div>
                  </div>

                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800/50 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500"
                    placeholder="https://example.com/image.jpg"
                    disabled={isUploading}
                  />

                  {/* Image Preview */}
                  {formData.image && (
                    <div className="relative">
                      <div className="relative h-48 bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
                        <Image
                          src={formData.image}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  )}
                </div>
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
