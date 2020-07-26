const express = require("express");
const app = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require('cors');
const connectDB = require("./config/db");
const { replier } = require("./lib/utils");

//load config
if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: "./config/configTest.env" });
}else {
  dotenv.config({ path: "./config/config.env" });
}

app.set("key", process.env.JWT_SECRET);

//connect to db
connectDB();

//middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/tasks", require("./routes/tasks"));

// Invalid request
app.use((req, res) => {
  replier(res, 404, {
    response: "Error",
    message: "Invalid Request"
  });  
});

module.exports = app;