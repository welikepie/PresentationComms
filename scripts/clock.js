/**
 * @author AMRoche
 */

var ScurrentDate = new Date();
var Sseconds = ScurrentDate.getSeconds();
var Sminute = ScurrentDate.getMinutes();
var Shour = ScurrentDate.getHours();
var Sday = ScurrentDate.getDate();
var Smonth = ScurrentDate.getMonth() + 1;
var Syear = ScurrentDate.getFullYear();
var settime;
var connection;
var settime = prompt("Specify Time to run for in minutes.", "");

if (settime != null) {
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
		//calculates remaining minutes by getting the set ammount in minutes and difference in time, in minutes.
	var remaintimesec = Math.floor(parseFloat(settime * 60) - (parseFloat(Math.ceil(currentDate.getTime() - ScurrentDate.getTime())) / 1000)) - (remaintimemin * 60);
	
	if (minute < 10) {
		minute = "0" + minute;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	if (remaintimesec == 0 && remaintimemin == 0) {
		alert("Time up!");
	}
	
	if (remaintimesec <= 0 && remaintimemin <= 0) {
		remaintimesec = 0;
		remaintimemin = 0;
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
           document.getElementById('messagebox').value = document.getElementById('messagebox').value +"\n RECEIVED: "+message;
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