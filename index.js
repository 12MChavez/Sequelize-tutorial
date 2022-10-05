const Sequelize = require("sequelize");
//do not need to require mysql2 because it is done internally by sequelize
const { DataTypes } = Sequelize;

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
        len: [4, 6],
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

// console.log(sequelize.models.user);

//alter:true alters the tables. force: true drops and creates a new table
// Users.sync({ alter: true })
//   .then((data) => {
//     console.log("table and model synced successfully");
//   })
//   .catch((err) => {
//     console.log("error syncing table and model");
//   });

Users.sync({ alter: true })
  .then(() => {
    //working with our updated table.
    //__________________
    //version 1 to save
    //__________________
    // const user = Users.build({
    //   username: "Mica",
    //   password: "123",
    //   age: 13,
    //   WittCodeRocks: true,
    // });
    // //can modify object before save()
    // if (user.age < 75) {
    //   user.old = true;
    // }
    // // console.log(user.username);
    // return user.save();

    //__________________
    //version 2 to save
    //__________________

    // return Users.create({
    //   username: "Micaela",
    //   password: "234",
    //   age: 13,
    //   WittCodeRocks: false,
    // });
    //__________________
    //version 3 to save
    //__________________
    return Users.bulkCreate(
      [
        {
          username: "Micaela",
          password: "234",
          age: 13,
          WittCodeRocks: false,
        },
        {
          username: "Daisy",
          password: "123",
          age: 3,
          WittCodeRocks: true,
        },
      ]
      // { validate: true } >> use this to validate users created with bulkCreate()
    );
  })
  .then((data) => {
    console.log("user added to database");
    // data.username = "Micaela Chavez";
    // data.age = 13;
    // console.log(data.toJSON());
    // // return data.save(); >>> saves data
    //return data.destroy  >>> deletes data
    // return data.reload(); >>> reverts to original data
    // return data.save({ fields: ["age"] }); >>> saves only the age field (sequelize only updates fields that have changed)
    // data.decrement({ age: 2 });
    // data.increment({ age: 2 });
    data.forEach((el) => {
      console.log(el.toJSON());
    });
  })
  // .then((data) => {
  //   console.log("user updated");
  //   console.log(data.toJSON());
  // })
  .catch((err) => {
    console.log(err);
  });
