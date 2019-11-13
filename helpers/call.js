const fetch = require('../utils/fetch')

module.exports = function(method, token, url, body, callback) {
  let headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (body) headers['Content-Type'] = 'application/json;charset=UTF-8'

  fetch(method, url, headers, JSON.stringify(body), function(response) {
      let content = ''
      response.on('data', chunk => content += chunk)
      response.on('end', () => callback(JSON.parse(content)))
  })
}
