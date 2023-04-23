const express = require("express");//引入express
const mongoose = require("mongoose");
const bodyParser = require("body-parser");//解析器
const passport = require("passport");//引入passport用于验证token
const app = express();//实例化一个app

//引入users.js
const users = require("./routes/api/users");//引入users接口
const profile = require("./routes/api/profile");//引入profile接口
const posts = require("./routes/api/posts");//引入post接口

//DB config
const db = require("./config/keys").mongoURI;

//使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Connect to mongodb
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// 使用中间件实现允许跨域
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
})

//passport初始化
app.use(passport.initialize());

require("./config/passport")(passport);//引入passport.js文件，并将最上面引入的passport对象传入其中

// app.get("/", (req, res) => {
//     res.send("Hello world!");
// })//设置一个路由

//使用routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;//设置端口号
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})