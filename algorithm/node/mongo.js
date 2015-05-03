/**
 * Created by king on 2014/9/20.
 */
  var mongo = require('mongodb');
  var host = 'localhost';
  var port = mongo.Connection.DEFAULT_PORT;
  var count = 0;
  var db = new mongo.Db('mongoExample',new mongo.Server(host,port,{}),{});
  db.open(function(err,db){
     db.collection('db1',function(err,collection){
         collection.save({name:"测试链接",total:function(){
             return count++;
         }},function(err,doc){
              console.log(doc);
              db.close();
         });
     });
  })