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

    switch (value) {
        case 1002:
            log ("Fernbedienung: " + DeviceName + " - 1002");

            if ((getState('shelly.0.SHSW-25#483FDA82436B#1.Relay0.Switch').val) !=
                (getState('shelly.0.SHSW-25#483FDA82436B#1.Relay1.Switch').val)) {
                    setState('shelly.0.SHSW-25#483FDA82436B#1.Relay0.Switch',false);
                    setState('shelly.0.SHSW-25#483FDA82436B#1.Relay1.Switch',false);
            } else {
                if (getState('shelly.0.SHSW-25#483FDA82436B#1.Relay0.Switch').val == true) {
                    setState('shelly.0.SHSW-25#483FDA82436B#1.Relay0.Switch',false);
                } else {
                    setState('shelly.0.SHSW-25#483FDA82436B#1.Relay0.Switch',true);
                }
                if (getState('shelly.0.SHSW-25#483FDA82436B#1.Relay1.Switch').val == true) {
                    setState('shelly.0.SHSW-25#483FDA82436B#1.Relay1.Switch',false);
                } else {
                    setState('shelly.0.SHSW-25#483FDA82436B#1.Relay1.Switch',true);
                }            
            }
            break;
        case 2002: 
            //Rollladen hoch + 10%
            log ("Fernbedienung: " + DeviceName + " - 2002");
            setState('shelly.0.SHSW-25#00869E#1.Shutter.Position',
                getState('shelly.0.SHSW-25#00869E#1.Shutter.Position').val + 10);
            break;
        case 2003: 
            //Rollladen komplett hoch
            log ("Fernbedienung: " + DeviceName + " - 2003");
            setState('shelly.0.SHSW-25#00869E#1.Shutter.Position',100);
            break;
        case 3002:
            //Rollladen runter - 10%
            log ("Fernbedienung: " + DeviceName + " - 3002");
            setState('shelly.0.SHSW-25#00869E#1.Shutter.Position',
                getState('shelly.0.SHSW-25#00869E#1.Shutter.Position').val -10);
            break;
        case 3003:
            //Rollladen komplett runter
            log ("Fernbedienung: " + DeviceName + " - 3003");
            setState('shelly.0.SHSW-25#00869E#1.Shutter.Position',0);
            break;
        case 4002:
            log ("Fernbedienung: " + DeviceName + " - 4002");
            if (getState('shelly.0.SHSW-25#483FDA82436B#1.Relay1.Switch').val == true) {
                setState('shelly.0.SHSW-25#483FDA82436B#1.Relay1.Switch',false);
            } else {
                setState('shelly.0.SHSW-25#483FDA82436B#1.Relay1.Switch',true);
            }
            break;
        case 5002:
            log ("Fernbedienung: " + DeviceName + " - 5002");
            if (getState('shelly.0.SHSW-25#483FDA82436B#1.Relay0.Switch').val == true) {
                setState('shelly.0.SHSW-25#483FDA82436B#1.Relay0.Switch',false);
            } else {
                setState('shelly.0.SHSW-25#483FDA82436B#1.Relay0.Switch',true);
            }
            break;
    }

});