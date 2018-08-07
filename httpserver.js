var http=require("http");
var routing = require('./BookRouting');
var url = require("url");
var net = require("net");

http.createServer(function(request, response) {
    if(request.url==="/favicon.ico")
    {
        response.writeHead(200,{"Content-Type":"image/x-icon"});
        response.end();
        return;
    } else {
        var url_parts = url.parse(request.url);
        routing.enableRoute(url_parts,request,response);
    }
}).listen(3000);

var server = net.createServer(function(c){
    console.log('Client connected.');
    c.on('data',function(data){
        console.log(data.toString());
        c.write(data);
    });
    c.on('close',function(){
        console.log('Client Disconnected.');
    });
});

server.listen(1234,function(){
    console.log('TCP Server started.');
});

console.log("Server started");