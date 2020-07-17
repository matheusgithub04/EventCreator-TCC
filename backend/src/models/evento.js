/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Event = sequelize.define('evento', {
    id_event: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    localidade: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    lat: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    lon: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    modalidade: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    datainicio: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    datafinal: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    state: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    horaevento: {
        type: DataTypes.TIME,
        allowNull: false
    },
    id_org: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id_users'
      }
    },
    win_end: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id_users'
      }
    },
    qtdParticipantes: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
  }, {
    tableName: 'evento',
    timestamps: false
  });
  
  const users = require('./users')

  const User = users(sequelize, DataTypes)
  Event.belongsTo(User, {foreignKey: 'id_org', as: 'users'})
  Event.belongsTo(User, {foreignKey: 'win_end', as: 'vencedor'})

  return Event
};
