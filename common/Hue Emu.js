/**
 * Status setzen, falls Wert bisher anders
 */
function statusSetzenFallsAnders(id, status) {
    if (getState(id).val != status)
        setState(id, status);
}
 
//-- Ein-/Ausschalten von Leinwand

on ({id: "hueemu.0.2.state.on", change: "ne"}, 
    function(obj){
        statusSetzenFallsAnders('alias.0.Licht.Leinwand', obj.state.val);
    }
);
on ({id: 'alias.0.Licht.Leinwand', change: "ne"}, 
    function(obj){
        statusSetzenFallsAnders("hueemu.0.2.state.on", obj.state.val);
    }
);

//-- Ein-/Ausschalten von Parkett

on ({id: "hueemu.0.1.state.on", change: "ne"}, 
    function(obj){
        statusSetzenFallsAnders('alias.0.Licht.Parkett', obj.state.val);
    }
);
on ({id: 'alias.0.Licht.Parkett', change: "ne"}, 
    function(obj){
        statusSetzenFallsAnders("hueemu.0.1.state.on", obj.state.val);
    }
);

//-- Ein-/Ausschalten von Lounge

on ({id: "hueemu.0.3.state.on", change: "ne"}, 
    function(obj){
        statusSetzenFallsAnders('alias.0.Licht.Lounge', obj.state.val);
    }
);
on ({id: 'alias.0.Licht.Lounge', change: "ne"}, 
    function(obj){
        statusSetzenFallsAnders("hueemu.0.3.state.on", obj.state.val);
    }
);

//-- Ein-/Ausschalten von LED Sttripes

on ({id: "hueemu.0.4.state.on", change: "ne"}, 
    function(obj){
        statusSetzenFallsAnders('wled.0.8c4b14a6ded4.on', obj.state.val);
    }
);
on ({id: 'wled.0.8c4b14a6ded4.on', change: "ne"}, 
    function(obj){
        statusSetzenFallsAnders("hueemu.0.4.state.on", obj.state.val);
    }
);
on ({id: 'hueemu.0.4.state.bri', change: "ne"}, 
    function(obj){
        statusSetzenFallsAnders("wled.0.8c4b14a6ded4.bri", obj.state.val);
    }
);
on ({id: "wled.0.8c4b14a6ded4.bri", change: "ne"}, 
    function(obj){
        statusSetzenFallsAnders('hueemu.0.4.state.bri', obj.state.val);
    }
);
