var connection;
var sendButton = document.getElementById('send');
var channelSet = "speaker";

window.onload = function() {
	if (sendButton.addEventListener) {
		sendButton.addEventListener(
			"click", sendMessage, false
		)}
	 else if (sendButton.attachEvent){
		sendButton.attachEvent
	{
		"onclick", sendMessage
	};}
}

function sendMessage() {
	PUBNUB.publish({             // SEND A MESSAGE.
                channel : channelSet,
                message : document.getElementById('sendbox').value
            })
            document.getElementById('sendbox').value = null;
	document.getElementById('messagebox').value = document.getElementById('messagebox').value+"\n SENT: "+document.getElementById('sendbox').value;
}

if (window.WebSocket)
	webSocketsOn();
else
	webSocketsOff();

function webSocketsOn() {
	if (window.MozWebSocket) {
		window.WebSocket = window.MozWebSocket;
	}
	document.getElementById('messagebox').innerHTML = "Websockets enabled; connecting...";
}


function webSocketsOff() {
	document.getElementById('messagebox').innerHTML = "Browser No Can Haz Websockets :(";
}

(function(){
 
    // LISTEN FOR MESSAGES
    PUBNUB.subscribe({
        channel    : channel,      // CONNECT TO THIS CHANNEL.
 
        restore    : false,              // STAY CONNECTED, EVEN WHEN BROWSER IS CLOSED
                                         // OR WHEN PAGE CHANGES.
 
        callback   : function(message) { // RECEIVED A MESSAGE.
           document.getElementById('messagebox').value = document.getElementById('messagebox').value +"\n"+message;
        },
 
        disconnect : function() {        // LOST CONNECTION.
            document.getElementById('messagebox').value = document.getElementById('messagebox').value +
                "\n Connection Lost." +
                "\n Will auto-reconnect when Online."
            
        },
 
        reconnect  : function() {        // CONNECTION RESTORED.
               document.getElementById('messagebox').value = document.getElementById('messagebox').value +
         "\n And we're Back!"
        },
 
        connect    : function() {        // CONNECTION ESTABLISHED.
 
            PUBNUB.publish({             // SEND A MESSAGE.
                channel : channelSet,
                message : "We have connection."
            })
 
        }
    })
 
})();
