var mongoose=require("mongoose");

var GroupSchema= new mongoose.Schema({
    username: String,
    place: String,
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});

module.exports= mongoose.model("Group",GroupSchema);