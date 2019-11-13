const { expect } = require('chai')
const call = require('../../helpers/call')
const searchDucks = require('.')

describe('logic - search ducks', () => {
  let name, surname, email, password, id, token, duckId = '5c3853aebd1bde8520e66e1b'

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

  it('should succeed on correct criteria (query)', () => {
    const query = 'blue'

    return searchDucks(id, token, query)
      .then(ducks => {
        expect(ducks).to.exist
        expect(ducks.length).to.be.greaterThan(0)

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

          expect(duck.isFav).to.be.false
        })
      })
  })

  describe('when fav already exists', () => {
    beforeEach(done => {
      call('PUT', token, `https://skylabcoders.herokuapp.com/api/user/${id}`, { favs: [duckId] }, result => {
        result.error ? done(new Error(result.error)) : done()
      })
    })

    it('should succeed on correct criteria (query)', () => {
      const query = 'blue'

      return searchDucks(id, token, query)
        .then(ducks => {
          expect(ducks).to.exist
          expect(ducks.length).to.be.greaterThan(0)

          const hasFav = ducks.some(duck => duck.isFav)

          expect(hasFav).to.be.true

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

            duck.id === duckId ? expect(duck.isFav).to.be.true : expect(duck.isFav).to.be.false
          })
        })
    })
  })

  it('should fail on incorrect criteria', () => {
    const query = 'asdfljasdf'

    return searchDucks(id, token, query)
      .then(() => {
        throw Error('should not reach this point')
      })
      .catch(error => {
        expect(error).to.exist

        expect(error.message).to.exist
        expect(typeof error.message).to.equal('string')
        expect(error.message.length).to.be.greaterThan(0)
        expect(error.message).to.equal(`There are not results for this query: ${query}`)
      })
  })

  it('should fail on incorrect query', () => {
    // TODO cases when id and token have values diff from non-empty string

    expect(() => { searchDucks(id, token, 1) }).to.throw(TypeError, '1 is not a string')
    expect(() => { searchDucks(id, token, true) }).to.throw(TypeError, 'true is not a string')
    expect(() => { searchDucks(id, token, []) }).to.throw(TypeError, ' is not a string')
    expect(() => { searchDucks(id, token, {}) }).to.throw(TypeError, '[object Object] is not a string')
    expect(() => { searchDucks(id, token, undefined) }).to.throw(TypeError, 'undefined is not a string')
    expect(() => { searchDucks(id, token, null) }).to.throw(TypeError, 'null is not a string')
  })
})
