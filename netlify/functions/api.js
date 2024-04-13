
async function handler(event, context) {
  console.log('[INFO]', event.httpMethod, event.body)

  if (event.httpMethod == 'POST') {
    const [id, title] = event.body.split(':')

    const res = await fetch(`https://ntfy.sh/events-${id}?title=Events`, {
      method: 'PUT',
      body: title
    })
    console.log('[INFO]', res.status, res.statusText)
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello world' })
  }
}

exports.handler = handler
