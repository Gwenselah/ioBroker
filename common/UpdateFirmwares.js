// Datenpunkt der Shelly (Standard: shelly.0)
var shelly_dp = "shelly.0";
 
// Datenpunkte der Shelly (!!! Bitte nicht ändern !!!)
var shellyDps = $('state[id=' + shelly_dp + '.*.firmware]');
 
let anzahl_shelly = 0;
let anzahl_shelly_update = 0;
 
// Starte Reboot
shellyDps.each(function (id, i) {
    if (getState(id).val == true) {
        log("Device to Update: " + id);
        setState(id + "update", true);
        anzahl_shelly_update++;
    }
    anzahl_shelly++;
});

log("Shelly-Firmware: Der Update-Befehl wurde an " + anzahl_shelly_update + " von " + anzahl_shelly + " Shelly gesendet!");
stopScript("");