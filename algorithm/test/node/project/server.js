/**
 * Created by king on 2015/4/15.
 */
   var http = require('http');
   http.createServer(function(req,res){
       console.log(req.params);
   }).listen(2020);
