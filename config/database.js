const mongoose = require("mongoose");
require('dotenv').config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_MONGO);
    console.log("Conexcion a la base de datos exitsa");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDb;