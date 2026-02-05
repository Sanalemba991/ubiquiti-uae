"use client";
import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

const Testimonial = () => {
  const testimonials = [
    {
      id: 1,
      rating: 5,
      text: "Ubiquiti UAE provided us with enterprise-grade networking solutions. Their deployment was seamless and support exceptional!",
      name: "Ahmed Al-Mansouri",
      position: "IT Director",
      company: "Emirates Tech Solutions",
      avatar: "/avatar/N2.png",
      borderColor: "border-blue-400",
      nameColor: "text-blue-500",
    },
    {
      id: 2,
      rating: 5,
      text: "Thanks to Ubiquiti UAE, our office network performance has increased dramatically. Highly recommend their UniFi solutions!",
      name: "Sarah Thompson",
      position: "Network Administrator",
      company: "Dubai Business Hub",
      avatar: "/avatar/N1.png",
      borderColor: "border-blue-400",
      nameColor: "text-blue-500",
    },
    {
      id: 3,
      rating: 4.5,
      text: "Ubiquiti UAE has transformed our connectivity infrastructure with reliable, high-performance networking equipment.",
      name: "Mohammed Hassan",
      position: "Project Manager",
      company: "Smart City Developments",
      avatar: "/avatar/N3.png",
      borderColor: "border-blue-400",
      nameColor: "text-blue-500",
    },
    {
      id: 4,
      rating: 4.5,
      text: "Their team was incblueibly responsive and provided expert guidance throughout our network upgrade project!",
      name: "David Chen",
      position: "Head of IT Infrastructure",
      company: "Gulf Innovations",
      avatar: "/avatar/N4.png",
      borderColor: "border-blue-400",
      nameColor: "text-blue-500",
    },
    {
      id: 5,
      rating: 4.5,
      text: "Ubiquiti UAE exceeds expectations. Their networking products and technical support are absolutely top-notch!",
      name: "Fatima Al-Zaabi",
      position: "Systems Manager",
      company: "Abu Dhabi Enterprises",
      avatar: "/avatar/N5.png",
      borderColor: "border-blue-400",
      nameColor: "text-blue-500",
    },
  ];

  

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const headerVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            What Our Clients <span className="text-blue-600">Say</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            At Ubiquiti UAE, we pride ourselves on delivering
            exceptional networking solutions and outstanding support.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className={`group relative bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${testimonial.borderColor} border border-opacity-20 hover:border-opacity-100`}
            >
              {/* Quote decoration */}
             

              {/* Rating Stars */}
             

              {/* Testimonial Text */}
              <blockquote className="text-gray-700 text-base leading-relaxed mb-6 relative">
                "{testimonial.text}"
              </blockquote>

              {/* Client Info */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-200 group-hover:ring-blue-400 transition-all duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h4
                    className={`font-semibold text-base ${testimonial.nameColor} group-hover:text-blue-600 transition-colors duration-300`}
                  >
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-500 text-xs">
                    {testimonial.position} at {testimonial.company}
                  </p>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;