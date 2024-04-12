import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  const payload = await req.json()
  console.log(req.method, req.headers, payload, context.ip)
  return new Response(JSON.stringify({ message: "hello wolrd" }))
}
