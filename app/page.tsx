import BlogList from './_library/blog-list';
import '@/private/styles/Article.css';
import welcome from '@/private/markdown/_welcome.json';
import { Metadata } from 'next';


type Props = {
  searchParams?: Promise<{ search?: string }>;
};


export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { search } = await searchParams ?? {};
  if (!search) return {};
  return {
    title: `Searching : ${search}`
  };
}


export default async function Home({ searchParams }: Props) {
  const { search } = await searchParams ?? {};

  return (
    <>
      {!search && (
        <div className="article">
          <h1>{welcome.heading}</h1>
          <p>{welcome.line_1}</p>
          <p>{welcome.line_2}</p>
          <p>{welcome.line_3}</p>
        </div>
      )}

      <BlogList {...{ query: search }} />
    </>
  );
}


