const { Sequelize, DataTypes } = require("sequelize");
const connection = require("./database");

const Offer = connection.define("offers", {
  price: {
    type: DataTypes.DOUBLE(10, 2),
    allowNull: false,
  },
  product: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image_url: {
    type: DataTypes.STRING,
  },
  link: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  source: {
    type: DataTypes.STRING,
  },
  store: {
    type: DataTypes.STRING,
  },
  coupon: {
    type: DataTypes.STRING,
  },
  active: {
    type: DataTypes.ENUM("yes", "no"),
    defaultValue: "yes",
  },
  published: {
    type: DataTypes.ENUM("yes", "no"),
    defaultValue: "no",
  },
  review: {
    type: DataTypes.ENUM("yes", "no"),
    defaultValue: "no",
  },
});


Offer.sync({ force : false }).then( () => {
    console.log("Criou as models")
})

module.exports = Offer;