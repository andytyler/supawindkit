<script lang="ts">
  export let data: {
    posts: {
      title: string;
      slug: string;
      publish_date: string;
      author: string;
    }[];
  };
</script>

<svelte:head>
  <title>Blog - My Website</title>
  <meta name="description" content="Read our latest blog posts." />
</svelte:head>

<div class="max-w-4xl mx-auto py-8">
  <h1 class="text-4xl font-bold mb-6">Blog</h1>
  {#each data.posts as post}
    <div class="mb-8">
      <a href={`/blog/${post.slug}`} class="text-2xl font-semibold text-blue-600 hover:underline">
        {post.title}
      </a>
      <p class="text-sm text-gray-500">By {post.author} on {new Date(post.publish_date).toLocaleDateString()}</p>
    </div>
  {/each}
</div>
