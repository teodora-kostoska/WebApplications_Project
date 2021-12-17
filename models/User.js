const mongoose = require("mongoose");
const schema = mongoose.Schema;

//In here we create the chema for user database, in here we keep track of username and password
let user = new schema ({
    username: {type: String},
    password: {type: String},
});
module.exports = mongoose.model("users", user)//The first part of this indicates the table name, and the second part of this indicates the information to be saved