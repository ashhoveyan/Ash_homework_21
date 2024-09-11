import sequelize from '../clients/sequelize.mysql.js';
import { DataTypes, Model } from 'sequelize';

import Users from '../models/Users.js';

class Posts extends Model {}

Posts.init(
    {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },

    {
        sequelize,
        timestamps: true,
        tableName: 'posts',
        modelName: 'posts',
    }
);

Users.hasMany(Posts, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
Posts.belongsTo(Users, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
export default Posts;