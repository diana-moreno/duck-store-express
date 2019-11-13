const call = require('../../helpers/call')
const validate = require('../../utils/validate')

module.exports = function(name, surname, email, password) {
  validate.string(name)
  validate.string.notVoid('name', name)
  validate.string(surname)
  validate.string.notVoid('surname', surname)
  validate.string(email)
  validate.string.notVoid('e-mail', email)
  validate.string(password)
  validate.string.notVoid('password', password)

  return new Promise((resolve, reject) => {
    call('POST', undefined, 'https://skylabcoders.herokuapp.com/api/user', { name, surname, username: email, password }, result => {
      result.error ? reject(new Error(result.error)) : resolve()
    })
  })
}
