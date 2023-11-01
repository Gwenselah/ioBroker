//Die Rooms Enumeration funktioniert nicht mit LinkedDevices
var DoorsandWindows = ['deconz.0.Sensors.24.open',
	//'deconz.0.Sensors.6.open', //Garage
	'deconz.0.Sensors.23.open',
	'deconz.0.Sensors.20.open',
	'deconz.0.Sensors.21.open',
	'deconz.0.Sensors.25.open',//Kino
	'deconz.0.Sensors.7.open',
	'deconz.0.Sensors.22.open',
	'deconz.0.Sensors.8.open', //Windfang, ehemals Kai
	//'deconz.0.Sensors.27.open', //Waschküche
	'deconz.0.Sensors.26.open',
	'deconz.0.Sensors.5.open',
	'deconz.0.Sensors.4.open',
	'deconz.0.Sensors.18.open',
	'deconz.0.Sensors.19.open',
	'deconz.0.Sensors.40.open',
	'deconz.0.Sensors.41.open',
	'deconz.0.Sensors.42.open'
];

var params = {
    user: 'heizung@badur.name',
	offset: '-3',
	password: '6@3IPI0KtS0kNCQNWy',
	offset_name:'ioBroker'
}

var myPowerInterval = [null];
const { get } = require('request');
var request = require('request');

function SendRequestToControme(ContromeRaumID){
	var URL='http://10.1.24.200/set/json/v1/1/roomoffset/'+ContromeRaumID+'/';
	console.log('Controme Offset/Function Trigger: ' + URL);
	request.post({url:URL, formData: params}, function optionalCallback(err, httpResponse, body) {
	  if (err) {
		return console.error('Controme Offset/upload failed:', err);
	  }
	  console.log('Controme Offset/Upload successful!  Server responded with:', body);
	});		
}

function CorrectTempValues (Temperature) {
    //Korrektur von negativen Werten, die Controme falsch setzt
    if (Temperature >= 0) {
        return Temperature
    } else {
        var pre = Math.floor(Temperature);
        var post = Temperature-pre;
        pre=pre-1;
        //post=(1-post);
        log ("Temperatur korrigiert: " + Temperature + " -> " + (pre-post));
        return (pre-post);
    }

}

function round(value, step) {
    step || (step = 1.0);
    var inv = 1.0 / step;
    return Math.round(value * inv) / inv;
}


function round2(value) {
    var pre = Math.floor(value);
    var post =((value*10)-(pre*10))/10;   //Wegen Floating Point Ungenauigkeiten
    post=post*100;
   // .00, .06, .12, .19, .25, .31, .38, .44, .50, .56, .62, .69, .75, .81, .88, .94
    if (post>=0) {var postnew=0;}
    if (post>=6) {var postnew=0.06;} 
    if (post>=12) {var postnew=0.12;} 
    if (post>=19) {var postnew=0.19;} 
    if (post>=25) {var postnew=0.25;} 
    if (post>=31) {var postnew=0.31;} 
    if (post>=38) {var postnew=0.38;} 
    if (post>=44) {var postnew=0.44;} 
    if (post>=50) {var postnew=0.50;} 
    if (post>=56) {var postnew=0.56;} 
    if (post>=62) {var postnew=0.63;} 
    if (post>=69) {var postnew=0.69;} 
    if (post>=75) {var postnew=0.75;} 
    if (post>=81) {var postnew=0.81;} 
    if (post>=88) {var postnew=0.88;} 
    if (post>=94) {var postnew=0.94;} 
    var sum=pre+postnew;
//    log(sum.toString());
    return sum; 
}

function SendTemperatureToControme(SensorID,Temperature){
	//bspw: http://contromeminiserver.fritz.box/set/28_62_f4_8f_09_00_11_c4/7.12

    Temperature=CorrectTempValues(Temperature);
//    log(Temperature);
    Temperature=round2(Temperature);
//    log("Temperatur nach dem Runden: " + Temperature);
  //    Temperature=Math.floor(Temperature * 100) / 100; //Nur zwei Digits übergeben
//    Temperature=round(Temperature * 100) / 100; //Nur zwei Digits übergeben
    var URL='http://10.1.24.200/set/'+SensorID+'/'+Temperature.toFixed(2);
    var options = {url: URL, method: 'GET', headers: { 'User-Agent': 'request' }};
    console.log('Controme Set Temperature: ' + URL);
    request(URL, function(error, response, body) {
        if(error) log('Fehler Request Steckdose', 'error');
    });
}

