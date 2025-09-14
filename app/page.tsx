import { Metadata } from 'next';
import BlogList from './_library/blog-list';
import home from '@/private/markdown/_home_page.json';
import '@/private/styles/Article.css';

type Props = {
  searchParams?: Promise<{ search?: string }>;
};


export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { search } = await searchParams ?? {};

  if (!search) return {};
  return { title: `Searching : ${search}` };
}


export default async function Home({ searchParams }: Props) {
  const { search } = await searchParams ?? {};

  return (
    <>
      {!search && (
        <div className="article">
          <h1>{home.heading}</h1>
          <p>{home.line_1}</p>
          <p>{home.line_2}</p>
          <p>{home.line_3}</p>
        </div>
      )}

      <BlogList {...{ query: search }} />
    </>
  );
}


