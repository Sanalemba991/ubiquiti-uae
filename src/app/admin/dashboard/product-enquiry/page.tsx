'use client';

import { useState, useEffect } from 'react';
import { FaEnvelope, FaSearch, FaTrash, FaCheckCircle, FaClock, FaUser, FaPhone, FaBox } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ProductEnquiry {
  _id: string;
  productName: string;
  name: string;
  email: string;
  mobile: string;
  description: string;
  status: 'pending' | 'contacted' | 'resolved';
  createdAt: string;
}

export default function ProductEnquiryPage() {
  const [enquiries, setEnquiries] = useState<ProductEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/product-enquiry');
      const data = await response.json();
      
      if (response.ok) {
        setEnquiries(data);
      } else {
        toast.error('Failed to fetch enquiries');
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;

    try {
      const response = await fetch(`/api/admin/product-enquiry/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Enquiry deleted successfully');
        fetchEnquiries();
      } else {
        toast.error('Failed to delete enquiry');
      }
    } catch (error) {
      console.error('Error deleting enquiry:', error);
      toast.error('Something went wrong');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/product-enquiry/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success('Status updated successfully');
        fetchEnquiries();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Something went wrong');
    }
  };

  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.mobile.includes(searchTerm);

    const matchesStatus = filterStatus === '' || enquiry.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'contacted': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FaEnvelope />;
      case 'contacted': return <FaClock />;
      case 'resolved': return <FaCheckCircle />;
      default: return <FaEnvelope />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center">
              <FaEnvelope className="mr-3 text-purple-500" />
              Product Enquiries
            </h1>
            <p className="text-slate-400 mt-1">Manage customer product enquiries</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">Total: </span>
            <span className="text-2xl font-bold text-purple-500">{enquiries.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Enquiries List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-slate-400">No enquiries found</p>
          </div>
        ) : (
          <div className="space-y-4 p-6">
            {filteredEnquiries.map((enquiry) => (
              <div key={enquiry._id} className="bg-slate-950 border border-slate-800 rounded-xl p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition duration-300">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                  {/* Left Side - Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <FaUser className="text-blue-400" />
                          <h3 className="text-lg font-bold text-white">{enquiry.name}</h3>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-400">
                          <span className="flex items-center space-x-1">
                            <FaEnvelope className="text-green-400" />
                            <a href={`mailto:${enquiry.email}`} className="hover:text-purple-400 transition">
                              {enquiry.email}
                            </a>
                          </span>
                          <span className="flex items-center space-x-1">
                            <FaPhone className="text-orange-400" />
                            <a href={`tel:${enquiry.mobile}`} className="hover:text-purple-400 transition">
                              {enquiry.mobile}
                            </a>
                          </span>
                        </div>
                      </div>
                      <span className={`flex items-center space-x-2 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(enquiry.status)}`}>
                        {getStatusIcon(enquiry.status)}
                        <span className="capitalize">{enquiry.status}</span>
                      </span>
                    </div>
                    
                    <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FaBox className="text-purple-400" />
                        <p className="text-sm font-medium text-purple-400">Product: {enquiry.productName}</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg">
                      <p className="text-sm text-slate-300">{enquiry.description}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span>📅 {new Date(enquiry.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}</span>
                      <span>🕐 {new Date(enquiry.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</span>
                    </div>
                  </div>

                  {/* Right Side - Actions */}
                  <div className="flex flex-row lg:flex-col gap-2 items-stretch">
                    <select
                      value={enquiry.status}
                      onChange={(e) => handleStatusChange(enquiry._id, e.target.value)}
                      className="flex-1 lg:flex-none px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 text-white min-w-[140px]"
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <button 
                      onClick={() => handleDelete(enquiry._id)}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition text-sm shadow-lg shadow-red-500/30 whitespace-nowrap"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
          <p className="text-slate-400 text-sm">Total Enquiries</p>
          <p className="text-3xl font-bold mt-2 text-white">{enquiries.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
          <p className="text-slate-400 text-sm">Pending</p>
          <p className="text-3xl font-bold mt-2 text-yellow-400">
            {enquiries.filter((e) => e.status === 'pending').length}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
          <p className="text-slate-400 text-sm">Contacted</p>
          <p className="text-3xl font-bold mt-2 text-blue-400">
            {enquiries.filter((e) => e.status === 'contacted').length}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6">
          <p className="text-slate-400 text-sm">Resolved</p>
          <p className="text-3xl font-bold mt-2 text-green-400">
            {enquiries.filter((e) => e.status === 'resolved').length}
          </p>
        </div>
      </div>
    </div>
  );
}
