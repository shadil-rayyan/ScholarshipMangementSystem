// app/layout.tsx
import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from 'next/headers';
import "./globals.css";

import { SESSION_COOKIE_NAME } from '@/lib/firebase/constants';
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Scholarship Management System",
  description: "Manage your scholarship applications efficiently",
  keywords: ["scholarship", "management", "system", "education", "applications"],
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
    openGraph: {
    title: "My Website – Accessible Math Learning",
    description: "An accessible math learning app with multiple modes.",
    url: "https://yourwebsite.com",
    siteName: "My Website",
    images: [
      {
        url: "https://yourwebsite.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "My Website Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Website – Accessible Math Learning",
    description: "Learn math in an accessible way.",
    images: ["https://yourwebsite.com/twitter-image.png"],
    creator: "@yourtwitter",
  },
  robots:{
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = cookies().get(SESSION_COOKIE_NAME)?.value || null;

  return (
    <html lang="en">
      <body className={inter.className}>

        <Suspense fallback={<Loading />}>
          {children}
        </Suspense>

      </body>
    </html>
  );
}



