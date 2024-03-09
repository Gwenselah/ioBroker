var Entprellzeit = 500;

on({id: 'shelly.0.ble.b0:c7:de:bd:45:16.button', change: 'any'},(obj) => {
    var value = obj.state.val;
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else { 
        log("Taster: " + value);
    }

})

