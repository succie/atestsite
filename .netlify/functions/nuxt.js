const { Nuxt } = require('nuxt')
const config = require('../../nuxt.config.js')

const nuxt = new Nuxt({ ...config, dev: false })

module.exports.handler = async (event, context) => {
  const result = await nuxt.renderRoute(event.path, { req: event, res: context })
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    },
    body: result.html
  }
}