const https = require('https')

module.exports = function (method, _url, headers, body, callback) {

    const { hostname, pathname, search } = new URL(_url)
    const path = `${pathname}${search}`

    const request = https.request({ method, hostname, headers, path }, callback)

    body && request.write(body)
    request.end()
}
