
async function handler(event, context) {
  console.log('[INFO]', event.httpMethod, event.body)

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello world' })
  }
}

exports.handler = handler
