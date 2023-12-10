// Lichtfarbendefinition
//Originale Farbwerte: 
//var ColorOK = "10FF00"; //Grün
//var ColorWarning = "ffcb05"; //Orange bis Gelb
//var ColorError = "ff0000";  //Rot
//diese waren zu hell, durch Konvertierung auf HSL, dimmen auf ide Hälfte (L = 25%) und zurück nach RGB, ergibt:
var ColorOK = "043800"; //Grün
var ColorWarning = "806600"; //Orange bis Gelb
var ColorError = "800000";  //Rot

//Gerätedefinition
var DisplayIP = "10.1.24.132";

/*
BEI TASMOTA BEGINNT DIE ZÄHLUNG BEI 1 !!!

LED 30: Wohnzimmer linke Tür	LED 19:	Lea Türe				LED 18: Schlafzimmer Fenster 	LED 7: Altpapaier 	    LED 6: linke Waschmaschine 
LED 29: Wohnzimmer rechte Tür   LED 20: Lea Fenster     		LED 17: Schlafzimmer Dachf.     LED 8: Biomüll    	    LED 5: rechte Waschmaschine
LED 28: Küche Fenster           LED 21: Lea Mond Office         LED 16: Büro klein Fenster		LED 9: Restmüll      	LED 4: Trockner   
LED 27: WC Fenster    			LED 22: Bad Fenster     		LED 15: Büro groß Türe          LED 10: Wertstoffe 	    LED 3: Geschirrspüler 
LED 26: Waschküche Fenster      LED 23: Kai Fenster	            LED 14: Arbeitstisch 			LED 11:	Klimagerät		LED 2: 3D Drucker
LED 25: Kino Fenster und Status LED 24: Garage           		LED 13: Tina PC 		    	LED 12:	Entertainment	LED 1: nicht erreichbare Geräte
*/
var ObjektLEDs = [
    //BEI TASMOTA BEGINNT DIE ZÄHLUNG BEI 1 !!!
    { Objekt: 'radar2.0._notHere', LED: '01' },
    { Objekt: 'device-reminder.0.3D Drucker.Status', LED: '02' },    
    { Objekt: 'device-reminder.0.Spülmaschine.Status', LED: '03' },
    { Objekt: 'device-reminder.0.Trockner.Status', LED: '04' },
    { Objekt: 'device-reminder.0.Waschmaschine Rechts.Status', LED: '05' },
    { Objekt: 'device-reminder.0.Waschmaschine Links.Status', LED: '06' },   
    { Objekt: 'Altpapier', LED: '07' },   //Altpapier 
    { Objekt: 'BioMuell', LED: '08' },    //Biomüll
    { Objekt: 'RestMuell', LED: '09' },   //Restmüll
    { Objekt: 'Wertstoffe', LED: '10' },  //Wertstoffe
    { Objekt: 'alias.0.Steckdosen.Klimagerät', LED: '11' },    
    { Objekt: 'alias.0.Steckdosen.Wohnzimmer_Entertainment', LED: '12' },    
//    { Objekt: 'alias.0.Steckdosen.XBOX', LED: '13' },    
//    { Objekt: 'alias.0.Steckdosen.Arbeit', LED: '14' },
    { Objekt: 'device-reminder.0.PC Tina.Status', LED: '13' },    
    { Objekt: 'device-reminder.0.Arbeitstisch.Status', LED: '14' },
    { Objekt: 'alias.0.Tueren.Büro_groß', LED: '15' },  
    { Objekt: 'alias.0.Fenster.Büro_klein', LED: '16' },  
    { Objekt: 'alias.0.Fenster.Schlafzimmer_Dachfenster', LED: '17' },   
    { Objekt: '0_userdata.0.Geräte.IsSchlafzimmerWindowOpen', LED: '18' },    
    { Objekt: 'alias.0.Tueren.Lea', LED: '19' },    
    { Objekt: 'alias.0.Fenster.Lea', LED: '20' },    
    { Objekt: 'alias.0.Licht.Lea_Mond', LED: '21' },    
    { Objekt: 'alias.0.Fenster.Bad', LED: '22' },    
    { Objekt: '0_userdata.0.Geräte.IsKaiWindowOpen', LED: '23' },    
    { Objekt: '0_userdata.0.Hilfsdatenpunkte.Garage_Status', LED: '24' },    
    { Objekt: '0_userdata.0.Hilfsdatenpunkte.Kino_Status', LED: '25' },    
    { Objekt: 'alias.0.Fenster.Waschküche', LED: '26' },
    { Objekt: 'alias.0.Fenster.WC', LED: '27' },
    { Objekt: 'alias.0.Fenster.Küche', LED: '28' },
    { Objekt: 'alias.0.Tueren.Wohnzimmer_Rechts', LED: '29' },
    { Objekt: 'alias.0.Tueren.Wohnzimmer_Links', LED: '30' }
];  

