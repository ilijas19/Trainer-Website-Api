require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();
//PACKAGES
const cookieParser = require("cookie-parser");
//DB
const connectDb = require("./db/connectDb");
//MIDDLEWARES
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
//ROUTERS
const authRouter = require("./routes/authRoutes");
//APP
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/v1/auth", authRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
