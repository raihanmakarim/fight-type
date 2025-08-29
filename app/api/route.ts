// app/api/runtime/route.ts (Next 13+ /app router)
export async function GET() {
  return Response.json({ node: process.versions.node });
}
