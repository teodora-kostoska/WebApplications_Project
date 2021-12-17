const mongoose = require("mongoose");
const schema = mongoose.Schema;

//Create the schema for the database to keep track of post information
let postSchema = new schema ({
    header: {type: String},
    description: {type: String},
    post: {type: String},
    user: {type: String}
});
//table name in database is posts, this sends the data into the table when the schema is called
module.exports = mongoose.model("posts", postSchema)