on({id: DoorsandWindows, change: 'ne'},(obj) => {
    var value = obj.state.val;
    //console.log ("Controme Offset/Sensor - ID:" + obj.id);
    var roomname = getObject(obj.id, 'rooms').enumNames[0];
	console.log("Controme Offset/Raum: " + roomname);
    //console.log("Controme Offset/Wert: " + value);
    
    //ContromeRaumID ermitteln
    //..kranker Scheiß, aber funktioniert
    var roomID = (ContromeRoomIDs.find(ContromeRoomIDs => ContromeRoomIDs.Name === roomname)).RoomID;
    console.log("Controme Offset/Controme Room ID: " + roomID);

	if (value) {
		//Aufruf
        console.log("Controme Offset/Offset senden");
		if (myPowerInterval[roomID]) clearInterval(myPowerInterval[roomID]);
		SendRequestToControme(roomID);
		myPowerInterval[roomID] = setInterval(function(){  	
			SendRequestToControme(roomID);
 		},540000); //Ausführungsfrequenz in ms. 540000 = 9 Minuten		
	} else {
		if (myPowerInterval[roomID]) clearInterval(myPowerInterval[roomID]);
        console.log("Controme Offset/Timer gelöscht");
	}
});

function CheckForgottenOpenWindow() {
	var tempDraussen = getState('alias.0.Temperaturen.Temperatur_Aussen').val;
	//log("Draußen:" + tempDraussen);

	if (((tempDraussen >24) && (getState('javascript.0.Astro.Astrotag').val)) || (tempDraussen < 5)) {
		//Hitzelogik 
		var tmpTXT = "";
		 
		//Hole alle Temperatursensoren
		var temperatures = getObject("enum.functions.temperaturen_alias").common.members;
		for(let i = 0; i < temperatures.length; i++) {
			
			//ermittle die Temperatur und den Raum (genauer: die Aufzählungsid des Raumes)	
			var temperature = getState(temperatures[i]).val;
			var roomenumId = getObject(temperatures[i],"rooms").enumIds;
			//log("Aufzählungsid des Raumes: " + roomenumId[0]);  //'enum.rooms.windfang'
			
			//hole alle Geräte des Raumes
			var DaW = getObject(roomenumId[0]).common.members;
			for(let i2=0; i2 < DaW.length; i2++) {
				//Hole den Stamm des Gerätes
				var tmpStr = DaW[i2].substring(0,15);  //alias.0.Tueren.  alias.0.Fenster
				if (tmpStr == "alias.0.Tueren." || tmpStr == "alias.0.Fenster") {
					//log ("Tür/Fenster im Raum: " + DaW[i2]);
					if (getState(DaW[i2]).val) {
						tmpTXT = tmpTXT + getObject(DaW[i2]).common.name + "\n";
					}
				}
			}	  
		}	
	
		if (tmpTXT.length > 0) {
			tmpTXT = "Es ist heiß und folgende Fenster und Türen sind offen: \n" + tmpTXT;
			if (tempDraussen <5) {
				tmpTXT = tmpTXT.replace("heiß","kalt");
			}

			sendTo('telegram', {
				text: tmpTXT,
				parse_mode: "HTML"
			});   			
		}
	}

}

//CheckForgottenOpenWindow();
SendTemperatureToControme("28_62_f4_8f_09_00_11_c4",getState('alias.0.Temperaturen.Temperatur_Aussen').val);
//SendTemperatureToControme("28_62_f4_8f_09_00_11_c4",-5.4);
SendTemperatureToControme("28_24_3d_79_a2_00_03_7c",getState('alias.0.Temperaturen.Temperatur_Kachelofen').val);

//Alle 4 Minuten Temperaturen setzen
schedule ('*/4 * * * *', function(){
    //Außentemperatur
    SendTemperatureToControme("28_62_f4_8f_09_00_11_c4",getState('alias.0.Temperaturen.Temperatur_Aussen').val);
    SendTemperatureToControme("28_24_3d_79_a2_00_03_7c",getState('alias.0.Temperaturen.Temperatur_Kachelofen').val);    
})


// ----- Funktion alle 28 Minuten aufrufen
schedule("*/50 * * * *", function(){
//	CheckForgottenOpenWindow();
});