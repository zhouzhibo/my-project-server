// 引入
var mongoose = require("mongoose");
var db = require("./db.js");

//创建了一个schema结构。
var userSchema = new mongoose.Schema({
    user_id      :  String,
    user_name    :  String,
    password     :  String,
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }  
},{
    versionKey: false,
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' }
});

//通过用户名查找用户
userSchema.statics.getUserByUserName = function(user_name, callback) {
    this.model('user').find({user_name: user_name}, callback);
};

//通过用户ID查找用户
userSchema.statics.getUserByUserId = function(user_id, callback) {
    this.model('user').find({user_id: user_id}, callback);
};


//创建了一个模型，就是学生模型，就是学生类。
//类是基于schema创建的。
var userModel = db.model('user', userSchema);

//向外暴露
module.exports = userModel;