module.exports = function(req) {
  const { headers: { cookie } } = req

  req.cookies = {}

  if(!cookie) return req.cookies // avoid the split error when cookie is undefined

  const keyValues = cookie.split(';')

  keyValues.forEach(keyValue => {
    const [key, value] = keyValue.trim().split('=')

    req.cookies[key] = value
  })
}
