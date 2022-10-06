const Sequelize = require("sequelize");

const { DataTypes, Op } = Sequelize;

const sequelize = new Sequelize("test_db", "root", "code", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  define: {
    freezeTableNames: true,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log("error connecting to database", err);
  });
