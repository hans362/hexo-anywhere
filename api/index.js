const path = require("path");
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const config = require("config-lite")(__dirname);
const routes = require("./routes");
const pkg = require("../package");

const app = express();

const FirebaseStore = require("connect-session-firebase")(session);
const firebase = require("firebase-admin");
const ref = firebase.initializeApp({
  credential: firebase.credential.cert(
    path.join(__dirname, "config/serviceAccountCredentials.json")
  ),
  databaseURL: config.db,
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true, // 强制更新 session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
      maxAge: config.session.maxAge, // 过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new FirebaseStore({
      database: ref.database(),
    }),
  })
);



// flash 中间件，用来显示通知
app.use(flash());
app.use(
  require("express-formidable")({
    uploadDir: path.join(__dirname, "public/img"), // 上传文件目录
    keepExtensions: true, // 保留后缀
  })
);

app.locals.hexoanywhere = {
  title: pkg.name,
  description: pkg.description,
};

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  res.locals.success = req.flash("success").toString();
  res.locals.error = req.flash("error").toString();
  next();
});

// 路由
routes(app);
// 监听端口，启动程序
app.listen(config.port, function () {
  console.log(`${pkg.name} is listening on port ${config.port}`);
});
