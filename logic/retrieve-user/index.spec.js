const { expect } = require('chai')
const call = require('../../helpers/call')
const retrieveUser = require('../retrieve-user')

describe('logic - retrieve user', () => {
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

  it('should succeed on correct user data', () =>
    retrieveUser(id, token)
    .then(user => {
      expect(user).to.exist
      expect(user.name).to.equal(name)
      expect(user.surname).to.equal(surname)
      expect(user.username).to.equal(email)
      expect(user.password).to.be.undefined
    })
  )

  it('should fail on incorrect user data', () =>
    retrieveUser(id, token)
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

  // TODO other cases
})
