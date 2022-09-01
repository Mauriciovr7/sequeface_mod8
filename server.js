const express = require('express')
const session = require('express-session')
const nunjucks = require('nunjucks')
const path = require('path')
const flash = require('connect-flash')
const {Pool} = require('pg') // nuevo *****
const pgSession = require('connect-pg-simple')(session)

// const router = require('./routes')

// const { User, Message, Comment } = require('./db/models')
// const f = require('./controllers/functions')

const app = express()

const port = 3000

// se configura uso de sesiones
// app.use(session({secret: '***'}))

// psql -U postgres -f node_modules/connect-pg-simple/table.sql sequeface // digitar esto en terminal despues de habilitar Pool

const pool = new Pool({ // nuevo *****
  database: 'sequeface',
  user: 'postgres',
  password: require('./clave').clave
  /*
  min: 3,
  max: 20,
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 2000,
  port: 5432
  */
})

app.use(session({
  store: new pgSession({
    pool: pool
  }),
  secret: '***',
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // expira en 30 dias
}))

// se configuran archivos estáticos
app.use(express.static('./node_modules/bootstrap/dist'))
app.use(express.static('public'))

// se configura uso de formularios
app.use(express.urlencoded({extended: true}))

// uso de flash
app.use(flash())

// se configura nunjucks
nunjucks.configure(path.resolve(__dirname, "templates"), {
  express: app,
  autoscape: true,
  noCache: true,
  watch: true
})

// se traen las rutas
// app.use(router)
app.use(require('./routes/auth'))
app.use(require('./routes/routes'))

app.listen(port, () => {
  console.log(`Servidor en puerto http://localhost:${port}`)
})

// nodemon server
