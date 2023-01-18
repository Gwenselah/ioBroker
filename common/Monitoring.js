//Überwacht den Batteristatus von Sensoren

const batt = $('deconz.0.Sensors.*.battery');
const reachable = $('deconz.0.Sensors.*.reachable');
const PingDevices = $('ping.0.iobroker.*');
var Alerts = ['alias.0.Alarm.Kinowasser'];

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


lowBatt();
NotReachable();
CheckAlerts();

schedule('0 18 * * *', lowBatt); // täglich 18 Uhr
schedule('0 18 * * *', NotReachable); // täglich 18 Uhr
schedule('0 18 * * *', CheckAlerts); // täglich 18 Uhr

 

 