const Sequelize = require('sequelize')
const { clave } = require('../clave.js')

const db = new Sequelize('sequeface', 'postgres', clave, { 
  //usuario ycontraseña son tus credenciales local MySQL
  host: 'localhost',
  dialect: 'postgres'
}); //

// IIFE
(async () => {
  try {
    await db.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
})()

module.exports = db