'use client';

import { useRouter } from 'next/navigation';
import { startTransition, useState } from 'react';

export default function SearchBar({ searchParams }: { searchParams?: { search?: string } }) {
    const router = useRouter();
    const [searchWord, setSearchWord] = useState(searchParams?.search ?? '');

    let handleSearch = (query: string) => {
        query = query.toLowerCase();
        startTransition(() => setSearchWord(query)); //
        window.scrollTo(0, 0); //
        router.replace(`/?search=${query}`);
    };

    return (
        <input
            className="navigation-search" value={String(searchWord)} placeholder="🔍  Search ..."
            onChange={(event) => handleSearch(event.target.value)}
        />
    );
}