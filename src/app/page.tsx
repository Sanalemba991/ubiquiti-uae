import { Metadata } from 'next';
import Home from "../app/component/Home";

export const metadata: Metadata = {
  title: 'Ubiquiti Dubai: Authorized Ubiquiti Distributor in UAE',
  description:
    'Ubiquiti Dubai provides enterprise-grade networking solutions, WiFi systems, access points, switches, and surveillance products. Explore premium Ubiquiti technology with trusted distribution across UAE.',
  keywords:
    'Ubiquiti Dubai, Ubiquiti distributor UAE, UniFi Dubai, Ubiquiti UAE, authorized Ubiquiti distributor Dubai, WiFi systems UAE, networking solutions Dubai, UniFi access points UAE',
  openGraph: {
    title: 'Ubiquiti Dubai - Authorized Ubiquiti Distributor in UAE',
    description:
      'Explore enterprise-class WiFi systems, access points, security cameras, and networking solutions from Ubiquiti — trusted authorized distributor in Dubai, UAE.',
    type: 'website',
    url: 'https://ubiquiti-uae.com/',
    images: [
      {
        url: '/images/ubiquiti-logo.png',   // <-- replace with your actual logo path
        width: 1200,
        height: 630,
        alt: 'Ubiquiti - Enterprise Networking Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ubiquiti Dubai - Authorized Ubiquiti Distributor in UAE',
    description:
      'Enterprise-grade UniFi WiFi systems, switches, access points, and security solutions — trusted Ubiquiti distributor in Dubai UAE.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <Home />;
}
