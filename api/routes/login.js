const express = require("express");
const router = express.Router();
const config = require("config-lite")(__dirname);
const checkNotLogin = require("../middlewares/check").checkNotLogin;

router.get("/", checkNotLogin, function (req, res, next) {
  res.render("login");
});

router.post("/", checkNotLogin, function (req, res, next) {
  //console.log(req.fields);
  const username = req.fields.username;
  const password = req.fields.password;
  // 校验参数
  try {
    if (!username.length) {
      throw new Error("请填写用户名");
    }
    if (!password.length) {
      throw new Error("请填写密码");
    }
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("back");
  }
  if (username !== config.credentials.username || password !== config.credentials.password) {
    req.flash("error", "用户名或密码错误");
    return res.redirect("back");
  }
  req.flash("success", "登录成功");
  // 用户信息写入 session
  req.session.user = username;
  // 跳转到主页
  res.redirect("/dash");
});

module.exports = router;
