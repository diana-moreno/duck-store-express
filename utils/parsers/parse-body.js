const querystring = require('querystring')

module.exports = function(req, callback) {
  let content = ''

  req.on('data', chunk => content += chunk)

  req.on('end', () => {
    const body = querystring.parse(content)

    callback(body)
  })
}
