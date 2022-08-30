// const express = require('express')
// const router = express.Router()
const { Router } = require('express')
const router = Router()
const bcrypt = require('bcrypt')
const { User, Message } = require('../db/models')
// const DB = require('../db/dbUsers')
// const f = require('../functions')

//  get login , ruta que carga el formulario del login
router.get('/login', (req, res) => {
  const messages = req.flash() //
  res.render('login.html', { messages })
})

// post login , ruta que procesa el formulario de Login
router.post('/login', async (req, res) => {

  // 1. me traigo los datos del formulario
  const email = req.body.email.trim()
  const password = req.body.password.trim()

  console.log('22 email ', email)

  try {
    if (email) {

      // 2. intento buscar al usuario en base a su email y contraseña 
      let user_buscado = await User.findOne({
        where: { email }
      })

      console.log('user_buscado ', user_buscado);
      // if (user_buscado = []) {
      if (!user_buscado) {
        console.log('user no found');
        req.flash('errors', 'Usuario es inexistente o contraseña incorrecta') // medida de seguridad
        return res.redirect('/login')
      }

      // 3. verificamos las contraseñas
      console.log('compare pass ', password, user_buscado.password);
      const son_coincidentes = await bcrypt.compare(password, user_buscado.password)
      if (!son_coincidentes) {
        req.flash('errors', 'Usuario es inexistente o contraseña incorrecta') // medida de seguridad
        return res.redirect('/login')
      }

      // PARTE FINAL
      req.session.user = {
        name: user_buscado.firstName,
        email: user_buscado.email
      }
      console.log('req.session.user ',req.session.user);
      // return res.redirect('/')
      res.redirect('/')
    }

  } catch (error) {
    console.log("Error usuario no ingresado: " + error)
    return res.redirect('/login')
    // res.status(400).json({ error })
  }



})

// get register
router.get('/register', (req, res) => {
  const messages = req.flash() //

  console.log(messages);
  res.render('register.html', messages) // los paso al template
})

// post register
router.post('/register', async (req, res) => {
  // 1. me traigo los datos del formulario
  const firstName = req.body.name.trim()
  const lastName = req.body.surname.trim()
  const email = req.body.email.trim() // para verificar email habría q usar un servidor de email, ejem firebase
  const pass = req.body.password.trim() // uar regex
  const re_password = req.body.re_password.trim()

  // 2. validamos que contraseñas coincidan
  if (pass != re_password) {
    console.log('Contraseñas no coinciden')
    req.flash('errors', 'Las claves no coinciden')
    return res.redirect('/register')
  }

  // 3. Verificamos si el usuario existe o no
  //if (!user_buscado) {
  console.log('Usuario exista email ', email)
  try {
    // 3. validamos que no exista otro usuario con ese mismo correo
    const current_user = await User.findOne({
      where: { email }
    })
    if (current_user) {
      req.flash('errors', 'Ese email ya está ocupado')
      return res.redirect('/register')
    }

    // 4. Finalmente lo agregamos a la base de datos
    const password = await bcrypt.hash(pass, 10)
    await User.create({
      firstName, lastName, email, password
    })
    req.session.user = { firstName, email }

    // 5. y redirigimos a la ruta principal
    res.redirect('/')

  } catch (error) {
    console.log(error)
  } /* finally {
      // res.end()
      // res.redirect('/')
      return res.redirect('/login')
    } */
  /* } else {
    console.log('Usuario ya registrado')
    return res.redirect('/register')
  } */
})

// logout
router.get('/logout', (req, res) => {
  req.session.user = null
  res.redirect('/login')
})

module.exports = router
