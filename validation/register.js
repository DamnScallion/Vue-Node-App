const Validator = require('validator');
const isEmpty = require("./is-empty");

module.exports = function velidateRegisterInput(data) {//验证req.body里的信息，data是接收req.body传递过来的形参
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';//如果为true返回name，如果为false返回空字符串
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = "名字的长度不能小于2位并且不能大于30位!";
    }

    if (Validator.isEmpty(data.name)) {
        errors.name = "名字不能为空!";
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = "邮箱不能为空!";
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = "邮箱不合法!";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "密码不能为空!";
    }

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "密码的长度不能小于6位并且不能大于30位!";
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = "确认密码不能为空!";
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = "两次密码不一致!";
    }

    return {
        errors,
        isValid: isEmpty(errors)//有errors返回false,没errors返回true,用于验证是否通过
    }
}