//Überwacht den Batteristatus von Sensoren

const batt = $('deconz.0.Sensors.*.battery');
const reachable = $('deconz.0.Sensors.*.reachable');
const PingDevices = $('ping.0.iobroker.*');
var Alerts = ['alias.0.Alarm.Kinowasser'];

function lowBatt() {
	var low = [];
	setState('Datenpunkte.0.Status.Batterieschwach', '', true);	
	batt.each(function (id, i) {
	if(getState(id).val < 30) {
			id = id.split('.');
			id = 'deconz.0.' + id[2] + '.' + id[3];
            //log(getObject(id).common.name);
			low.push(getObject(id).common.name); // Geräte-Name
		}	
	});
	setState('Datenpunkte.0.Status.Batterieschwach', low.join(',<br>'), true);	
    if (low.length >0) {
        sendTo("telegram", "send", {
            text: ('Folgende Batterien sind schwach: \n' + low)
        });
    }
}


function NotReachable() {
	var NotReachableArray = [];
	setState('Datenpunkte.0.Status.NichtErreichbar','', true);
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
	setState('Datenpunkte.0.Status.NichtErreichbar', NotReachableArray.join(',<br>'), true);	
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

on({id: /^ping\.0\.iobroker\.*/ ,change:'ne'}, function (obj) {
    var value = obj.state.val;
    var objArr  = obj.id.match(/(^.+)\.(.+)\.(.+)$/, ""); //Aufteilung in Pfad + Device + CMD
    /*var DeviceID=objArr[1]+"."+objArr[2];
    console.log("Trigger: " + objArr[0]);
    console.log("Pfad: " + objArr[1]);    
    var DeviceName=getObject(DeviceID).common.name;*/
    var DeviceName=objArr[3];
    DeviceName=DeviceName.replace(/_/g,' ');
    //log (DeviceName);
    if (value) {
        //nothing to do
    } else {
        log(">" + DeviceName + "< ist nicht erreichbar");
        sendTo('telegram', {
                user: 'Andy',
                text: (">" + DeviceName + "< ist nicht erreichbar"),
            });           
    }
})

lowBatt();
NotReachable();
CheckAlerts();

schedule('0 18 * * *', lowBatt); // täglich 18 Uhr
schedule('0 18 * * *', NotReachable); // täglich 18 Uhr
schedule('0 18 * * *', CheckAlerts); // täglich 18 Uhr

 

 