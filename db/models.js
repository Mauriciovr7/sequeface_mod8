const { DataTypes } = require('sequelize')
const db = require('./db_conection.js')

// const bcrypt = require('bcrypt')

// User
const User = db.define('user',
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
        primaryKey: true,
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
const Message = db.define('message', {
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, { timestamps: true })

// Comment
const Comment = db.define('comment', {
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, { timestamps: true })

// relations
User.hasMany(Message, {
  foreignKey: 'UserId',
  sourceKey: 'email'
}) // ok
User.hasMany(Comment, {
  foreignKey: 'UserId',
  sourceKey: 'email'
}) // ok

Message.belongsTo(User, {
  foreignKey: 'UserId',
  targetId: 'email'
}) // ok Userid
Message.hasMany(Comment, {
  foreignKey: 'MessageId',
  sourceKey: 'id'
}) // ok

Comment.belongsTo(Message, {
  foreignKey: 'MessageId',
  sourceKey: 'id'
}) // ok Messageid
Comment.belongsTo(User, {
  foreignKey: 'UserId',
  sourceKey: 'email'
}) // ok Userid
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
module.exports = { User, Message } //, Transferencia }