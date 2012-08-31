/**
 * @author AMRoche
 */


var settime = prompt("Specify Time to run for in minutes.", "");
var ScurrentDate;
var Sseconds;
var Sminute;
var Shour;
var Sday;
var Smonth;
var Syear;
var connection;
var finished = false;

if (settime != null) {
ScurrentDate = new Date();
Sseconds = ScurrentDate.getSeconds();
Sminute = ScurrentDate.getMinutes();
Shour = ScurrentDate.getHours();
Sday = ScurrentDate.getDate();
month = ScurrentDate.getMonth() + 1;
Syear = ScurrentDate.getFullYear();
	clockdisplay();
};
if(window.WebSocket)webSocketsOn();
else webSocketsOff();

function webSocketsOn() {
	document.getElementById('messagedisplay').innerHTML = "<textarea readonly rows = \"14\" cols = \"40\" id=\"messagebox\"></textarea>";
	if (window.MozWebSocket) {
		window.WebSocket = window.MozWebSocket;
	}
		document.getElementById('messagebox').innerHTML = "Websockets enabled; connecting...";
}



function webSocketsOff() {
document.getElementById('messagedisplay').value = "NO WEBSOCKETS HERE!";

}

function clockdisplay() {
	var currentDate = new Date();
	var seconds = currentDate.getSeconds();
	var minute = currentDate.getMinutes();
	var hour = currentDate.getHours();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	var remaintimemin = Math.floor(parseFloat(settime) - (parseFloat(Math.ceil(currentDate.getTime() - ScurrentDate.getTime())) / 60000));
	var remaintimesec = Math.floor(parseFloat(settime * 60) - (parseFloat(Math.ceil(currentDate.getTime() - ScurrentDate.getTime())) / 1000)) - (remaintimemin * 60);
	if(remaintimesec == -1){
		remaintimesec = 59;
		remaintimemin -= 1;
	}
	if (minute < 10) {
		minute = "0" + minute;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	if (remaintimesec == 0 && remaintimemin == 0) {
		alert("Time up!");
		finished = true;
	}
	if (finished == true){
		remaintimemin = 0;
		remaintimesec = 0;
	}
	document.getElementById('clockdisplay').innerHTML = "<b>Current Date: </b>" + day + "/" + month + "/" + year + "<br><b>Current Time: </b>" + hour + ":" + minute + ":" + seconds;
	document.getElementById('alarmdisplay').innerHTML = "<b>Alarm set for: " + settime + " minutes.</b><br><b>Time Remaining: " + remaintimemin + " minutes, " + remaintimesec + " seconds.";
	window.setTimeout("clockdisplay()", 1000);

};

(function(){
 
    // LISTEN FOR MESSAGES
    PUBNUB.subscribe({
        channel    : "speaker",      // CONNECT TO THIS CHANNEL.
 
        restore    : false,              // STAY CONNECTED, EVEN WHEN BROWSER IS CLOSED
                                         // OR WHEN PAGE CHANGES.
 
        callback   : function(message) { // RECEIVED A MESSAGE.
    
    var currentDate = new Date();
    var seconds = currentDate.getSeconds();
	var minute = currentDate.getMinutes();
	var hour = currentDate.getHours();
	
		if (minute < 10) {
		minute = "0" + minute;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	
           document.getElementById('messagebox').value = document.getElementById('messagebox').value +"\n"+hour + ":" + minute + ":" + seconds+"; "+message;
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
                channel : "speaker",
                message : "We have connection."
            })
 
        }
    })
 
})();