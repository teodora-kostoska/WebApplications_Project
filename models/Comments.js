const mongoose = require("mongoose");
const schema = mongoose.Schema;

//Schema for comments table
let commentSchema = new schema ({
    user: {type: String},
    comment: {type: String},
    postid: {type: String}
});
//Name of table is comments, and this is how the data is sent to the database when this schema is called
module.exports = mongoose.model("comments", commentSchema)