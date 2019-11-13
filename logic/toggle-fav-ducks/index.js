const call = require('../../helpers/call')
const validate = require('../../utils/validate')

module.exports = function(id, token, ducks) {
  validate.string(id)
  validate.string.notVoid('id', id)
  validate.string(token)
  validate.string.notVoid('token', token)

  //validate ducks

  return new Promise((resolve, reject) => {
    call('GET', token, `https://skylabcoders.herokuapp.com/api/user/${id}`, undefined, result => {
      if (result.error) return reject(new Error(result.error))

      const { data: { favs = [] } } = result

      ducks.map(duck => {
        duck.isFav = favs.includes(duck.id)
      })
      resolve(ducks)
    })
  })
}
