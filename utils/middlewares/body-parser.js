const { parseBody } = require('../parsers')

module.exports = function(req, res, next) {
  parseBody(req, body => {
    req.body = body

    next()
  })
}
