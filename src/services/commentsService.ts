type CreateCommentInput = { content: string };

export async function createCommentRequest(
  postId: string,
  comment: CreateCommentInput,
  accessToken: string
) {
  const response = await fetch(`/api/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(comment),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create comment");
  }

  return response.json();
}

type GetCommentsParams = {
  post_id: string;
  cursor?: string;
  limit?: number;
};

export async function getComments(pageParam: GetCommentsParams, token: string) {
  const searchParams = new URLSearchParams();

  if (pageParam.cursor) {
    searchParams.append("cursor", pageParam.cursor.toString());
  }

  if (pageParam.limit) {
    searchParams.append("limit", pageParam.limit.toString());
  }

  const url = `/api/posts/${pageParam.post_id}/comments?${searchParams.toString()}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) {
    throw new Error("Comments not found");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  const data = await response.json();
  return data.comments; // Retourne directement le tableau de commentaires
}
