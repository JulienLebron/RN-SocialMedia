import dummyPosts from "@/dummyPosts";

export function GET(request: Request, { id }: { id: string }) {
  console.log(id);
  const post = dummyPosts.find((p) => p.id === parseInt(id));

  if (!post) {
    return new Response("Post not found", { status: 404 });
  }

  return Response.json({ post });
}

export function DELETE(request: Request, { id }: { id: string }) {
  // delete post based on id

  return new Response("Not implemented");
}

export function PATCH(request: Request, { id }: { id: string }) {
  // update post with id, using data from request
  return new Response("Not implemented");
}
