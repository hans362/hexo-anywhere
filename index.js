const path = require("path");
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const routes = require("./routes");
const pkg = require("./package");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const FirebaseStore = require("connect-session-firebase")(session);
const firebase = require("firebase-admin");
const ref = firebase.initializeApp({
  credential: firebase.credential.cert({
    type: "service_account",
    project_id: process.env.pid,
    private_key_id: process.env.pkid,
    private_key: process.env.pk.replace(/\\n/g, "\n"),
    client_email: process.env.ce,
    client_id: process.env.cid,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-booht%40hexoanywhere.iam.gserviceaccount.com",
  }),
  databaseURL: process.env.db,
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    name: process.env.sessionkey, // 设置 cookie 中保存 session id 的字段名称
    secret: process.env.sessionsecret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true, // 强制更新 session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
      maxAge: Number(process.env.sessionmaxAge), // 过期时间，过期后 cookie 中的 session id 自动删除
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
app.listen(process.env.port, function () {
  console.log(`${pkg.name} is listening on port ${process.env.port}`);
});
