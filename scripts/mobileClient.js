var minuteThings = null;
var pause = false;
var started = false;
var minutes;
var seconds;
var intervalId = null;
var channelToConnect = "speaker";

document.getElementById("pause").addEventListener('click', pauseMe);
document.getElementById("start").addEventListener('click', start);
document.getElementById("reset").addEventListener('click', reset);

function messageParse(stringy){
	var IDtoFetch = "message"+stringy;
	document.getElementById('messageBox').value = document.getElementById(IDtoFetch).innerHTML;
}
function pauseMe(){
	pause = true;
	started = false;
	if(intervalId!=null){
		clearInterval(intervalId);
		PUBNUB.publish({             // SEND A MESSAGE.
                channel : channelToConnect,
                message : "|pause|"
            	})
	}
		
}

function pauseMeSneakily(){
	pause = true;
	started = false;
	if(intervalId!=null){
		clearInterval(intervalId);
	}
		
}

function reset(){
	pauseMeSneakily();
	document.getElementById('timeywimey').innerHTML = "<span>00:00</span>";
}

function start(){
	pause = false;
	if(started == false){
		started = true;
		PUBNUB.publish({             // SEND A MESSAGE.
                channel : channelToConnect,
                message : "|time|"+document.getElementById('timeywimey').innerHTML.substr(6,5)
            	})
		countDown();
		intervalId = setInterval('countDown()',1000);
	}
}

function countDown(){

	if(minuteThings != null && document.getElementById('timeywimey').innerHTML.substr(6,5) != "00:00"){
		var split = document.getElementById('timeywimey').innerHTML.substr(6,5).split(":");
		minutes = split[0];
		seconds = split[1];

		if(seconds == 0){
			minutes -= 1;
			seconds += 60;
		}
		if(minutes == 0 && seconds == 0){
			minutes == 0;
			seconds == 1;
		}

		if(pause == false){
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
		document.getElementById('timeywimey').innerHTML = "<span>"+minutes+":"+seconds+"</span>";
	}
//console.log(minutes+":"+seconds);
	
}

function pubnubSend(){
	if (document.getElementById('messageBox').value != "" || document.getElementById('messageBox').value != null)
		{	PUBNUB.publish({             // SEND A MESSAGE.
                channel : channelToConnect,
                message : document.getElementById('messageBox').value
            	})
            }
	document.getElementById('messageBox').value = "";
}
//------done functions under here.
function updateStuff(){
	pauseMeSneakily();
	minuteThings = document.getElementById('timeSetting').value;
	if(minuteThings < 10){
		minuteThings = "0"+minuteThings;
	}
	document.getElementById('timeywimey').innerHTML = 	"<span>"+minuteThings+":00</span>"
}
//document.getElementById('timeSetting').addEventListener('change', console.log(document.getElementById('timeSetting').value), false);
//document.getElementById('timeSetting').attachEvent('onchange', console.log(document.getElementById('timeSetting').value));
(function(){
 
    // LISTEN FOR MESSAGES
    PUBNUB.subscribe({
        channel    : channelToConnect,      // CONNECT TO THIS CHANNEL.
 
        restore    : false,              // STAY CONNECTED, EVEN WHEN BROWSER IS CLOSED
                                         // OR WHEN PAGE CHANGES.
 
        callback   : function(message) { // RECEIVED A MESSAGE.
        },
 
        disconnect : function() {        // LOST CONNECTION.
         console.log("You have been disconnected. Reconnecting ASAP.");
        },
 
        reconnect  : function() {        // CONNECTION RESTORED.
   			 console.log("You have been Reconnected.");
        },
 
        connect    : function() {        // CONNECTION ESTABLISHED.
 
          /*  PUBNUB.publish({             // SEND A MESSAGE.
                channel : currentMode,
                message : "0 : 0 : 0"
            })*/
 
        }
    })
 
})();