"use client";

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    // Admin pages don't need navbar and footer
    return <>{children}</>;
  }

  // Regular pages get navbar and footer
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}