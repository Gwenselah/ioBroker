//Bei Feueralarm Aktionen ausführen

function AlertReaction(TriggerName){
    var TriggerThings=true;
    log ("SmokeDetectorConnector: - " + TriggerName);
    if (TriggerName=='Fault'){TriggerThings=false}; //Bei Störungen auf jeden Fall keine Aktionen auslösen

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


on({id:"shelly.0.shellyplusi4#80646fe19d20#1.Input1.Status", change: "ne", val: true },function (obj) {
    if (obj.state.val) {
        AlertReaction("Fire")
    }
});

on({id:'shelly.0.shellyplusi4#80646fe19d20#1.Input2.Status', change: 'ne', val: true},function (obj) {
    if (obj.state.val) {
        AlertReaction("Fault")
    }
});

on({id:'shelly.0.shellyplusi4#80646fe19d20#1.Input0.Status', change: 'ne'},function (obj) {
    if (obj.state.val) {
        AlertReaction("CO")
    }
});

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

