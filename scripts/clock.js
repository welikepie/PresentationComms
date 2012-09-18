/**
 * @author AMRoche
 */
var remaintimemin;
var remaintimesec;
var settime = null;
//var settime = prompt("Specify Time to run for in minutes.", "");
var ScurrentDate;
var Sseconds;
var Sminute;
var Shour;
var Sday;
var Smonth;
var Syear;
var connection;
var finished = false;
var oldRed = 142;
var midRed = 104;
var newRed = 17;
var oldGreen = 77;
var midGreen = 0;
var newGreen = 92;
var oldBlue = 19;
var midBlue = 39;
var newBlue = 130;
var steps;
var stepNum = 0;
var currentRed = oldRed;
var currentBlue = oldBlue;
var currentGreen = oldGreen;
var timeLimit = 0;
////console.log("ping");
document.getElementById("container").style.backgroundColor = "rgb(" + oldRed + "," + oldGreen + "," + oldBlue + ")";
//142.77.19 - 104.0.39 - 17.92.130
//Gradient: #8e4d13 to #680027 to #115c82
/*currentRed = oldRed;
for (i = 0; i < steps; i++) {
currentRed += redStepAmount;
}*/

//call this from le pubnub code.
if (settime == null) {
	document.getElementById("alarmtext").innerHTML = "00:00";
};

if (window.WebSocket)
	webSocketsOn();
else
	webSocketsOff();

function webSocketsOn() {
	//document.getElementById('messagedisplay').innerHTML = "<textarea readonly rows = \"14\" cols = \"40\" id=\"messagebox\"></textarea>";
	if (window.MozWebSocket) {
		window.WebSocket = window.MozWebSocket;
	}
	//document.getElementById('messagebox').innerHTML = "Websockets enabled; connecting...";
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
	remaintimemin = Math.floor(parseFloat(settime) - (parseFloat(Math.ceil(currentDate.getTime() - ScurrentDate.getTime())) / 60000));
	remaintimesec = Math.floor(parseFloat(settime * 60) - (parseFloat(Math.ceil(currentDate.getTime() - ScurrentDate.getTime())) / 1000)) - (remaintimemin * 60);
	if (remaintimesec == -1) {
		remaintimesec = 59;
		remaintimemin -= 1;
	}
	if (minute < 10) {
		minute = "0" + minute;
	}
	if (seconds < 10) {
		seconds = "0" + seconds;
	}
	if (remaintimemin < 10) {
		remaintimemin = "0" + remaintimemin;
	}

	if (remaintimesec < 10) {
		remaintimesec = "0" + remaintimesec;
	}

	if (remaintimesec == 0 && remaintimemin == 0) {
		//alert("Time up!");
		finished = true;
	}
	if (finished == true) {
		document.getElementById("container").style.backgroundColor = "rgb(" + oldRed + "," + oldGreen + "," + oldBlue + ")";
		remaintimemin = "00";
		remaintimesec = "00";
	}
	//	document.getElementById('clockdisplay').innerHTML = "<b>Current Date: </b>" + day + "/" + month + "/" + year + "<br><b>Current Time: </b>" + hour + ":" + minute + ":" + seconds;
	//	document.getElementById('alarmdisplay').innerHTML = "<b>Alarm set for: " + settime + " minutes.</b><br><b>Time Remaining: " + remaintimemin + " minutes, " + remaintimesec + " seconds.";
	document.getElementById('alarmtext').innerHTML = remaintimemin + ":" + remaintimesec;
	backgroundChange();
	messageWindow();
	window.setTimeout("clockdisplay()", 1000);

};
function messageWindow() {
	
	if (document.getElementById('messageBox').className.indexOf("visShow") != -1) {
		timeLimit++;
		//console.log(timeLimit);
		if (timeLimit == 5) {
			document.getElementById('messageBox').className = "message visHide";
			timeLimit = 0;
		}
			if (settime == null) {
		window.setTimeout("messageWindow()", 1000);
	}
	}
}

