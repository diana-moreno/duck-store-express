const call = require('../../helpers/call')
const validate = require('../../utils/validate')

module.exports = function(id, token, duckId) {
  if (typeof id !== 'string') throw new TypeError(id + ' is not a string')
  if (!id.trim().length) throw new ContentError('id is empty or blank')
  if (typeof token !== 'string') throw new TypeError(token + ' is not a string')
  if (!token.trim().length) throw new ContentError('token is empty or blank')
  if (typeof duckId !== 'string') throw new TypeError(duckId + ' is not a string')
  if (!duckId.trim().length) throw new ContentError('duck id is empty or blank')

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
