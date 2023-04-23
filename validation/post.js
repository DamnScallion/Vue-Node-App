const Validator = require('validator');
const isEmpty = require("./is-empty");

module.exports = function velidatePostInput(data) {//验证req.body里的信息，data是接收req.body传递过来的形参
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';

    if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
        errors.text = "评论不能少于10个字符且不能大于300个!";
    }

    if (Validator.isEmpty(data.text)) {
        errors.text = "文本不能为空!";
    }

    return {
        errors,
        isValid: isEmpty(errors)//有errors返回false,没errors返回true,用于验证是否通过
    }
}