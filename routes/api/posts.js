const express = require("express");//引入express
const router = express.Router();//实例化成一个路由
const mongoose = require("mongoose");
mongoose.set('useFindAndModify', false);//mongoose该模块已弃用，需要全局设置不要它
const passport = require("passport");//引入用于验证获取到的token

const Post = require("../../models/Post");
const Profile = require("../../models/Profiles");

const velidatePostInput = require("../../validation/post");

//$route   GET api/post/test
//@desc    返回请求的json数据
//@access  public
router.get("/test", (req, res) => {
    res.json({ msg: "posts works" })
})

//$route   POST api/posts
//@desc    创建一个评论接口
//@access  private   只有登录了的用户才能评论
router.post("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { errors, isValid } = velidatePostInput(req.body);//解构得到的errors和isValid

    //判断isValid是否通过
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));

})

//$route   GET api/posts
//@desc    获取评论信息
//@access  public
router.get("/", (req, res) => {
    Post.find()
        .sort({ date: -1 })//按时间升序排序
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopostsfound: "找不到任何评论信息" }))
})

//$route   GET api/posts/:id
//@desc    获取单个评论信息
//@access  public
router.get("/:id", (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ nopostsfound: "找不到该评论信息" }))
})

//$route   DELETE api/posts/:id
//@desc    删除单个评论信息
//@access  private  只能删除自己的评论
router.delete("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
        Post.findById(req.params.id)
            .then(post => {
                //判断是否是本人
                if (post.user.toString() !== req.user.id) {
                    return res.status(401).json({ notauthorized: "用户非法操作!" })
                }

                post.remove().then(() => res.json({ success: true }))
            })
            .catch(err => res.status(404).json({ postsnotfound: "没有该评论信息" }))
    })
})

//$route   POST api/posts/like/:id
//@desc    点赞接口
//@access  private  
router.post("/like/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {//找到用户
        Post.findById(req.params.id)//找到评论
            .then(post => {
                if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                    return res.status(400).json({ alreadyliked: "该用户已赞过" })
                }

                post.likes.unshift({ user: req.user.id })//没赞过，加入到like数组里

                post.save().then(post => res.json(post))
            })
            .catch(err => res.status(404).json({ likederror: "点赞错误" }))
    })
})

//$route   POST api/posts/unlike/:id
//@desc    取消点赞接口
//@access  private  
router.post("/unlike/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {//找到用户
        Post.findById(req.params.id)//找到评论
            .then(post => {
                if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                    return res.status(400).json({ notliked: "该用户没有点过赞" })
                }

                //获取要删掉的user的id
                const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);

                post.likes.splice(removeIndex, 1);

                post.save().then(post => res.json(post))
            })
            .catch(err => res.status(404).json({ likederror: "取消点赞错误" }))
    })
})

//$route   POST api/posts/comment/:id
//@desc    添加评论接口
//@access  private  
router.post("/comment/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
    const { errors, isValid } = velidatePostInput(req.body);//解构得到的errors和isValid

    //判断isValid是否通过
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }

            post.comments.unshift(newComment);

            //save
            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "添加评论错误" }))
})

//$route   DELETE api/posts/comment/:id
//@desc    删除评论接口
//@access  private     :id找到当前用户是否有评论   :comment_id根据评论的id删除评论
router.delete("/comment/:id/:comment_id", passport.authenticate("jwt", { session: false }), (req, res) => {

    Post.findById(req.params.id)
        .then(post => {
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({ commentnotexists: "该评论不存在" })
            }

            //找到该评论的index
            const removeIndex = post.comments.map(item => item._id.toString())
                .indexOf(req.params.comment_id);

            post.comments.splice(removeIndex, 1);

            //save
            post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ deletecommenterror: "删除评论错误" }))
})


module.exports = router;