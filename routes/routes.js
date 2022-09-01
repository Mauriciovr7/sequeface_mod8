const { Router } = require('express')
const router = Router()
const { User, Message, Comment } = require('../db/models')
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

  /* if (req.session.likes == undefined) {
    req.session.likes = 0
  } */

  if (req.session.mensajes == undefined) {
    req.session.mensajes = []
  }

  const mensajes = await Message.findAll({ include: 'user' });
  mensajes.forEach((item) => {
    const id = item.id
    const likes = item.likes
    const us = item.user.firstName
    const msj = item.message
    const fecha = item.createdAt
    // console.log('id, likes, us, msj, fecha ', id, likes, us, msj, fecha);

    req.session.mensajes.push({ id, likes, us, msj, fecha })
  })
  const comentarios = await Comment.findAll({ include: 'user', include: 'message' });
  console.log('us ', req.session.user);
  // console.log('msj ', req.session.mensajes);
  // console.log('lks ',req.session.likes);

  req.session.comentarios = comentarios

  res.render('index.html', { user: req.session.user, mensajes: req.session.mensajes, comentarios: req.session.comentarios }) //, likes: req.session.likes })
})

router.get('/dos', (req, res) => {
  res.render('dos.html', { user: req.session.user })
})

router.get('/tres', (req, res) => {
  res.render('tres.html', { user: req.session.user })
})

// post message
router.post('/message', async (req, res) => {
  if (req.session.mensajes == undefined) {
    req.session.mensajes = []
  }
  const likes = 0
  try {
    const mensaje = req.body.mensaje.trim() //////

    console.log('mensaje user id ', mensaje, req.session.user);
    const userEmail = req.session.user.email ////

    console.log('userEmail ', userEmail);
    /*  const us_id = await User.findOne({
       where: { email: userEmail }
     }) */
    // console.log('us_id ', us_id);

    await Message.create({
      UserId: userEmail,
      message: mensaje,
      likes
    })

    const mess = await Message.findAll({ include: 'user', include: 'comment' }); /************** */

    // console.log('mess ', mess);
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
      const us = item.user.firstName
      const msj = item.message
      const fecha = item.createdAt
      console.log('id, likes, us, msj, fecha ', id, likes, us, msj, fecha);

      req.session.mensajes.push({ id, likes, us, msj, fecha })
    })
    //req.session.mensajes.push({ us, msj, fecha })

    res.redirect('/')

  } catch (error) {
    res.status(400)//.redirect('/')

    // res.status(400).json({ error })
  }
})

// router.post('/like', async (req, res) => {
router.post('/like/:id', async (req, res) => { // req.params.id // id ok
  // const likes = 1
  let likes
  const id = req.params.id
  console.log('post likesssss');
  console.log('params id ', req.params.id); // ok
  /* const like = req.body.like
  const likes = 1
  console.log('lk ',like); */

/*   if (req.session.likes == undefined) {
    req.session.likes = 0
  } */ 

    // req.session.likes += likes
    // req.session.likes ++
    // console.log('likes ',req.session.likes);

    
     const mess = await Message.findOne({
       where: { id }
     })
     console.log('mess like ', mess.likes);
     likes = mess.likes + 1

  await Message.update(
    {
      likes
    },
    {
      where: { id }
    })

  res.redirect('/')
})

// post comment
router.post('/comment', async (req, res) => {
  if (req.session.comentarios == undefined) {
    req.session.comentarios = []
  }
  const likes = 0
  try {
    const mensaje = req.body.mensaje.trim()

    console.log('mensaje user id ', mensaje, req.session.user);
    const userEmail = req.session.user.email

    console.log('userEmail ', userEmail);
    /*  const us_id = await User.findOne({
       where: { email: userEmail }
     }) */
    // console.log('us_id ', us_id);

    await Comment.create({
      UserId: userEmail,
      comment: mensaje,
      likes
    })

    const mess = await Comment.findAll({ include: 'user' });

    // console.log('mess ', mess);

    mess.forEach((item) => {
      // messas.push(item.UserId, item.message, item.createdAt)
      const id = item.id
      const likes = item.likes
      const us = item.user.firstName
      const msj = item.comment
      const fecha = item.createdAt
      console.log('id, likes, us, msj, fecha ', id, likes, us, msj, fecha);

      req.session.comentarios.push({ id, likes, us, msj, fecha })
    })
    //req.session.mensajes.push({ us, msj, fecha })

    res.redirect('/')

  } catch (error) {
    res.status(400)
  }
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