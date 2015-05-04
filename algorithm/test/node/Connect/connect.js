/**
 * Created by king on 2015/4/26.
 */
  var http = require('http');
  var app = require('connect')();

   function logger(req,res,next){
        switch(req.url){
            case "/":
            console.log('url is index');
            break
        };
        console.log('URL:' + req.url + "Method :" + req.method);
        console.log('HI I M  log');
        next();
   }
   function hello(req,res){
       console.log('hello world!!!');
       res.end();
   }
  app.use(logger);
  app.use(hello);
  app.listen(3000);