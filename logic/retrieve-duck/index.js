const call = require('../../helpers/call')
const validate = require('../../utils/validate')

module.exports = function(id, token, duckId) {
  validate.string(id)
  validate.string.notVoid('id', id)
  validate.string(token)
  validate.string.notVoid('token', token)
  validate.string(duckId)
  validate.string.notVoid('duck id', duckId)

  return new Promise((resolve, reject) => {
      call('GET', undefined, `https://duckling-api.herokuapp.com/api/ducks/${duckId}`, undefined, result => {
        if (result.error) return reject(new Error(result.error))

        call('GET', token, `https://skylabcoders.herokuapp.com/api/user/${id}`, undefined, result2 => {
          if (result2.error) return reject(new Error(result2.error))

          const { data: { favs = [] } } = result2
          result.isFav = favs.includes(result.id)

          resolve(result)
        })
      })
    })
  }
