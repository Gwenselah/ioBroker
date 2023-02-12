//Überwacht den Batteristatus von Sensoren

const batt = $('deconz.0.Sensors.*.battery');
const reachable = $('deconz.0.Sensors.*.reachable');
const PingDevices = $('ping.0.iobroker.*');
var Alerts = ['alias.0.Alarm.Kinowasser'];

var GaragenDevices = ['alias.0.Tueren.Garage','alias.0.Licht.Garage'];

function lowBatt() {
	var low = [];
	setState('0_userdata.0.Hilfsdatenpunkte.Batterieschwach', '', true);	
	batt.each(function (id, i) {
	if(getState(id).val < 30) {
			id = id.split('.');
			id = 'deconz.0.' + id[2] + '.' + id[3];
            //log(getObject(id).common.name);
			low.push(getObject(id).common.name); // Geräte-Name
		}	
	});
	setState('0_userdata.0.Hilfsdatenpunkte.Batterieschwach', low.join(',<br>'), true);	
    if (low.length >0) {
        sendTo("telegram", "send", {
            text: ('Folgende Batterien sind schwach: \n' + low)
        });
    }
}


function NotReachable() {
	var NotReachableArray = [];
	setState('0_userdata.0.Hilfsdatenpunkte.NichtErreichbar','', true);
	reachable.each(function (id, i) {
	    if(getState(id).val == false) {
			id = id.split('.');
			id = 'deconz.0.' + id[2] + '.' + id[3];
			var CommonName = getObject(id).common.name;
			//log (CommonName);
			if ((CommonName.indexOf("Consumption") ==-1) && (CommonName.indexOf("Power") ==-1)) {
				NotReachableArray.push(CommonName); // Geräte-Name
			}
		}	
	});
	setState('0_userdata.0.Hilfsdatenpunkte.NichtErreichbar', NotReachableArray.join(',<br>'), true);	
    if (NotReachableArray.length >0) {
        sendTo("telegram", "send", {
            text: ('Folgende Sensoren sind nicht erreichbar: \n' + NotReachableArray)
        });
    }
}

function CheckAlerts(){
    Alerts.forEach(function(element) {
        if ((getState(element).val) == true) {
            sendTo("telegram", "send", {
                text: ('ALARM: ' + element)
            });
        }
    })

}


on({id:"radar2.0._notHere", change:'ne'}, function (obj) {
    var value = obj.state.val    
    if (value != "") {
        log(">" + value + "< ist nicht erreichbar");
        sendTo('telegram', {
                user: 'Andy',
                text: (">" + value + "< ist nicht erreichbar"),
            });           
    } else {
        log("Alle Geräte sind wieder erreichbar");
        sendTo('telegram', {
                user: 'Andy',
                text: ("Alle Geräte sind wieder erreichbar"),
            });           

    }
    
    
})

on({id: GaragenDevices, change: 'ne'},(obj) => {
    /*var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    var DeviceID=objArr[1]+"."+objArr[2];
    var DeviceName=objArr[2];
    console.log("Trigger: " + objArr[0]);
    console.log("Pfad: " + objArr[1]);
    console.log("Devic);name: " + objArr[2]);
    console.log("localDeviceID:"+DeviceID);*/

    if (getState('alias.0.Tueren.Garage').val) {
        setState('0_userdata.0.Hilfsdatenpunkte.Garage_Status','rot');    
    } else {
        if (getState('alias.0.Licht.Garage').val) {
            setState('0_userdata.0.Hilfsdatenpunkte.Garage_Status','gelb');        
        } else {
            setState('0_userdata.0.Hilfsdatenpunkte.Garage_Status','aus');        
        }
    }
});


lowBatt();
NotReachable();
CheckAlerts();

schedule('0 18 * * *', lowBatt); // täglich 18 Uhr
schedule('0 18 * * *', NotReachable); // täglich 18 Uhr
schedule('0 18 * * *', CheckAlerts); // täglich 18 Uhr

 

 