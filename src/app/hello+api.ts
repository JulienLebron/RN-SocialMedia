export function GET(request: Request) {
  console.log("Hello world from api routes");

  console.log("Secret from API ROutes: ", process.env.SECRET_KEY);
  console.log("Public from API ROutes: ", process.env.EXPO_PUBLIC_SHARED_KIT);

  return Response.json({ Hello: "world" });
}
