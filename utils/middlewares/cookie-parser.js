const { parseCookie } = require('../parsers')

module.exports = function(req, res, next) {
  parseCookie(req)

  next()
}
