/*
 * @Author: Khoayenn 
 * @Date: 2019-08-21 14:40:02 
 * @Last Modified by: Khoayenn
 * @Last Modified time: 2019-08-24 01:20:39
 */
const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const morgan = require("morgan");
const database = require("./src/database/database.service");
const userRouter = require("./src/routes/user.route");
const adminRouter = require("./src/routes/admin.route");
const authRouter = require("./src/routes/auth.route");
const postRouter = require("./src/routes/post.route");
const {isAdmin} = require("./src/services/auth.service")

const {errHandler, notFoundErr} = require("./src/commons/error.handler");

const PORT = process.env.PORT || 8082;

database.connect();

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(morgan("dev"));
app.use(express.static('images'))

app.get("/", function(req, res, next){
    res.json(new Date());
})

app.use("/user", userRouter);
app.use("/admin", isAdmin, adminRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);

// Handle not found page
app.use(notFoundErr);

// Handle all errors
app.use(errHandler);

app.listen(PORT, (err) => {
    console.log("App is listening on " + PORT);
})