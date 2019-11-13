const call = require('../../helpers/call')
const validate = require('../../utils/validate')

module.exports = function(id, token) {
  validate.string(id)
  validate.string.notVoid('id', id)
  validate.string(token)
  validate.string.notVoid('token', token)

  return new Promise((resolve, reject) => {
    call('GET', token, 'https://skylabcoders.herokuapp.com/api/user/' + id, undefined, result => {

      if (result.error) return reject(new Error(result.error))
      const { data: { favs = [] } } = result
      let counter = 0,
        error

      if (favs.length) {
        favs.forEach((fav, i) => {
          call('GET', undefined, 'https://duckling-api.herokuapp.com/api/ducks/' + favs[i], undefined, result2 => {
            //if (result2.error) return reject(error = new Error(result2.error))

            favs[i] = result2
            favs[i].isFav = true

            if (++counter === favs.length) resolve(favs) // this condicional solves to repeat the callback in each iteration
          })
        })
      } else {
        resolve(favs)
      }
    })
  })
}