export async function getPosts(token: string) {
  const response = await fetch("/api/posts", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }

  const data = await response.json();

  return data.posts;
}

export async function getPost(id: string, token: string) {
  const response = await fetch(`/api/posts/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    throw new Error("Post not found");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch post");
  }

  return response.json();
}
