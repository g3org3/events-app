import type { Context } from "@netlify/functions"

export default async (req: Request, context: Context) => {
  console.log(req.method, JSON.stringify(req.headers), context.ip, JSON.stringify(context.json), JSON.stringify(context.params))
  return new Response(JSON.stringify({ message: "hello wolrd" }))
}
