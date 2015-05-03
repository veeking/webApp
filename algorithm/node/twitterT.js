/**
 * Created by king on 2014/9/20.
 */
  var express = require('express');
  var app = express();
  app.get('/',function(req,res){
        res.send("欢迎来到Twitter!!!");
  });
var twitter = ["哈哈哈哈","dsa"];
app.post('/send',function(req,res){
        twitter.push(req.body.twitte);

});
app.get('/twitter',function(req,res){
    res.send(twitter);
});
  app.listen(8000);


