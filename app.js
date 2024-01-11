import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import _ from "lodash";
import mongoose from "mongoose";
import {
  homeStartingContent,
  aboutContent,
  contactContent,
} from "./constants/constants";
import { postSchema } from "./models/post.model";
const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect(process.env.CLUSTER, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  Post.find({}, function (err, posts) {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", {
    aboutContent: aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactContent: contactContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post.save(function (err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  Post.findOne(
    {
      _id: requestedPostId,
    },
    function (err, post) {
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    }
  );
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server started on successfully");
});
