import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import BlogSearch from "./_library/blog-search";
import "@/private/styles/global.css";


export const metadata: Metadata = {
  title: "Personal Blog",
  description: "Simplistic blog website template that displays a list of blogs, allows searching blogs, and displays the content of a selected blog.",
  openGraph: {
    type: 'article',
    url: '/',
    title: 'Personal Blog',
    description: 'Simplistic blog website template that displays a list of blogs, allows searching blogs, and displays the content of a selected blog.',
    images: [{ url: '/images/_logo.png' }],
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="navigation">
          <Link href="/"> <img className="navigation-logo" src="/images/_logo.png" alt="logo" /> </Link>
          <Suspense><BlogSearch /></Suspense>
        </div>

        {children}
      </body>
    </html>
  );
}