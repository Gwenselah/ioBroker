
var shutters = getObject("enum.functions.rollladen_alias").common.members;
for(let i = 0; i < shutters.length; i++) {
    var shutter = getState(shutters[i]).val;
    log (shutters[i]);
    log (shutter);
}

