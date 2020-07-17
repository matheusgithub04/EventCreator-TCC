/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Participants = sequelize.define('participants', {
    id_part: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id_users'
      }
    },
    id_team: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'team',
        key: 'id_time'
      }
    }
  }, {
    tableName: 'participants',
    timestamps: false,
  });

  Participants.removeAttribute('id')
  const user = require('./users')

  const User = user(sequelize, DataTypes)
  Participants.belongsTo(User, {foreignKey: 'id_part', as: 'user'})

  return Participants
};
