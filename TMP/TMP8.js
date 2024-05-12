
// Datenpunkt der Shelly (Standard: shelly.0)
var shelly_dp = "shelly.0";

// Datenpunkte der Shelly (!!! Bitte nicht ändern !!!)
var shellyDps = $('state[id=' + shelly_dp + '.*.*.Energy]');

var shellyDps2 = {'0':'shelly.0.SHPLG-S#4022D881C2E0#1.Relay0.Energy','1':'shelly.0.SHPLG-S#4022D882E4CB#1.Relay0.Energy'};

// Datenpunkte der Shelly 3EM DP
var shelly3EMDps = $('state[id=' + shelly_dp + '.*.*.Total]');

// Datenpunkte der Shelly 3EM DP - Total
var shelly3EMTotalDps = $('state[id=' + shelly_dp + '.*.*.ConsumedPower]');

// Datenpunkte der Shelly 3EM DP - Total
var shelly3EMTotalReturned = $('state[id=' + shelly_dp + '.*.*.Total_Returned]');

// Datenpunkte der Shelly Namen (!!! Bitte nicht ändern !!!)
var shellyDpsName = $('state[id=' + shelly_dp + '.*.name]');


log (shellyDps);
log ("----");
log (shellyDps2);
log ("----");
log (shelly3EMDps);
