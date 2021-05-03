const axios = require("axios");
const express = require("express");
const router = express.Router();
const config = require("config-lite")(__dirname);
const checkLogin = require("../middlewares/check").checkLogin;

router.get("/", checkLogin, function (req, res, next) {
  //res.send("控制台");
  axios({
    method: "get",
    url: `https://api.github.com/repos/hans362/MyBlog/contents/source/_posts`,
    headers: {
      Authorization: `token ${config.pat}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.mercy-preview+json", // MUST ADD TO INCLUDE TOPICS
    },
  })
    .then((response) => {
      console.log(response.data);
      var articleList = "";
      response.data.forEach(function (article) {
        console.log(article);
        articleList = articleList + article.name + "<br>";
      });
      res.send(articleList);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
