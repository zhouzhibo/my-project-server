const express = require('express');
const router = express.Router();
const formidable = require("formidable");
const sd = require('silly-datetime');
const User = require('../models/User');

// 向外暴露这个文件
module.exports = router;

/* 注册--------------------------------------- */
router.post('/', function (req, res, next) {
  //得到用户填写的东西
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
  
  let obj = [{
                "result": "1",
                "message": "新用户创建成功"
              },
              {
                "result": "-1",
                "message": "用户名已经存在，请重试"
              },
              {
                "result": "-2",
                "message": "用户名或密码为空，请重试"
              }];

    //得到表单之后做的事情
    if (fields.user_name =="" || fields.password == "") {
      
      res.json(obj[2]);
    } else {
      let user_name = fields.user_name;
      let password = fields.password;


      // 查询一下，是否有这个用户
      User.getUserByUserName(user_name, function (err, user) {

        // 如果该用户已经存在，做以下处理
        if (user != "") {        
          res.json(obj[1]);
        } else {

          let user_id = "UID" + sd.format(new Date(), 'YYYYMMDDHHmmss');  // 创建一个user_id
          // 创建一个新用户
          let newUser = new User({ "user_id": user_id, "user_name": user_name, "password": password });
          // 保存该用户
          newUser.save(function (err, result) {
            if (err) {
              next();
            } else {
              console.log("注册成功：" + result.user_name);
              res.json(obj[0]);
            }
            
          });
        }
      });
    }
    
  });
});

/* 登录--------------------------------------- */
router.post('/login', function (req, res, next) {
  //得到用户填写的东西
  var form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
  
  let obj = [{
                "result": "1",
                "message": "登录成功"
              },
              {
                "result": "-1",
                "message": "用户名或密码错误，请重试"
              },
              {
                "result": "-2",
                "message": "用户名或密码为空，请重试"
              }];

    //得到表单之后做的事情

    // 排除空表单
    if (fields.user_name =="" || fields.password == "") {
      res.json(obj[2]);
    } else {
      let user_name = fields.user_name;
      let password = fields.password;


      // 查询一下，是否有这个用户
      User.getUserByUserName(user_name, function (err, user) {
        if (user == {}) {
           res.json(obj[1]);
        } else {
          // 如果该用户已经存在，做以下处理
          if (password == user[0].password) {
            console.log("登录成功：" + user_name);
            res.json(obj[0]);
          } else {
            res.json(obj[1]);
          }
        }
        
        
      });
    }
    
  });
});