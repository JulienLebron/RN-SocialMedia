import dummyPosts from "@/dummyPosts";

export function GET(request: Request) {
  // read posts from database
  const posts = dummyPosts;

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
