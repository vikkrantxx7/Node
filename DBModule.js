module.exports.authenticateUser = function(username,password){
    if(username === "vikrant" && password === "password")
    return "Valid User";
    return "Invalid User";
}

module.exports.addUser = function(username,password,address,res){
    return "User added successfully";
}