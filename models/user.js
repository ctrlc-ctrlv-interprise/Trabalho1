const { DataTypes, Model } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init({
      Email: {
        type:DataTypes.STRING(50),
        primaryKey: true
      },
      FirstName: DataTypes.STRING,
      Password: DataTypes.STRING,
      Classes: DataTypes.STRING,
      Roles: {
        type: DataTypes.INTEGER,
        defaultValue: 200
      },
      RefreshToken:{
        type: DataTypes.STRING
      }
    }, {
      sequelize, modelName: 'User',
    })
  };
}
module.exports = User;