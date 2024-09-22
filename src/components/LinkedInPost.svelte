<script lang="ts">
  export let profileImage: string = "/images/default-profile.png"
  export let userName: string = "Anonymous"
  export let userHeadline: string = "No headline provided"
  export let postTime: string = "Just now"
  export let postContent: string = "No content available."
  export let postImage: string = ""
</script>

<div class="bg-white p-6 rounded-lg shadow max-w-xl mx-auto">
  <div class="flex items-center">
    <img src={profileImage} alt={userName} class="w-12 h-12 rounded-full" />
    <div class="ml-4">
      <p class="font-semibold text-gray-800">{userName}</p>
      <p class="text-sm text-gray-500">{userHeadline}</p>
      <p class="text-xs text-gray-400">{postTime}</p>
    </div>
  </div>
  <div class="mt-4 text-gray-800">
    <p>{postContent}</p>
    {#if postImage}
      <img src={postImage} alt="Post image" class="mt-4 rounded-lg" />
    {/if}
  </div>
  <div class="mt-4 flex justify-around text-gray-600 border-t pt-2">
    <button class="flex items-center space-x-2 hover:text-blue-600">
      <!-- <HeartIcon class="w-5 h-5" /> -->
      <span>Like</span>
    </button>
    <button class="flex items-center space-x-2 hover:text-blue-600">
      <!-- <ChatBubbleLeftIcon class="w-5 h-5" /> -->
      <span>Comment</span>
    </button>
    <button class="flex items-center space-x-2 hover:text-blue-600">
      <!-- <ShareIcon class="w-5 h-5" /> -->
      <span>Share</span>
    </button>
  </div>
</div>
