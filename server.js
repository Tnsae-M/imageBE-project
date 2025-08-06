//import env and other resources.
require("dotenv").config();
const { error } = require("console");
const express = require("express");
const connectToDB = require("./database/database");
//import routes
const authRoutes = require("./routes/authRoutes");
const HomeRoutes = require("./routes/homeRoutes");
const adminRoute = require("./routes/adminRoutes");
const imgRoutes = require("./routes/imagesRoutes");
const app = express();
//connect to DB.
connectToDB();
//express middleware used to parse or extract info from request(i.e req.body)
app.use(express.json());
//create mother routes
app.use("/api/home", HomeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoute);
app.use("/api/image", imgRoutes);
//create a port and listen to server.
const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`server is listening to port ${port}`);
});
//checkpoint=> 9:07 hr
