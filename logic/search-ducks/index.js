const call = require('../../helpers/call')
const validate = require('../../utils/validate')

module.exports = function(id, token, query) {
  validate.string(id)
  validate.string.notVoid('id', id)
  validate.string(token)
  validate.string.notVoid('token', token)
  validate.string(query)

  return new Promise((resolve, reject) => {
    call('GET', undefined, query ? 'https://duckling-api.herokuapp.com/api/search?q=' + query : 'https://duckling-api.herokuapp.com/api/search', undefined, result => {
      if (result.error) return reject(new Error(result.error))

      call('GET', token, `https://skylabcoders.herokuapp.com/api/user/${id}`, undefined, result2 => {
        if (result2.error) return reject(new Error(result2.error))

        const { data: { favs = [] } } = result2

        result.map(duck => {
          duck.isFav = favs.includes(duck.id)
        })
        resolve(result)
      })
    })
  })
}
