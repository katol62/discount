var mysql=require('mysql');
var connection = mysql.createPool({

    host:'localhost',
    user:'root',
    password:'',
    database:'discount',
    multipleStatements: true

});
module.exports=connection;