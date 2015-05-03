/**
 * Created by king on 2015/4/15.
 */
   var http = require('http');
   var options = {
       hostname : '127.0.0.1',
       port : 1334,
       path : '/',
       method: 'GET'
   };
   var req = http.request(options,function(res){
       res.on('data',function(data){
           console.log(1);
       });
   });
req.end();