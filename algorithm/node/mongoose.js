/**
 * Created by king on 2014/9/20.
 */
   var mongoose = require('mongoose');
   var Schema = mongoose.Schema;
   var ObjectId = Schema.ObjectId;

  var AuthorSchema = new Schema({
      name:String
  });
  var CommentSchema = new Schema({
      commenter : String,
      body : String,
      posted : Date
  });
  var ArticleSchema = new Schema({
      author : ObjectId,
      title : String,
      contents : String,
      published : Date,
      comments:[CommentSchema]
  });


 mongoose.connect('mongodb://localhost/mongooseExample',function(err){
      if(err) console.log('connect err!!!');
 });
 mongoose.connection.on('open',function(){
     console.log('Connected to Mongoose!!');
 });
var Author = mongoose.model('Author',AuthorSchema);
var Article = mongoose.model('Article',ArticleSchema);
var author = {
    name : "vekeing"
}  // oK!!
var newAuthor = new Author(author);

newAuthor.save(function(err,data){
      if(err){
          console.log('err')
      }else{
          console.log(data);
      }
  });
Author.find(function(err,doc){
     if(err){
         console.log(err)
     }else{
         console.log(doc)
     }
})



