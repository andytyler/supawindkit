export async function getHtml(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    return {
      html,
      status: response.status
    };
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return {
      html: '',
      status: 500
    };
  }
}

export default getHtml; 