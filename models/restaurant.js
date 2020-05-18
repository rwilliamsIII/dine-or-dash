module.exports = function(sequelize, DataTypes) {
    var Restaurant = sequelize.define("Restaurant", {
        resID: {
            type: DataTypes.STRING,
            allowNull: false
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
        liked: {
            type: DataTypes.BOOLEAN
        },
        favorited: {
            type: DataTypes.BOOLEAN
        }
    });
    return Restaurant;
};