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
router.get('/', protected_route, async (req, res) => { // ruta protegida
  /* if (req.session.mensajes == undefined) {
    req.session.mensajes = []
  }
  if (req.session.likes == undefined) {
    req.session.likes = 0
  }

  const mess = await Message.findAll({ include: 'user' });

  mess.forEach((item) => {
    // messas.push(item.UserId, item.message, item.createdAt)
    const us=item.user.firstName
    const msj=item.message
    const fecha=item.createdAt
    const id=item.id
    console.log('id us, msj, fecha ', id, us, msj, fecha);

    req.session.mensajes.push({ id, us, msj, fecha })
  }) */

  console.log('us ',req.session.user);
  console.log('msj ',req.session.mensajes);
  console.log('lks ',req.session.likes);

  res.render('index.html', {user: req.session.user, mensajes: req.session.mensajes, likes: req.session.likes })
})

router.get('/dos', (req, res) => {
  res.render('dos.html', {user: req.session.user})
})

router.get('/tres', (req, res) => {
  res.render('tres.html', {user: req.session.user})
})

// post message
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

    console.log('mess ', mess);
    /*
    const mess = await Message.findByPk(1, { include: 'user' });
    console.log('mess ', mess);
    console.log('mess *****************',mess.toJSON())
    console.log('obj ', mess.user.firstName);
    */
    // res.send({mess})
    // const messas = []

    mess.forEach((item) => {
      // messas.push(item.UserId, item.message, item.createdAt)
      const id = item.id
      const likes = item.likes
      const us=item.user.firstName
      const msj=item.message
      const fecha=item.createdAt
      console.log('id likes, us, msj, fecha ',id, us, msj, fecha);

      req.session.mensajes.push({ id, likes, us, msj, fecha })
    })
    //req.session.mensajes.push({ us, msj, fecha })
    
    res.redirect('/')

  } catch (error) {
    res.status(400).redirect('/')

    // res.status(400).json({ error })
  }
})

// router.post('/like', async (req, res) => {
router.post('/like/:opcion', async (req, res) => { // req.params.opcion
  console.log('params ', req.params.opcion);
  console.log('body ', req.body);
  const like = req.body.like
  const likes = 1
  console.log('lk ',like);

  if (req.session.likes == undefined) {
    req.session.likes = 0
  }

  if (like) {

    req.session.likes += likes
    console.log('likes ',req.session.likes);
  }

  await Message.update(
    {
      likes: req.session.likes
    },
    {
      where: { id: like }
    })

  res.redirect('/')
})

// ruta 404
router.get('*', (req, res) => {
  res.render('404.html')
})

module.exports = router

/*
BONUS para el Muro: 
- Debe poder llevar registro de qué usuario le dió like a qué mensaje. Debe poder eliminar el propio like de un mensaje. 
- Al agregar un mensaje, se puede (opcionalmente) adjuntar una imagen
*/