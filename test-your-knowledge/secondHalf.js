const Sequelize = require("sequelize");
//do not need to require mysql2 because it is done internally by sequelize
const { DataTypes, Op } = Sequelize;

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
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4, 9],
      },
    },
    password: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
      defaultValue: 21,
    },
    WittCodeRocks: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

Users.sync({ alter: true })
  .then(() => {
    //_______similar to toJSON() but it can be used on json objects
    // return Users.findAll({
    //   raw: true,
    // });
    // ______raw with where
    // return Users.findAll({
    //   where: { age: 13 },
    //   raw: true,
    // });
    //______ find by primary key
    // return Users.findByPk(18);
    //______ find the first one
    // return Users.findOne();
    //______ find the first where age is less than 5 or null
    // return Users.findOne({
    //   where: {
    //     age: {
    //       [Op.or]: {
    //         [Op.lt]: 7,
    //         [Op.eq]: null,
    //       },
    //     },
    //   },
    // });
    //____ find or create one that meets where condition
    // return Users.findOrCreate({ where: { username: "PizzaGuy" }, raw: true });
    //____ find or create one that meets where condition and add new default
    // return Users.findOrCreate({
    //   where: { username: "Pizza" },
    //   defaults: { age: 76 },
    //   raw: true,
    // });
    //______
    return Users.findAndCountAll({
      where: {
        username: "Micaela",
      },
      raw: true,
    });
  })
  .then((data) => {
    const { count, rows } = data;
    console.log(count);
    console.log(rows);
  })

  .catch((err) => {
    console.log(err);
  });
