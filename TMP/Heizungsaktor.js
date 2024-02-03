
//Leas Mond
on({id: 'alias.0.Temperaturen.Temperatur_Kachelofen',change: "ne"},function(obj) {
    if (obj.state.val > 23.5) {
        log("Die Temperatur ist: " + obj.state.val + ". Ich schalte aus");
        setState('shelly.0.shellyplus1pm#d4d4da7ca858#1.Relay0.Switch',false);
    }
    if (obj.state.val < 21.5) {
        log("Die Temperatur ist: " + obj.state.val + ". Ich schalte an");
        setState('shelly.0.shellyplus1pm#d4d4da7ca858#1.Relay0.Switch',true);
    }    
});