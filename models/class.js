const { DataTypes, Model} = require('sequelize');

class Class extends Model {
    static init(sequelize) {
        super.init({
            ClassName:DataTypes.STRING(10),
            ClassTimeCode: DataTypes.JSON,
            ClassTimeFull: DataTypes.STRING(10),
            ClassRequirements: DataTypes.JSON,
            ClassCode: {
                type: DataTypes.STRING(10),
                primaryKey: true
            }
        }, {
            sequelize, modelName: 'Class'
        })
    }
}
module.exports = Class;