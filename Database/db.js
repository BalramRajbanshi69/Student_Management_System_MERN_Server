const mongoose = require("mongoose");
const MONGO_URI = process.env.MONGO_URI;

const dbConnect = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Successfully Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};

module.exports = dbConnect;
