module.exports = function(sequelize, DataTypes) {
  const Login = sequelize.define('login', {
    cpf: {
      type: DataTypes.STRING(11),
      allowNull: false,
      primaryKey: true
    },
    senha: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'login',
    timestamps: false
  });
  return Login
};
