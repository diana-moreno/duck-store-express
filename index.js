const express = require('express')
const { View, Login, Register, RegisterSuccess, Search, ResultsItem, Result, Detail } = require('./components')
const { registerUser, authenticateUser, retrieveUser, searchDucks, retrieveDuck, toggleFavDuck, retrieveFavDucks, toggleFavDucks } = require('./logic')
const { bodyParser, cookieParser } = require('./utils/middlewares')
const arrayShuffle = require('./utils/array-shuffle')

const { argv: [, , port = 8080] } = process

const sessions = {}

let query, name

const app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/login')
})

app.get('/login', cookieParser, (req, res) => {
  let { cookies: { id } } = req
  if(id) {
    const session = sessions[id]
    if(session) {
      res.redirect(session.allLastPath)
    } else {
      res.send(View({ body: Login({ path: '/login', register: '/register' })}))
    }
  } else {
      res.send(View({ body: Login({ path: '/login', register: '/register' })}))
  }
})

app.get('/register', cookieParser, (req, res) => {
  let { cookies: { id } } = req
  if(id) {
    const session = sessions[id]
    if(session) {
      res.redirect(session.allLastPath)
    } else {
      res.send(View({ body: Register({ path: '/register', login: '/login' })}))
    }
  } else {
      res.send(View({ body: Register({ path: '/register', login: '/login' })}))
  }
})

app.get('/register-success', (req, res) => {
  res.send(View({ body: RegisterSuccess({ login: '/login' }) }))
})

app.post('/register', bodyParser, (req, res) => {
  const { body: { name, surname, email, password } } = req

  try {
    registerUser(name, surname, email, password)
      .then(() => res.redirect('/register-success'))
      .catch(({ message }) => res.send(View({ body: Register({ path: '/register', login: '/login', error: message }) })))
  } catch ({ message }) {
    res.send(View({ body: Register({ path: '/register', error: message }) }))
  }
})

app.post('/login', bodyParser, (req, res) => {
  const { body: { username, password } } = req

  try {
    authenticateUser(username, password)
      .then(credentials => {
        const { id, token } = credentials
        sessions[id] = { token }
        res.setHeader('set-cookie', `id=${id}`)
        res.redirect('/random')
      })
      .catch(({ message }) => {
        res.send(View({ body: Login({ path: '/login', error: message }) }))
      })
  } catch ({ message }) {
    res.send(View({ body: Login({ path: '/login', error: message }) }))
  }
})

app.get('/random', cookieParser, (req, res) => {
  try {
    let { cookies: { id } } = req
    if (!id) return res.redirect('/login')
    const session = sessions[id]
    if (!session) return res.redirect('/login')
    const { token } = session
    if (!token) return res.redirect('/login')
    session.lastPath = '/random'
    const { randomDucks } = session
    if(!query) query = ''
    let name
    session.allLastPath = '/random'

    retrieveUser(id, token)
      .then(userData => {
        name = userData.name

        return searchDucks(id, token, query)
          .then(ducks => {
            if(!session.randomDucks) {
              let randomDucks = arrayShuffle(ducks).splice(0, 8)
              session.randomDucks = randomDucks
            }
              return session.randomDucks
          })
          .then(ducks => {
            //throw (new Error('errorrrrrrrrr'))
            return toggleFavDucks(id, token, ducks)
              .then(ducks => res.send(View({ body: Search({ path: '/search', query, name, logout: '/logout', results: ducks, favPath: '/fav', detailPath: '/ducks', favoritePath: '/favorites' }) })))
          })
      })
      .catch(({ message }) => res.send(View({ body: Search({ path: '/search', query, name, logout: '/logout', error: message, favoritePath: '/favorites' }) })))
  } catch ({ message }) {
    res.send(View({ body: Search({ path: '/search', query, name, logout: '/logout', error: message, favoritePath: '/favorites' }) }))
  }
})

app.post('/search', (req, res) => {
  res.redirect('/search')
})

