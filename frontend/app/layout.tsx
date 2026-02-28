import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ArwaPark SaaS - Tourist Transport Management Platform',
  description: 'Multi-tenant SaaS platform for tourist transport agencies. Manage fleets, bookings, trips, and analytics in one powerful dashboard.',
  keywords: 'transport, tourism, SaaS, fleet management, bookings, tourist trips, multi-tenant, arwapark',
  authors: [{ name: 'ArwaPark Team' }],
  viewport: 'width=device-width, initial-scale=1',
  openGraph: {
    title: 'ArwaPark SaaS - Tourist Transport Management',
    description: 'Multi-tenant SaaS for tourist transport agencies',
    url: 'https://arwapark.digima.cloud',
    siteName: 'ArwaPark',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#10B981',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
            },
          }}
        />
      </body>
    </html>
  );
}