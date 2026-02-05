
import React from 'react';
import Contact from '../component/Contact';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us | Authorized Ubiquiti Distributor in UAE",
  description:
    "Get in touch with Ubiquiti UAE, your authorized distributor for premium network, cloud, and security solutions across the UAE.",
  alternates: {
    canonical: "https://ubiquiti-uae.com/contact",
  },
  openGraph: {
    title: "Contact Us | Authorized Ubiquiti Distributor in UAE",
    description:
      "Reach out to Ubiquiti UAE for sales, support, and consultation. Your trusted authorized distributor in the UAE.",
    url: "https://ubiquiti-uae.com/contact",
    siteName: "Ubiquiti UAE",
    type: "website",
  },
};

function Page() {
  return <Contact />;
}

export default Page;