app.get('/search', cookieParser, (req, res) => {
  try {
    let { cookies: { id }, query: { query } } = req
    if (!id) return res.redirect('/login')
    const session = sessions[id]
    if (!session) return res.redirect('/login')
    const { token } = session
    if (!token) return res.redirect('/login')
    session.lastPath = '/search'
    let name
    session.allLastPath = '/search'

    retrieveUser(id, token)
      .then(userData => {
        name = userData.name

        if(query === '') query === ''
        if(query === undefined) query = session.query
        session.query = query

        return searchDucks(id, token, query) // return es necesario si queremos ahorrarnos un catch y dejar que se recoja el valor en el siguiente catch.
          .then(ducks => res.send(View({ body: Search({ path: '/search', query, name, logout: '/logout', results: ducks, favPath: '/fav', detailPath: '/ducks', favoritePath: '/favorites' }) })))
      })
      .catch(({ message }) => res.send(View({ body: Search({ path: '/search', query, name, logout: '/logout', error: message, favoritePath: '/favorites' }) })))
  } catch ({ message }) {
    res.send(View({ body: Search({ path: '/search', query, name, logout: '/logout', error: message, favoritePath: '/favorites' }) }))
  }
})

app.post('/logout', cookieParser, (req, res) => {
  res.setHeader('set-cookie', 'id=""; expires=Thu, 01 Jan 1970 00:00:00 GMT')

  const { cookies: { id } } = req
  if (!id) return res.redirect('/login')
  delete sessions[id]

  res.redirect('/login')
})

app.get('/favorites', cookieParser, (req, res) => {
  try {
    const { cookies: { id } } = req
    if (!id) return res.redirect('/login')
    const session = sessions[id]
    if (!session) return res.redirect('/login')
    const { token } = session
    if (!token) return res.redirect('/login')
    session.lastPath = '/favorites'
    session.isClickedFavorites = true
    const { isClickedFavorites } = session
    session.allLastPath = '/favorites'

    retrieveUser(id, token)
      .then(userData => {
        name = userData.name

        return retrieveFavDucks(id, token)
          .then(ducks => res.send(View({ body: Search({ path: '/search', name, logout: '/logout', favorites: ducks, detailPath: '/ducks', favPath: '/fav', favoritePath: '/favorites', isClickedFavorites }) })))
          .then(() => session.isClickedFavorites = false)
      })
      .catch(({ message }) => {
        res.send(View({ body: Search({ path: '/search', name, logout: '/logout', error: message, favoritePath: '/favorites' }) }))
      })
  } catch ({ message }) {
    res.send(View({ body: Search({ path: '/search', name, logout: '/logout', error: message, favoritePath: '/favorites' }) }))
  }
})

app.post('/fav', cookieParser, bodyParser, (req, res) => {
  try {
    const { cookies: { id }, body: { id: duckId } } = req
    if (!id) return res.redirect('/login')
    const session = sessions[id]
    if (!session) return res.redirect('/login')
    const { token } = session
    if (!token) return res.redirect('/login')
    session.duckId = duckId

    toggleFavDuck(id, token, duckId)
        .then(() => {
          res.redirect(req.headers.referer)
        })
        .catch(({ message }) => {
          res.send(View({ body: Search({ path: '/search', name, logout: '/logout', error: message, favoritePath: '/favorites' }) }))
        })
  } catch ({ message }) {
    res.send(View({ body: Search({ path: '/search', name, logout: '/logout', error: message, favoritePath: '/favorites' }) }))
  }
})

app.get('/ducks/:id', cookieParser, (req, res) => {
  try {
    const { params: { id: duckId }, cookies: { id }, query: { query }  } = req
//cómo se ha guardado en params?
    if (!id) return res.redirect('/login')
    const session = sessions[id]
    if (!session) return res.redirect('/login')
    const { token } = session
    if (!token) return res.redirect('/login')
    session.duckId = duckId
    const { lastPath } = session
    let name
    session.allLastPath = `/ducks/${session.duckId}`

    retrieveUser(id, token)
      .then(userData => {
        name = userData.name

        return retrieveDuck(id, token, duckId)
          .then(duck => res.send(View({ body: Search({ path: '/search', name, logout: '/logout', item: duck, favPath: '/fav', favDetailPath: '/favDetail', lastPath, favoritePath: '/favorites' }) })))
      })
      .catch(({ message }) => res.send(View({ body: Search({ path: '/search', query, name, logout: '/logout', error: message, favoritePath: '/favorites' }) })))
  } catch ({ message }) {
    res.send(View({ body: Search({ path: '/search', query, name, logout: '/logout', error: message, favoritePath: '/favorites' }) }))
  }
})

app.listen(port, () => console.log(`server running on port ${port}`))
