<script>
  function handleClick() {
    alert('Button clicked!');
  }
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  <h1 class="text-3xl font-bold mb-4">Simple Notion Page</h1>
  <a href="https://api.notion.com/v1/oauth/authorize?client_id=120d872b-594c-801f-bfdc-0037ac915733&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fsupafetch.com%2Fredirect">
    Connect to Notion
  </a>
  <button
    on:click={handleClick}
    class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  >
    Click Me
  </button>
</div>

