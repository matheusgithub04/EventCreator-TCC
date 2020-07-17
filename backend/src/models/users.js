/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('users', {
    id_users: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: false,
      references: {
        model: 'login',
        key: 'cpf'
      }
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING(13),
      allowNull: true
    },
    logradouro: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    numero: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    bairro: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    complemento: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cidade: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    uri: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    wins: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: false
  });

  const login = require('./login')

  const Login = login(sequelize, DataTypes)
  User.belongsTo(Login, {foreignKey: 'cpf', as: 'login'})

  return User
};
