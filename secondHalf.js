const Sequelize = require("sequelize");
//do not need to require mysql2 because it is done internally by sequelize
const { DataTypes, Op } = Sequelize;
//bcrypt is a password-hashing function - A library to help you hash passwords.
const bycrypt = require("bcrypt");
//make things smaller with this
const zlib = require("zlib");
const { get } = require("http");
const { truncateSync } = require("fs");

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
      //this getter gets user.username without user.get() so we don't create an infinite loop
      get() {
        const rawValue = this.getDataValue("username");
        //return value in uppercase letters
        return rawValue.toUpperCase();
      },
    },
    password: {
      type: DataTypes.STRING,
      //value = user.password without user.set()
      // set(value) {
      //   //salt is a randomly generated string that gets added to the hash to make it harder to decrypt hashed passwords
      //   const salt = bycrypt.genSaltSync(12);
      //   const hash = bycrypt.hashSync(value, salt);
      //   //'pasword' is column to set, hash is value to insert >> storing hashed password to database
      //   this.setDataValue("password", hash);
      // },
    },
    age: {
      type: DataTypes.INTEGER,
      defaultValue: 21,
      validate: {
        isOldEnough(value) {
          if (value < 21) {
            throw new Error("too young!");
          }
        },
        isNumeric: {
          msg: "you must enter a number for age",
        },
      },
    },
    WittCodeRocks: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    description: {
      type: DataTypes.STRING,
      defaultValue: 21,
      // set(value) {
      //   //takes a buffer(our case string) >> outputs a string >> toString() to return string
      //   //base64 is a type of encoding to turn bianary encoding into text
      //   const compressed = zlib.deflateSync(value).toString("base64");
      //   this.setDataValue("description", compressed);
      // },
      // get(value) {
      //   //get value of users.description
      //   const descValue = this.getDataValue("description");
      //   // infaltes buffer created with this >> Buffer.from(value, 'base64')
      //   const uncompressed = zlib.inflateSync(Buffer.from(descValue, "base64"));
      //   return uncompressed.toString();
      // },
    },
    aboutUser: {
      //this column will not show in table because this datatype used
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.username} ${this.description}`;
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        //validate is email
        // isEmail: true,
        //validate email is one of the below: "me@soccer.org", "me@soccer.com"
        // isIn: {
        //   args: ["me@soccer.org", "me@soccer.com"],
        //   msg: "the provided email must be one of the following",
        // },
        myEmailValue(value) {
          if (value === null) {
            throw new Error("Please enter an email");
          }
        },
      },
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    //module validator
    validate: {
      usernamePassMatch() {
        if (this.username === this.password) {
          throw new Error("Password cannot be your username");
        } else {
          console.log("password and username do not match");
        }
      },
    },
    //set timestamps to true to have paranoid column work
    //this sets up a deleted at column
    paranoid: true,
    deletedAt: "timeDestroyed",
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
    //______ find and count all usernames = Micaela
    // return Users.findAndCountAll({
    //   where: {
    //     username: "Micaela",
    //   },
    //   raw: true,
    // });
    // returns an array of the results and object metadata
    // return sequelize.query(`UPDATE user SET age = 54 WHERE username = 'Mica'`);
    // return sequelize.query(`SELECT * FROM user`, {
    //   type: Sequelize.QueryTypes.SELECT,
    // });
    // use replacements to escape input in input forms
    // return sequelize.query(`SELECT * FROM user WHERE username = :username`, {
    //   replacements: { username: "Micaela" },
    // returns a regular object and only 1 object
    // plain: true,
    // });
    // return all users names with names listed in replacements
    // return sequelize.query(`SELECT * FROM user WHERE username IN(:username)`, {
    //   replacements: { username: ["Mica", "pizza"] },
    // });
    // Use wildcard operators to return users with the replacement usernames in them
    // return sequelize.query(
    //   `SELECT * FROM user WHERE username LIKE(:username)`,
    //   {
    //     replacements: { username: "mi%" },
    //   }
    // );
    // return Users.destroy({
    //   where: { user_id: 27 },
    //   //force delete
    //   force: true,
    // });
    // restore deleted user
    return Users.restore({
      where: { user_id: 29 },
    });
  })
  .then((data) => {
    //deconstruction
    // [result, metadata] = data;
    console.log(data);
  })

  .catch((err) => {
    console.log(err);
  });
