module.exports = function(sequelize, DataTypes) {
    var Restaurant = sequelize.define("Restaurant", {
        resID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pic_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        yelp_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rating: {
            type: DataTypes.STRING,
            allowNull: false
        },
        liked: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        favorited: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
    return Restaurant;
};