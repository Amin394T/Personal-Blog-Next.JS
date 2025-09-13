import BlogList from './_library/blog-list';
import '../private/styles/Article.css';
import welcome from '../private/markdown/_welcome.json';


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

      <BlogList {...{searchParams}} />
    </>
  );
}


