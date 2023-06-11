/*log ("Jetzt");
setTimeout(function() {
console.log("Callback Funktion wird aufgerufen");
}, 3000);

console.log("Vor der sleep-Funktion");
await sleep(3000); // Pausiert die Funktion für 3 Sekunden
 console.log("Nach der Sleep Funktion");

*/

//let obj = getObject('alias.0.Rollladen.Küche_Stop');
let obj = getObject('alias.0.Steckdosen.Waschmaschine_Rechts');
if (!obj.common.smartName || !obj.common.smartName.de) {
    log("true")
} else {
    log ("false")
}


//log(obj);
log (existsObject('alias.0.Rollladen.Küche_Stop').common);
//log (getState('alias.0.Rollladen.Küche_Stop'));
//log (getState('alias.0.Rollladen.Küche_Stop').common.smartName);


//log (getState('alias.0.Steckdosen.KaiPC').common.smartName);

log (obj.common.smartName);
if (obj.common.smartName  == null) {
    log ("tr");
}