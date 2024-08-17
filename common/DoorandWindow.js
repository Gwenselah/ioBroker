
on({id: ['0_userdata.0.StateDoorsWindows.Fenster.Kai_links','0_userdata.0.StateDoorsWindows.Fenster.Kai_rechts'], change: "ne"}, function (obj) {
    setState('0_userdata.0.Geräte.IsKaiWindowOpen',
        ((getState('0_userdata.0.StateDoorsWindows.Fenster.Kai_links').val >0) || 
            (getState('0_userdata.0.StateDoorsWindows.Fenster.Kai_rechts').val >0)));
})

on({id: ['0_userdata.0.StateDoorsWindows.Fenster.Schlafzimmer_Dachfenster','0_userdata.0.StateDoorsWindows.Fenster.Schlafzimmer_links',
        '0_userdata.0.StateDoorsWindows.Fenster.Schlafzimmer_rechts'], change: "ne"}, function (obj) {            
    setState('0_userdata.0.Geräte.IsSchlafzimmerWindowOpen',
        ((getState('0_userdata.0.StateDoorsWindows.Fenster.Schlafzimmer_Dachfenster').val >0)  || 
            (getState('0_userdata.0.StateDoorsWindows.Fenster.Schlafzimmer_links').val>0)) || 
            (getState('0_userdata.0.StateDoorsWindows.Fenster.Schlafzimmer_rechts').val>0)
    );
})

on({id: ['0_userdata.0.StateDoorsWindows.Fenster.Lea_Fenster','0_userdata.0.StateDoorsWindows.Tueren.Lea_Tür'], change: "ne"}, function (obj) {
    setState('0_userdata.0.Geräte.IsLeaWindowOpen',
        ((getState('0_userdata.0.StateDoorsWindows.Fenster.Lea_Fenster').val >0) || 
            (getState('0_userdata.0.StateDoorsWindows.Tueren.Lea_Tür').val >0)));
})

//============================================================================================
//=== Steuerung für gekippt
//============================================================================================

/*
"0": "geschlossen",
"1": "gekippt",
"2": "offen"
*/

//reagiert auf alles Änderungen in der Fenster_Alias Aufzählung
$('state(functions=fenster_alias)').on(function(obj) {
    var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    var DeviceID=objArr[1]+"."+objArr[2];
    var DeviceName=objArr[3];
    //console.log("Trigger: " + objArr[0]);
    //console.log("Pfad: " + objArr[1]);
    //console.log("Devicename: " + objArr[3]);
    //console.log("localDeviceID:"+DeviceID);   
    /*
    Trigger: alias.0.Fenster.Bad
    Pfad: alias.0
    Devicename: Bad
    localDeviceID:alias.0.Fenster
    */
    var DPRotation = objArr[0] + "_Rotation" //Trigger+Zusatz "_Rotation"
    var DPDestination = "0_userdata.0.StateDoorsWindows." + objArr[2] + "." + DeviceName

    //log ("DPRotation: " + DPRotation);
    //log ("DPRotaion Value: " + getState(DPRotation).val);
    //log ("DPDestination: " + DPDestination);

    if (value) { //true = geöffnet
        if ((getState(DPRotation).val) <2) { //fast senkrecht
            setState(DPDestination,2); //offen
        } else {
            setState(DPDestination,1); //gekippt
        }         
    } else { //geschlossen
        setState(DPDestination,0); //geschlossen
    }   

});


//reagiert auf alles Änderungen in der Tueren_Alias Aufzählung
$('state(functions=tueren_alias)').on(function(obj) {
    var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    var DeviceID=objArr[1]+"."+objArr[2];
    var DeviceName=objArr[3];
    //console.log("Trigger: " + objArr[0]);
    //console.log("Pfad: " + objArr[1]);
    //console.log("Devicename: " + objArr[3]);
    //console.log("localDeviceID:"+DeviceID);   

    var DPRotation = objArr[0] + "_Rotation" //Trigger+Zusatz "_Rotation"
    var DPDestination = "0_userdata.0.StateDoorsWindows." + objArr[2] + "." + DeviceName

    //log ("DPRotation: " + DPRotation);
    //log ("DPRotaion Value: " + getState(DPRotation).val);
    //log ("DPDestination: " + DPDestination);

    if (value) { //true = geöffnet
        if ((getState(DPRotation).val) <2) { //fast senkrecht
            setState(DPDestination,2); //offen
        } else {
            setState(DPDestination,1); //gekippt
        }         
    } else { //geschlossen
        setState(DPDestination,0); //geschlossen
    }   

});

//reagiert auf alles Änderungen in der DoorWindowRotation Aufzählung
$('state(functions=DoorWindowRotation)').on(function(obj) {
    
    var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    var DeviceID=objArr[1]+"."+objArr[2];
    var DeviceName=objArr[3];
//    console.log("Trigger: " + objArr[0]);
//    console.log("Pfad: " + objArr[1]);
//    console.log("Devicename: " + objArr[3]);
//    console.log("localDeviceID:"+DeviceID);   

    /*
    Trigger: alias.0.Fenster.Bad_Rotation
    Pfad: alias.0
    Devicename: Bad_Rotation
    localDeviceID:alias.0.Fenster
    */

    var DPOpenClosed = objArr[0].replace("_Rotation",""); //"_Rotation" entfernen
    var DPDestination = "0_userdata.0.StateDoorsWindows." + objArr[2] + "." + DeviceName.replace("_Rotation",""); //"_Rotation" entfernen
//    log ("DPOpenClosed: " + DPOpenClosed);
//    log ("DPDestination: " + DPDestination);


    if (!getState(DPOpenClosed).val) { //true = offen
        setState(DPDestination,0); //geschlossen
    } else {
        if (value <2) { //<2 bedeutet senkrecht
            setState(DPDestination,2); //offen
        } else {
            setState(DPDestination,1); //gekippt
        }
    }         

});
