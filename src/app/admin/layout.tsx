import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login - Ubiquiti UAE',
  description: 'Admin portal for Ubiquiti UAE management system',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
