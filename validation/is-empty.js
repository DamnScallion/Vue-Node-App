const isEmpty = value => {
    return value === undefined || value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0);
    //判断传入的errors是否没定义，是否空的，是否是对象且长度为0(也代表没有errors),是否是字符串且去掉空格长度为0(也代表没有errors)
}

module.exports = isEmpty;