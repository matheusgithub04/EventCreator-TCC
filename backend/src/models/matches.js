/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const Matches = sequelize.define('matches', {
    id_matches: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    partida: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    pri_part: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'team',
        key: 'id_time'
      }
    },
    seg_part: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'team',
        key: 'id_time'
      }
    },
    id_evento: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'evento',
        key: 'id_event'
      }
    },
    state: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    resultado: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    perdedor: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    tableName: 'matches',
    timestamps: false
  });
  const team = require('./team')

  const Team = team(sequelize, DataTypes)
  Matches.belongsTo(Team, {foreignKey: 'pri_part', as: 'primeiro'})
  Matches.belongsTo(Team, {foreignKey: 'seg_part', as: 'segundo'})

  return Matches
};
