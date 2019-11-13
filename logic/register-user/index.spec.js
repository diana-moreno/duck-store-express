const { expect } = require('chai')
const call = require('../../helpers/call')
const registerUser = require('../register-user')
const { ContentError } = require('../../utils/errors')

describe('logic - register user', () => {
  let name, surname, email, password

  beforeEach(() => {
    name = `name-${Math.random()}`
    surname = `surname-${Math.random()}`
    email = `email-${Math.random()}@mail.com`
    password = `password-${Math.random()}`
  })

  it('should succeed on correct credentials', () =>
    registerUser(name, surname, email, password)
      .then(response => {
        expect(response).to.be.undefined
      })
  )
  it('should fail on incorrect credentials', () =>
    registerUser(name, surname, email, password)
      .then(() => {
        throw Error('should not reach this point')
      })
      .catch(error => {
        expect(error).to.exist
        expect(error.message).to.exist
        expect(typeof error.message).to.equal('string')
        expect(error.message.length).to.be.greaterThan(0)
      })
  )

  describe('when user already exists', () => {
    beforeEach(done => {
      call('POST', undefined, 'https://skylabcoders.herokuapp.com/api/user', { name, surname, username: email, password }, result => {
        if (result.error) done(new Error(result.error))
        else done()
      })
    })

    it('should fail on already existing user', () =>
      registerUser(name, surname, email, password)
        .then(() => {
          throw Error('should not reach this point')
        })
        .catch(error => {
          expect(error).to.exist
          expect(error.message).to.exist
          expect(typeof error.message).to.equal('string')
          expect(error.message.length).to.be.greaterThan(0)
          expect(error.message).to.equal(`user with username "${email}" already exists`)
        })
    )
  })

  it('should fail on incorrect name, surname, email, password, or expression type and content', () => {
    expect(() => registerUser(1)).to.throw(TypeError, '1 is not a string')
    expect(() => registerUser(true)).to.throw(TypeError, 'true is not a string')
    expect(() => registerUser([])).to.throw(TypeError, ' is not a string')
    expect(() => registerUser({})).to.throw(TypeError, '[object Object] is not a string')
    expect(() => registerUser(undefined)).to.throw(TypeError, 'undefined is not a string')
    expect(() => registerUser(null)).to.throw(TypeError, 'null is not a string')

    expect(() => registerUser('')).to.throw(ContentError, 'name is empty or blank')
    expect(() => registerUser(' \t\r')).to.throw(ContentError, 'name is empty or blank')

    expect(() => registerUser(name, 1)).to.throw(TypeError, '1 is not a string')
    expect(() => registerUser(name, true)).to.throw(TypeError, 'true is not a string')
    expect(() => registerUser(name, [])).to.throw(TypeError, ' is not a string')
    expect(() => registerUser(name, {})).to.throw(TypeError, '[object Object] is not a string')
    expect(() => registerUser(name, undefined)).to.throw(TypeError, 'undefined is not a string')
    expect(() => registerUser(name, null)).to.throw(TypeError, 'null is not a string')

    expect(() => registerUser(name, '')).to.throw(ContentError, 'surname is empty or blank')
    expect(() => registerUser(name, ' \t\r')).to.throw(ContentError, 'surname is empty or blank')

    expect(() => registerUser(name, surname, 1)).to.throw(TypeError, '1 is not a string')
    expect(() => registerUser(name, surname, true)).to.throw(TypeError, 'true is not a string')
    expect(() => registerUser(name, surname, [])).to.throw(TypeError, ' is not a string')
    expect(() => registerUser(name, surname, {})).to.throw(TypeError, '[object Object] is not a string')
    expect(() => registerUser(name, surname, undefined)).to.throw(TypeError, 'undefined is not a string')
    expect(() => registerUser(name, surname, null)).to.throw(TypeError, 'null is not a string')

    expect(() => registerUser(name, surname, '')).to.throw(ContentError, 'e-mail is empty or blank')
    expect(() => registerUser(name, surname, ' \t\r')).to.throw(ContentError, 'e-mail is empty or blank')

    expect(() => registerUser(name, surname, email, 1)).to.throw(TypeError, '1 is not a string')
    expect(() => registerUser(name, surname, email, true)).to.throw(TypeError, 'true is not a string')
    expect(() => registerUser(name, surname, email, [])).to.throw(TypeError, ' is not a string')
    expect(() => registerUser(name, surname, email, {})).to.throw(TypeError, '[object Object] is not a string')
    expect(() => registerUser(name, surname, email, undefined)).to.throw(TypeError, 'undefined is not a string')
    expect(() => registerUser(name, surname, email, null)).to.throw(TypeError, 'null is not a string')

    expect(() => registerUser(name, surname, email, '')).to.throw(ContentError, 'password is empty or blank')
    expect(() => registerUser(name, surname, email, ' \t\r')).to.throw(ContentError, 'password is empty or blank')
  })
})
