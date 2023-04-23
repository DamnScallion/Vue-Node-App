// @login & register
const express = require("express");//引入express
const router = express.Router();//实例化成一个路由
const bcrypt = require("bcryptjs");//给用户登录密码加密
const jwt = require('jsonwebtoken');//引入jwt
const gravatar = require('gravatar');//引用全球公认头像
const keys = require("../../config/keys");
const passport = require("passport");//引入用于验证获取到的token

const User = require("../../models/User");

//引入验证方法
const velidateRegisterInput = require("../../validation/register");
const velidateLoginInput = require("../../validation/login");

//$route   GET api/users/test
//@desc    返回请求的json数据
//@access  public
router.get("/test", (req, res) => {
    res.json({ msg: "login works" })
})

//$route   POST api/users/register
//@desc    返回请求的json数据
//@access  public
router.post("/register", (req, res) => {
    //console.log(req.body);
    const { errors, isValid } = velidateRegisterInput(req.body);//解构得到的errors和isValid

    //判断isValid是否通过
    if (!isValid) {
        return res.status(400).json(errors);
    }


    //查询数据库中是否拥有邮箱
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                return res.status(400).json({ email: "邮箱已被注册!" })
            } else {
                const avatar = gravatar.url(req.body.email, { s: '200', r: 'pg', d: 'mm' });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                })

                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;

                        newUser.password = hash;//直接将变为哈希值的密码赋给用户

                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        })
})

//$route   POST api/users/login
//@desc    返回token jwt passport
//@access  public
router.post("/login", (req, res) => {
    const { errors, isValid } = velidateLoginInput(req.body);//解构得到的errors和isValid

    //判断isValid是否通过
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    //查询数据库
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ email: "用户不存在!" });
            }

            //密码匹配
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        const rule = { id: user.id, name: user.name, avatar: user.avatar };
                        //规则  加密名字           过期时间             箭头函数
                        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                            if (err) throw err;
                            res.json({//成功获取token
                                success: true,
                                token: "Bearer " + token
                            })
                        });
                        //res.json({ msg: "success" });
                    } else {
                        return res.status(400).json({ password: "密码错误!" });
                    }
                })
        })
})

//$route  GET api/users/current
//@desc   return current user
//@access private 只有当拿到token时才能获取用户信息
//请求current为了让用户拿到数据库中的保存数据，因此需要passport来验证获得的token，里面用到了passport-jwt来验证jwt
router.get("/current", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({//验证成功，返回这三个必要的信息给用户看
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
})

module.exports = router;//路由供出