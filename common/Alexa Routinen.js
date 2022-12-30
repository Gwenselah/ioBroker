function SwitchOffLights() {
    //Schaltet alle Lampen und Alexas-Geräte im EG aus
    SwitchDevices.forEach(function(element) {
        if (element.Ort == "Wohnzimmer" || element.Ort == "Esszimmer") {
			if (element.Objekt.includes("alexa")) {
                //console.log ("Setze Alexa Gerät auf Pause");
                var AlexaPause = (element.Objekt).replace(".volume",".controlPause");                       
                setState(AlexaPause, true); //den Pauseknopf drücken
			} else {
				setState(element.Objekt, false);
			}
		};			
    });
};

function ShutdownJalousies() {
    var mSelector = $('[id=^shelly.0.*.Shutter.Position]');
    //log(mSelector.length);
    mSelector.each(function(id, i) {
        // Name des Gerätes abfragen
        var deviceID = id.substring(0,id.length-17); // get Device by removing last 17 chars
        var deviceName = getObject(deviceID).common.name;
    
        // Jetzt können wir alle Jalousien herunter fahren      
        //log(id);  
        setState(id, 0);
        log('Jalousie >' + deviceName + '< herunter gelassen.');
    });
    
}

on({id: 'Datenpunkte.0.ScriptTrigger.AlexaGuteNacht', val: true},(obj) => {

        log("Gute Nacht Script getriggert");
        
        //alle Geräte im Erdgeschoss ausschalten
        SwitchOffLights();

        //alle Rolläden runter fahren
        ShutdownJalousies();

        //Offene Fenster im EG ansagen
        //TODO

        
        setState('Datenpunkte.0.ScriptTrigger.AlexaGuteNacht',false);
})
