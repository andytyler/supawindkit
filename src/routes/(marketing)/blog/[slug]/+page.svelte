<script lang="ts">
  export let data: {
    post: {
      title: string
      publish_date: string
      author: string
    }
    content: string
  }
</script>

<svelte:head>
  <title>{data.post.title}</title>
  <meta name="description" content={data.post.title} />
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content={data.post.title} />
  <meta property="og:description" content={data.post.title} />
  <meta property="og:url" content={new URL($page.url).href} />
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={data.post.title} />
  <meta name="twitter:description" content={data.post.title} />
  <script type="application/ld+json">
    {`
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "${data.post.title}",
        "author": {
          "@type": "Person",
          "name": "${data.post.author}"
        },
        "datePublished": "${data.post.publish_date}"
      }
    `}
  </script>
</svelte:head>

<article class="prose lg:prose-xl mx-auto my-8">
  <h1>{data.post.title}</h1>
  <p class="text-sm text-gray-500">
    By {data.post.author} on {new Date(
      data.post.publish_date,
    ).toLocaleDateString()}
  </p>
  {@html data.content}
</article>
