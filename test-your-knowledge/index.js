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

const Student = sequelize.define("student", {
  student_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [4, 20],
    },
  },
  favorite_class: {
    type: DataTypes.STRING(25),
    defaultValue: "Computer Science",
  },
  school_year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subscribed_to_wittcode: {
    type: DataTypes.TINYINT,
    defaultValue: true,
  },
});

Student.sync()
  .then(() => {
    return Student.bulkCreate(
      [
        {
          name: "Mica",
          favorite_class: "outdoors",
          school_year: 2013,
          subscribed_to_wittcode: false,
        },
        {
          name: "Micaela",
          favorite_class: "eating",
          school_year: 2015,
          subscribed_to_wittcode: true,
        },
        {
          name: "Micaela Chavez",
          favorite_class: "Computer Science",
          school_year: 2013,
          subscribed_to_wittcode: false,
        },
      ],
      { validate: true }
    );
  })
  .then((data) => {
    console.log("users added to database");
    //returns sum of students for each school year
    return Student.findAll({
      attributes: [
        "school_year",
        [sequelize.fn("COUNT", sequelize.col("school_year")), "num_students"],
      ],
      group: "school_year",
      //return only name for computer science or subscribed
      // return Student.findAll({
      //   attributes: ["name"],
      //   where: {
      //     [Op.or]: {
      //       favorite_class: "Computer Science",
      //       subscribed_to_wittcode: true,
      //     },
      //   },
    });
  })
  .then((data) => {
    data.forEach((el) => {
      console.log(el.toJSON());
    });
  })
  .catch((err) => {
    console.log(err);
  });
