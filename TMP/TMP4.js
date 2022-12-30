stopScript("");
bei einem Reboot werden alle Shellys ausgeschaltet

//alle Shellys rebooten
// Datenpunkt der Shelly (Standard: shelly.0)
var shelly_dp = "shelly.0";
 
// Datenpunkte der Shelly (!!! Bitte nicht ändern !!!)
var shellyDps = $('state[id=' + shelly_dp + '.*.reboot]');
 
let anzahl_shelly = 0;
 
// Starte Reboot
shellyDps.each(function (id, i) {
    log("Device to Reboot: " + id);
    setState(id, true);
    anzahl_shelly++;
});
log("Shelly-Reboot: Der Update-Befehl wurde an " + anzahl_shelly + " Shelly gesendet!");
stopScript("");