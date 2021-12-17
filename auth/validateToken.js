//In here we handle the token, so that users that are logged in can comment and post things
const jwt = require("jsonwebtoken");
module.exports = function(req, res, next){
    const authHeader =req.headers["authorization"]; //From the req get headers, which contains the token information
    const post = req.headers["post"]; //headers "post" contains the post information
    const header = req.headers["header"]; //contains the post header
    const description = req.headers["description"]; //Contains description if provided
    const body = {post, header, description} //create body, which contains all post information
    let token;
    if(authHeader){//If token is sent, split the token and only take the end part without "Bearer "
        token = authHeader.split(" ")[1];
    }else{//if authHeader is empty set token as null
        token = null;
    }
    if(token == null) return res.sendStatus(401);//If token is null, send response that user is not authorised to use this
    console.log("Token ok."); //Otherwise token is ok
    jwt.verify(token, process.env.SECRET, (err, user) =>{ //This basically translates the token to it's original form
        if(err) return res.sendStatus(403);
        req.user = user; //return user
        req.currentUser = user.username; //return the user's username
        req.body = body; //return body which contains post information
        next();
    });
}