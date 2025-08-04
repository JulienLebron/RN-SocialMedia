// Test this endpoint with curl:

import { sendNotification } from "@/services/serverNotifications";
import { getDecodedToken } from "@/utils/serverAuth";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DATABASE_URL!);

// curl -X POST http://localhost:8081/api/posts/1/comments -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4M2JkNDUxLTlkZjMtNDUwOC1iMjE2LWFjODdjZGZlZDkwZSIsImlhdCI6MTc1NDIyNDY3MSwiZXhwIjoxNzU2ODE2NjcxfQ.nyf_Heo3MVVCB6xzHPLGnvV0Xgqv6QfB4sYW5jeorXM" -d '{"content": "Hello, world!"}'
export async function POST(request: Request, { id }: { id: string }) {
  try {
    const token = getDecodedToken(request);

    if (!token) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { content } = await request.json();

    const [comment] = await sql`
              INSERT INTO comments (user_id, post_id, content) 
             VALUES (${token.id}, ${id}, ${content}) RETURNING *`;

    await notifyPostAuthorAboutComment(comment.id, token.id, id);

    return new Response(JSON.stringify(comment), { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return new Response("Error inserting comment", { status: 500 });
  }
}

export async function GET(request: Request, { id }: { id: string }) {
  const token = getDecodedToken(request);
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get("limit") || "3");
  const cursor = searchParams.get("cursor")
    ? parseInt(searchParams.get("cursor") || "0")
    : Number.MAX_SAFE_INTEGER;

  try {
    const comments = await sql`
      SELECT
        comments.*,
        row_to_json(users) AS author
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = ${id}
      AND comments.id < ${cursor}
      ORDER BY comments.id DESC
      LIMIT ${limit}
    `;
    return Response.json({ comments });
  } catch (error) {
    console.error("Database Error:", error);
    return new Response("Error fetching posts", { status: 500 });
  }
}

async function notifyPostAuthorAboutComment(
  comment_id: string,
  user_id: string,
  post_id: string
) {
  try {
    // Récupérer toutes les informations en une seule requête
    const [comment] = await sql`
      SELECT 
        comments.*, 
        row_to_json(posts) as post, 
        row_to_json(commenter) AS comment_author, 
        row_to_json(post_author) AS post_author 
      FROM comments
      JOIN users AS commenter ON comments.user_id = commenter.id
      JOIN posts ON comments.post_id = posts.id
      JOIN users AS post_author ON posts.user_id = post_author.id
      WHERE comments.id = ${comment_id}
    `;

    // Ne pas notifier si l'auteur du commentaire est le même que l'auteur du post
    if (comment.user_id === comment.post.user_id) {
      return;
    }

    if (comment.post_author?.push_token) {
      await sendNotification({
        to: comment.post_author.push_token,
        title: "Nouveau commentaire",
        body: `${comment.comment_author.handle} a commenté votre publication`,
        data: { post_id, url: `/post/${post_id}` },
      });
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de la notification:", error);
  }
}
