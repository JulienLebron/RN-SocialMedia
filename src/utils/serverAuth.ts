import jwt from "jsonwebtoken";

export function getDecodedToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];
  if (!token) {
    return null;
  }

  return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
}
