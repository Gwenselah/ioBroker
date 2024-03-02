
var sonoff_dp = "sonoff.0";
var ids = $('state[id=' + sonoff_dp + '*.INFO.Info2_IPAddress]');

//log(ids); 
const idTable = '0_userdata.0.iQontrol.Listen.IPs'; // ID JSON-Tabelle

var table = [];

for(let i = 0; i < ids.length; i++) {
        table[(i+ids.length)] = {};
        var DPName=ids[i].substr(0, ids[i].length - 21);
        //log(getObject(DPName).common.name + "/" + getState(ids[i]).val);
        table[(i+ids.length)].Name = getObject(DPName).common.name;
        table[(i+ids.length)].Wert = getState(ids[i]).val;
}
log(JSON.stringify(table));


jsonataExpression(table,'$^(Name)')

log(JSON.stringify(table));
