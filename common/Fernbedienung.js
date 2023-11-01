//Türen und Fenster
var Remotes = ['deconz.0.Sensors.30.buttonpressed','deconz.0.Sensors.31.buttonpressed'];

on({id: Remotes, change: 'ne'},(obj) => {
    var value = obj.state.val;
    //log ("Fernbedienung Button Pressed: " + value);
    //1002: On Off - beide Lampen an / aus
    //2002: heller - Rollladen hoch
    //2003: Long Press 2003
    //3002: dunkler - Rollladen runter
    //3003: Long Press 3002
    //4002: links - Linke (hintere) Lampe an aus
    //5002: rechts - Rechte Lampe an aus

    //var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    var DeviceID=objArr[1]+"."+objArr[2];
    var DeviceName=getObject(DeviceID).common.name;
//    console.log("Devicename: "+getObject(DeviceID).common.name);
    /*console.log("Trigger: " + objArr[0]);
    console.log("Pfad: " + objArr[1]);
    console.log("Devicename: " + getObject(DeviceID).common.name); // Geräte-Name);
    console.log("localDeviceID:"+DeviceID);*/
    log ("Fernbedienung: " + DeviceName + " - " + value);
    switch (value) {
        case 1002:
            if ((getState('alias.0.Licht.Schlafzimmer_Lampe_Links').val) !=
                (getState('alias.0.Licht.Schlafzimmer_Lampe_Rechts').val)) {
                    setState('alias.0.Licht.Schlafzimmer_Lampe_Links',false);
                    setState('alias.0.Licht.Schlafzimmer_Lampe_Rechts',false);
            } else {
                if (getState('alias.0.Licht.Schlafzimmer_Lampe_Links').val == true) {
                    setState('alias.0.Licht.Schlafzimmer_Lampe_Links',false);
                } else {
                    setState('alias.0.Licht.Schlafzimmer_Lampe_Links',true);
                }
                if (getState('alias.0.Licht.Schlafzimmer_Lampe_Rechts').val == true) {
                    setState('alias.0.Licht.Schlafzimmer_Lampe_Rechts',false);
                } else {
                    setState('alias.0.Licht.Schlafzimmer_Lampe_Rechts',true);
                }            
            }
            break;
        case 2002: 
            //Rollladen hoch + 10%
            setState('alias.0.Rollladen.Schlafzimmer',
                getState('alias.0.Rollladen.Schlafzimmer').val + 10);
            break;
        case 2003: 
            //Rollladen komplett hoch
            setState('alias.0.Rollladen.Schlafzimmer',100);
            break;
        case 3002:
            //Rollladen runter - 10%
            setState('alias.0.Rollladen.Schlafzimmer',
                getState('alias.0.Rollladen.Schlafzimmer').val -10);
            break;
        case 3003:
            //Rollladen komplett runter
            setState('alias.0.Rollladen.Schlafzimmer',0);
            break;
        case 4002:
            if (getState('alias.0.Licht.Schlafzimmer_Lampe_Rechts').val == true) {
                setState('alias.0.Licht.Schlafzimmer_Lampe_Rechts',false);
            } else {
                setState('alias.0.Licht.Schlafzimmer_Lampe_Rechts',true);
            }
            break;
        case 5002:
            if (getState('alias.0.Licht.Schlafzimmer_Lampe_Links').val == true) {
                setState('alias.0.Licht.Schlafzimmer_Lampe_Links',false);
            } else {
                setState('alias.0.Licht.Schlafzimmer_Lampe_Links',true);
            }
            break;
    }

});

var RemoteKai = ['deconz.0.Sensors.38.buttonpressed'];

