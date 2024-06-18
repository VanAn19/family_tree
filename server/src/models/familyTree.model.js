'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FamilyTree extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FamilyTree.hasMany(models.FamilyMember, {
        foreignKey: 'familyTreeId',
      });
      FamilyTree.belongsTo(models.User, {
        foreignKey: 'userCreateId',
      });
    }
  }
  FamilyTree.init({
    name: DataTypes.STRING,
    userCreateId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
    },
    ancestorName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'FamilyTree',
  });
  return FamilyTree;
};