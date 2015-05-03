/**
 * Created by king on 2015/4/28.
 */

  var mongo = require('./db');
  var Post = function(post){
      this.title = post.title;
      this.date = post.date;
      this.author = post.author;
      this.content = post.content;
  }
  module.exports = Post;


  Post.prototype.save = function(callback){
       var newPost = {
           title : this.title,
           date : this.date,
           author : this.author,
           content : this.content
       }
      mongo.open(function(err,db){
          if(err) return callback(err);
          db.collection('posts',function(err,collection){
              if(err){
                mongo.close();
                return callback(err);
              };
              collection.insert(newPost,{safe:true},function(err,doc){
                   mongo.close();
                   if(err) return callback(err);
                   callback(null,doc.ops[0]);
              });
          })
      })
  }
 Post.get = function(name,callback){
      mongo.open(function(err,db){
          if(err) return callback(err);
          db.collection('posts',function(err,collection){
             if(err){
                mongo.close();
                return callback(err);
             }   //  根据用户名称查找文章，排序并以数组形式输出
             collection.find({author:name}).sort({date:-1}).toArray(function(err,docs){
                  mongo.close();
                  if(err) return callback(err);
                  var posts = [];  // 存放 所有文章
                  docs.forEach(function(doc,index){
                     var post = new Post(doc);
                     posts.push(post);
                  })
                 callback(null,posts);
             });
          })
      });
 }