const API_URL = import.meta.env.VITE_BACKEND_URL + "/api/posts";

/**
 * Create a new post
 * @param {Object} data - post data (title, content, status, tags, etc.)
 * @returns {Promise<Object>} - created post object from server
 */
export async function CreatePost(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create post");
  }

  return res.json();
}
