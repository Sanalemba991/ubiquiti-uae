import type { Metadata } from 'next';
import IntegrationClient from './Integratioin';

export const metadata: Metadata = {
  title: "Integration | Ubiquiti UAE",
  description: "Seamless integration solutions for unified data flow and automated workflows across business applications.",
  alternates: {
    canonical: "https://ubiquiti-uae.com/solution/integration",
  },
  openGraph: {
    title: "Integration | Ubiquiti UAE",
    description: "Connected Ecosystem - Effortless integration solutions that unify data exchange and automate workflows across business platforms.",
    url: "https://ubiquiti-uae.com/solution/integration",
    siteName: "Ubiquiti UAE",
    type: "website",
  },
};

export default function IntegrationPage() {
  return <IntegrationClient />;
}