//Türen und Fenster
var Doors = ['alias.0.Tueren.Wohnzimmer_Rechts','alias.0.Tueren.Wohnzimmer_Links','alias.0.Fenster.Bad',
    'alias.0.Fenster.Küche','alias.0.Tueren.Lea','alias.0.Fenster.Lea','alias.0.Tueren.Büro_groß','0_userdata.0.Hilfsdatenpunkte.Kino_Status',
	'alias.0.Fenster.Waschküche','alias.0.Fenster.WC','0_userdata.0.Geräte.IsSchlafzimmerWindowOpen',
    'alias.0.Fenster.Schlafzimmer_Dachfenster','alias.0.Fenster.Büro_klein','0_userdata.0.Geräte.IsKaiWindowOpen'];

//DoorsNew unterstützt Dreh Kipp Auswertung
var DoorsNew = ['']; 
//on Trigger muss unten aktiviert werden

var BoolDevicesTrueRED = ['alias.0.Steckdosen.Klimagerät','alias.0.Steckdosen.Wohnzimmer_Entertainment']; //LED ist rot, wenn der Status dieses Gerätes TRUE ist

var BoolDevicesTrueGreen = ['']; //LED ist grün, wenn der Status dieses Gerätes TRUE ist
//on Trigger muss unten aktiviert werden

var MultiStateDevices = ['0_userdata.0.Hilfsdatenpunkte.Garage_Status']; //LED ist rot, gelb, grün oder aus

var Lights = ['alias.0.Licht.Lea_Mond']; //LED ist gelb, wenn die Lampe an ist, ansonsten aus

var RunningDevices = ['device-reminder.0.Spülmaschine.Status','device-reminder.0.Trockner.Status','device-reminder.0.3D Drucker.Status',
    'device-reminder.0.Waschmaschine Links.Status','device-reminder.0.Waschmaschine Rechts.Status','device-reminder.0.PC Tina.Status','device-reminder.0.Arbeitstisch.Status'];

var MissingDevices = ['radar2.0._notHere'];

// -----------------------------------------
function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}

function RunRequest(URL){
    try {
        require("request")(URL).on("error", function (e) {console.error(e);});
    } catch (e) { console.error(e); }

    console.log("Statusdisplay Request: " + URL);

}
// --- Funktion für Einzelledsteuerung ----------------------------------------------------------
function SwitchLED (LEDNo, ColorCode) {
	if (getState('sonoff.0.Statusdisplay.POWER').val) {
		RunRequest("http://"+DisplayIP+"/cm?cmnd=Led"+LEDNo+"%20"+ColorCode);
	}
}

function GetLedNo (DeviceTriggerName){
    //log ("Dev: " + DeviceTriggerName);
    for (var ObjektLED in ObjektLEDs) { //ObjektLED enthält nur eine Nummer und nicht das Element        
        //log ("Name: " + ObjektLEDs[ObjektLED].Objekt);
        if (ObjektLEDs[ObjektLED].Objekt == DeviceTriggerName) {
            return (ObjektLEDs[ObjektLED].LED);             
        }
    }    
}

function SetBoolDevicesTrueRED (DeviceTriggerName, DeviceTriggerValue) {
    if (DeviceTriggerValue == "true" || DeviceTriggerValue == "1" || DeviceTriggerValue == "läuft" ) {
        SwitchLED (GetLedNo(DeviceTriggerName),ColorError);
    } else {
        //SwitchLED (GetLedNo(DeviceTriggerName),ColorOK);
        SwitchLED (GetLedNo(DeviceTriggerName),"000000");        
    }
}

