import type { Metadata } from 'next';
import SwitchingClient from './Switch';

export const metadata: Metadata = {
  title: "Switching | Ubiquiti UAE",
  description: "Scalable switching solutions with intelligent traffic management and robust connectivity for modern enterprise networks.",
  alternates: {
    canonical: "https://ubiquiti-uae.com/solution/switching",
  },
  openGraph: {
    title: "Switching | Ubiquiti UAE",
    description: "Network Infrastructure - Professional-Grade Infrastructure for Modern Businesses with flexible and high-performance switching solutions.",
    url: "https://ubiquiti-uae.com/solution/switching",
    siteName: "Ubiquiti UAE",
    type: "website",
  },
};

export default function SwitchingPage() {
  return <SwitchingClient />;
}