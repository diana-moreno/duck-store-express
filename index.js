const express = require('express')
const { registerUser, authenticateUser, retrieveUser, searchDucks, retrieveDuck, toggleFavDuck, retrieveFavDucks, searchRandom } = require('./logic')
const bodyParser = require('body-parser')
const session = require('express-session')
const FileStore = require('session-file-store')(session) // to save the session in disk

const { argv: [, , port = 8080] } = process

const app = express()

app.set('view engine', 'pug')
app.set('views', 'components')

app.use(express.static('public'))

app.use(session({
  store: new FileStore({}),
  secret: 'a super secret thing',
  saveUninitialized: true,
  resave: true
}))

const formBodyParser = bodyParser.urlencoded({ extended: false })
//  This object will contain key-value pairs, where the value can be a string or array

app.get('/register', (req, res) => {
  const { session: { lastPath } } = req

  if (lastPath) {
    res.redirect(lastPath)
  } else {
    res.render('register', { path: '/register', login: '/login' })
  }
})

app.post('/register', formBodyParser, (req, res) => {
  const { body: { name, surname, email, password } } = req

  try {
    registerUser(name, surname, email, password)
      .then(() => res.redirect('/register-success'))
      .catch(({ message }) => res.render('register', { path: '/register', login: '/login', error: message }))
  } catch ({ message }) {
    res.render('register', { path: '/register', login: '/login', error: message })
  }
})

app.get('/register-success', (req, res) => {
  res.render('register-success', { login: '/login' })
})

app.get('/', (req, res) => {
  res.redirect('/login')
})

app.get('/login', (req, res) => {
  const { session: { lastPath } } = req

  if (lastPath) {
    res.redirect(lastPath)
  } else {
    res.render('login', { path: '/login', register: '/register' })
  }
})

app.post('/login', formBodyParser, (req, res) => {
  const { session, body: { username, password } } = req

  try {
    authenticateUser(username, password)
      .then(credentials => {
        const { id, token } = credentials

        session.userId = id
        session.token = token
        session.save(() => res.redirect('/random'))
      })
      .catch(({ message }) => {
        res.render('login', { path: '/login', register: '/register' })
      })
  } catch ({ message }) {
    res.render('login', { path: '/login', register: '/register', error: message })
  }
})

app.get('/random', (req, res) => {
  try {
    let { session } = req
    if (!session) return res.redirect('/login')
    const { userId: id, token, randomDucks } = session
    if (!token) return res.redirect('/login')
    let name, query

    session.backPath = '/random'
    session.lastPath = '/random'
    session.save()

    retrieveUser(id, token)
      .then(userData => {
        name = userData.name

        return searchRandom(id, token, 8)
          .then(ducks => {
            session.randomDucks = randomDucks
            session.save()
            return ducks
          })
          .then(ducks => res.render('search', { path: '/search', name, logout: '/logout', results: ducks, favPath: '/fav', detailPath: '/ducks', favoritePath: '/favorites' }))
      })
      .catch(({ message }) => res.render('search', { path: '/search', name, logout: '/logout', error: message, favoritePath: '/favorites' }))
  } catch ({ message }) {
    res.render('search', { path: '/search', name, logout: '/logout', error: message, favoritePath: '/favorites' })
  }
})

app.post('/search', (req, res) => {
  res.redirect('/search')
})

app.get('/search', (req, res) => {
  try {
    let { session, query: { query } } = req
    if (!session) return res.redirect('/login')
    const { userId: id, token } = session
    if (!token) return res.redirect('/login')
    let name

    retrieveUser(id, token)
      .then(userData => {
        name = userData.name

        if (query === '') query === ''
        if (query === undefined) query = session.query
        session.query = query
        session.backPath = '/search'
        session.lastPath = '/search'
        session.save()

        return searchDucks(id, token, query) // return es necesario si queremos ahorrarnos un catch y dejar que se recoja el valor en el siguiente catch.
          .then(ducks => res.render('search', { path: '/search', query, name, logout: '/logout', results: ducks, favPath: '/fav', detailPath: '/ducks', favoritePath: '/favorites' }))
      })
      .catch(({ message }) => res.render('search', { path: '/search', query, name, logout: '/logout', error: message, favoritePath: '/favorites' }))
  } catch ({ message }) {
    res.render('search', { path: '/search', query, name, logout: '/logout', error: message, favoritePath: '/favorites' })
  }
})

app.post('/logout', (req, res) => {
  const { session } = req
  session.destroy(() => {
    res.clearCookie('connect.sid', { path: '/' })
    // res.setHeader('set-cookie', 'connect.sid=""; expires=Thu, 01 Jan 1970 00:00:00 GMT')
    res.redirect('/')
  })
})

app.get('/favorites', (req, res) => {
  try {
    let { session, query: { query } } = req
    if (!session) return res.redirect('/login')
    const { userId: id, token } = session
    if (!token) return res.redirect('/login')
    const { isClickedFavorites } = session

    session.isClickedFavorites = true
    session.backPath = '/favorites'
    session.lastPath = '/favorites'
    session.save()

    retrieveUser(id, token)
      .then(userData => {
        name = userData.name

        return retrieveFavDucks(id, token)
          .then(ducks => res.render('search', { path: '/search', name, logout: '/logout', favorites: ducks, detailPath: '/ducks', favPath: '/fav', favoritePath: '/favorites', isClickedFavorites }))
          .then(() => session.isClickedFavorites = false)
      })
      .catch(({ message }) => {
        res.render('search', { path: '/search', name, logout: '/logout', error: message, favoritePath: '/favorites' })
      })
  } catch ({ message }) {
    res.render('search', { path: '/search', name, logout: '/logout', error: message, favoritePath: '/favorites' })
  }
})

app.post('/fav', formBodyParser, (req, res) => {
  try {
    const { session, body: { id: duckId }, headers: { referer } } = req
    if (!session) return res.redirect('/login')
    const { userId: id, token } = session
    if (!token) return res.redirect('/login')

    toggleFavDuck(id, token, duckId)
      .then(() => {
        res.redirect(referer)
      })
      .catch(({ message }) => {
        res.render('search', { path: '/search', name, logout: '/logout', error: message, favoritePath: '/favorites' })
      })
  } catch ({ message }) {
    res.render('search', { path: '/search', name, logout: '/logout', error: message, favoritePath: '/favorites' })
  }
})

app.get('/ducks/:id', (req, res) => {
  try {
    const { session, params: { id: duckId } } = req

    if (!session) return res.redirect('/login')
    const { userId: id, token, query } = session
    if (!token) return res.redirect('/login')
    let name
    const { backPath } = req.session

    session.duckId = duckId
    session.lastPath = `/ducks/${session.duckId}`
    session.save()

    retrieveUser(id, token)
      .then(userData => {
        name = userData.name

        return retrieveDuck(id, token, duckId)
          .then(duck => res.render('search', { path: '/search', name, logout: '/logout', item: duck, favPath: '/fav', favDetailPath: '/favDetail', backPath, favoritePath: '/favorites' }))
      })
      .catch(({ message }) => res.render('search', { path: '/search', query, name, logout: '/logout', error: message, favoritePath: '/favorites' }))
  } catch ({ message }) {
    res.render('search', { path: '/search', query, name, logout: '/logout', error: message, favoritePath: '/favorites' })
  }
})

app.listen(port, () => console.log(`server running on port ${port}`))
