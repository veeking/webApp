/**
 * Created by king on 2015/4/16.
 */
  var settings = {
      db : 'firstNode',
      host : 'localhost'
 };
 var Db = require('mongodb').Db; //新版本mongo 去掉了Connection.DEFAULT_PORT, {}
 var Server = require('mongodb').Server;
 module.exports = new Db(settings.db,new Server(settings.host,27017),{safe : true});
  // 为什么是27017不是28017????