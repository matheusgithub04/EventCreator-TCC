/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Team = sequelize.define('team', {
    id_time: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nome_time: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    id_part: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id_users'
      }
    },
    id_event: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'evento',
        key: 'id_event'
      }
    },
    modalidade: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    id_chaveamento: {
      type: DataTypes.INTEGER(11),
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
    tableName: 'team',
    timestamps: false
  });

  const users = require('./users')
  const events = require('./evento')

  const User = users(sequelize, DataTypes)
  const Event = events(sequelize, DataTypes)

  Team.belongsTo(User, {foreignKey: 'id_part', as: 'users'})
  Team.belongsTo(Event, {foreignKey: 'id_event', as: 'evento'})

  return Team
};
