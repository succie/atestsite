const { Nuxt } = require('nuxt')
const config = require('./nuxt_config.js')

let nuxt

const getNuxt = async () => {
  if (nuxt) {
    return nuxt
  }
  
  nuxt = new Nuxt(config)
  await nuxt.ready()
  return nuxt
}

module.exports.handler = async (event, context) => {
  try {
    const nuxtInstance = await getNuxt()
    
    const result = await nuxtInstance.renderRoute(event.path || '/', {
      req: {
        url: event.path || '/',
        method: event.httpMethod || 'GET',
        headers: event.headers || {}
      }
    })
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      },
      body: result.html
    }
  } catch (error) {
    console.error('Nuxt render error:', error)
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      },
      body: `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Error</title>
        </head>
        <body>
          <h1>Internal Server Error</h1>
          <p>Something went wrong. Please try again later.</p>
        </body>
        </html>
      `
    }
  }
}