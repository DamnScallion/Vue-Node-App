const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users"//关联users表
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [
        {
            user: {//当用户一点赞即可将该用户的ID存入likes里面
                type: Schema.Types.ObjectId,
                ref: "users"
            }
        }
    ],
    comments: [
        {
            user: {//当用户一点赞即可将该用户的ID存入likes里面
                type: Schema.Types.ObjectId,
                ref: "users"
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Post = mongoose.model("post", PostSchema);