function backgroundChange() {
	stepNum++;

	var constantTime = remaintimemin + remaintimesec / 60;
	var redStepAmount;
	var greenStepAmount;
	var blueStepAmount;

	if (constantTime == null) {
		document.getElementById("container").style.backgroundColor = "rgb(" + Math.floor(newRed) + "," + Math.floor(newGreen) + "," + Math.floor(newBlue) + ")";
		stepNum--;
	}

	//document.getElementById("container").style.backgroundColor = "rgb(100,200,150)";
	//document.getElementById("container").style.backgroundColor = "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")";
	////console.log(document.getElementById("container").style.backgroundColor);
	if (constantTime > settime / 2) {
		redStepAmount = (midRed - oldRed) / ((steps / 2));
		greenStepAmount = (midGreen - oldGreen) / ((steps / 2));
		blueStepAmount = (midBlue - oldBlue) / ((steps / 2));
		//console.log(currentRed);
		//console.log(redStepAmount);
		currentRed += redStepAmount;
		currentGreen += greenStepAmount;
		currentBlue += blueStepAmount;
		////console.log(currentRed);
		document.getElementById("container").style.backgroundColor = "rgb(" + Math.floor(currentRed) + "," + Math.floor(currentGreen) + "," + Math.floor(currentBlue) + ")";
		//console.log("post-change"+currentRed);
	}
	if (constantTime == settime / 2) {
		//console.log("YYEAAAH");
		currentRed = midRed;
		//console.log(currentRed);
		currentBlue = midBlue;
		currentGreen = midGreen;
		document.getElementById("container").style.backgroundColor = "rgb(" + currentRed + "," + currentGreen + "," + currentBlue + ")";
	}
	if (constantTime < settime / 2 && constantTime > 0) {
		//console.log(steps - (steps/2));
		redStepAmount = (newRed - midRed) / (steps / 2);
		greenStepAmount = (newGreen - midGreen) / (steps / 2);
		blueStepAmount = (newBlue - midBlue) / (steps / 2);
		//console.log(currentRed);
		//console.log(redStepAmount);
		currentRed += redStepAmount;
		currentGreen += greenStepAmount;
		currentBlue += blueStepAmount;
		////console.log(currentRed);
		document.getElementById("container").style.backgroundColor = "rgb(" + Math.floor(currentRed) + "," + Math.floor(currentGreen) + "," + Math.floor(currentBlue) + ")";
		//console.log("post-change"+currentRed);
	}

}

(function() {

	// LISTEN FOR MESSAGES
	PUBNUB.subscribe({
		channel : "speaker", // CONNECT TO THIS CHANNEL.

		restore : false, // STAY CONNECTED, EVEN WHEN BROWSER IS CLOSED
		// OR WHEN PAGE CHANGES.

		callback : function(message) {// RECEIVED A MESSAGE.

			if (message.indexOf("Time:") == -1) {
				document.getElementById("messageBox").innerHTML = "<div id='messageContainer'><p>" + message + "</div></p>";
				document.getElementById("messageBox").className = "message visShow";
			if(settime == null){
				timeLimit = 0;
				messageWindow();
			}	
			}
			if (message.indexOf("Time:") != -1) {
				ScurrentDate = new Date();
				Sseconds = ScurrentDate.getSeconds();
				Sminute = ScurrentDate.getMinutes();
				Shour = ScurrentDate.getHours();
				Sday = ScurrentDate.getDate();
				month = ScurrentDate.getMonth() + 1;
				Syear = ScurrentDate.getFullYear();
				settime = message.substr(5);
				steps = Math.floor(settime * 60);
				clockdisplay();
			}
			//  document.getElementById('messagebox').value = document.getElementById('messagebox').value +"\n"+hour + ":" + minute + ":" + seconds+"; "+message;
		},

		disconnect : function() {// LOST CONNECTION.
			document.getElementById("messageBox").innerHTML = "<div id='messageContainer'><p>" + "\n connection lost" + "\n will auto-connect when online" + "</div></p>";
			document.getElementById("messageBox").className = "message visShow";
			if(settime == null){
				timeLimit = 0;
				messageWindow();
			}
		},

		reconnect : function() {// CONNECTION RESTORED.
			document.getElementById("messageBox").innerHTML = "<div id='messageContainer'><p>" + "and we're back!" + "</p></div>";
			document.getElementById("messageBox").className = "message visShow";
			if(settime == null){
				timeLimit = 0;
				messageWindow();
			}
		},

		connect : function() {// CONNECTION ESTABLISHED.
			document.getElementById("messageBox").innerHTML = "<div id='messageContainer'><p>" + "connected to channel" + "</p></div>";
			document.getElementById("messageBox").className = "message visShow";
			if(settime == null){
				timeLimit = 0;
				messageWindow();
			}

			/*PUBNUB.publish({
			 channel: "speaker",
			 //message: "Time:1"
			 })*/

		}
	})

})(); 