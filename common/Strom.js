
on({id: [].concat(Array.prototype.slice.apply($("state[id=*](functions=powermeasurement_alias)"))), change: "ne"}, function (obj) {
  //log ("-------------------------------------------------------");
  //PRO RAUM TUT NET GSCHEIT
  var value = obj.state.val;
  var oldValue = obj.oldState.val;
  var listWert
  var listwertsumme = 0
  var listWert_list = Array.prototype.slice.apply($("state[id=*](functions=powermeasurement_alias)"));
  //log(listWert_list);
  var roomsValues; //nimmt den Verbrauch pro Raum auf
  if (typeof(roomsValues) != "object")  { 
    roomsValues = [];
  }

  for (var listWert_index in listWert_list) {
    listWert = listWert_list[listWert_index];
    listwertsumme = listwertsumme + getState(listWert).val

    let room = getObject(listWert, 'rooms').enumNames[0]; //den Raum zum Wert holen
    //log("=====");
//    if (room == "Waschküche") {
//        log(room + "/" + listWert + "/" + getState(listWert).val);
//    }

    if (typeof(roomsValues[room]) == "number") {
        //log(roomsValues[room]);
        roomsValues[room]=roomsValues[room]+getState(listWert).val
        //log(roomsValues[room]);
    } else {
      roomsValues[room]=[];
      roomsValues[room]=0
    }
  }//
  
  //alle Werte schreiben
  //console.log(Math.round(listwertsumme));
  setState('0_userdata.0.PowerMeter.Werte.aktueller_Verbrauch',Math.round(listwertsumme));

  for (var room_index in roomsValues) {
//    if (room_index == "Waschküche") {
//        log (room_index + ": " + roomsValues[room_index])
//    }
    var roomName
    roomName=room_index.replace(" ","_")
    //log(roomName);
    setState ('0_userdata.0.PowerMeter.Werte.Verbrauch_'+roomName,roomsValues[room_index]);
  } 

});





//var numberOfLightsOn, listWert;

// Beschreibe diese Funktion …
async function countLightsOn() {
  numberOfLightsOn = 0;
  var listWert_list = Array.prototype.slice.apply($("state[id=*](functions=light)"));
  for (var listWert_index in listWert_list) {
    listWert = listWert_list[listWert_index];
    if (getState(listWert).val == true) {
      numberOfLightsOn = (typeof numberOfLightsOn == 'number' ? numberOfLightsOn : 0) + 1;
      console.log(getState(listWert).val);
    }
  }
  setState("0_userdata.0.status.Lights.countOn", numberOfLightsOn);
}


on({id: [].concat(Array.prototype.slice.apply($("state[id=*](functions=light)"))), change: "ne"}, async function (obj) {
  var value = obj.state.val;
  var oldValue = obj.oldState.val;
  await countLightsOn();
});

