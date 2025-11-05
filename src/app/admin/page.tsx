'use client';

import { useState, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { FaUser, FaLock, FaShieldAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy load Spline (it's heavy)
const SplineScene = dynamic(() => import('@/components/ui/splite').then(mod => mod.SplineScene), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-indigo-900/20 animate-pulse rounded-3xl" />
});

const Spotlight = dynamic(() => import('@/components/ui/spotlight').then(mod => mod.Spotlight), {
  ssr: false
});

function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('🎉 Login successful! Redirecting...', {
          position: 'top-right',
          autoClose: 1000,
        });
        
        setTimeout(() => {
          window.location.href = '/admin/dashboard';
        }, 1000);
      } else {
        toast.error(data.error || 'Invalid credentials', {
          position: 'top-right',
          autoClose: 3000,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer theme="dark" />
      <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 relative overflow-hidden">
        {/* Spotlight Effect */}
        <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="purple" />
        
        {/* Left Side - 3D Robot */}
        <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-8 xl:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-transparent"></div>
          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            <SplineScene 
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-[500px] xl:h-[600px]"
            />
            <div className="mt-6 text-center">
              <h2 className="text-3xl xl:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                Secure Admin Access
              </h2>
              <p className="text-slate-400 mt-3 text-base xl:text-lg">Powered by Advanced AI Security</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 relative min-h-screen lg:min-h-0">
          {/* Background Pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>

          <div className="w-full max-w-md relative z-10 my-auto">
            {/* Card */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800/50 p-6 sm:p-8 shadow-2xl">
              {/* Logo/Header */}
              <div className="text-center space-y-4 sm:space-y-6 mb-6 sm:mb-8">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30 transform hover:scale-110 transition-transform duration-300">
                      <FaShieldAlt className="text-3xl sm:text-4xl text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-7 sm:h-7 bg-green-500 rounded-full flex items-center justify-center border-4 border-slate-900 animate-pulse">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    Admin Portal
                  </h1>
                  <p className="text-slate-400 mt-2 sm:mt-3 text-sm sm:text-base">Sign in to access your dashboard</p>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Username Input */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-xs sm:text-sm font-semibold text-slate-300">
                    Username
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-sm sm:text-base text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 border-2 border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-white font-medium placeholder-slate-500 text-sm sm:text-base"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-slate-300">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <FaLock className="text-sm sm:text-base text-slate-500 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 sm:pl-12 pr-12 sm:pr-14 py-3 sm:py-4 bg-slate-800/50 border-2 border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-white font-medium placeholder-slate-500 text-sm sm:text-base"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-slate-500 hover:text-purple-500 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={18} className="sm:w-5 sm:h-5" /> : <FaEye size={18} className="sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-600 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-purple-600 hover:via-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-4 sm:mt-6"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <FaShieldAlt className="mr-2 text-sm sm:text-base" />
                      Sign In Securely
                    </span>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="text-center pt-6 sm:pt-8 border-t border-slate-800 mt-6 sm:mt-8">
                <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-slate-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="font-medium">Protected by JWT Authentication</p>
                </div>
                <p className="text-xs text-slate-600 mt-2 sm:mt-3">Managed by <span className="text-purple-400 font-semibold">Adeeb Jamil</span> • Backend Developer</p>
              </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="hidden sm:block absolute -top-12 -right-12 w-32 h-32 sm:w-40 sm:h-40 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="hidden sm:block absolute -bottom-12 -left-12 w-40 h-40 sm:w-48 sm:h-48 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(AdminLogin);
