const { DataTypes, Model } = require('sequelize');

class User extends Model {
  static init(sequelize) {
    super.init({
      Email: {
        type:DataTypes.STRING(50),
        primaryKey: true
      },
      Username: DataTypes.STRING,
      Password: DataTypes.STRING,
      Classes: DataTypes.JSON,
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