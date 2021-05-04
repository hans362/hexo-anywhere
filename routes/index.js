module.exports = function (app) {
  app.get("/", function (req, res) {
    res.redirect("/login");
  });
  app.use("/login", require("./login"));
  app.use("/logout", require("./logout"));
  app.use("/dash", require("./dash"));
};
