const call = require('../../helpers/call')
const validate = require('../../utils/validate')
const arrayShuffle = require('../../utils/array-shuffle')

module.exports = function(id, token, num) {
  validate.string(id)
  validate.string.notVoid('id', id)
  validate.string(token)
  validate.string.notVoid('token', token)
  validate.number(num)

  return new Promise((resolve, reject) => {
    call('GET', undefined, 'https://duckling-api.herokuapp.com/api/search', undefined, result => {
      if (result.error) return reject(new Error(result.error))

      let randomDucks = arrayShuffle(result).splice(0, num)

      call('GET', token, `https://skylabcoders.herokuapp.com/api/user/${id}`, undefined, result2 => {
        if (result2.error) return reject(new Error(result2.error))

        const { data: { favs = [] } } = result2

        randomDucks.map(duck => {
          duck.isFav = favs.includes(duck.id)
        })
        resolve(randomDucks)
      })
    })
  })
}
