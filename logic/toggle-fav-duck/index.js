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
    call('GET', token, `https://skylabcoders.herokuapp.com/api/user/${id}`, undefined, result => {

      if (result.error) return reject(new Error(result.error))

      const { data: { favs = [] } } = result
      const index = favs.findIndex(fav => fav === duckId)
      index > -1 ? favs.splice(index, 1) : favs.push(duckId)

      call('PUT', token, `https://skylabcoders.herokuapp.com/api/user/${id}`, { favs }, result => {
        result.error ? reject(new Error(result.error)) : resolve(result)
      })
    })
  })
}