const { DataTypes } = require('sequelize')
const db = require('./db_conection.js')

// const bcrypt = require('bcrypt')

// User
const User = db.define('User',
  {
    firstName: {
      type:
        DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type:
        DataTypes.STRING,
      allowNull: false
    },
    email: {
      type:
        DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: { // comprueba que el patrón de correo electrónico sea correcto. msg: "Must be a valid email."
        }
      }
    },
    password: {
      type:
        DataTypes.STRING,
      allowNull: false,
      confirmPassword: {
        type:
          DataTypes.VIRTUAL,
        get() {
          return
          this.confirmPassword;
        },
        set(value) {
          this.setDataValue('confirmPassword',
            value);
        }
      }
    }
  }, { timestamps: true });

// Message
const Message = db.define('Message', {
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, { timestamps: true })

// Comment
const Comment = db.define('Comment', {
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, { timestamps: true })

User.hasMany(Message) // ok
User.hasMany(Comment) // ok

Message.belongsTo(User) // ok Userid
Message.hasMany(Comment) // ok

Comment.belongsTo(Message) // ok Messageid
Comment.belongsTo(User) // ok Userid
// Transferencia.belongsTo(Usuario, { foreignKey: "receptor", onDelete: 'CASCADE' })

try {
  db.sync()
} catch (err) {
  console.log(`Error en la sicnronizacion`, err)
}

/* User.beforeValidate(function(next) {
  if(this.password != this.confirmPassword) {
  throw new Error('Passwords do not  match.');
  }
  next(); // ejecute el próximo middleware o la siguiente  función (en este caso, las validaciones normales).
}) */
  

// mas fácil y rápido , hace la union sólo con fkey automática de sequelize (usuarioId)
module.exports = { User } //, Transferencia }