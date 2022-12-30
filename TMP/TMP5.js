on({id: 'fakeroku.0.ioBroker.keys.Info' , change:'ne'},function(obj) {
    log('Start');
    if (obj.state.val) {
        log('Info true')
    } else {
        log ('Info false')
    }
})


//to /keypress/Info from
/*
var command = "";
command = "/keypress/Info"
var m;
    m = command.match(/^\/([^\/]+)\/(\S+)$/);
    log ("M1: " + m[1]);
    log ("M2: " + m[2]);
*/