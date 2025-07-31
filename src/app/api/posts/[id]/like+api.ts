// src/app/api/posts/[id]/like+api.ts

import { getDecodedToken } from "@/utils/serverAuth";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DATABASE_URL!);

// Test this endpoint with curl:
// curl -X POST http://localhost:8081/api/posts/1/like -H "Authorization: Bearer <token>"
export async function POST(request: Request, { id }: { id: string }) {
  const token = getDecodedToken(request);
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const [like] = await sql`
      INSERT INTO likes (user_id, post_id) 
      VALUES (${token.id}, ${id})
      ON CONFLICT (user_id, post_id) DO NOTHING 
      RETURNING * ;`;

    return new Response(JSON.stringify(like), { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return new Response("Error liking post", { status: 500 });
  }
}

// Test this endpoint with curl:
// curl -X DELETE http://localhost:8081/api/posts/1/like -H "Authorization: Bearer <token>"
export async function DELETE(request: Request, { id }: { id: string }) {
  const token = getDecodedToken(request);

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const [like] = await sql`
      DELETE FROM likes 
      WHERE user_id = ${token.id} AND post_id = ${id};`;

    return new Response(JSON.stringify(like), { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return new Response("Error unliking post", { status: 500 });
  }
}
