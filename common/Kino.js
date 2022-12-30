
var Switches = ['sonoff.0.Kino.POWER1','sonoff.0.Kino.POWER2','sonoff.0.Kino.POWER3','sonoff.0.Kino.POWER4',
    'alias.0.Steckdosen.Kinositze','alias.0.Fenster.Kino','wled.0.8c4b14a6ded4.on'];
var Remotes = ['deconz.0.Sensors.32.buttonpressed'];
   
on({id: Switches, change: 'ne'},(obj) => {
    var value = obj.state.val;

    //wenn einer der Schalter an ist, wird der globale Schalter aktiviert
    if (value) {
        setState('0_userdata.0.Hilfsdatenpunkte.Kino_Power',true);
    } else {
        //prüfen, ob es das letzte Gerät war, dann den globalen Schalter auf deaktiviert setzen
        
        var AnzahlSwitches = Switches.length;
        var AnzahlSwitchesOff = 0;
        Switches.forEach(function(element) {
            if ((getState(element).val) == false) {
                AnzahlSwitchesOff = AnzahlSwitchesOff + 1;
            }
        })
        //log(AnzahlSwitchesOff)
        if (AnzahlSwitches == AnzahlSwitchesOff) {
            setState('0_userdata.0.Hilfsdatenpunkte.Kino_Power',false);
        }
      
    }


});


on({id: Remotes, change: 'ne'},(obj) => {
    var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    var DeviceID=objArr[1]+"."+objArr[2];
    var DeviceName=getObject(DeviceID).common.name;

    switch (value) {
        case 1002:
            log ("Fernbedienung: " + DeviceName + " - 1002");

            if ((getState('scene.0.Kinolicht_LED').val) == true) {
                //setState('scene.0.Kinolicht',false);
                setState('scene.0.Kinolicht_LED',false);
            } else {
                //setState('scene.0.Kinolicht',true);
                setState('scene.0.Kinolicht_LED',true);
            }

            break;
        case 1004:
            log ("Fernbedienung: " + DeviceName + " - 1004");
            setState('sonoff.0.Kino.POWER1',true);
            break;        

    }

});


//Wassersensoralarm
on({id: 'alias.0.Alarm.Kinowasser' , change:'ne'},function(obj) {
    if (obj.state.val) {
        //ALARM
        sendTo("telegram", "send", {text: ('ALARM: Wasser im Kino')});
    } else {
        sendTo("telegram", "send", {text: ('Kinowassersensor: alles trocken')});
    }
})


/*
on({id: '0_userdata.0.Hilfsdatenpunkte.Kino_Power' , change:'ne'},function(obj) {
    Switches.forEach(function(element) {
        setState(element,obj.state.val);
    })    
})
*/


//Beim Start prüfen, ob etwas angeschaltet ist
/*
Switches.forEach(function(element) {
    if ((getState(element).val) == true) {
        setState('0_userdata.0.Hilfsdatenpunkte.Kino_Power',true);
    }
})
*/