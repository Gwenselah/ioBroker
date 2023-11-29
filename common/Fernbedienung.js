var Entprellzeit = 500;
//Die runden IKEA Fernbedienungen lösen bei kurzem Druck zwei Mal aus. Einmal beim Drücken der Taste und einmal beim Loslassen.
//Das wird über die Entprellzeit abgefangen
function SwitchAllLights(){
    if ((getState('alias.0.Licht.Schlafzimmer_Lampe_Links').val) !=
        (getState('alias.0.Licht.Schlafzimmer_Lampe_Rechts').val)) {
            setState('alias.0.Licht.Schlafzimmer_Lampe_Links',false);
            setState('alias.0.Licht.Schlafzimmer_Lampe_Rechts',false);
    } else {
        if (getState('alias.0.Licht.Schlafzimmer_Lampe_Links').val == true) {
            setState('alias.0.Licht.Schlafzimmer_Lampe_Links',false);
        } else {
            setState('alias.0.Licht.Schlafzimmer_Lampe_Links',true);
        }
        if (getState('alias.0.Licht.Schlafzimmer_Lampe_Rechts').val == true) {
            setState('alias.0.Licht.Schlafzimmer_Lampe_Rechts',false);
        } else {
            setState('alias.0.Licht.Schlafzimmer_Lampe_Rechts',true);
 
        }            
    }
}
//===========================================================================================
//Fernbedienung Kai
//Kai PC aus
on ({id:'zigbee.0.003c84fffe0dcdbd.arrow_left_click', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {       
        if (getState('alias.0.Steckdosen.KaiPC').val == true) {
            setState('alias.0.Steckdosen.KaiPC',false);
        }
    }
})
//Kai PC an
on ({id:'zigbee.0.003c84fffe0dcdbd.arrow_right_click', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {       
        if (getState('alias.0.Steckdosen.KaiPC').val == false) {
            setState('alias.0.Steckdosen.KaiPC',true);
        }
    }
})
//Rollladen hoch + 10%
on ({id:'zigbee.0.003c84fffe0dcdbd.on', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {       
        setState('alias.0.Rollladen.Kai',getState('alias.0.Rollladen.Kai').val + 10);
    }
})
//Rollladen komplett hoch
on ({id:'zigbee.0.003c84fffe0dcdbd.brightness_move_up', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {   
        setState('alias.0.Rollladen.Kai',100);
    }
})
//Rollladen runter - 10%
on ({id:'zigbee.0.003c84fffe0dcdbd.off', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {   
        setState('alias.0.Rollladen.Kai',getState('alias.0.Rollladen.Kai').val -10);    
    }
})
//Rollladen komplett runter
on ({id:'zigbee.0.003c84fffe0dcdbd.brightness_move_down', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {   
        setState('alias.0.Rollladen.Kai',0);
    }
})

//===========================================================================================
//Fernbedienung Andy
//Lampe links
on ({id:'zigbee.0.003c84fffe9c5b11.arrow_left_click', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {   
        if (getState('alias.0.Licht.Schlafzimmer_Lampe_Links').val == true) {
            setState('alias.0.Licht.Schlafzimmer_Lampe_Links',false);
        } else {
            setState('alias.0.Licht.Schlafzimmer_Lampe_Links',true);
        }
    }
})
//Lampe rechts
on ({id:'zigbee.0.003c84fffe9c5b11.arrow_right_click', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {   
        if (getState('alias.0.Licht.Schlafzimmer_Lampe_Rechts').val == true) {
            setState('alias.0.Licht.Schlafzimmer_Lampe_Rechts',false);
        } else {
            setState('alias.0.Licht.Schlafzimmer_Lampe_Rechts',true);
        }
    }
})
//Rollladen hoch + 10%
on ({id:'zigbee.0.003c84fffe9c5b11.on', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {   
        setState('alias.0.Rollladen.Schlafzimmer',getState('alias.0.Rollladen.Schlafzimmer').val + 10);
    }
})
//Rollladen komplett hoch
on ({id:'zigbee.0.003c84fffe9c5b11.brightness_move_up', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {   
        setState('alias.0.Rollladen.Schlafzimmer',getState('alias.0.Rollladen.Schlafzimmer').val + 10);
    }
})
//Rollladen runter - 10%
on ({id:'zigbee.0.003c84fffe9c5b11.off', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {       
        setState('alias.0.Rollladen.Schlafzimmer',getState('alias.0.Rollladen.Schlafzimmer').val -10);    
    }
})
//Rollladen komplett runter
on ({id:'zigbee.0.003c84fffe9c5b11.brightness_move_down', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {   
        setState('alias.0.Rollladen.Schlafzimmer',0);
    }
})


//===========================================================================================
//Fernbedienung Tina
//Mittlere Taste
on ({id:'zigbee.0.842e14fffebaf7b5.toggle', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {   
        SwitchAllLights();
    }
})
//Lampe links
on ({id:'zigbee.0.842e14fffebaf7b5.arrow_left_click', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {
        if (getState('alias.0.Licht.Schlafzimmer_Lampe_Links').val == true) {
            setState('alias.0.Licht.Schlafzimmer_Lampe_Links',false);
        } else {
            setState('alias.0.Licht.Schlafzimmer_Lampe_Links',true);
        }   
    }
})
//Lampe rechts
on ({id:'zigbee.0.842e14fffebaf7b5.arrow_right_click', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {    
        if (getState('alias.0.Licht.Schlafzimmer_Lampe_Rechts').val == true) {
            setState('alias.0.Licht.Schlafzimmer_Lampe_Rechts',false);
        } else {
            
            setState('alias.0.Licht.Schlafzimmer_Lampe_Rechts',true);
        }
    }
})
//Rollladen hoch + 10%
on ({id:'zigbee.0.842e14fffebaf7b5.brightness_up_click', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {   
        setState('alias.0.Rollladen.Schlafzimmer',getState('alias.0.Rollladen.Schlafzimmer').val + 10);
    }
})
//Rollladen komplett hoch
on ({id:'zigbee.0.842e14fffebaf7b5.brightness_up_hold', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {       
        setState('alias.0.Rollladen.Schlafzimmer',getState('alias.0.Rollladen.Schlafzimmer').val + 10);
    }
})
//Rollladen runter - 10%
on ({id:'zigbee.0.842e14fffebaf7b5.brightness_down_click', change: 'ne'},(obj) => {
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {       
        setState('alias.0.Rollladen.Schlafzimmer',getState('alias.0.Rollladen.Schlafzimmer').val -10);    
    }
})
//Rollladen komplett runter
on ({id:'zigbee.0.842e14fffebaf7b5.brightness_down_hold', change: 'ne'},(obj) => {    
    if ((obj.state.ts-obj.oldState.ts) < Entprellzeit) {
        log ("Keine Aktion, da Taste geprellt hat: " + (obj.state.ts-obj.oldState.ts) + " ms");
    } else {       
        setState('alias.0.Rollladen.Schlafzimmer',0);
    }
})
