<script lang="ts">
  export let profileImage: string = '/images/default-profile.png';
  export let userName: string = 'Anonymous';
  export let userHandle: string = 'anonymous';
  export let postTime: string = 'Just now';
  export let postContent: string = 'No content available.';
  export let postImage: string = '';
</script>

<div class="bg-white p-4 border-b border-gray-200 max-w-xl mx-auto">
  <div class="flex items-start">
    <img src="{profileImage}" alt="{userName}" class="w-12 h-12 rounded-full"/>
    <div class="ml-4 w-full">
      <div class="flex justify-between items-center">
        <div>
          <span class="font-bold text-gray-800">{userName}</span>
          <span class="text-gray-500 ml-1">@{userHandle}</span>
          <span class="text-gray-500 mx-1">·</span>
          <span class="text-gray-500">{postTime}</span>
        </div>
        <button class="text-gray-500 hover:text-blue-500 focus:outline-none">
          <!-- More Options Icon -->
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <!-- SVG content -->
          </svg>
        </button>
      </div>
      <div class="mt-2 text-gray-800">
        <p>{postContent}</p>
        {#if postImage}
          <img src="{postImage}" alt="Post image" class="mt-2 rounded-lg"/>
        {/if}
      </div>
      <div class="mt-4 flex justify-between text-gray-500">
        <button class="flex items-center space-x-2 hover:text-blue-500">
          <!-- Reply Icon -->
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <!-- SVG content -->
          </svg>
          <span>Reply</span>
        </button>
        <button class="flex items-center space-x-2 hover:text-green-500">
          <!-- Retweet Icon -->
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <!-- SVG content -->
          </svg>
          <span>Retweet</span>
        </button>
        <button class="flex items-center space-x-2 hover:text-red-500">
          <!-- Like Icon -->
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <!-- SVG content -->
          </svg>
          <span>Like</span>
        </button>
        <button class="flex items-center space-x-2 hover:text-blue-500">
          <!-- Share Icon -->
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <!-- SVG content -->
          </svg>
          <span>Share</span>
        </button>
      </div>
    </div>
  </div>
</div>
