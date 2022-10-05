const Sequelize = require("sequelize");
//do not need to require mysql2 because it is done internally by sequelize

//this is the constructor function
const sequelize = new Sequelize("sequelize-video", "root", "code", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  define: {
    //freezes table names for all tables
    freezeTableName: true,
  },
});

//authenticate returns a promise
sequelize
  .authenticate()
  .then(() => {
    console.log("connection successful!");
  })
  .catch((err) => {
    console.log("error connecting to database", err);
  });

console.log("another task");

//drop tables that end with "_test"
sequelize.drop({ match: /_test$/ });

const Users = sequelize.define(
  "user",
  {
    user_id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoincrement: true,
    },
    username: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.DataTypes.STRING,
    },
    age: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: 21,
    },
    WittCodeRocks: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

console.log(sequelize.models.user);

//alter:true alters the tables. force: true drops and creates a new table
Users.sync({ alter: true })
  .then((data) => {
    console.log("table and model synced successfully");
  })
  .catch((err) => {
    console.log("error syncing table and model");
  });
