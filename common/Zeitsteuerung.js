//const { on } = require('events');

function AmbilightShutdown() { 
    log("Ambilight Shutdown getriggert");
    if (getState('ping.0.iobroker.10_1_24_139').val) {
        //var node_ssh = require('node-ssh');
        //var ssh = new node_ssh();

        const node_ssh = require('node-ssh').NodeSSH;
        const ssh = new node_ssh();

        ssh.connect({ 
            host: '10.1.24.139', 
            username: 'pi', 
            password: 'Daijan' 
            }).then(() => { 
                ssh.execCommand("sudo shutdown"); 
        })
        //setStateDelayed('alias.0.Steckdosen.Ambilight', false,(1000*60*10)); //nach 10 Minuten Ambilight ausschalten     
    }
};

//CPAP
schedule('0 9 * * *', function(){setState('alias.0.Steckdosen.CPAP',false)});
schedule('0 21 * * *', function(){setState('alias.0.Steckdosen.CPAP',true)});

//Entertainment Oben
schedule('0 2 * * *', function(){setState('alias.0.Steckdosen.XBOX',false)});

//Entertainment Unten
schedule('0 2 * * *', function(){setState('alias.0.Steckdosen.Wohnzimmer_Entertainment',false)});

//Ambilight ausschalten
on({id: "Datenpunkte.0.Geräte.Wohnzimmer_Entertainment.Shutdown", change: "ne"},function(obj) {
    if (!obj.state.val) {
        AmbilightShutdown();
    } else {
        //setState('XXXXosen.Ambilight',true);
    } 
});
schedule('30 1 * * *', AmbilightShutdown);

//Leas Mond
on({id: 'alias.0.Licht.Lea_Mond',change: "ne"},function(obj) {
    if (obj.state.val) {
        setStateDelayed('alias.0.Licht.Lea_Mond',false,5400*1000); //1,5 Stunden später ausschalten
        log("Leas Mond wird in eineinhalb Stunden ausgeschaltet.");
    }
});

//Leas Lava
on({id: 'alias.0.Steckdosen.Lava',change: "ne"},function(obj) {
    if (obj.state.val) {
        setStateDelayed('alias.0.Steckdosen.Lava',false,5400*1000); //1,5 Stunden später ausschalten
        log("Leas Lavalampe wird in eineinhalb Stunden ausgeschaltet.");
    }
});


//Satanlage zusammen mit Entertainment an- und ausschalten
on({id: 'alias.0.Steckdosen.Wohnzimmer_Entertainment',change: "ne"}, function (obj) {
    setState('alias.0.Steckdosen.Satverteiler',obj.state.val)
});

//Dunstabzugshaube in Abhängigkeit des Automatikswitches 
on({id: 'alias.0.Fenster.Küche',change: "ne"},function(obj){
    if (getState('0_userdata.0.iQontrol.Switches.Dunstabzugshaubenautomatik').val) {
        setState('alias.0.Steckdosen.Dunstabzug',obj.state.val);
    }
});
//wenn die Automatik deaktiviert wird, dann Dunstabzug an, ansonsten ans Fenster koppeln
on({id: '0_userdata.0.iQontrol.Switches.Dunstabzugshaubenautomatik',change: "ne"},function(obj){
    if (obj.state.val) {
        setState('alias.0.Steckdosen.Dunstabzug',getState('alias.0.Fenster.Küche').val);
    } else {
        setState('alias.0.Steckdosen.Dunstabzug',true);        
    }
});
