/**
 * Created by king on 2015/4/16.
 */
  var mongodb = require('./db');
  function User(user){   // user形参为客户端接收数据对象
      this.name = user.name;
      this.password = user.password;
  }
  module.exports = User;
  User.prototype.save = function(callback){
      var newUser = {
          name : this.name,
          password : this.password
      };
      mongodb.open(function(err,db){   // 数据库连接 有问题
      if(err){
          return callback(err);
      }

      db.collection('users',function(err,collection){ //  读取数据库中的users集合
          if(err){
              mongodb.close();
              return callback(err);
          }
          collection.insert(newUser,{safe : true},function(err,doc){  // 插入数据
               mongodb.close();
               if(err) {
                   return callback(err);
               }
               callback(null,doc.ops[0]); //mongo新版本改动
          });
      });
      })
  };// end save  插入
  //  取出静态方法， 因为不需要实例属性 所以定义为静态方法
  User.get = function(name,callback){
//      console.log(name)
      mongodb.open(function(err,db){
           if(err){
               return callback(err);
           }

           db.collection('users',function(err,collection){
               if(err){
                   mongodb.close();
                   return callback(err);
               }
               collection.findOne({name : name},function(err,name_user){
                   mongodb.close();
                   if(err){
                       return callback(err);
                   }
                   callback(null,name_user);
               });
           }) // end db.collection
       })
  }

