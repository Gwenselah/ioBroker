//Info, dass das Netzwerk ausgeht
function WarnKai(){
//Esszimmer:
    //setState("alexa2.0.Echo-Devices.G2A0U2048495012U.Commands.speak-volume",35);
    //setState("alexa2.0.Echo-Devices.G2A0U2048495012U.Commands.speak","Hallo Kai. Denke dran. In 15 Minuten wird das Netzwerk abgeschaltet.");          

//Kai:
    setState("alexa2.0.Echo-Devices.G0911M0793154C71.Commands.speak-volume",35);
    setState("alexa2.0.Echo-Devices.G0911M0793154C71.Commands.speak","Hallo Kai. Denke dran. In 15 Minuten wird das Netzwerk abgeschaltet.");          
}

function DisableKaisNetwork(){
    setState("unifi.0.default.clients.d8:43:ae:cb:9d:9d.blocked",true); //PC
//    setState("unifi.0.default.clients.92:28:a6:a6:fe:cb.blocked",true); //Handy
//    setState("unifi.0.default.clients.82:c8:62:c1:69:23.blocked",true); //Handy alt

}

function EnableKaisNetwork(){
    setState("unifi.0.default.clients.d8:43:ae:cb:9d:9d.blocked",false); //PC
//    setState("unifi.0.default.clients.92:28:a6:a6:fe:cb.blocked",false); //Handy
//    setState("unifi.0.default.clients.82:c8:62:c1:69:23.blocked",false); //Handy alt

}

//Deckenlicht soll nach 30 Minuten ausgehen
function SwitchKaisDeckenlichtOff(){
    if (getState('alias.0.Licht.Kai_Deckenlicht').val) {
        const currentHour = new Date().getHours();
        if (currentHour >= 0 && currentHour < 6) {
            setStateDelayed('alias.0.Licht.Kai_Deckenlicht', false, 30 * 60*1000);
            log ('Kais Deckenlampe wird in 30 Minuten ausgeschaltet');
        }    
    }    
}
on({id: 'alias.0.Licht.Kai_Deckenlicht', change: 'ne'}, function (obj) {
    SwitchKaisDeckenlichtOff
});
schedule('1 0 * * *', SwitchKaisDeckenlichtOff);




schedule('45 21 * * *', WarnKai);
//WarnKai();

schedule('1 22 * * 0-4', DisableKaisNetwork); //unter der Woche
schedule('1 23 * * 5,6', DisableKaisNetwork); //unter der Woche
schedule('1 16 * * *', EnableKaisNetwork);