'use client';

import { useState, useEffect } from 'react';
import { FaPhone, FaSearch, FaTrash, FaCheckCircle, FaClock, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'contacted' | 'resolved';
  created_at: string;
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
      default: return 'bg-gray-500/20 text-gray-400 dark:text-gray-400 border-gray-500/30';
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
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <FaPhone className="mr-3 text-blue-500" />
              Contact Enquiries
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage customer contact form submissions</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Total: </span>
            <span className="text-2xl font-bold text-blue-500">{enquiries.length}</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-gray-500 dark:text-gray-400">No enquiries found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-150">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{enquiry.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                        <FaEnvelope className="text-blue-500 text-xs" />
                        <a href={`mailto:${enquiry.email}`} className="hover:text-blue-500 transition text-sm">{enquiry.email}</a>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{enquiry.subject}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-xs">{enquiry.message}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
                      {new Date(enquiry.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={enquiry.status}
                        onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${getStatusColor(enquiry.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDelete(enquiry.id)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        <FaTrash size={16} />
                      </button>
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
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 p-6">
          <p className="text-sm opacity-90">Total Enquiries</p>
          <p className="text-3xl font-bold mt-2">{enquiries.length}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl shadow-lg shadow-yellow-500/30 p-6">
          <p className="text-sm opacity-90">Pending</p>
          <p className="text-3xl font-bold mt-2">{enquiries.filter(e => e.status === 'pending').length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 p-6">
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
