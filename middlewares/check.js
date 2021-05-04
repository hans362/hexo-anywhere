module.exports = {
  checkLogin: function checkLogin(req, res, next) {
    if (!req.session.user) {
      req.flash("error", "您尚未登录");
      return res.redirect("/login");
    }
    next();
  },
  checkNotLogin: function checkNotLogin(req, res, next) {
    if (req.session.user) {
      return res.redirect("/dash");
    }
    next();
  },
};