'use client';

import { useState, useEffect } from 'react';
import { FaPhone, FaSearch, FaTrash, FaCheckCircle, FaClock, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ContactEnquiry {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'contacted' | 'resolved';
  createdAt: string;
}

export default function ContactEnquiryPage() {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/contact-enquiry');
      const result = await response.json();
      
      if (result.success) {
        setEnquiries(result.data);
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
      const response = await fetch(`/api/admin/contact-enquiry/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Contact enquiry deleted successfully!');
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
      const response = await fetch(`/api/admin/contact-enquiry/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`Status updated successfully`);
        fetchEnquiries();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Something went wrong');
    }
  };

  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === '' || enq.status === filterStatus;
    return matchesSearch && matchesFilter;
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
              <FaPhone className="mr-3 text-purple-500" />
              Contact Enquiries
            </h1>
            <p className="text-slate-400 mt-1">Manage customer contact form submissions</p>
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
              placeholder="Search by name, email, or subject..."
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

      {/* Enquiries Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-12 text-center">
          <p className="text-slate-400">No enquiries found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEnquiries.map((enquiry) => (
            <div key={enquiry._id} className="bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition duration-300">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">{enquiry.name}</h3>
                    <span className={`inline-flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-full mt-2 border ${getStatusColor(enquiry.status)}`}>
                      {getStatusIcon(enquiry.status)}
                      <span className="capitalize">{enquiry.status}</span>
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleDelete(enquiry._id)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>

                {/* Subject */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-3 rounded-lg border-l-4 border-purple-500">
                  <p className="text-sm font-semibold text-white">{enquiry.subject}</p>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 text-sm text-slate-400">
                  <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-purple-500" />
                    <a href={`mailto:${enquiry.email}`} className="hover:text-purple-400 transition">
                      {enquiry.email}
                    </a>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-300 leading-relaxed">{enquiry.message}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
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
                  <select
                    value={enquiry.status}
                    onChange={(e) => handleStatusChange(enquiry._id, e.target.value)}
                    className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs focus:ring-2 focus:ring-purple-500 text-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 p-6">
          <p className="text-sm opacity-90">Total Enquiries</p>
          <p className="text-3xl font-bold mt-2">{enquiries.length}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg shadow-yellow-500/30 p-6">
          <p className="text-sm opacity-90">Pending</p>
          <p className="text-3xl font-bold mt-2">{enquiries.filter(e => e.status === 'pending').length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg shadow-purple-500/30 p-6">
          <p className="text-sm opacity-90">Contacted</p>
          <p className="text-3xl font-bold mt-2">{enquiries.filter(e => e.status === 'contacted').length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 p-6">
          <p className="text-sm opacity-90">Resolved</p>
          <p className="text-3xl font-bold mt-2">{enquiries.filter(e => e.status === 'resolved').length}</p>
        </div>
      </div>
    </div>
  );
}
