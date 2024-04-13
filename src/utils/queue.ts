import z from 'zod'
const url = "https://quirrel-production-02d9.up.railway.app"

interface Params {
  nextId: string
  remindAt: string
  userId: string
  title: string
}

const payload = (params: Params) => ({
  "body": `${params.userId}:${params.title}`,
  "runAt": params.remindAt,
  "delay": 0,
  "id": params.nextId
})

const basic = "aWdub3JlZDpNYWN3aW4xNCE="

const schema = z.object({
  id: z.string(),
  endpoint: z.string(),
  body: z.string(),
  runAt: z.string(),
  exclusive: z.boolean(),
  retry: z.object({}).array(),
  count: z.number(),
})

type Response = z.infer<typeof schema>

export async function enqueue(params: Params) {
  const opts = {
    method: 'POST',
    headers: {
      "content-type": "application/json",
      "authorization": `Basic ${basic}`
    },
    body: JSON.stringify(payload(params)),
  }

  const quirrel = encodeURIComponent("https://events.jorgeadolfo.com/.netlify/functions/api")
  
  const res = await fetch(`${url}/queues/${quirrel}`, opts)

  if (res.status > 299) {
    throw new Error(`${res.status}: ${res.statusText}`)
  }

  return await res.json() as Response
}

