import type { Metadata } from "next";
import "./global.css";
import "../src/styles/Navigation.css"
import Link from "next/link";
import SearchBar from "./search-bar";
import path from "node:path";


const publicDir = path.join(process.cwd(), 'public');

export const metadata: Metadata = {
  title: "Personal Blog",
  description: "Simplistic blog website template that displays a list of blogs, allows searching blogs, and displays the content of a selected blog.",
  openGraph: {
    type: 'article',
    url: 'https://amin394t.github.io/Personal-Blog/',
    title: 'Personal Blog',
    description: 'Simplistic blog website template that displays a list of blogs, allows searching blogs, and displays the content of a selected blog.',
    images: [{ url: 'https://amin394t.github.io/Personal-Blog/images/_logo.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="navigation">
          <Link href="/"> <img className="navigation-logo" src="/images/_logo.png" alt="logo" /> </Link>
          <SearchBar />
        </div>

        {children}
      </body>
    </html>
  );
}