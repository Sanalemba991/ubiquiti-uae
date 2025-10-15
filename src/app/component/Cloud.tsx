export default function Cloud() {
  const features = [
    "Firewall Zone Matrix",
    "Seamless VPN & SD-WAN",
    "Intelligent Failover",
    "Detailed Traffic & Activity Logs",
    "Advanced Intrusion Prevention & Anti Malware",
    "Layer 7 Application & Web Filtering"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-8">
      <div className="max-w-6xl w-full">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-12">
          AI Enhanced Cybersecurity Platform
        </h1>

        {/* Feature Pills Container */}
        <div className="flex flex-wrap justify-center gap-4 items-center">
          {features.map((feature, index) => (
            <button
              key={index}
              className={`
                px-6 py-3 rounded-full text-sm md:text-base font-medium
                transition-all duration-300 ease-in-out
                ${
                  index === features.length - 1
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-500/60 hover:scale-105'
                    : 'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 hover:scale-105'
                }
                backdrop-blur-sm cursor-pointer
              `}
            >
              {feature}
            </button>
          ))}
        </div>

        {/* Optional: Add a subtle description */}
        <p className="text-center text-slate-300 mt-12 text-lg max-w-3xl mx-auto">
          Comprehensive security solutions powered by artificial intelligence to protect your digital infrastructure
        </p>
      </div>
    </div>
  );
}