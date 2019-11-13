const { expect } = require('chai')
const call = require('../../helpers/call')
const searchRandom = require('.')

describe('logic - search random ducks', () => {
  let name, surname, email, password, id, token, duckId = '5c3853aebd1bde8520e66e1b', num = 8

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

  it('should succeed on random ducks', () => {
    return searchRandom(id, token, num)
      .then(ducks => {
        expect(ducks).to.exist
        expect(ducks.length).to.be.greaterThan(0)
        expect(ducks.length).to.be.equal(num)

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

  it('should return the specified number of ducks', () => {
    num = 2
    return searchRandom(id, token, num)
      .then(ducks => {
        expect(ducks).to.exist
        expect(ducks.length).to.be.greaterThan(0)
        expect(ducks.length).to.be.equal(num)

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

  it('the ducks returned are random', () => {
    num = 6
    let initialducks
    searchRandom(id, token, num)
      .then(ducks => {
        initialducks = ducks
        expect(ducks).to.exist
        expect(ducks.length).to.be.greaterThan(0)
        expect(ducks.length).to.be.equal(num)
      })
      .then((ducks) => {
        searchRandom(id, token, num)
        .then(ducks2 => {
          expect(ducks2).to.exist
          expect(ducks2.length).to.be.greaterThan(0)
          expect(ducks2.length).to.be.equal(num)
          expect(initialducks).not.equal(ducks2)
          expect(initialducks[0]).not.equal(ducks2[0])
        })
      })
  })

  it('should fail on incorrect type number', () => {
    // TODO cases when id and token have values diff from non-empty string

    expect(() => { searchRandom(id, token, true) }).to.throw(TypeError, 'true is not a number')
    expect(() => { searchRandom(id, token, []) }).to.throw(TypeError, ' is not a number')
    expect(() => { searchRandom(id, token, {}) }).to.throw(TypeError, '[object Object] is not a number')
    expect(() => { searchRandom(id, token, undefined) }).to.throw(TypeError, 'undefined is not a number')
    expect(() => { searchRandom(id, token, null) }).to.throw(TypeError, 'null is not a number')
  })
})
