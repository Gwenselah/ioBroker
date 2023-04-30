
on({id: [].concat(Array.prototype.slice.apply($("state[id=*](functions=powermeasurement_alias)"))), change: "ne"}, async function (obj) {
  var value = obj.state.val;
  var oldValue = obj.oldState.val;
  var listWert
  var listwertsumme = 0
  var listWert_list = Array.prototype.slice.apply($("state[id=*](functions=powermeasurement_alias)"));
  for (var listWert_index in listWert_list) {
    listWert = listWert_list[listWert_index];
    listwertsumme = listwertsumme + getState(listWert).val

  }//
  //console.log(Math.round(listwertsumme));
  setState('0_userdata.0.PowerMeter.Werte.aktueller_Verbrauch',Math.round(listwertsumme));

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

