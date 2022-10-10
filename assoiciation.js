const Sequelize = require("sequelize");
const { DataTypes, Op } = Sequelize;
const sequelize = new Sequelize("sequelize-video", "root", "code", {
  dialect: "mysql",
});

const Country = sequelize.define(
  "country",
  {
    countryName: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

const Capital = sequelize.define(
  "capital",
  {
    capitalName: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: false,
  }
);

Country.hasOne(
  Capital
  //can set foreign key like this
  // , {foreignKey: 'soccer'}
);

sequelize
  .sync({ alter: true })
  .then(() => {
    //working with our updated table
    return Country.findOne({ where: { countryName: "Spain" } });
  })
  .then((data) => {
    country = data;
    //get helper method
    return country.getCapital();
  })
  .then((data) => {
    console.log(data.toJSON());
  })
  .catch((err) => {
    console.log(err);
  });
