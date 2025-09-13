'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function BlogSearch({ searchParams }: { searchParams?: { search?: string } }) {
    const router = useRouter();
    const [searchWord, setSearchWord] = useState(searchParams?.search ?? '');

    let handleSearch = (query: string) => {
        query = query.toLowerCase();
        setSearchWord(query);
        //startTransition(() => setSearchWord(query));
        router.replace(`/?search=${query}`);
    };

    return (
        <input
            className="navigation-search" value={searchWord} placeholder="🔍  Search ..."
            onChange={(event) => handleSearch(event.target.value)}
        />
    );
}

// clicking logo or article doesn't clear search bar