'use strict';
const {
  Model
} = require('sequelize');
const crypto = require('crypto');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.KeyToken, {
        foreignKey: 'user',
      });
      User.hasMany(models.FamilyTree, {
        foreignKey: 'userCreateId',
      });
    }
    createPasswordChangedToken() {
      const resetToken = crypto.randomBytes(32).toString('hex');
      this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      this.passwordResetExpires = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes
      return resetToken;
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    passwordChangedAt: DataTypes.STRING,
    passwordResetToken: DataTypes.STRING,
    passwordResetExpires: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};