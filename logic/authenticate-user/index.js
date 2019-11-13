const call = require('../../helpers/call')
const validate = require('../../utils/validate')

module.exports = function(email, password) {
  validate.string(email)
  validate.string.notVoid('e-mail', email)
  validate.string(password)
  validate.string.notVoid('password', password)

  return new Promise((resolve, reject) => {
    call('POST', undefined, 'https://skylabcoders.herokuapp.com/api/auth', { username: email, password }, result => {
      result.error ? reject(new Error(result.error)) : resolve(result.data)
    })
  })
}
