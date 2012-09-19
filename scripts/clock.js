/**
 * @author AMRoche
 */
var remaintimemin;
var remaintimesec;
var settime = null;
//var settime = prompt("Specify Time to run for in minutes.", "");
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
var intervalId;
var paused = false;
var minutes;
var seconds;
console.log(currentRed);
document.getElementById("container").style.backgroundColor = "rgb(" + oldRed + "," + oldGreen + "," + oldBlue + ")";


if (window.WebSocket){
	webSocketsOn();
}
else{
	webSocketsOff();
}
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

function startTimer(stringy) {
	console.log(stringy);
	stringTime = stringy.substr(6, 5);
	settime = stringTime.split(":")[0];
	document.getElementById('alarmtext').innerHTML = stringTime;
	paused = false;
	clockCounter();
	intervalId = setInterval('clockCounter()',1000);
}
function pause(){
	if(paused == false){
		paused = true;
		if(intervalId != null){
			clearInterval(intervalId);
		}
	}
}

function clockCounter() {
	console.log("lol");
	if(document.getElementById('alarmtext').innerHTML.substr(6,5) != "00:00"){
		var split = document.getElementById('alarmtext').innerHTML.split(":");
		minutes = parseInt(split[0]);
		seconds = parseInt(split[1]);

		if(seconds == 0){
			minutes -= 1;
			seconds += 60;
		}
		if(minutes == 0 && seconds == 0){
			minutes == 0;
			seconds == 1;
		}

		if(paused == false){
			seconds = seconds-1;
		}		
		if(minutes < 10 && minutes.length !=2){
			minutes = "0"+minutes;
		}
		if(seconds < 10 && seconds.length !=2){
			seconds = "0"+seconds;
		}
		
		if(minutes == 0){
			minutes = "00";
		}		
		console.log(minutes+":"+seconds);
		document.getElementById('alarmtext').innerHTML = minutes+":"+seconds;
	}
	backgroundChange();
//console.log(minutes+":"+seconds);
}

function messageWindow() {
	if (document.getElementById('messageBox').className.indexOf("visShow") != -1) {
		timeLimit++;
		if (timeLimit == 7) {
			document.getElementById('messageBox').className = "message visHide";
			timeLimit = 0;
		}
		if (settime == null || paused == true) {
			window.setInterval("messageWindow()", 1000);
		}
	}
}

function backgroundChange() {
	messageWindow();
	stepNum++;
	var constantTime = parseInt(minutes) + parseInt(seconds) / 60;
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
		currentRed += redStepAmount;
		currentGreen += Math.floor(greenStepAmount);
		currentBlue += Math.floor(blueStepAmount);
		document.getElementById("container").style.backgroundColor = "rgb(" + Math.floor(currentRed) + "," + Math.floor(currentGreen) + "," + Math.floor(currentBlue) + ")";
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

			if (message.indexOf("|time|") == -1 && message.indexOf("|pause|") == -1) {
				document.getElementById("messageBox").innerHTML = "<div id='messageContainer'><p>" + message + "</div></p>";
				document.getElementById("messageBox").className = "message visShow";
				if (settime == null) {
					timeLimit = 0;
					messageWindow();
				}
			}
						
			if (message.indexOf("|pause|") != -1) {
				pause();
			}


			if (message.indexOf("|time|") != -1) {
				console.log("MESSAGE BITCHES:"+message);
				settime = parseInt(message.substr(6,5).split(":")[0]);
				steps = settime*60;
				document.getElementById('messageBox').className = "message visHide";
				startTimer(message);
			}
			//  document.getElementById('messagebox').value = document.getElementById('messagebox').value +"\n"+hour + ":" + minute + ":" + seconds+"; "+message;
		},

		disconnect : function() {// LOST CONNECTION.
			document.getElementById("messageBox").innerHTML = "<div id='messageContainer'><p>" + "\n connection lost" + "\n will auto-connect when online" + "</div></p>";
			document.getElementById("messageBox").className = "message visShow";
			if (settime == null) {
				timeLimit = 0;
				messageWindow();
			}
		},

		reconnect : function() {// CONNECTION RESTORED.
			document.getElementById("messageBox").innerHTML = "<div id='messageContainer'><p>" + "and we're back!" + "</p></div>";
			document.getElementById("messageBox").className = "message visShow";
			if (settime == null) {
				timeLimit = 0;
				messageWindow();
			}
		},

		connect : function() {// CONNECTION ESTABLISHED.
			document.getElementById("messageBox").innerHTML = "<div id='messageContainer'><p>" + "connected to channel" + "</p></div>";
			document.getElementById("messageBox").className = "message visShow";
			if (settime == null) {
				timeLimit = 0;
				messageWindow();
			}

			//PUBNUB.publish({
			//channel: "speaker",
			//message: "Time:1"
			//})

		}
	})

})();