function SetBoolDevicesTrueGreen (DeviceTriggerName, DeviceTriggerValue) {
    if (DeviceTriggerValue == "true" || DeviceTriggerValue == "1") {
        //SwitchLED (GetLedNo(DeviceTriggerName),ColorOK);
        SwitchLED (GetLedNo(DeviceTriggerName),"000000");
    } else {
        SwitchLED (GetLedNo(DeviceTriggerName),ColorError);
    }
}

function SetDoorsLED (DeviceTriggerName, DeviceTriggerValue) {
    if (DeviceTriggerValue) {
        SwitchLED (GetLedNo(DeviceTriggerName),ColorError);
    } else {
        //SwitchLED (GetLedNo(DeviceTriggerName),ColorOK);
        SwitchLED (GetLedNo(DeviceTriggerName),"000000");
    }
}

function SetDoorsNewLED (DeviceTriggerName, DeviceTriggerValue) {
    if (DeviceTriggerValue == "geschlossen") {
        SwitchLED (GetLedNo(DeviceTriggerName),"000000");
    } else if (DeviceTriggerValue == "gekippt") {
        SwitchLED (GetLedNo(DeviceTriggerName),ColorWarning);
    } else {
        SwitchLED (GetLedNo(DeviceTriggerName),ColorError);    
    }
}

function SetLightsLED (DeviceTriggerName, DeviceTriggerValue) {
    if (DeviceTriggerValue) {
        SwitchLED (GetLedNo(DeviceTriggerName),ColorWarning);
    } else {
        SwitchLED (GetLedNo(DeviceTriggerName),"000000");
    }
}

function SetMultiStateLED(DeviceTriggerName,DeviceTriggerValue){
    if (DeviceTriggerValue == "rot") {
        SwitchLED (GetLedNo(DeviceTriggerName),ColorError);
    } else if (DeviceTriggerValue == "gelb") {
        SwitchLED (GetLedNo(DeviceTriggerName),ColorWarning);
    } else if (DeviceTriggerValue == "grün") {
        SwitchLED (GetLedNo(DeviceTriggerName),ColorOK);
    } else {
        SwitchLED (GetLedNo(DeviceTriggerName),"000000");
    }
}

function SetMuelltonnenLights(){
	function SwitchGarbageLEDs(GarbageName,Days){
		if (Days == 0) {
			SwitchLED (GetLedNo(GarbageName),ColorError);
		} else if (Days == 1) {
			SwitchLED (GetLedNo(GarbageName),ColorWarning);
		} else {
			//SwitchLED (GetLedNo(GarbageName),ColorOK);
            SwitchLED (GetLedNo(GarbageName),"000000");
		}
	}
	
	var RestMuellResttage = getState('Datenpunkte.0.Wertstoffe.Restmüll_Resttage').val;
	var BioMuellResttage = getState('Datenpunkte.0.Wertstoffe.Bio_Resttage').val;
	var AltpapierResttage = getState('Datenpunkte.0.Wertstoffe.Papier_Resttage').val;
	var WertstoffeResttage = getState('Datenpunkte.0.Wertstoffe.Wertstoffe_Resttage').val;
	
	SwitchGarbageLEDs("BioMuell",BioMuellResttage);
	SwitchGarbageLEDs("RestMuell",RestMuellResttage);
	SwitchGarbageLEDs("Altpapier",AltpapierResttage);
    SwitchGarbageLEDs("Wertstoffe",WertstoffeResttage);

}

function SetRunningDevices(DeviceTriggerName, DeviceTriggerValue) {
    switch (DeviceTriggerValue) {
        case "ausgeschaltet":
            SwitchLED (GetLedNo(DeviceTriggerName),"000000");            
            break;
        case "im StandBy":
            SwitchLED (GetLedNo(DeviceTriggerName),ColorOK);
            break;
        case "in Aktion":
            SwitchLED (GetLedNo(DeviceTriggerName),ColorError);
            break;
        case "initialize": //"an" bedeutet Sonoff an, aber es wird kein Strom verbraucht
            SwitchLED (GetLedNo(DeviceTriggerName),"FFFFFF");
            break;            
    }

}

