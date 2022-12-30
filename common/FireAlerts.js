//Bei Feueralarm Aktionen ausführen

function AlertReaction(TriggerName){
    var TriggerThings=true;
    if (TriggerName='Fault'){TriggerThings=false}; //Bei Störungen auf jeden Fall keine Aktionen auslösen

    sendTo('telegram', {
        text: TriggerName +  " hat einen Alarm ausgelöst"
    });     

    if (TriggerThings){
        for (var i=0; i<Rollladen.length;i++) {
            log(Rollladen[i][0].Objekt);
            setState(Rollladen[i][0].Objekt,100);
        }
        for (var i=0; i<SwitchDevices.length;i++) {
            setState(SwitchDevices[i].Objekt,false); //CaseSENSITIV!!!!!
        }
    } else {
        sendTo('telegram', {
            text: "Die Aktionen sind deaktiviert. Es werden keine Rollläden geöffnet"
        });         
    }
};


on({id:"mqtt.0.SmokeDetectorConnector.Fire", change: "ne", val: 1 },AlertReaction("Fire"));

on({id:'mqtt.0.SmokeDetectorConnector.Fault', change: 'ne', val: 1},AlertReaction("Fault"));

on({id:'mqtt.0.SmokeDetectorConnector.CO', change: 'ne', val: 1},AlertReaction("CO"));

/*
on({id: 'mqtt.0.SmokeDetectorConnector.LWT', change: 'ne'}, function (obj) {
    var value = obj.state.val;
    if (value = 'Connected') {
        sendTo("telegram", "send", {
            text: ('Der Rauchmelderkonnektor ist wieder verbunden')
        });
    } else {
        sendTo("telegram", "send", {
            text: ('Der Rauchmelderkonnektor ist nicht mehr verbunden!')
        });
    }

});*/

