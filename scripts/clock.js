/**
 * @author AMRoche
 */

var channelToConnect = "speaker";
//var channelToConnect = prompt("Specify Channel to listen to. Case sensitive.", "");
// ^ uncomment this to define which channel to connect this to.
var remaintimemin;
var remaintimesec;
var settime = null;
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
var messageIntId;
var paused = false;
var minutes;
var seconds;
var intervalSet = false;
var displayTime = 5000;
//////console.log(currentRed);
document.getElementById("background").style.backgroundColor = "rgb(" + oldRed + "," + oldGreen + "," + oldBlue + ")";

if (window.WebSocket) {
	//webSocketsOn();
} else if (window.MozWebSocket) {
	window.WebSocket = window.MozWebSocket;
} else {
	webSocketsOff();
}

function webSocketsOff() {
	document.getElementById('messagedisplay').innerHTML = "NO WEBSOCKETS HERE!";
}

function startTimer(stringy) {
	////console.log(stringy);
	stringTime = stringy.substr(6, 5);
	settime = stringTime.split(":")[0];
	document.getElementById('alarmtext').innerHTML = stringTime;
	paused = false;
	clockCounter();
	if (intervalSet == false) {
		intervalId = setInterval('clockCounter()', 1000);
		intervalSet = true;
	}
}

function pause() {
	if (paused == false) {
		paused = true;
		if (intervalId != null) {
			intervalSet = false;
			clearInterval(intervalId);
		}
	}
}

function clockCounter() {
	paused == false;
	if (minutes == "00" && seconds == "00" || seconds <= 0 && minutes <= 0) {
		clearInterval(intervalId);
	}

	if (document.getElementById('alarmtext').innerHTML != "00:00") {
		//console.log(document.getElementById('alarmtext').innerHTML);
		var split = document.getElementById('alarmtext').innerHTML.split(":");
		//console.log(split);
		minutes = Number(split[0]);
		seconds = Number(split[1]);
		//console.log(minutes + ":" + seconds);

		if (seconds == 0) {
			minutes -= 1;
			seconds += 60;
			//console.log("seconds are zero");
		}
		if (minutes == 0 && seconds == 0) {
			minutes == 0;
			seconds == 1;
			//console.log("end of count");
		}

		if (paused == false && minutes >= 0 && seconds >= 0) {
			seconds = seconds - 1;
			//console.log("counted" + seconds);
		}
		if (minutes < 10 && minutes.length != 2) {
			minutes = "0" + minutes;
			//console.log("minutes less than ten");
		}
		if (seconds < 10 && seconds.length != 2) {
			seconds = "0" + seconds;
			console.log("seconds less than ten");
			console.log(seconds);
		}

		if (minutes == 0) {
			minutes = "00";
			//console.log("minutes be zero");
		}
		//console.log("being parsed:"+minutes+":"+seconds);
		document.getElementById('alarmtext').innerHTML = minutes + ":" + seconds;
	}
	backgroundChange();

	////console.log(minutes+":"+seconds);
}

function messageWindow() {
		document.getElementById("messageBox").style.backgroundColor = document.getElementById("background").style.backgroundColor;
	//150 fadein -> 350 fadeout
	//250 on fade in, flash on fade out
	//if (document.getElementById('messageBox').className.indexOf("visShow") != -1) {
	$("#frontBlast").clearQueue();
	$("#messageBox").clearQueue();
	
	$("#frontBlast").queue(function(next) {
		$(this).attr('class', 'blast');
		next();
	})
		.delay(150+250) //time of in animation + time you want white for
	.queue(function(next) {
		$(this).attr('class', 'dissipate');
		next();
	})
		.delay(displayTime-400)
	.queue(function(next) {
		$(this).attr('class', 'blast');
		next();
	})
		.delay(150) //delaying time of animation
	.queue(function(next) { $(this).attr('class','fastDissipate'); next();});


	$("#messageBox").delay(displayTime).queue(function(next) {
		$(this).attr('class', 'message visHide');
		next();
	});
}

function backgroundChange() {
	stepNum++;
	var constantTime = minutes + seconds / 60;
	////console.log(constantTime);
	////console.log(settime);
	var
	redStepAmount;
	var greenStepAmount;
	var blueStepAmount;
	if (constantTime == null) {
		document.getElementById("backround").style.backgroundColor = "rgb(" + Math.floor(newRed) + "," + Math.floor(newGreen) + "," + Math.floor(newBlue) + ")";
		stepNum--;
	}

	//document.getElementById("container").style.backgroundColor = "rgb(100,200,150)";
	//document.getElementById("container").style.backgroundColor = "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")";
	////////console.log(document.getElementById("container").style.backgroundColor);
	if (constantTime > settime / 2) {
		redStepAmount = (midRed - oldRed) / (steps / 2);
		greenStepAmount = (midGreen - oldGreen) / (steps / 2);
		blueStepAmount = (midBlue - oldBlue) / (steps / 2);
		currentRed += redStepAmount;
		currentGreen += greenStepAmount;
		currentBlue += blueStepAmount;
		document.getElementById("background").style.backgroundColor = "rgb(" + Math.floor(currentRed) + "," + Math.floor(currentGreen) + "," + Math.floor(currentBlue) + ")";
	}
	if (constantTime == settime / 2 && constantTime != 0) {
		////console.log("YYEAAAH");
		currentRed = midRed;
		//////console.log(currentRed);
		currentBlue = midBlue;
		currentGreen = midGreen;
		document.getElementById("background").style.backgroundColor = "rgb(" + currentRed + "," + currentGreen + "," + currentBlue + ")";
	}
	if (constantTime < settime / 2 && constantTime > 0) {
		//////console.log(steps - (steps/2));
		redStepAmount = (newRed - midRed) / (steps / 2);
		greenStepAmount = (newGreen - midGreen) / (steps / 2);
		blueStepAmount = (newBlue - midBlue) / (steps / 2);
		//////console.log(currentRed);
		//////console.log(redStepAmount);
		currentRed += redStepAmount;
		currentGreen += greenStepAmount;
		currentBlue += blueStepAmount;
		////////console.log(currentRed);
		document.getElementById("background").style.backgroundColor = "rgb(" + Math.floor(currentRed) + "," + Math.floor(currentGreen) + "," + Math.floor(currentBlue) + ")";
		//////console.log("post-change"+currentRed);
	}

}

(function() {
	// LISTEN FOR MESSAGES
	PUBNUB.subscribe({
		channel : channelToConnect, // CONNECT TO THIS CHANNEL.

		restore : false, // STAY CONNECTED, EVEN WHEN BROWSER IS CLOSED
		// OR WHEN PAGE CHANGES.

		callback : function(message) {// RECEIVED A MESSAGE.

			if (message.indexOf("|time|") == -1 && message.indexOf("|pause|") == -1) {
				document.getElementById("messageBox").innerHTML = "<div id='messageContainer'><p>" + message + "</div></p>";
				document.getElementById("messageBox").className = "message visShow";
				timeLimit = 0;
				messageWindow();
			}

			if (message.indexOf("|pause|") != -1) {
				////console.log(message);
				pause();
			}

			if (message.indexOf("|time|") != -1) {
				currentRed = oldRed;
				currentBlue = oldBlue;
				currentGreen = oldGreen;
				settime = parseInt(message.substr(6,5).split(":")[0]);
				steps = settime * 60;
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

		}
	})

})();
