const { expect } = require('chai')
const call = require('../../helpers/call')
const retrieveFavDucks = require('.')

describe('logic - retrieve favorites ducks', () => {
  let name, surname, email, password, id, token, favId = '5c3853aebd1bde8520e66e1b'

  beforeEach(done => {
    name = `name-${Math.random()}`
    surname = `surname-${Math.random()}`
    email = `email-${Math.random()}@mail.com`
    password = `password-${Math.random()}`

    call('POST', undefined, 'https://skylabcoders.herokuapp.com/api/user', { name, surname, username: email, password, favId }, result => {
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

  it('should succeed when user has favorites', () => {

    retrieveFavDucks(id, token)
      .then(ducks => {
        expect(ducks).to.exist

        ducks.forEach(function(duck) {
          expect(duck).to.exist
          expect(typeof duck.id).to.equal('string')
          expect(duck.id.length).to.be.greaterThan(0)

          expect(duck.title).to.exist
          expect(typeof duck.title).to.equal('string')
          expect(duck.title.length).to.be.greaterThan(0)

          expect(duck.imageUrl).to.exist
          expect(typeof duck.imageUrl).to.equal('string')
          expect(duck.imageUrl.length).to.be.greaterThan(0)

          expect(duck.price).to.exist
          expect(typeof duck.price).to.equal('string')
          expect(duck.price.length).to.be.greaterThan(0)

          expect(duck.isFav).to.be.true
        })
      })
  })
  describe('when user has no favorites', () => {
    let name, surname, email, password, id, token

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

    it('should succeed on favorite ducks when no favorites exists', () => {

      retrieveFavDucks(id, token)
        .then(ducks => {
          expect(ducks).to.exist
          expect(ducks.length).to.equal(0)

        })
    })
  })
})
