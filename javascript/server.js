var WebSocketServer = require('websocket').server;
var http = require('http');
var connectors = [];
fs = require('fs');
var staticFiles = require('node-static');
var fileServer = new staticFiles.Server('../public');

var server = http.createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response)
    }).resume();
}).listen(8080);


wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
    return true;
}

wsServer.on('request', function (request) {
    if (!originIsAllowed(request.origin)) {
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
    }

    var connection = request.accept(null, request.origin);
    connectors.push(connection);
    console.log(' Connection accepted.');


    connection.on('message', function (message) {
        messageData = JSON.parse(message.utf8Data);
        console.log("Recieved message: " + (messageData.name));
        for (var connector of connectors) {
            connector.sendUTF(JSON.stringify({
                name: messageData.name,
                text: messageData.text,
                color: messageData.color
            }));
        }
    });
    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});