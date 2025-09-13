import fs from 'fs';
import path from 'path';
import '../private/styles/Article.css';
import BlogList from './_library/blog-list';

type Welcome = {
  name: string;
  heading: string;
  line_1: string;
  line_2: string;
  line_3: string;
};

type Props = {
  searchParams?: { search?: string };
};


export default async function Home({ searchParams }: Props) {
  const markdownPath = path.join(process.cwd(), 'private', 'markdown');
  const welcome: Welcome = JSON.parse(fs.readFileSync(markdownPath + '/_welcome.json', 'utf-8'));

  return (
    <>
      {!searchParams?.search && (
        <div className="article">
          <h1>{welcome.heading}</h1>
          <p>{welcome.line_1}</p>
          <p>{welcome.line_2}</p>
          <p>{welcome.line_3}</p>
        </div>
      )}

      <BlogList searchParams={searchParams} />
    </>
  );
}


