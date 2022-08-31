// const express = require('express')
// const router = express.Router()
const { Router } = require('express')
const router = Router()
const { User, Message } = require('../db/models')
// const f = require('./functions')

// funcion middleware
function protected_route(req, res, next) { // esta func se pone a las rutas q seran protegidas
  if (!req.session.user) {
    req.flash('errors', 'Debe logearse')
    return res.redirect('/login')
  }
  // si llegamos hasta acá, guardamos el usuario de la sesión en una variable de los templates
  res.locals.user = req.session.user;
  // finalmente, seguimos el camino original
  next()
}
// rutas
router.get('/', protected_route, (req, res) => { // ruta protegida
  console.log('us ',req.session.user);
  console.log('msj ',req.session.mensajes);
  console.log('msj ',req.session.likes);

  res.render('index.html', {user: req.session.user, mensajes: req.session.mensajes, likes: req.session.likes })
})

router.get('/dos', (req, res) => {
  res.render('dos.html', {user: req.session.user})
})

router.get('/tres', (req, res) => {
  res.render('tres.html', {user: req.session.user})
})

// user POST
/* router.post('/user', async (req, res) => {

  try {

    const form = await f.getForm(req)
    const nombre = form.nombre.replace(/\s+/g, ' ').trim()
    const balance = form.balance.trim()

    if (f.userValid(nombre) && f.balanceValid(balance)) {

      const usName = await User.findOne({
        where: { nombre },
        include: [{
          model: Transferencia
        }]
      })

      if (usName != null) { if (usName.nombre) { throw 'user ya existe' } }

      await User.create({
        nombre,
        balance
      })
      res.json({})
    }

  } catch (error) {

    console.log("Error user no ingresado: " + error)
    res.status(400).json({ error })
  }
})

 */// users GET
/* router.get('/users', async (req, res) => {

  try {

    const users = await User.findAll({
      include: [{
        model: Transferencia
      }]
    })

    res.json(users)

  } catch (error) {
    console.log(error)
  }
})

 */// user PUT
/* router.put('/user', async (req, res) => {
  const form = await f.getForm(req)

  const nombre = form.name
  const balance = form.balance
  const id = req.query.id
  if (id) {

    try {
      if (f.userValid(nombre) && f.balanceValid(balance)) {
        const user = await User.findOne({
          where: { id },
          include: [{
            model: Transferencia
          }]
        })

        await User.update(
          {
            nombre,
            balance
          },
          {
            where: { id }
          })
        res.json(user)

      }

    } catch (error) {
      console.log("Error user no ingresado: " + error)
      res.status(400).json({ error })
    }
  }

})

 */// user DELETE
/* app.delete('/user', async (req, res) => {
  const id = req.query.id
  if (id) {
    try {

      await Transferencia.destroy({
        where: { emisor: id }
      })

      await User.destroy({
        where: { id }
      })


      res.json({})
    } catch (error) {
      console.log("Surgió un error: " + error)
      return res.status(400).redirect('/') // 400 error
    }
  }
})
 */

// transferencia POST
router.post('/message', async (req, res) => {
  if (req.session.mensajes == undefined) {
    req.session.mensajes = []
  }
  if (req.session.likes == undefined) {
    req.session.likes = 0
  }
  try {
    const mensaje = req.body.mensaje.trim()
    
    if (mensaje == '') {
      console.log('sin mensaje ')
      return res.redirect('/')
      
    }
    console.log('mensaje user id ', mensaje, req.session.user);
    const userEmail = req.session.user.email

    console.log('userEmail ',userEmail);
   /*  const us_id = await User.findOne({
      where: { email: userEmail }
    }) */
    // console.log('us_id ', us_id);

    await Message.create({
      UserId: userEmail,
      message: mensaje      
    })

    const mess = await Message.findAll({ include: 'user' });
    // const messas = []
    mess.forEach((item) => {
      // messas.push(item.UserId, item.message, item.createdAt)
      const us=item.UserId
      const msj=item.message
      const fecha=item.createdAt
      console.log('us, msj, fecha ',us, msj, fecha);

      req.session.mensajes.push({ us, msj, fecha })
    })
    
    res.redirect('/')

  } catch (error) {
    res.status(400).redirect('/')

    // res.status(400).json({ error })
  }
})

router.post('/like', (req, res) => {
  const opcion = req.body.opcion
  const likes = 1
  console.log('op ',opcion);

  if (req.session.likes == undefined) {
    req.session.likes = 0
  }

  if (opcion) {

    req.session.likes += likes
    console.log('likes ',req.session.likes);
  }
  res.redirect('/')
})

// ruta 404
router.get('*', (req, res) => {
  res.render('404.html')
})

module.exports = router
