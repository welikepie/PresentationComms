var minuteThings = null;
var pause = false;
var started = false;
var minutes;
var seconds;
var intervalId = null;
var panic = false;
var channelToConnect = "speaker";
//var channelToConnect = prompt("Specify Channel to broadcast to. Case sensitive.", "");
// ^ uncomment this to define which channel to connect this to.

$('#pause').off('click').on('click',pauseMe); 
$('#start').off('click').on('click',start); 
$('#reset').off('click').on('click',reset); 
$('#leftButton').off('click').on('click',pubnubPanic); 
//document.getElementById("leftButton").addEventListener('click');
document.getElementById("rightButton").addEventListener('click',pubnubSend);

var rows = document.getElementsByClassName("rowOrder");

//array forEach
for(var i = 0; i < rows.length; i++){
	bind_event(i+1);	
}

function bind_event(t) {
    var td = rows[t-1];
    if (typeof window.addEventListener==='function'){
      $(td).off('click').on('click',function(){
      	messageParse(t);
      }); 
    }
}


function messageParse(stringy){
	console.log(stringy);
	var IDtoFetch = "message"+stringy;
			{	PUBNUB.publish({             // SEND A MESSAGE.
                channel : channelToConnect,
                message : document.getElementById(IDtoFetch).innerHTML
            	})
            }
}
function pubnubPanic(){
	console.log("dpoing something");
	panic = !panic;
	if(panic == true){
		console.log("panic");
		document.getElementById("leftButton").className = "shadow";
		PUBNUB.publish({             // SEND A MESSAGE.
                channel : channelToConnect,
                message : "|set|panic"
            	})
	}
	else{
		console.log("noPanic");
		document.getElementById("leftButton").className = "";
		PUBNUB.publish({             // SEND A MESSAGE.
                channel : channelToConnect,
                message : "|set|noPanic"
            	})
	}
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
	document.getElementsByTagName("a")[0].style.left="0%";
	document.getElementsByTagName("a")[0].title="0";
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