function SetMissingDevices(DeviceTriggerName, DeviceTriggerValue) {
    //log(DeviceTriggerName + ": " + DeviceTriggerValue);
    if (DeviceTriggerValue!= "") {
        SwitchLED (GetLedNo(DeviceTriggerName),ColorError);
    } else {
        //SwitchLED (GetLedNo(DeviceTriggerName),ColorOK);
        SwitchLED (GetLedNo(DeviceTriggerName),"000000");
    }

}

// --- globale Displayfunktionen ----------------------------------------------------------------

function ResetDisplay(){
    setState('sonoff.0.StatusDisplay.Color','000000');
    //setState('sonoff.0.StatusDisplay.POWER',false); //Power wird bei MQTT automatisch auf false gesetzt
}

function SwitchOffDisplayDelayed(){
    //setStateDelayed('sonoff.0.Statusdisplay.POWER',false,(1000 * 60)); //Angabe in Millisekunden
}


function SwitchOnOffDisplay(PowerOn){
    if (PowerOn) {
       RunRequest("http://"+DisplayIP+"/cm?cmnd=Power%20on");
       log ("Status Display: Power On");
    } else {
       RunRequest("http://"+DisplayIP+"/cm?cmnd=Power%20off");
       log ("Status Display: Power Off");
    }
}

function InitDisplay(){    
    log ("+++ Statusdisplay Init");
//    setState('Datenpunkte.0.ScriptTrigger.Feuerwerk',false);
    //Option20 setzen: LED: ermöglicht den Dimmwert zu verändern, ohne die Versorgung einzuschalten (default = 0 / off)
    RunRequest("http://"+DisplayIP+"/cm?cmnd=SetOption20%201");

    //setState('sonoff.0.Statusdisplay.Dimmer',10); //Dimmer setzt Power TRUE    
    RunRequest("http://"+DisplayIP+"/cm?cmnd=fade%200");
    RunRequest("http://"+DisplayIP+"/cm?cmnd=scheme%200");
    wait (1000); //Milliseconds
    //alle undefinierten LEDs löschen
    for (i = 0; i < 30; i++) {   
        //console.log ("------------------------------------------------------------");
        //console.log(ObjektLEDs[i].Objekt + ": " + ObjektLEDs[i].Objekt.length);
        if (ObjektLEDs[i].Objekt == '') {                        
            SwitchLED ((i+1),"000000");   
            wait (500); //Milliseconds          
        }    
    }

    if (Doors.length > 0) {
        Doors.forEach(function(element) {
            SetDoorsLED(element,getState(element).val);
        });
    }

    if (DoorsNew.length > 0) {
        DoorsNew.forEach(function(element) {
            SetDoorsNewLED(element,getState(element).val);
        });
    }

    if (BoolDevicesTrueRED.length > 0) {
        BoolDevicesTrueRED.forEach(function(element) {
            //var value = getState(element).val;
            //SetBoolDevicesTrueRED(element,value);
            SetBoolDevicesTrueRED(element,getState(element).val);
        });
    }
    if (BoolDevicesTrueGreen.length > 0) {
        BoolDevicesTrueGreen.forEach(function(element) {
            SetBoolDevicesTrueGreen(element,getState(element).val);
        }); 
    }   
    if (Lights.length > 0) {
        Lights.forEach(function(element) {
            SetLightsLED(element,getState(element).val);
        }); 
    }

    if (RunningDevices.length > 0) {
        RunningDevices.forEach(function(element) {
            SetRunningDevices(element,getState(element).val);
        }); 
    }

    if (MultiStateDevices.length > 0) {
        MultiStateDevices.forEach(function(element) {
            SetMultiStateLED(element,getState(element).val);
        }); 
    }

    if (MissingDevices.length > 0) {
        MissingDevices.forEach(function(element) {
            SetMissingDevices(element,getState(element).val);
        }); 
    }

    SetMuelltonnenLights();
	//setStateDelayed('sonoff.0.StatusDisplay.POWER',false,(1000 * 30)); //Angabe in Millisekunden
}

