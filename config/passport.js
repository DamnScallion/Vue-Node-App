const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require("mongoose");//引入是为了用model中的User.js
const User = mongoose.model("users");
const keys = require("../config/keys");

const opts = {}//配置
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();//调用该jwt请求来验证对应的token
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        //console.log(jwt_payload);
        User.findById(jwt_payload.id)//查询token中的id值
            .then(user => {
                if (user) {
                    return done(null, user);//用户存在
                }
                return done(null, false);//没有该用户
            })
            .catch(err => console.log(err));
    }));
}