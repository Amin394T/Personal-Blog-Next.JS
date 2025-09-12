type Props = {
  params: Promise<{ blog: string }>;
}

async function Article({ params }: Props) {
  const { blog } = await params;

  return (
    <article className="prose mx-auto max-w-4xl p-6">
      <h1>Blog Post: {blog}</h1>
      {/* Add your blog post content here */}
    </article>
  )
}

export default Article;