const PingDevices = $('ping.0.iobroker.*');
var Alerts = ['alias.0.Alarm.Kinowasser'];

var GaragenDevices = ['alias.0.Tueren.Garage','alias.0.Licht.Garage'];

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

function UpdateIPList(){
    log("Update der IP Liste wurde gestartet");
    var unifi_dp = "unifi.0.default.clients";
    var ids = $('state[id=' + unifi_dp + '.*.ip]');
    
    //log(ids); 
    const idTable = '0_userdata.0.iQontrol.Listen.IPs'; // ID JSON-Tabelle
  
    var table = [];
    for(let i = 0; i < ids.length; i++) {
            table[i] = {};
            var DPName=ids[i].substr(0, ids[i].length - 3);
            //log(getObject(DPName).common.name + "/" + getState(ids[i]).val + "/" + getState(DPName + ".is_online").val);
            table[i].Name = getObject(DPName).common.name.toLowerCase();
            table[i].Wert = getState(ids[i]).val;
            table[i].Online = getState(DPName + ".is_online").val;
    }

    //Array of Objects (kein JSON) sortieren
    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    setState(idTable, JSON.stringify(sortByKey(table,'Name')), true);
}


function UpdateIPListOld(){
    log("Update der IP Liste wurde gestartet");
    var shelly_dp = "shelly.0";
    var ids = $('state[id=' + shelly_dp + '.*.hostname]');
    
    //log(ids); 
    const idTable = '0_userdata.0.iQontrol.Listen.IPs'; // ID JSON-Tabelle
  
    var table = [];
    for(let i = 0; i < ids.length; i++) {
        if (ids[i] != "shelly.0.undefined.hostname"){
            table[i] = {};
            var DPName=ids[i].substr(0, ids[i].length - 9);
            //log(getObject(DPName).common.name + "/" + getState(ids[i]).val);
            table[i].Name = getObject(DPName).common.name;
            table[i].Wert = getState(ids[i]).val;
        }
    }

    var ShellyLength = table.length;

    //Sonoffs
    var sonoff_dp = "sonoff.0";
    var sonoffids = $('state[id=' + sonoff_dp + '*.INFO.Info2_IPAddress]');
    //log(sonoffids);
    for(let i = 0; i < sonoffids.length; i++) {
            table[(i+ShellyLength)] = {};
            var DPName=sonoffids[i].substr(0, sonoffids[i].length - 21);
            //log(getObject(DPName).common.name + "/" + getState(ids[i]).val);
            table[(i+ShellyLength)].Name = getObject(DPName).common.name;
            table[(i+ShellyLength)].Wert = getState(sonoffids[i]).val;
    }

    //Array of Objects (kein JSON) sortieren
    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    setState(idTable, JSON.stringify(sortByKey(table,'Name')), true);

}

CheckAlerts();
UpdateIPList();


schedule('0 18 * * *', CheckAlerts); // täglich 18 Uhr
schedule('*/60 * * * *',UpdateIPList); //stündlich
 

 