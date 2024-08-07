
var Switches = ['alias.0.Steckdosen.Kinotechnik','sonoff.0.Kino.POWER2','sonoff.0.Kino.POWER3','sonoff.0.Kino.POWER4',
    'alias.0.Steckdosen.Kinositze','wled.0.8c4b14a6ded4.on'];

var Entprellzeit = 1000;

on({id: Switches, change: 'ne'},(obj) => {
    var value = obj.state.val;
    //wenn einer der Schalter an ist, wird der globale Schalter aktiviert
    if (value) {
        setState('0_userdata.0.Hilfsdatenpunkte.Kino_Status','rot');
    } else {
        //prüfen, ob es das letzte Gerät war, dann den globalen Schalter auf deaktiviert setzen
        
        var AnzahlSwitches = Switches.length;
        var AnzahlSwitchesOff = 0;
        Switches.forEach(function(element) {
            if ((getState(element).val) == false) {
                AnzahlSwitchesOff = AnzahlSwitchesOff + 1;
            }
        })
        //log(AnzahlSwitches);
        log(getState('alias.0.Fenster.Kino').val);
        if (AnzahlSwitches == AnzahlSwitchesOff) {
            if (getState('alias.0.Fenster.Kino').val) {
                setState('0_userdata.0.Hilfsdatenpunkte.Kino_Status','gelb');        
                //log("gelb");                
            } else {
                setState('0_userdata.0.Hilfsdatenpunkte.Kino_Status','aus');
                //log("aus");                
            }
        }
      
    }

});

//Klick auf Shelly Blu Taster
on({id: 'shelly.0.ble.b0:c7:de:bd:45:16.button', change: 'any'},(obj) => {
    var value = obj.state.val;
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else { 
        log("Kino-Taste: " + value);
        switch (value) {
            case 1: //Singelklick
                if ((getState('scene.0.Kinolicht_LED').val) == true) {
                    setState('scene.0.Kinolicht_LED',false);
                } else {
                    setState('scene.0.Kinolicht_LED',true);
                }        
                break;
            case 2: //Doppelklick
                if ((getState('scene.0.Kinolicht').val) == true) {
                    setState('scene.0.Kinolicht',false);
                } else {
                    setState('scene.0.Kinolicht',true);
                }        
                break;
            case 3: //Dreifachklick
                if ((getState('alias.0.Steckdosen.Kinotechnik').val) == true) {
                    setState('alias.0.Steckdosen.Kinotechnik',false);
                } else {
                    setState('alias.0.Steckdosen.Kinotechnik',true);
                }            
                break;
            case 4: //Langerklick
                if ((getState('alias.0.Steckdosen.Kinotechnik').val) == true) {
                    setState('alias.0.Steckdosen.Kinotechnik',false);
                } else {
                    setState('alias.0.Steckdosen.Kinotechnik',true);
                }            
                break;            
            break;
        }
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

//Kinositze zusammen mit Kinotechnik schalten
on({id: 'alias.0.Steckdosen.Kinotechnik',change: "ne"}, function (obj) {
    setState('alias.0.Steckdosen.Kinositze',obj.state.val);
    setStateDelayed('alias.0.Steckdosen.Kinotechnik2',obj.state.val,(1000*30)); //Angabe in Millisekunden
});

