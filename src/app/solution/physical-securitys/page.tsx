import type { Metadata } from 'next';
import PhysicalSecurityClient from './Physical';

export const metadata: Metadata = {
  title: "Physical Security | Ubiquiti UAE",
  description: "Comprehensive security systems combining access control, surveillance, and monitoring with network integration.",
  alternates: {
    canonical: "https://ubiquiti-uae.com/solution/physical-security",
  },
  openGraph: {
    title: "Physical Security | Ubiquiti UAE",
    description: "Unified Protection Systems - Advanced, fully integrated security solutions combining intelligent access control, high-definition surveillance, and real-time monitoring.",
    url: "https://ubiquiti-uae.com/solution/physical-security",
    siteName: "Ubiquiti UAE",
    type: "website",
  },
};

export default function PhysicalSecurityPage() {
  return <PhysicalSecurityClient />;
}