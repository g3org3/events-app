import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  console.log(req.method, req.json(), context.ip)
  return new Response(JSON.stringify({ message: "hello wolrd" }))
}
