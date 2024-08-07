'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FamilyMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FamilyMember.belongsTo(models.FamilyTree, {
        foreignKey: 'familyTreeId',
      });
    }
  }
  FamilyMember.init({
    familyTreeId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'FamilyTrees',
            key: 'id'
        },
    },
    fatherId: DataTypes.INTEGER,
    motherId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
    childrenId: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    name: DataTypes.STRING,
    citizenIdentification: DataTypes.STRING,
    dateOfBirth: DataTypes.STRING,
    age: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    avatar: DataTypes.STRING,
    relationship: DataTypes.STRING,
    job: DataTypes.STRING,
    isAlive: DataTypes.BOOLEAN,
    deathOfBirth: DataTypes.STRING,
    isAncestor: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'FamilyMember',
  });
  return FamilyMember;
};