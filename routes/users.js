var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

//importing all the database schemas
const User = require("../models/User");
const Post = require("../models/Posts");
const Comments = require("../models/Comments");

//importing json webtoken and libraries for validating whether the user is signed in
const jwt = require("jsonwebtoken");
const validateToken = require("../auth/validateToken.js");
const validateToken2 = require("../auth/validateToken2.js");

//importing necessary libraries for localStorage usage
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


/*Get registering page */
router.get('/register', function(req, res, next) {
  res.render('register');
});

//render Posting page to show every post that is in database 
router.get('/posts', function(req, res, next) {
  Post.find({}, (err,posts)=>{ //get all posts in the database
    if(err) return next(err);
    res.render("posts", {posts}); //render page with posts information
  });
}); 

//get only specific post and get all the comments for that post from comments database
router.get("/singlePost/:id", (req,res,next) =>{
  let target_id = req.params.id; //id of post is sent through params
  Post.find({}, (err,posts)=>{//get all posts from database
    let post;
    for(e of posts){//find the specific post that was clicked via id
      if(e._id.valueOf() ==target_id){//If the id of the current post is same as the one provided through params, set this as the post that should be used to render page
        post=e;
      };
    };
    if(!post){//if no such post, although this should not be possible as this router is called through click event
      console.log("No such value.");
    };
  //from comments find all of the comments that are for the specific post via id
  Comments.find({postid: target_id}, (err, comments)=>{
    if(!comments){ //if post has no comments then render page without comments
      res.render("singlePost",{post});
    }
    res.render("singlePost", {post, comments});//if post has comments render page with comments
    });
  });
});

//Render post new page
router.get('/postNew', (req, res, next) => {
  res.render("postNew");
});

/*Get login page */
router.get('/login', function(req, res, next) {
  res.render('login');
});

//router to post new comment to Comments database
//using validateToken2, as I need different information returned from there
router.post("/postNewComment", validateToken2, 
(req,res,next) =>{
  var username = "Posted by:" +req.currentUser;
  Comments.create({ //create the new comment
    comment: req.body.comment,
    postid: req.body.id,
    user: username
  },
  (err,posted) =>{
    if(err) throw err; 
    console.log("Posted");
    res.send("Ok");
  })
});

//Route to save new posts to database
router.post('/postNew', validateToken,
(req,res,next) =>{
  var username = "Posted by: "+req.currentUser;
  Post.create(//create new post with given information
    {
      header: req.body.header,
      description: req.body.description,
      post: req.body.post,
      user: username
    },
    (err, posted) =>{
      if(err) throw err;
      console.log("Posted");
      res.send("OK");
    }
  )
})

//Route to post new user to database
router.post('/register', 
(req, res, next)  =>{
  //check whether user with sama username exists already in database
  User.findOne({username: req.headers["username"]}, (err,user) =>{
    if(err) {
      console.log(err);
      throw err;
    };
    if(user){//If same named user already exists in database inform user that that username is not valid
      return res.status(403).json({message: "Username invalid."}); 
    }else {
      //if username doesn't exist, then add new user to database
      //first hash password
      bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(req.headers["password"], salt, (err, hashed) => {
          if(err) throw err;
          User.create(//create new user in database
            {
              username: req.headers["username"],
              password: hashed
            },
            (err, userCreated)=>{
              if(err) throw err;
              return res.json({success:true}); //redirect user to login page
            });
        });
      });
    };
  });
});

/*Authenticate log in*/
router.post('/login', 
upload.none(),
(req, res, next) => {
  User.findOne({username: req.body.username}, (err, user) =>{ //search for same username in database
    if(err) throw err;
    if(!user){//if user doesn't exist throw error
      return res.status(403).json({message: "Failed to log in."});
    }else{ //if username found compare passwords
      bcrypt.compare(req.body.password, user.password, (err, matched)=>{
        if(err) throw err;
        if(matched){ //if passwords same create token
          const jwtPayload= {//create token payload, this is what is encoded in the token
            id: user._id,
            username: user.username,
          }
          jwt.sign( //create the token
            jwtPayload,
            process.env.SECRET,
            {
              expiresIn: 120 //expires in 2 mins.
            },
            (err,token)=>{
              if(err) throw err;
              res.json({success:true, token}); //respond with the token
            }
          );
        }else {
          return res.status(403).json({message: "Invalid password."});
        };
      });
    };
  });
});
module.exports = router;
