//In here we handle the token, so that users that are logged in can comment and post things
const jwt = require("jsonwebtoken");
module.exports = function(req, res, next){
    const authHeader =req.headers["authorization"]; //Get from header authorization which contains "Bearer " + token 
    const comment = req.headers["comment"]; //Get the comment
    const id = req.headers["id"]; //Get the id of the post
    const body = {comment, id} //create body which contains the comment and the id of the post that is commented on
    let token;
    if(authHeader){//If token found take only end part of token without the "Bearer "
        token = authHeader.split(" ")[1];
    }else{//else set token as null
        token = null;
    }
    if(token == null) return res.sendStatus(401);//If token is null send error as authentication is not ok, shouldn't be possible to get this error as the token is checked in eg postComment.js
    console.log("Token ok.");
    jwt.verify(token, process.env.SECRET, (err, user) =>{//If token is okay translate it back to original state
        if(err) return res.sendStatus(403);
        req.user = user; //return user
        req.currentUser = user.username;//return username
        req.body = body;//return comment information
        next();
    });
}