window.onload = function () {
    var connection = new WebSocket('ws://10.103.50.190:8080/');
    var userName = document.querySelector("#userName");
    var text = document.querySelector("#userText");
    var posts = document.querySelector(".messages");
    var color = "black";

    document.querySelector("#message-button").addEventListener('click', sendMessage);

    connection.onmessage = function (message) {
        try {
            var messageObject = JSON.parse(message.data);
            var docFrag = document.createDocumentFragment();
            var userNameSpan = document.createElement("span");
            var textSpan = document.createElement("span");
            var userdiv = document.createElement("div");
            userNameSpan.appendChild(document.createTextNode(messageObject.name + " : "));
            textSpan.appendChild(document.createTextNode(messageObject.text));
            textSpan.setAttribute("style", "color: " + messageObject.color);
            userdiv.appendChild(userNameSpan);
            userdiv.appendChild(textSpan);
            docFrag.appendChild(userdiv);
            posts.appendChild(docFrag);
        } catch (e) {
            console.log("valid error");
        }
    };

    function sendMessage() {
        if (text.value.startsWith("/")) {
            var commandList = text.value.split(" ");

            if (commandList[0] === "/setColor") {
                color = commandList[1];
                text.value = "";
            }
        } else {
            connection.send(JSON.stringify({name: userName.value, text: text.value, color: color}));
        }
    };
};
