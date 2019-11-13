const { expect } = require('chai')
const call = require('../../helpers/call')
const toggleFavDuck = require('.')

describe('logic - toggle fav duck', () => {
  let name, surname, email, password, id, token, duckId = '5c3853aebd1bde8520e66e11'

  beforeEach(done => {
    name = `name-${Math.random()}`
    surname = `surname-${Math.random()}`
    email = `email-${Math.random()}@mail.com`
    password = `password-${Math.random()}`

    call('POST', undefined, 'https://skylabcoders.herokuapp.com/api/user', { name, surname, username: email, password }, result => {
      if (result.error) done(new Error(result.error))
      else {
        call('POST', undefined, 'https://skylabcoders.herokuapp.com/api/auth', { username: email, password }, result => {
          if (result.error) done(new Error(result.error))
          else {
            const { data } = result

            id = data.id
            token = data.token

            done()
          }
        })
      }
    })
  })

  it('should succeed on correct user and duck data', () =>
    toggleFavDuck(id, token, duckId)
      .then(response => {
        expect(response).to.exist

        // comprueba 2 veces para asegurarse de que es favorito
        call('GET', token, `https://skylabcoders.herokuapp.com/api/user/${id}`, undefined, result => {
          if (result.error) return done(new Error(result.error))

          const { data: { favs } } = result

          expect(response).to.exist
          expect(response.length).to.equal(1)
          expect(response[0]).to.equal(duckId)
        })
      })
  )

  describe('when fav already exists', () => {
    beforeEach(done => {
      call('PUT', token, `https://skylabcoders.herokuapp.com/api/user/${id}`, { favs: [duckId] }, result => {
        result.error ? done(new Error(result.error)) : done()
      })
    })

    it('should succeed on correct user and duck data', done => {
      toggleFavDuck(id, token, duckId)
        .then(response => {
          expect(response).to.be.undefined

          call('GET', token, `https://skylabcoders.herokuapp.com/api/user/${id}`, undefined, result => {
            if (result.error) return done(new Error(result.error))

            const { data: { favs } } = result

            expect(favs).to.exist
            expect(favs.length).to.equal(0)

            done()
          })
        })
    })
  })

  // TODO other cases
})
