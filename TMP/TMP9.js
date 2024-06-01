function UpdateIPList(){
    log("Test - Update der IP Liste wurde gestartet");
    var unifi_dp = "unifi.0.default.clients";
    var ids = $('state[id=' + unifi_dp + '.*.ip]');
    
    //log(ids); 
    const idTable = '0_userdata.0.iQontrol.Listen.IPs'; // ID JSON-Tabelle
  
    var table = [];
    for(let i = 0; i < ids.length; i++) {
            table[i] = {};
            var DPName=ids[i].substr(0, ids[i].length - 3);
            //log(getObject(DPName).common.name + "/" + getState(ids[i]).val + "/" + getState(DPName + ".is_online").val);
            table[i].Name = getObject(DPName).common.name;
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

UpdateIPList();