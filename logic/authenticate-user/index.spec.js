const { expect } = require('chai')
const call = require('../../helpers/call')
const authenticateUser = require('../authenticate-user')
const { ContentError } = require('../../utils/errors')

describe('logic - authenticate user', () => {
  let name, surname, email, password

  beforeEach(done => {
    name = `name-${Math.random()}`
    surname = `surname-${Math.random()}`
    email = `email-${Math.random()}@mail.com`
    password = `password-${Math.random()}`

    call('POST', undefined, 'https://skylabcoders.herokuapp.com/api/user', { name, surname, username: email, password }, result => {
      if (result.error) done(new Error(result.error))
      else done()
    })
  })

  it('should succeed on correct credentials', () => {
    authenticateUser(email, password)
      .then(response => {
        expect(response).to.exist
        const { id, token } = response

        expect(id).to.exist
        expect(typeof id).to.equal('string')
        expect(id.length).to.be.greaterThan(0)

        expect(token).to.exist
        expect(typeof token).to.equal('string')
        expect(token.length).to.be.greaterThan(0)
      })
  })

  email = 'fake'
  it('should fail on incorrect credentials', () =>
    authenticateUser(email, password)
      .then((response) => {
        throw Error('should not reach this point')
      })
      .catch(error => {
        expect(error).to.exist
        expect(error.message).to.exist
        expect(typeof error.message).to.equal('string')
        expect(error.message.length).to.be.greaterThan(0)
      })
  )

  it('should fail on incorrect name, surname, email, password, or expression type and content', () => {
    expect(() => authenticateUser(1)).to.throw(TypeError, '1 is not a string')
    expect(() => authenticateUser(true)).to.throw(TypeError, 'true is not a string')
    expect(() => authenticateUser([])).to.throw(TypeError, ' is not a string')
    expect(() => authenticateUser({})).to.throw(TypeError, '[object Object] is not a string')
    expect(() => authenticateUser(undefined)).to.throw(TypeError, 'undefined is not a string')
    expect(() => authenticateUser(null)).to.throw(TypeError, 'null is not a string')
    expect(() => authenticateUser('')).to.throw(ContentError, 'e-mail is empty or blank')
    expect(() => authenticateUser(' \t\r')).to.throw(ContentError, 'e-mail is empty or blank')
    expect(() => authenticateUser(email, 1)).to.throw(TypeError, '1 is not a string')
    expect(() => authenticateUser(email, true)).to.throw(TypeError, 'true is not a string')
    expect(() => authenticateUser(email, [])).to.throw(TypeError, ' is not a string')
    expect(() => authenticateUser(email, {})).to.throw(TypeError, '[object Object] is not a string')
    expect(() => authenticateUser(email, undefined)).to.throw(TypeError, 'undefined is not a string')
    expect(() => authenticateUser(email, null)).to.throw(TypeError, 'null is not a string')
    expect(() => authenticateUser(email, '')).to.throw(ContentError, 'password is empty or blank')
    expect(() => authenticateUser(email, ' \t\r')).to.throw(ContentError, 'password is empty or blank')
  })
})
