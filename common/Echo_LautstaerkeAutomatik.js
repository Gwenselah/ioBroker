
var Devices = [
    { Name: "Echo Dot Kai", MusicVolume: "alexa2.0.Echo-Devices.G090LF1175040F6A.Player.volume", CommandVolume: "alexa2.0.Echo-Devices.G090LF1175040F6A.Commands.speak-volume", VolumeSets:"Datenpunkte.0.Geräte.Echo_Kai"},
    { Name: "Echo Plus Wohnzimmer", MusicVolume: "alexa2.0.Echo-Devices.G2A0U2048495012U.Player.volume", CommandVolume: "alexa2.0.Echo-Devices.G2A0U2048495012U.Commands.speak-volume", VolumeSets:"Datenpunkte.0.Geräte.Echo_WZ"},
];

var DeviceNo = 1;

function meineFunktion() {
   console.log ("Meine Funktion");
}

/*  ---   MAIN    ---   */
var Device = Devices[DeviceNo];
console.log (Device.Name);

/*  --- DayStart ---  */
var DayStartDatapoint = Device.VolumeSets+".VolumeSetDayStart";
var DayStart = getState(DayStartDatapoint).val.split(':');
console.log ("+++ DayStart: " + DayStart+" +++");

function SetDayStartVolume() {
   console.log ("+++ DayStart: Aufruf SetDayStartVolume +++");
}

var DayStarttimer = schedule(DayStart[1] + ' ' + DayStart[0] + ' * * 0-6', SetDayStartVolume);
console.log ("+++ DayStart: Timer gesetzt +++");

on(DayStartDatapoint, function(dp) {  // Trigern bei Änderung
    DayStart = getState(DayStartDatapoint).val.split(':');
    clearSchedule(DayStarttimer);   // altes Schedule löschen
    DayStarttimer = schedule(DayStart[1] + ' ' + DayStart[0] + ' * * 0-6', SetDayStartVolume);
    console.log ("+++ DayStart: Timer geändert: " + DayStart+" +++");
});

/*  --- DayEnd ---  */
var DayEndDatapoint = Device.VolumeSets+".VolumeSetDayEnd";
var DayEnd = getState(DayEndDatapoint).val.split(':');
console.log ("+++ DayEnd: " + DayEnd+" +++");

function SetDayEndVolume() {
   console.log ("+++ DayEnd: Aufruf SetDayEndVolume +++");
}

var DayEndtimer = schedule(DayEnd[1] + ' ' + DayEnd[0] + ' * * 0-6', SetDayEndVolume);
console.log ("+++ DayEnd: Timer gesetzt +++");

on(DayEndDatapoint, function(dp) {  // Trigern bei Änderung
    DayEnd = getState(DayEndDatapoint).val.split(':');
    clearSchedule(DayEndtimer);   // altes Schedule löschen
    DayEndtimer = schedule(DayEnd[1] + ' ' + DayEnd[0] + ' * * 0-6', SetDayEndVolume);
    console.log ("+++ DayEnd: Timer geändert: " + DayEnd+" +++");
});

/*
var zu = getState("javascript.0.Jalousien.Konfig.Zeit_Schliessen").val.split(':');
 
function meineFunktion() {
   ...
}
 
var timer = schedule(zu[1] + ' ' + zu[0] + ' * * 0-6', meineFunktion);
 
on("javascript.0.Jalousien.Konfig.Zeit_Schliessen", function(dp) {  // Trigern bei Änderung
   zu = dp.state.val.split(':');
   clearSchedule(timer);   // altes Schedule löschen
   timer = schedule(zu[1] + ' ' + zu[0] + ' * * 0-6', meineFunktion);
});*/
