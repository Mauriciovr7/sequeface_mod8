// const express = require('express')
// const router = express.Router()
const { Router } = require('express')
const router = Router()
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
  res.render('index.html', {user: req.session.user})
})

router.get('/dos', (req, res) => {
  res.render('dos.html', {user: req.session.user})
})

router.get('/tres', (req, res) => {
  res.render('tres.html', {user: req.session.user})
})

// user POST
router.post('/user', async (req, res) => {

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

// users GET
router.get('/users', async (req, res) => {

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

// user PUT
router.put('/user', async (req, res) => {
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

// user DELETE
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
/* app.post('/transferencia', async (req, res) => {
  try {
    const form = await f.getForm(req)
    const emisor = form.emisor
    const receptor = form.receptor
    const valor = form.monto

    const us_emisor = await User.findOne({
      where: { nombre: emisor },
      include: [{
        model: Transferencia
      }]
    })

    if (f.balanceValid(valor, us_emisor.balance) && f.emisorValid(emisor, receptor)) {

      const us_receptor = await User.findOne({
        where: { nombre: receptor },
        include: [{
          model: Transferencia
        }]
      })

      await Transferencia.create({
        valor,
        emisor: us_emisor.id,
        receptor: us_receptor.id
      })

      const user = await User.findOne({
        where: { id: us_emisor.id },
        include: [{
          model: Transferencia
        }]
      })

      const nuevo_valor = user.balance - valor

      await User.update(
        {
          balance: nuevo_valor
        },
        {
          where: { id: us_emisor.id }
        })
      const nuevo_valor_receptor = parseInt(us_receptor.balance) + parseInt(valor)

      await User.update(
        {
          balance: nuevo_valor_receptor
        },
        {
          where: { id: us_receptor.id }
        })
      res.json(user)
    }

  } catch (error) {
    res.status(400).json({ error })
  }
}) */

// transferencias GET
/* app.get('/transferencias', async (req, res) => {
  try {
    const transferencias = await Transferencia.findAll({ include: 'user' })

    let datos = []
    for (const transferencia of transferencias) {
      emisor = await User.findOne({
        where: { id: transferencia.emisor }
      }, {
        attributes: ['nombre'],
        include: [{
          model: Transferencia
        }]
      })

      receptor = await User.findOne({
        where: { id: transferencia.receptor }
      }, {
        attributes: ['nombre'],
        include: [{
          model: Transferencia
        }]
      });
      (receptor === null) ? receptor = 'Eliminado' : receptor = receptor.nombre
      emisor = emisor.nombre
      datos.push([transferencia.id, emisor, receptor, transferencia.valor, transferencia.createdAt])
    }

    res.send(datos)

  } catch (error) {
    console.log(error)
  }
}) */

/* app.use((req, res) => {
  res.status(404).send(`
  <html>
    <h2>...ruta no existe</h2>
    <a href="/">
      <button>Volver</button>
    </a>
  </html>`)
}) */

// ruta 404
router.get('*', (req, res) => {
  res.render('404.html')
})

module.exports = router
