const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,//根据user的ID得到，可用于查找用户是否存在
        ref: "users"//当前的表与users表关联，可使用其对应的数据
    },
    handle: {//存储登录的用户名，根据用户名可以请求对应的数据
        type: String,
        required: true,
        max: 40
    },
    company: {
        type: String,
    },
    website: {
        type: String,
    },
    location: {
        type: String,
    },
    status: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },
    bio: {
        type: String
    },
    githubusername: {
        type: String
    },
    experience: [
        {
            current: {
                type: Boolean,
                default: true
            },
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            location: {
                type: String,
            },
            from: {
                type: String,
                require: true
            },
            to: {
                type: String,
            },
            description: {
                type: String,
            },
        }
    ],
    education: [
        {
            current: {
                type: Boolean,
                default: true
            },
            school: {
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            fieldofstudy: {
                type: String,
                required: true
            },
            from: {
                type: String,
                require: true
            },
            to: {
                type: String,
            },
            description: {
                type: String,
            },
        }
    ],
    social: {
        wechat: {
            type: String
        },
        QQ: {
            type: String
        },
        tengxunkt: {
            type: String
        },
        wangyikt: {
            type: String
        },
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Profile = mongoose.model("profile", ProfileSchema);