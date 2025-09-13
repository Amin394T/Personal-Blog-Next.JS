"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") ?? '');
  
  useEffect(() => {
    setQuery(searchParams.get("search") ?? '');
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setQuery(query);
    
    searchParams.get("search")
      ? router.replace(`/?search=${query}`)
      : router.push(`/?search=${query}`);
  };

  return (
    <input
      className="navigation-search"
      value={query}
      placeholder="🔍 Search ..."
      onChange={(event) => handleSearch(event.target.value)}
    />
  );
}