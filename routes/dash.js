const axios = require("axios");
const express = require("express");
const router = express.Router();
const checkLogin = require("../middlewares/check").checkLogin;

const firebase = require("firebase-admin");

router.get("/", checkLogin, function (req, res, next) {
  //res.send("控制台");
  axios({
    method: "get",
    url: `https://api.github.com/repos/hans362/MyBlog/contents/source/_posts`,
    headers: {
      Authorization: `token ${process.env.pat}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.mercy-preview+json", // MUST ADD TO INCLUDE TOPICS
    },
  })
    .then((response) => {
      //console.log(response.data.content);
      res.render("dash", {
        page: "dash",
        data: response.data,
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/posts", checkLogin, function (req, res, next) {
  //res.send("控制台");
  axios({
    method: "get",
    url: `https://api.github.com/repos/hans362/MyBlog/contents/source/_posts`,
    headers: {
      Authorization: `token ${process.env.pat}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.mercy-preview+json", // MUST ADD TO INCLUDE TOPICS
    },
  })
    .then((response) => {
      //console.log(response.data);
      res.render("dash-posts", {
        page: "dash-posts",
        posts: response.data,
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

router.get("/drafts", checkLogin, function (req, res, next) {
  var db = firebase.database();
  var ref = db.ref("drafts");
  ref.on("value", function (snapshot) {
    var drafts = snapshot.val();
    res.render("dash-drafts", {
      page: "dash-drafts",
      drafts: drafts,
    });
  });
});

router.get("/editor/new", checkLogin, function (req, res, next) {
  var draft = Math.round(Math.random() * 100000).toString();
  /*var db = firebase.database();
  var ref = db.ref("drafts");
  ref.child(draft).set({
    name: draft,
    content: "",
  });*/
  res.render("dash-editor", {
    page: "dash-editor",
    name: draft,
    content: "",
  });
});

router.get("/editor/:postName", checkLogin, function (req, res, next) {
  const postName = req.params.postName;
  const rawUrl =
    "https://api.github.com/repos/hans362/MyBlog/contents/source/_posts/" +
    postName +
    ".md";
  //console.log(rawUrl);
  axios({
    method: "get",
    url: rawUrl,
    headers: {
      Authorization: `token ${process.env.pat}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github.mercy-preview+json", // MUST ADD TO INCLUDE TOPICS
    },
  })
    .then((response) => {
      //console.log(response.data);
      res.render("dash-editor", {
        page: "dash-editor",
        name: postName,
        content: Buffer.from(response.data.content, "base64").toString(),
      });
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;
