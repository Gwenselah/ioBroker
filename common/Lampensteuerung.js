//Wenn über Shelly angeschaltet wird, warten bis die Lampe sich gemeldet hat und dann die Werte des virtuellen Objekts auf die Lampe setzen
on({id: 'yeelight-2.0.ceiling1-0x0000000007c87a96.info.connect',change:'ne'}, function (obj) {
    if (getState('yeelight-2.0.ceiling1-0x0000000007c87a96.info.connect').val === true) {
		setState("yeelight-2.0.ceiling1-0x0000000007c87a96.control.active_bright",parseInt(getState("Datenpunkte.0.Geräte.Esszimmer_Lampe.active_bright").val));
		setState("yeelight-2.0.ceiling1-0x0000000007c87a96.control.ct",parseInt(getState("Datenpunkte.0.Geräte.Esszimmer_Lampe.ct").val));
	}
})

//Wenn sich die Datenpunkte des virtuellen Objekts ändern, z.B. über Alexa, dann diese Werte an die Lampe senden
var dp= ['Datenpunkte.0.Geräte.Esszimmer_Lampe.active_bright','Datenpunkte.0.Geräte.Esszimmer_Lampe.ct'];
on({id: ['Datenpunkte.0.Geräte.Esszimmer_Lampe.active_bright','Datenpunkte.0.Geräte.Esszimmer_Lampe.ct'], change:'ne'}, function (obj) {
	if (getState("shelly.0.SHSW-1#E1FE99#1.Relay0.Switch").val === false) {
		setState("shelly.0.SHSW-1#E1FE99#1.Relay0.Switch",true);
	} else {
		if (getState("Datenpunkte.0.Geräte.Esszimmer_Lampe.active_bright").val != getState("yeelight-2.0.ceiling1-0x0000000007c87a96.control.active_bright").val) {
			setState("yeelight-2.0.ceiling1-0x0000000007c87a96.control.active_bright",parseInt(getState("Datenpunkte.0.Geräte.Esszimmer_Lampe.active_bright").val));
		}
		if (getState("Datenpunkte.0.Geräte.Esszimmer_Lampe.ct").val != getState ("yeelight-2.0.ceiling1-0x0000000007c87a96.control.ct").val) {
			setState("yeelight-2.0.ceiling1-0x0000000007c87a96.control.ct",parseInt(getState("Datenpunkte.0.Geräte.Esszimmer_Lampe.ct").val));
		}
	};
});

//Wenn die Lampenwerte sich ändern, z.B. über die App oder Fernbedienung, dann die Werte an die Datenpunkte des virtuellen Geräts senden
on({id: ["yeelight-2.0.ceiling1-0x0000000007c87a96.control.active_bright"], change:'ne'}, function (obj) {
    if (getState("Datenpunkte.0.Geräte.Esszimmer_Lampe.active_bright").val == 0) {
        setState("shelly.0.SHSW-1#E1FE99#1.Relay0.Switch",false);
    }
	if (getState("Datenpunkte.0.Geräte.Esszimmer_Lampe.active_bright").val != getState("yeelight-2.0.ceiling1-0x0000000007c87a96.control.active_bright").val) {
		setState("Datenpunkte.0.Geräte.Esszimmer_Lampe.active_bright",parseInt(getState("yeelight-2.0.ceiling1-0x0000000007c87a96.control.active_bright").val));
	}

});
on({id: ["yeelight-2.0.ceiling1-0x0000000007c87a96.control.ct"], change:'ne'}, function (obj) {
	if (getState("Datenpunkte.0.Geräte.Esszimmer_Lampe.ct").val != getState("yeelight-2.0.ceiling1-0x0000000007c87a96.control.ct").val) {
		setState("Datenpunkte.0.Geräte.Esszimmer_Lampe.ct",parseInt(getState("yeelight-2.0.ceiling1-0x0000000007c87a96.control.ct").val));
	}
});

//=====================================================================================================================================================
//Wenn der Rolladen komplett offen ist, dann die Lampen ausschalten
/*
on({id: ["shelly.0.SHSW-25#00465F#1.Shutter.state", "shelly.0.SHSW-25#00CDCF#1.Shutter.state"], val: "stop"},(obj) => {    
    var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
//    log(objArr[0]);
//    log(objArr[1]);
//    log(objArr[2]);
    log("Trigger: " +  obj.id);
    log("Name: " +  getObject(objArr[1]).common.name);

    var ShutterPosition = objArr[0].replace("state","Position");
    log("astronomischer Tag:" + getState('javascript.0.Astro.Astrotag').val);
    log("Position: " + getState(ShutterPosition).val);
    if ((getState(ShutterPosition).val) > 49 && (getState('javascript.0.Astro.Astrotag').val))  {
       
        log("Es ist hell genug, Lampen werden ausgeschaltet.");
        LightSwitched = false; //merkt sich, ob eine Lampe geschaltet wurde.
        SwitchDevices.forEach(function(element) {
            if (element.Ort == "Wohnzimmer" || element.Ort == "Esszimmer") {
                if (element.Name.includes("licht") || element.Name.includes("lampe")) {
                    if (getState(element.Objekt).val) {
                        //setState(element.Objekt, false);
                        setStateDelayed(element.Objekt, false,15000);
                        log(element.Ort  + " - " + element.Name + " wurde ausgeschaltet.");
                        LightSwitched = true;
                    }
                }
            };			
        });
        if (LightSwitched) {
            setState ('alexa2.0.Echo-Devices.G2A0U2048495012U.Commands.speak', 'Es ist hell genug, daher werde ich die Lampen ausschalten.');
        }
    }
});

//=====================================================================================================================================================
//Wenn die Lampen angeschaltet werden, dann erst Mal die Rolladen hoch fahren

on({id: ["linkeddevices.0.Diningroom.CEILINGSWITCHSwitch", "linkeddevices.0.Livingroom.CEILINGSWITCHSwitch"], val: true},(obj) => {    
    var value = obj.state.val;
    //log("Value: " + value);
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    //log("Trigger: " +  obj.id);
    if (getState('javascript.0.Astro.Astrotag').val) {
        //prüfen, ob einer der Rollläden nicht auf 100 steht
        MoveRollladen=false;
        for (var i=0;i<Rollladen.length; i++) {
            if (getState(Rollladen[i][0].Objekt).val != 100) {
                //log (getState(Rollladen[i][0].Objekt).val);  
                setState(Rollladen[i][0].Objekt,100);
                                   
                MoveRollladen=true;
            }
        }
        //log("MoveRollladen:" + MoveRollladen);

        if (MoveRollladen) {
            //Lampe wieder ausschalten
            setState(obj.id,false);
            setState ('alexa2.0.Echo-Devices.G2A0U2048495012U.Commands.speak', 'Draußen ist es hell, daher habe ich die Rollläden hoch gefahren.');
        }
    }
});


*/