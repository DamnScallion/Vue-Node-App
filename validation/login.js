const Validator = require('validator');
const isEmpty = require("./is-empty");

module.exports = function velidateLoginInput(data) {//验证req.body里的信息，data是接收req.body传递过来的形参
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (!Validator.isEmail(data.email)) {
        errors.email = "邮箱不合法!";
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = "邮箱不能为空!";
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = "密码不能为空!";
    }

    return {
        errors,
        isValid: isEmpty(errors)//有errors返回false,没errors返回true,用于验证是否通过
    }
}