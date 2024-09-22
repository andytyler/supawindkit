<script lang="ts">
  import LinkedInPost from "$components/LinkedInPost.svelte"
  import TwitterPost from "$components/TwitterPost.svelte"
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<LinkedInPost
  profileImage="/images/FLUX-john.jpeg"
  userName="John Doe"
  userHeadline="Software Engineer at TechCorp"
  postTime="2h ago"
  postContent="Excited to share our new product launch!"
  postImage="/images/template.png"
/>

<TwitterPost
  profileImage="/images/FLUX-jamie.jpeg"
  userName="Jamie Doe"
  userHandle="jamie324"
  postTime="1h ago"
  postContent="Just attended an amazing webinar about Svelte."
  postImage="/images/template.png"
/>
