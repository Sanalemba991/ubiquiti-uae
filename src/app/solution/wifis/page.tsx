import type { Metadata } from 'next';
import WifiClient from './wifi';

export const metadata: Metadata = {
  title: "WiFi | Ubiquiti UAE",
  description: "Enterprise WiFi systems with seamless connectivity, advanced roaming, and optimization for high-density environments.",
  alternates: {
    canonical: "https://ubiquiti-uae.com/solution/wifis",
  },
  openGraph: {
    title: "WiFi | Ubiquiti UAE",
    description: "Wireless Solutions - Reliable, high-performance WiFi for modern enterprises with seamless connectivity and optimized performance.",
    url: "https://ubiquiti-uae.com/solution/wifis",
    siteName: "Ubiquiti UAE",
    type: "website",
  },
};

export default function WifiPage() {
  return <WifiClient />;
}