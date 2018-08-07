var module = require('./DBModule');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
var zlib = require('zlib');
var net=require('net');
message="";

exports.display_login = function(url,request,response){
    data1 = '';
    request.on('data',function(chunk){
        data1 += chunk;
    });
    request.on('end',function(){
        qs = querystring.parse(data1);
        name = qs["username"];
        password = qs["password"];
        result = module.authenticateUser(name,password);
        if(result === "Valid User"){
            fs.appendFile('./log.txt',"User "+name+" has logged in at "+new Date(),function(err,html){
                if(err)
                throw err;
            });
            fs.readFile('./Details_Book.html', function (err, html) {
                if (err) {
                            throw err;
                        }      
                response.writeHead(200, {"Content-Type": "text/html"}); 
                response.write(html); 
                response.end(); 
            });
        }else{
            response.writeHead(200,{"Content-Type":"text/html"});
            response.write(`<body bgcolor='#E2C2F6'><center>Invalid User try login Again!!</center>
            <center><a href='home'>Back to Login</a></center></body>`);
            response.end();
        }
    });
}

exports.display_signup = function(url,request,response){
    fs.readFile('./Signup_Book.html',function(err,html){
        if(err)
        throw err;
        response.writeHead(200,{"Content-Type":"text/html"});
        response.write(html);
        response.end();
    });
}

exports.display_register = function(url,request,response){
    data1 = '';
    request.on('data',function(chunk){
        data1 += chunk;
    });
    request.on('end',function(){
        qs = querystring.parse(data1);
        name = qs["username"];
        password = qs["password"];
        confirmpassword = qs["confirmpassword"];
        address = qs["address"];
        if(password === confirmpassword){
            result = module.addUser(name,password,address,response);
            response.writeHead(200,{"Content-Type":"text/html"});
            response.write("<body bgcolor='#E2C2F6'><center>"+result+"</center></body>");
            response.write("<center><a href='home'>Click here to Login</a></center>");            
        } else {
            response.writeHead(200,{"Content-Type":"text/html"});
            response.write("<body bgcolor='#E2C2F6'><center>Password doenot match with confirm password!!</center></body>");
            response.write("<center><a href='signup'>Try again</a></center>");
            response.end();
        }
    });
}

exports.display_home = function(url,request,response){
    fs.readFile('./Login_Book.html', function (err, html){
        if(err)
        throw err;
        response.writeHead(200,{"Content-Type":"text/html"});
        response.write(html);
        response.end();
    });
}

exports.view_books = function(request,response){
    fs.readFile('./books.json',function(err,json){
        if(err)
        throw err;
        response.writeHead(200,{"Content-Type":"application/json"});
        response.end(json);
    });
}

exports.getImageResponse = function(request,response){
    var img;
    switch(request.url){
        case '/node1.jpg':
            img = fs.readFileSync('./books/images/node1.jpg');
            break;
        case '/node2.jpg':
            img = fs.readFileSync('./books/images/node2.jpg');
            break;
        case '/node3.jpg':
            img = fs.readFileSync('./books/images/node3.jpg');
    }
    response.writeHead(200, {'Content-Type': 'image/jpg' });
    response.end(img, 'binary');
}

exports.download_book = function(request,response){
    var query = url.parse(request.url).query;
    var ebook = querystring.parse(query)["ebook"];
    rstream = fs.createReadStream('./books/'+ebook);
    wstream = fs.createWriteStream('D://books//'+ebook+'.gz');
    var gzip = zlib.createGzip();
    rstream.pipe(gzip).pipe(wstream).on('finish',function(){
        console.log("Finished Compressing");
        fs.readFile('./Details_Book.html', function (err, html) {
            if (err) {
                throw err;
            }      
                response.writeHeader(200, {"Content-Type": "text/html"}); 
                response.write(html); 
                response.write("<script type='text/javascript'>alert('Downloaded the zipped file,check in the D:/books directory');</script>");
                response.end();
        });
    });
}

exports.view_book = function(request,response){
    var query = url.parse(request.url).query;
    var ebook = querystring.parse(query)["ebook"];
    rstream = fs.createReadStream('./books/'+ebook);
    rstream.pipe(response);
}

exports.createChat = function(request,response){
    var query = url.parse(request.url).query;
    var chatmessage = querystring.parse(query)['chatmessage'];
    var chatname = querystring.parse(query)['chatname'];
    var client = net.connect({port:1234},function(){
        console.log('Connected to server.');
        client.write("<B>Name:</B>"+chatname);
        client.write("<br><B>Message:</B>"+chatmessage);
    });

    client.on('data',function(data){
        message += "<tr style=' border-bottom:ridge;'><td>"+data.toString()+"</td></tr>";
        console.log(data.toString());
        fs.readFile('./Details_Book.html', function (err, html) {
            if (err) {
                throw err;
            }      
            response.writeHeader(200, {"Content-Type": "text/html"}); 
            response.write(html);
            var chatresponse="<br><table style='border-collapse:collapse;background-color: #ffb3b3;border: ridge;width:300px;top:100;left:0;position: fixed;'><tr style=' border-bottom:ridge;'><td><h4>Discussion:</h4></td></tr>"+message+"</table>";
            response.write(chatresponse);
            response.end();
        });
    });

    // client.end();
    client.on('end', function() {
        console.log('disconnected from server');      
    });
}