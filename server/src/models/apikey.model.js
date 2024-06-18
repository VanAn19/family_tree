'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Apikey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Apikey.init({
    key: DataTypes.STRING,
    status: DataTypes.BOOLEAN,
    permissions: {
        type: DataTypes.JSON,
        allowNull: false,
        validate: {
            isArrayOfEnum(value) {
                if (!Array.isArray(value)) {
                    throw new Error('Permissions must be an array');
                }
                const allowValues = ['0000','1111','2222'];
                value.forEach(val => {
                    if (!allowValues.includes(val)) {
                        throw new Error(`Invalid permission value: ${val}`);
                    }
                });
            }
        }
    }
  }, {
    sequelize,
    modelName: 'Apikey',
  });
  return Apikey;
};