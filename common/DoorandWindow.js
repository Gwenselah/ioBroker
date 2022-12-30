
// Kai Fenster rechte
on({id: new RegExp("shelly.0.SHDW-2#C9445B#1\.[a-zA-Z0-9]"), change:"ne"}, function (obj) {
  var value = obj.state.val;
  var oldValue = obj.oldState.val;
  var DatenpunktName = obj.id;
  if (DatenpunktName.includes("sensor.door")) {
    if (value) { //true = Fenster offen
      log ("Fenser offen");      
    } else {
      log ("Fenser geschlossen");
    }

  } 

  if (DatenpunktName.includes("sensor.tilt")) {
    log("Tilt:" + value);
    if (value >4 ) { //Fenster gekippt
      log ("Fenser gekippt");      
    } else {
      log ("Fenser geschlossen");
    }

  } 


  /*
  sendTo("telegram", "send", {
      text: (['Geänderter Datenpunkt:',obj.id,'\n','Neuer Wert:',(obj.state ? obj.state.val : "")].join(''))
  });*/
  //log (obj.id);
});