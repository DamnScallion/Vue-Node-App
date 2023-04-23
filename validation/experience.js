const Validator = require('validator');
const isEmpty = require("./is-empty");

module.exports = function velidateExperienceInput(data) {//验证req.body里的信息，data是接收req.body传递过来的形参
    let errors = {};

    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';



    if (Validator.isEmpty(data.title)) {
        errors.title = "个人经历的title不能为空!";
    }

    if (Validator.isEmpty(data.company)) {
        errors.company = "个人经历的company不能为空!";
    }

    if (Validator.isEmpty(data.from)) {
        errors.from = "个人经历的from不能为空!";
    }



    return {
        errors,
        isValid: isEmpty(errors)//有errors返回false,没errors返回true,用于验证是否通过
    }
}