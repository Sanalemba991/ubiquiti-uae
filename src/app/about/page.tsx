import React from 'react';
import AboutUs from '../component/AboutUs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us | Authorized Ubiquiti Distributor in UAE",
  description:
    "Learn about Ubiquiti UAE, your authorized distributor for premium network, cloud, and security solutions across the UAE.",
  alternates: {
    canonical: "https://ubiquiti-uae.com/about-us",
  },
  openGraph: {
    title: "About Us | Authorized Ubiquiti Distributor in UAE",
    description:
      "Discover Ubiquiti UAE’s mission, values, and expertise as an authorized distributor of networking and security solutions in the UAE.",
    url: "https://ubiquiti-uae.com/about-us",
    siteName: "Ubiquiti UAE",
    type: "website",
  },
};

function Page() {
  return <AboutUs />;
}

export default Page;
