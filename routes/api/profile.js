const express = require("express");//引入express
const router = express.Router();//实例化成一个路由
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);//mongoose该模块已弃用，需要全局设置不要它
const passport = require("passport");//引入用于验证获取到的token

const Profile = require("../../models/Profiles");
const User = require("../../models/User");

const velidateProfileInput = require("../../validation/profile");//引入用户信息验证
const velidateExperienceInput = require("../../validation/experience");
const velidateEducationInput = require("../../validation/education");


//$route   GET api/profile/test
//@desc    返回请求的json数据
//@access  public
router.get("/test", (req, res) => {
    res.json({ msg: "profile works" })
})

//$route   GET api/profile
//@desc    获取当前登录用户的个人信息
//@access  private                                session不要
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
        .populate('user', ["name", "avatart"])//引用user表里面对应的数据
        .then((profile) => {
            if (!profile) {//如果找不到该用户
                errors.noprofile = "该用户的信息不存在!";
                return res.status(404).json(errors);
            }
            res.json(profile);//如果找到该用户,返回该用户信息
        }).catch(err => res.status(404).json(err));
})

//$route   POST api/profile
//@desc    创建和编辑个人信息接口
//@access  private                                session不要
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { errors, isValid } = velidateProfileInput(req.body);//解构得到的errors和isValid

    //判断isValid是否通过
    if (!isValid) {
        return res.status(400).json(errors);
    }


    const profileFields = {};//一个profile对象，用来接获取到的数据
    profileFields.user = req.user.id;//登录成功后，得到的id赋给user,根据id可以获取个人信息
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.status) profileFields.status = req.body.status;


    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    //skills-数组转换
    if (typeof req.body.skills !== "undefined") {
        profileFields.skills = req.body.skills.split(",");
    }

    profileFields.social = {};

    if (req.body.wechat) profileFields.social.wechat = req.body.wechat;
    if (req.body.QQ) profileFields.social.QQ = req.body.QQ;
    if (req.body.tengxunkt) profileFields.social.tengxunkt = req.body.tengxunkt;
    if (req.body.wangyikt) profileFields.social.wangyikt = req.body.wangyikt;

    Profile.findOne({ user: req.user.id }).then(profile => {
        //console.log(profile);
        if (profile) {
            //用户信息存在，执行更新方法
            //                        根据user.id去查找      更新profileFields对象    该内容是新的
            Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true }).then(profile => res.json(profile));
        } else {
            //用户信息不存在，执行创建方法
            //                handle标识用于判断“已经拥有多条用户信息的用户”是否可以继续创建
            //如果handle一样就不能创建，反之可以
            Profile.findOne({ handle: profileFields.handle }).then(profile => {
                if (profile) {//handle存在，返回错误
                    errors.handle = "该用户的handle个人信息已经存在，请勿重新创建!";
                    res.status(400).json(errors);
                }

                //handle不存在，将当前的profileFields对象传递过去
                new Profile(profileFields).save().then(profile => res.json(profile));
            })
        }
    })
})

//$route   GET api/profile/handle/:handle
//@desc    通过handle获取个人信息
//@access  public
router.get("/handle/:handle", (req, res) => {
    const errors = {};
    Profile.findOne({ handle: req.params.handle })
        .populate('user', ["name", "avatar"])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "未找到该用户信息";
                res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
})

//$route   GET api/profile/user/:user_id
//@desc    通过user_id获取个人信息
//@access  public
router.get("/user/:user_id", (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.params.user_id })
        .populate('user', ["name", "avatart"])
        .then(profile => {
            if (!profile) {
                errors.noprofile = "未找到该用户信息";
                res.status(404).json(errors);
            }

            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
})

//$route   GET api/profile/all
//@desc    获取所有人信息
//@access  public
router.get("/all", (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ["name", "avatar"])
        .then(profiles => {
            if (!profiles) {
                errors.noprofile = "没有任何用户信息";
                res.status(404).json(errors);
            }

            res.json(profiles);
        })
        .catch(err => res.status(404).json(err));
})

//$route   POST api/profile/experience
//@desc    添加个人经历
//@access  private
router.post("/experience", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { errors, isValid } = velidateExperienceInput(req.body);//解构得到的errors和isValid

    //判断isValid是否通过
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description,
            }

            profile.experience.unshift(newExp);

            profile.save().then(profile => res.json(profile));

        })
})


//$route   POST api/profile/education
//@desc    添加个人学历
//@access  private
router.post("/education", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { errors, isValid } = velidateEducationInput(req.body);//解构得到的errors和isValid

    //判断isValid是否通过
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const newEdu = {
                school: req.body.school,
                degree: req.body.degree,
                fieldofstudy: req.body.fieldofstudy,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description,
            }

            profile.education.unshift(newEdu);

            profile.save().then(profile => res.json(profile));

        })
})

//$route   DELETE api/profile/experience/:epx_id
//@desc    删除个人经历
//@access  private
router.delete("/experience/:epx_id", passport.authenticate("jwt", { session: false }), (req, res) => {

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const removeIndex = profile.experience
                .map(item => item.id)//用map遍历item，返回其id
                .indexOf(req.params.epx_id);//找到当前要删除项的下标

            profile.experience.splice(removeIndex, 1);//删除长度1个

            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
})

//$route   DELETE api/profile/education/:edu_id
//@desc    删除个人学历
//@access  private
router.delete("/education/:edu_id", passport.authenticate("jwt", { session: false }), (req, res) => {

    Profile.findOne({ user: req.user.id })
        .then(profile => {
            const removeIndex = profile.education
                .map(item => item.id)//用map遍历item，返回其id
                .indexOf(req.params.edu_id);//根据id找到当前要删除项的下标

            profile.education.splice(removeIndex, 1);//删除长度1个

            profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
})

//$route   DELETE api/profile
//@desc    删除整个用户
//@access  private
router.delete("/", passport.authenticate("jwt", { session: false }), (req, res) => {

    Profile.findOneAndRemove({ user: req.user.id })
        .then(() => {
            User.findOneAndRemove({ _id: req.user.id })
                .then(() => {
                    res.json({ success: true });
                })
        })
})

module.exports = router;