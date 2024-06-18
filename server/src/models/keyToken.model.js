'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class KeyToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      KeyToken.belongsTo(models.User, {
        foreignKey: 'user',
      });
    }
  }
  KeyToken.init({
    user: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
    },
    publicKey: DataTypes.STRING,
    privateKey: DataTypes.STRING,
    refreshTokensUsed: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    refreshToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'KeyToken',
  });
  return KeyToken;
};