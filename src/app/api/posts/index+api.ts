import dummyPosts from "@/dummyPosts";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEON_DATABASE_URL!);

export async function GET(request: Request) {
  // read posts from database
  const posts = dummyPosts;
  console.log(posts);

  // test connect
  // const result = await sql`SELECT version()`;
  const result = await sql`SELECT * FROM posts`;
  console.log(posts);

  return Response.json({ posts });
}

export async function POST(request: Request) {
  const { content } = await request.json();
  try {
    const newPost = {
      id: 123,
      content,
      user_id: "user_id",
    };

    // insert in database

    return new Response(JSON.stringify(newPost), { status: 201 });
  } catch (e) {
    return new Response("Error creating a post", { status: 500 });
  }
}
