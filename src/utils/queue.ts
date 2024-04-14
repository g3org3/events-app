import z from 'zod'
const queueUrl = 'https://quirrel.jorgeadolfo.com'
const lambdaUrl = 'https://events.jorgeadolfo.com/.netlify/functions/api'

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

const basic = 'aWdub3JlZDpDYUJ2WEFQMzE1d0t2S21jZkV3eUtzMzBoclFIc0VmUg=='

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

  const quirrel = encodeURIComponent(lambdaUrl)
  const res = await fetch(`${queueUrl}/queues/${quirrel}`, opts)

  if (res.status > 299) {
    throw new Error(`${res.status}: ${res.statusText}`)
  }

  return await res.json() as Response
}

