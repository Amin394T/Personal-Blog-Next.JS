'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';

function getQueryParam(param: string): string {
  if (typeof window === 'undefined') return '';
  return new URLSearchParams(window.location.search).get(param) ?? '';
}

export default function SearchBar() {
    const router = useRouter();
    const [searchWord, setSearchWord] = useState(getQueryParam("search"));

    let handleSearch = (query: string) => {
        query = query.toLowerCase();
        startTransition(() => setSearchWord(query)); //
        window.scrollTo(0, 0); //
        router.push(`?search=${query}`);
      };

    return (
        <input
        className="navigation-search" value={String(searchWord)} placeholder="🔍  Search ..."
        onChange={(event) => handleSearch(event.target.value)}
      />
    );
}