import type { Metadata } from 'next';
import CloudGatewaysClient from "./cloud-gateways";

export const metadata: Metadata = {
  title: "Cloud Gateways | Ubiquiti UAE",
  description:
    "Enterprise-grade cloud gateways with secure connectivity, advanced security protocols, and high-performance routing for reliable cloud application access.",
  alternates: {
    canonical: "https://ubiquiti-uae.com/solution/cloud-gatewayss",
  },
  openGraph: {
    title: "Cloud Gateways | Ubiquiti UAE",
    description:
      "Secure cloud connectivity powered by high-performance routing and enterprise-level security protocols.",
    url: "https://ubiquiti-uae.com/solution/cloud-gatewayss",
    siteName: "Ubiquiti UAE",
    type: "website",
  },
};

export default function CloudGatewaysPage() {
  return <CloudGatewaysClient />;
}