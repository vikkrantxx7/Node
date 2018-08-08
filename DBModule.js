var databaseUrl = 'Vikk';
var collections = ['name'];
var db = require('mongojs')(databaseUrl,collections);

module.exports.authenticateUser = function(username,password,response,callback){
    // if(username === "vikrant" && password === "password")
    // return "Valid User";
    // return "Invalid User";
    db.name.find({"username":username,"password":password},function(err,users){
        if(err || !users){
            console.log('Invalid');
            return callback(err);
        } else if(users.length === 0){
            console.log('Invalid Length');
            return callback(err);
        } else {
            callback(null,'success');
        }
    });
}

module.exports.addUser = function(username,password,address,res,callback){
    db.name.save({"username":username,"password":password,"address":address},function(err,saved){
        if(err || !saved) {
            console.log('User not saved');
            return callback(err);
        } else {
            console.log('User Saved');
            return callback(null,saved);
        }
    });
}