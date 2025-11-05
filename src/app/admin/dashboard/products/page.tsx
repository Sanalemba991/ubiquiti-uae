'use client';

import { useState, useEffect } from 'react';
import { FaBox, FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from 'react-icons/fa';
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
  navbarCategory: NavbarCategory;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: Category;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  keyFeatures: string[];
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;
  navbarCategory: NavbarCategory;
  category: Category;
  subcategory?: SubCategory;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  description: string;
  keyFeatures: string[];
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  navbarCategory: string;
  category: string;
  subcategory: string;
  isActive: boolean;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [navbarCategories, setNavbarCategories] = useState<NavbarCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterSubCategory, setFilterSubCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentFeature, setCurrentFeature] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    keyFeatures: [],
    image1: '',
    image2: '',
    image3: '',
    image4: '',
    navbarCategory: '',
    category: '',
    subcategory: '',
    isActive: true,
  });

  // Fetch all data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const [productsRes, navbarCatsRes, catsRes, subCatsRes] = await Promise.all([
        fetch('/api/admin/product'),
        fetch('/api/admin/navbar-category'),
        fetch('/api/admin/category'),
        fetch('/api/admin/subcategory')
      ]);

      const productsResult = await productsRes.json();
      const navbarCatsResult = await navbarCatsRes.json();
      const catsResult = await catsRes.json();
      const subCatsResult = await subCatsRes.json();

      if (productsResult.success) setProducts(productsResult.data);
      if (navbarCatsResult.success) setNavbarCategories(navbarCatsResult.data);
      if (catsResult.success) setCategories(catsResult.data);
      if (subCatsResult.success) setSubCategories(subCatsResult.data);
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
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageField: 'image1' | 'image2' | 'image3' | 'image4') => {
    const file = e.target.files?.[0];
    if (!file) return;

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
        setFormData(prev => ({ ...prev, [imageField]: result.url }));
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

  // Add feature
  const handleAddFeature = () => {
    if (currentFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        keyFeatures: [...prev.keyFeatures, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };

  // Remove feature
  const handleRemoveFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index)
    }));
  };

  // Open modal for adding
  const handleAddNew = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      keyFeatures: [],
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      navbarCategory: navbarCategories[0]?._id || '',
      category: categories[0]?._id || '',
      subcategory: '',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      keyFeatures: product.keyFeatures || [],
      image1: product.image1,
      image2: product.image2 || '',
      image3: product.image3 || '',
      image4: product.image4 || '',
      navbarCategory: product.navbarCategory._id,
      category: product.category._id,
      subcategory: product.subcategory?._id || '',
      isActive: product.isActive,
    });
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      keyFeatures: [],
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      navbarCategory: '',
      category: '',
      subcategory: '',
      isActive: true,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.navbarCategory) {
      toast.error('Please select a navbar category');
      return;
    }
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    try {
      const url = editingProduct
        ? `/api/admin/product/${editingProduct._id}`
        : '/api/admin/product';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message || `Product ${editingProduct ? 'updated' : 'created'} successfully!`);
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
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/product/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success('Product deleted successfully!');
        fetchData();
      } else {
        toast.error(result.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category._id === filterCategory;
    const matchesSubCategory = !filterSubCategory || product.subcategory?._id === filterSubCategory;
    return matchesSearch && matchesCategory && matchesSubCategory;
  });

  // Get available categories based on selected navbar category
  const availableCategories = formData.navbarCategory 
    ? categories.filter(cat => cat.navbarCategory._id === formData.navbarCategory)
    : categories;

  // Get available subcategories based on selected category
  const availableSubCategories = formData.category
    ? subCategories.filter(sub => sub.category._id === formData.category)
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FaBox className="mr-3 text-purple-500" />
              Products
            </h1>
            <p className="text-slate-400 mt-1">Manage your product inventory</p>
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition duration-200 shadow-lg shadow-purple-500/30"
          >
            <FaPlus />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.navbarCategory.name} → {cat.name}
              </option>
            ))}
          </select>
          <select
            value={filterSubCategory}
            onChange={(e) => setFilterSubCategory(e.target.value)}
            className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
          >
            <option value="">All Sub-Categories</option>
            {subCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.category.name} → {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-slate-400">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-950 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Sub-Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-950 transition duration-150">
                    <td className="px-6 py-4">
                      {product.image1 ? (
                        <img 
                          src={product.image1} 
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-slate-800 rounded-lg flex items-center justify-center">
                          <FaBox className="text-slate-600" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-white">{product.name}</p>
                        <p className="text-xs text-slate-400 line-clamp-1">{product.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-500">{product.navbarCategory.name}</span>
                        <span className="text-white">{product.category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {product.subcategory ? (
                        <span className="px-3 py-1 bg-slate-950 rounded-full text-xs">
                          {product.subcategory.name}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="text-blue-400 hover:text-blue-300 transition"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
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
          <p className="text-slate-400 text-sm">Total Products</p>
          <p className="text-3xl font-bold mt-2 text-white">{products.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
          <p className="text-slate-400 text-sm">Active</p>
          <p className="text-3xl font-bold mt-2 text-green-400">{products.filter(p => p.isActive).length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
          <p className="text-slate-400 text-sm">Inactive</p>
          <p className="text-3xl font-bold mt-2 text-red-400">{products.filter(p => !p.isActive).length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
          <p className="text-slate-400 text-sm">Categories</p>
          <p className="text-3xl font-bold mt-2 text-white">{new Set(products.map(p => p.category._id)).size}</p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-800">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Navbar Category */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Navbar Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.navbarCategory}
                  onChange={(e) => setFormData({ ...formData, navbarCategory: e.target.value, category: '', subcategory: '' })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Navbar Category</option>
                  {navbarCategories.map((navbar) => (
                    <option key={navbar._id} value={navbar._id}>{navbar.name}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                  disabled={!formData.navbarCategory}
                >
                  <option value="">Select Category</option>
                  {availableCategories.map((category) => (
                    <option key={category._id} value={category._id}>{category.name}</option>
                  ))}
                </select>
              </div>

              {/* Sub-Category */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Sub-Category (Optional)
                </label>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={!formData.category}
                >
                  <option value="">Select Sub-Category</option>
                  {availableSubCategories.map((subCategory) => (
                    <option key={subCategory._id} value={subCategory._id}>{subCategory.name}</option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* Key Features */}
              <div>
                <label className="block text-slate-300 text-sm font-semibold mb-2">
                  Key Features (One per line)
                </label>
                <textarea
                  value={formData.keyFeatures.join('\n')}
                  onChange={(e) => {
                    const features = e.target.value.split('\n').filter(f => f.trim());
                    setFormData({ ...formData, keyFeatures: features });
                  }}
                  rows={6}
                  placeholder="Enter each feature on a new line&#10;Feature 1&#10;Feature 2&#10;Feature 3"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-slate-500 mt-1">Press Enter to add each feature on a new line</p>
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image 1 */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">
                    Image 1 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image1')}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                    required={!editingProduct}
                  />
                  {formData.image1 && (
                    <img src={formData.image1} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
                  )}
                </div>

                {/* Image 2 */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Image 2</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image2')}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                  />
                  {formData.image2 && (
                    <img src={formData.image2} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
                  )}
                </div>

                {/* Image 3 */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Image 3</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image3')}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                  />
                  {formData.image3 && (
                    <img src={formData.image3} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
                  )}
                </div>

                {/* Image 4 */}
                <div>
                  <label className="block text-slate-300 text-sm font-semibold mb-2">Image 4</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image4')}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600"
                  />
                  {formData.image4 && (
                    <img src={formData.image4} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />
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
                  className="w-5 h-5 text-purple-500 bg-slate-950 border-slate-800 rounded focus:ring-2 focus:ring-purple-500"
                />
                <label htmlFor="isActive" className="text-slate-300 text-sm font-semibold">
                  Active Product
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
