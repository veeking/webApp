/**
 * Created by king on 2015/4/15.
 */
  var http = require('http');
  var server = http.createServer(function(req,res){
      var buffers = [];
      req.on('data',function(data){
          console.log(data);
          buffer.push(data);
      })

      res.end('HTTP的服务事件',function(){  // 得到响应后触发

          var buffer = new Buffer.concat(buffers);
          console.log(buffer);
          res.write('呵呵');
      });
  }).listen(2020);