on({id: RemoteKai, change: 'ne'},(obj) => {
    var value = obj.state.val;
    //1002: heller -Rolladen 10%plus
    //1003: Long Press 1002 Rollladen komplett öffnen
    //2002: dunkler - Rollanden 10% minus
    //2003: Long Press 2003
    //3002: links
    //3003: Long Press 3002
    //4002: rechts
    //4003: Long Press 4002

    //var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    var DeviceID=objArr[1]+"."+objArr[2];
    var DeviceName=getObject(DeviceID).common.name;
    log ("Fernbedienung: " + DeviceName + " - " + value);
    switch (value) {
        case 1002: 
            //Rollladen hoch + 10%
            setState('alias.0.Rollladen.Kai',
                getState('alias.0.Rollladen.Kai').val + 10);
            break;
        case 1003: 
            //Rollladen komplett hoch
            setState('alias.0.Rollladen.Kai',100);
            break;
        case 2002:
            //Rollladen runter - 10%
            setState('alias.0.Rollladen.Kai',
                getState('alias.0.Rollladen.Kai').val -10);
            break;
        case 2003:
            //Rollladen komplett runter
            setState('alias.0.Rollladen.Kai',0);
            break;
        case 3002: //Kai PC aus
            if (getState('alias.0.Steckdosen.KaiPC').val == true) {
                setState('alias.0.Steckdosen.KaiPC',false);
            }
            break;
        case 4002: //Kai PC an
            if (getState('alias.0.Steckdosen.KaiPC').val == false) {
                setState('alias.0.Steckdosen.KaiPC',true);
            }
            break;
    }

});

var RemoteAndy = ['deconz.0.Sensors.36.buttonpressed'];

on({id: RemoteAndy, change: 'ne'},(obj) => {
    var value = obj.state.val;
    //Fenster
    //1002: heller -Rolladen 10%plus
    //1003: Long Press 1002 Rollladen komplett öffnen
    //2002: dunkler - Rollanden 10% minus
    //2003: Long Press 2003 - Rolladen 0%

    //Türe
    //4002: heller -Rolladen 10%plus
    //4003: Long Press 1002 Rollladen komplett öffnen
    //3002: dunkler - Rollanden 10% minus
    //3003: Long Press 2003 - Rolladen 0%

    //var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    var DeviceID=objArr[1]+"."+objArr[2];
    var DeviceName=getObject(DeviceID).common.name;
    log ("Fernbedienung: " + DeviceName + " - " + value);
    switch (value) {
        case 1002: 
            //Rollladen hoch + 10%
            setState('alias.0.Rollladen.Schlafzimmer',
                getState('alias.0.Rollladen.Schlafzimmer').val + 10);
            break;
        case 1003: 
            //Rollladen komplett hoch
            setState('alias.0.Rollladen.Schlafzimmer',100);
            break;
        case 2002:
            //Rollladen runter - 10%
            setState('alias.0.Rollladen.Schlafzimmer',
                getState('alias.0.Rollladen.Schlafzimmer').val -10);
            break;
        case 2003:
            //Rollladen komplett runter
            setState('alias.0.Rollladen.Schlafzimmer',0);
            break;
        case 4002:  //rechts
            //Lampe rechts
            if (getState('alias.0.Licht.Schlafzimmer_Lampe_Rechts').val == true) {
                setState('alias.0.Licht.Schlafzimmer_Lampe_Rechts',false);
            } else {
                setState('alias.0.Licht.Schlafzimmer_Lampe_Rechts',true);
            }
            break;
 //       case 4003: 
            //Rollladen komplett hoch
//            setState('alias.0.Rollladen.Lea_Türe',100);
//            break;
        case 3002: //links
            //Lampe links
            if (getState('alias.0.Licht.Schlafzimmer_Lampe_Links').val == true) {
                setState('alias.0.Licht.Schlafzimmer_Lampe_Links',false);
            } else {
                setState('alias.0.Licht.Schlafzimmer_Lampe_Links',true);
            }
            break;
//        case 3003:
            //Rollladen komplett runter
//            setState('alias.0.Rollladen.Lea_Türe',0);
//            break;
    }

});