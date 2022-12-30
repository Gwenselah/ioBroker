
//bei jedem empfangenen Wert die Hilfsvariable um eins erhöhen
//bei >75 Zählerstand um eins erhöhen
on({id: 'mqtt.0.Powercounter.Stromverbrauch.Count' , change:'ne'},function(obj) {
    if (obj.state.val) {
        setState('0_userdata.0.PowerMeter.Hilfswerte.RedLineCounter',
            (getState('0_userdata.0.PowerMeter.Hilfswerte.RedLineCounter').val+1));            
    }

    if (getState('0_userdata.0.PowerMeter.Hilfswerte.RedLineCounter').val >75) {
        setState('0_userdata.0.PowerMeter.Werte.Zählerstand',
            (getState('0_userdata.0.PowerMeter.Werte.Zählerstand').val+1));            

        setState('0_userdata.0.PowerMeter.Hilfswerte.RedLineCounter',
            (getState('0_userdata.0.PowerMeter.Hilfswerte.RedLineCounter').val-75));            
    }
})

var cronH           = "0 * * * *";
var cronD           = "59 23 * * *";
var cronW           = "0 0 * * 1";
var cronM           = "0 0 1 * *";
var idHAGTotH       = "0_userdata.0.PowerMeter.Hilfswerte.Total-h";
var idHAGTotD       = "0_userdata.0.PowerMeter.Hilfswerte.Total-d";
var idHAGTotW       = "0_userdata.0.PowerMeter.Hilfswerte.Total-w";
var idHAGTotM       = "0_userdata.0.PowerMeter.Hilfswerte.Total-m";
var idHAGTotal      = "0_userdata.0.PowerMeter.Werte.Zählerstand";               /*Stromverbrauch insgesammt*/
var idHAGZielH      = "0_userdata.0.PowerMeter.Werte.Hour";
var idHAGZielD      = "0_userdata.0.PowerMeter.Werte.Day";
var idHAGZielW      = "0_userdata.0.PowerMeter.Werte.Week";
var idHAGZielM      = "0_userdata.0.PowerMeter.Werte.Month";
var debug           = false;
var DPArray         = [idHAGTotH, idHAGTotD , idHAGTotW, idHAGTotM, idHAGZielH, idHAGZielD, idHAGZielW, idHAGZielM];
var DPUnit          = "kWh";
DPArray.forEach(function(wert, index, array) {
    var DPType = wert.split(".");
    var DPDescr = "Power consumption of " + (DPType[DPType.length - 1]);
 
    if(index > 3) DPUnit = "Wh";
    createState(wert, 0, {
        name: DPDescr,
        desc: DPDescr,
        type: 'number',
        unit: DPUnit,
        role: 'value'
    });
});
function haupt (VorId, ZielId) {
    var nVorwert = getState(VorId).val;
    var nAktuell = getState(idHAGTotal).val;
    var nDiff = ((nAktuell * 10) - (nVorwert * 10)) * 100;
    setState(ZielId, nDiff, true);
    if(debug) log("Aus: " + nAktuell +" - "+ nVorwert + " = " + nDiff);
    var shandler = on ({id: ZielId, change: 'any'}, function(data) {
        setState(VorId, (nAktuell*10)/10, true);
        unsubscribe(shandler); 
    });
}
// regelmässige Wiederholungen
// -----------------------------------------------------------------------------
schedule(cronH, function () {
    haupt(idHAGTotH, idHAGZielH);
});
schedule(cronD, function () {
    haupt(idHAGTotD, idHAGZielD);
});
schedule(cronW, function () {
    haupt(idHAGTotW, idHAGZielW);
});
schedule(cronM, function () {
    haupt(idHAGTotM, idHAGZielM);
});