// --- MAIN ---------------------------------------------------------------------------
on({id:'sonoff.0.Statusdisplay.POWER', change: 'ne'},(obj) => {
    var value = obj.state.val;
    log ("Statusdisplay - Power: " + value);
    if (value) {
        InitDisplay();    
    }
});

on({id: Doors, change: 'ne'},(obj) => {
	//setState('sonoff.0.StatusDisplay.POWER',true)
    var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    //var DeviceID=objArr[1]+"."+objArr[2];
    //var DeviceName=objArr[2];
    /*console.log("Trigger: " + objArr[0]);
    console.log("Pfad: " + objArr[1]);
    console.log("Devic);name: " + objArr[2]);
    console.log("localDeviceID:"+DeviceID);*/
    SetDoorsLED(objArr[0],value);
	SwitchOffDisplayDelayed();
});
/*
on({id: DoorsNew, change: 'ne'},(obj) => {
	//setState('sonoff.0.StatusDisplay.POWER',true)
    var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    //var DeviceID=objArr[1]+"."+objArr[2];
    //var DeviceName=objArr[2];
    //console.log("Trigger: " + objArr[0]);
    //console.log("Pfad: " + objArr[1]);
    //console.log("Devic);name: " + objArr[2]);
    //console.log("localDeviceID:"+DeviceID);
    SetDoorsNewLED(objArr[0],value);
	SwitchOffDisplayDelayed();
});
*/
on({id: BoolDevicesTrueRED, change: 'ne'},(obj) => {
	//setState('sonoff.0.StatusDisplay.POWER'/*Turn On/Off*/,true)
    var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    SetBoolDevicesTrueRED(objArr[0],value);
	SwitchOffDisplayDelayed();
    
});
/*
on({id: BoolDevicesTrueGreen, change: 'ne'},(obj) => {
	//setState('sonoff.0.StatusDisplay.POWER',true)
    var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    SetBoolDevicesTrueGreen(objArr[0],value);
	SwitchOffDisplayDelayed();
    
});*/
on({id: Lights, change: 'ne'},(obj) => {
	//setState('sonoff.0.StatusDisplay.POWER'/*Turn On/Off*/,true)
    //InitDisplay();
    var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    SetLightsLED(objArr[0],value);
	SwitchOffDisplayDelayed();
    
});

on({id: RunningDevices, change: 'ne'},(obj) => {
	//setState('sonoff.0.StatusDisplay.POWER'/*Turn On/Off*/,true)
    //InitDisplay();
    var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    SetRunningDevices(objArr[0],value);
	SwitchOffDisplayDelayed();
    
});

on({id: MultiStateDevices, change: 'ne'},(obj) => {
    var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    SetMultiStateLED(objArr[0],value);
	SwitchOffDisplayDelayed();
    
});


on({id: MissingDevices, change: 'ne'},(obj) => {
	//setState('sonoff.0.StatusDisplay.POWER'/*Turn On/Off*/,true)
    //InitDisplay();
    var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    SetMissingDevices(objArr[0],value);
	SwitchOffDisplayDelayed();
    
});


//-- Inits --
if (getState('alias.0.Steckdosen.Statusdisplay').val == false) {
    //setState('linkeddevices.0.Diningroom.StatusdisplayPOWER',true); //Power True triggert "InitDisplay()"
    SwitchOnOffDisplay(true);
} else {
    InitDisplay();
}

//Display AN/AUS Steuerung

on({id: 'javascript.0.Astro.Astrotag',val: true}, function(){
	//Wenn es Tag wird Display anschalten
	if (getState('alias.0.Steckdosen.Statusdisplay').val == false) {
		SwitchOnOffDisplay(true);
	}
})

on({id: 'alias.0.Licht.Esszimmer', change: 'ne'}, function() {
	//Wenn es Nacht ist, wird das Display mit der Deckenlampe geschaltet
	if (getState('javascript.0.Astro.Astrotag').val == false) {
		SwitchOnOffDisplay(getState('alias.0.Licht.Esszimmer').val);
	}
})

//schedule('0 6 * * *', function(){SwitchOnOffDisplay(true)});
schedule('55 22 * * *',  function(){SwitchOnOffDisplay(false)}); //zur Sicherheit trotzdem um 23 Uhr ausschalten
schedule('1 6 * * *', SetMuelltonnenLights);
