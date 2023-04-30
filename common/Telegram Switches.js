
function SendHelpMessage(benutzer){
	    sendTo('telegram.0', {        
        text:   'Bitte drücke einen Knopf',
		user: benutzer,
        reply_markup: {
			keyboard: [
				['Alexa Befehle', 'Alle Alexas aus'],
				['Fenster','Menu','Müll'],
				['Status','Rollläden'],
                ['Tanken','Temperaturen','Wetter']
			],			
            resize_keyboard:   false, 
            one_time_keyboard: true
        }
    }); 	
    return;
}	

/**
 * Prüft ob Variableninhalt eine Zahl ist.
 * isNumber ('123'); // true  
 * isNumber ('123abc'); // false  
 * isNumber (5); // true  
 * isNumber ('q345'); // false
 * isNumber(null); // false
 * isNumber(undefined); // false
 * isNumber(false); // false
 * isNumber('   '); // false
 * @source https://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
 * @param {any} n     Variable, die zu prüfen ist auf Zahl
 * @return {boolean}  true falls Zahl, false falls nicht.
  */
 function isNumber(n) { 
    return /^-?[\d.]+(?:e-?\d+)?$/.test(n); 
}

function AlexaAllPause() {
// Gibt State-IDs zurück für Pause, z.B. alexa2.0.echo-devices.XXXXXXXXXXXXXXXX.Player.controlPause
//alexa2.0.Echo-Devices.G2A0U2048495012U.Player.controlPause
// Siehe auch Doku zu Selector: https://github.com/ioBroker/ioBroker.javascript/blob/master/doc/en/javascript.md#---selector

    var mSelector = $('[id=^alexa2.0.Echo-Devices.*.Player.controlPause]');
    //log(mSelector.length);
    mSelector.each(function(id, i) {
        //Nun haben wir mit "id" die State-ID, z.B. alexa2.0.echo-devices.XXXXXXXXXXXXXXXX.Player.controlPause

        // Name des Gerätes abfragen
        var deviceID = id.substring(0,id.length-20); // get Device by removing last 20 chars (.Player.controlPause)
        var deviceName = getObject(deviceID).common.name;
    
        // Jetzt können wir alle auf Pause schalten
        setState(id, true);
        log('Alexa: ' + deviceName + ' auf Pause gesetzt.');
    });
	
	//Zweite Alexa Instanz
    var mSelector = $('[id=^alexa2.1.Echo-Devices.*.Player.controlPause]');
    //log(mSelector.length);
    mSelector.each(function(id, i) {
        //Nun haben wir mit "id" die State-ID, z.B. alexa2.0.echo-devices.XXXXXXXXXXXXXXXX.Player.controlPause

        // Name des Gerätes abfragen
        var deviceID = id.substring(0,id.length-20); // get Device by removing last 20 chars (.Player.controlPause)
        var deviceName = getObject(deviceID).common.name;
    
        // Jetzt können wir alle auf Pause schalten
        setState(id, true);
        log('Alexa: ' + deviceName + ' auf Pause gesetzt.');
    });

};

function DistinctKeyValues(Array, Key) {
    var unique = {};
    var distinct = [];

    for( var i in Array ){
        if (!Array[i].selection) { continue; }
        if( typeof(unique[Array[i][Key]]) == "undefined"){
            distinct.push(Array[i][Key]);
        }
        unique[Array[i][Key]] = 0;
    }
return distinct;
}

function ArrayDeselectKeyValues(Array, Key, Value) {
    for( var i in Array ) {
        if (Array[i][Key] != Value) {
            Array[i].selection = false;
        }
    }    
return Array;
}

function Array2ID(Array, Key, Value) {
    for( var i in Array ) {
        if (Array[i][Key] == Value) {
            break;
        }
    }
return i;
}

function Key2Keyboard(Array, Key) {
    Distinct = [], OuterArray = []; 
    Distinct = DistinctKeyValues(Array, Key);

    for( var i in Distinct ){
        InnerArray = [];
        item = {};
        item.text          = Distinct[i];
        item.callback_data = "___" + Key + ","+ Distinct[i];
        InnerArray.push(item);
        OuterArray.push(InnerArray);
    }
return OuterArray;    
}

function SwitchKeyboard(Array, Key, Value) {
    Distinct = [], OuterArray = []; 
    Distinct = ['an', 'aus'];

    for( var i in Distinct ){
        InnerArray = [];
        item = {};
        item.text          = Distinct[i];
        item.callback_data = "___" + Key + ","+ Distinct[i];
        InnerArray.push(item);
        OuterArray.push(InnerArray);
    }
return OuterArray;    
}

function MenuFrageKey(Frage, Key, Array) {
    MenuFrage(Frage, Array, Key2Keyboard(Array, Key));
}

function MenuFrageDevice(ID, Array) {
    Objekt = Array[ID].Objekt;
    Status=getState(Objekt).val;
    // console.log ("Status: " + Status);
    // console.log ('Role:' + getObject(Objekt).common.role);
    if (getObject(Objekt).common.role == "level.volume") {
            MenuFrage("Lautstärke von " + Array[ID].Name + ": " + Status + ".\nWas wollen Sie tun?",Array, SwitchKeyboard(Array, '*'+Array[ID].Name, Array[ID].Name));       
    } else {
        if (Status == Array[ID].an) {
            MenuFrage("Status von " + Array[ID].Name + ": eingeschaltet.\nWas wollen Sie tun?",Array, SwitchKeyboard(Array, '*'+Array[ID].Name, Array[ID].Name));
        } 
        else {
            MenuFrage("Status von " + Array[ID].Name + ": ausgeschaltet.\nWas wollen Sie tun?",Array, SwitchKeyboard(Array, '*'+Array[ID].Name, Array[ID].Name));
        }
    }
}

function MenuFrage(Frage, Array, KeyboardArray) {
    sendTo('telegram.0', {
        chatId: getState("telegram.0.communicate.requestChatId").val,
        text:   Frage,
        reply_markup: {
            inline_keyboard: KeyboardArray,
            resize_keyboard:   false, 
            one_time_keyboard: true
        }
    });
return;    
}

function MenuAntwortDeselect(Array, Key, Value) {
    MenuAntwort(Array, Key, Value);
    ArrayDeselectKeyValues(Array, Key, Value);
}

function MenuAntwort(Array, Key, Value) {
    sendTo('telegram.0', {
        chatId: getState("telegram.0.communicate.requestChatId").val,
        text: Key + ': ' + Value,
        editMessageText: {
            options: {
                chat_id: getState("telegram.0.communicate.requestChatId").val,
                message_id: getState("telegram.0.communicate.requestMessageId").val,
            }
        }
    });
return Array;
}

on({id: "telegram.0.communicate.request", change: 'any'}, function (obj) {
//on({id: "telegram.0.communicate.request", ack: false, change: 'any'}, function (obj) {
    command = obj.state.val.substring(obj.state.val.indexOf(']')+1);
    console.log("Received: " + command);
	var benutzer = obj.state.val.substring(1, obj.state.val.indexOf("]"));
    //console.log ("Benutzer:" + benutzer)
    // Menü beginnen
    var Tmpvalues = command.split(" ");
    var cmdFirstWord = Tmpvalues[0].toUpperCase();
    if (cmdFirstWord == "ALEXA") {
        cmd = "ALEXASAY";
        var TexttoSay = command.substring(6);
        setState("0_userdata.0.Hilfsdatenpunkte.AlexaTexttoSay",TexttoSay);
    } else {
        var cmd = command.toUpperCase();
    }
    var TelegramText="";

    switch (cmd) {
        case "HILFE":
            SendHelpMessage(benutzer);
            break;
        case "ALEXA BEFEHLE":
            TelegramText = "Folgende Sprachkommandos sind implementiert: \n" +
              "... schalte XYZ (GASTWlan, Wohnzimmer Ecklampe,...) an. \n" + 
              "";
       		sendTo('telegram', {
					user: benutzer,
					text: TelegramText,
				});   
            break; 
        case "ROLLLÄDEN":
//            log ("Rollladen");
            sendTo('telegram', {
					user: benutzer,
					text: "Welchen Rollladen willst Du steuern?",
					reply_markup: {
						inline_keyboard: Rollladen,
                        resize_keyboard:   false, 
                        one_time_keyboard: true

					}
				});   
            break;                      
        case "TEST":
            TelegramText = "Water Leak: " + getState('zigbee.0.00158d0002795a9b.detected').val + " / Qual: " +getState('zigbee.0.00158d0002795a9b.link_quality').val;
            TelegramText = TelegramText + "\n Door Open: " + getState('zigbee.0.00158d0002ca0dfa.opened').val + " / Qual: " +getState('zigbee.0.00158d0002ca0dfa.link_quality').val;
            TelegramText = TelegramText + "\n Temperatur: " + getState('zigbee.0.00158d0002b533fa.temperature').val + " / Qual: " +getState('zigbee.0.00158d0002b533fa.link_quality').val;
            TelegramText = TelegramText + "\n Temperatur: " + getState('zigbee.0.00158d0002b534e2.temperature').val + " / Qual: " +getState('zigbee.0.00158d0002b534e2.link_quality').val;
    		sendTo('telegram', {
					user: benutzer,
					text: TelegramText,
				});   
            break;
        case "TANKEN":
            TelegramText = "";
            for (var i = 0; i < 9;i++) {
            	var StationName = "tankerkoenig.0.stations." + i + ".name";
            	var StationStatus = "tankerkoenig.0.stations." + i + ".status";
            	var StationDiesel = "tankerkoenig.0.stations." + i + ".diesel.short";
            	var StationE10 = "tankerkoenig.0.stations." + i + ".e10.short";
            	var StationE5 = "tankerkoenig.0.stations." + i + ".e5.short";
            	if (StationName != "") {
                	TelegramText = TelegramText + "<b>" + getState(StationName).val + "</b> (" + getState(StationStatus).val + ")";
                	if (getState(StationStatus).val == "open") {
						TelegramText = TelegramText + ": \n Diesel: ";
						if (getState(StationDiesel).val == 0) {
							TelegramText = TelegramText + "==";
						} else {
							TelegramText = TelegramText + getState(StationDiesel).val +"9€";
						}
						
						TelegramText = TelegramText + " E5: ";						
						if (getState(StationE5).val == 0) {
							TelegramText = TelegramText + "==";
						} else {
							TelegramText = TelegramText + getState(StationE5).val +"9€";
						}
						
						TelegramText = TelegramText + " E10: ";
						
						if (getState(StationE10).val == 0) {
							TelegramText = TelegramText + "==";
						} else {
							TelegramText = TelegramText + getState(StationE10).val +"9€";
						}
						
						TelegramText = TelegramText + " \n";
						
                	} else {
                	  TelegramText = TelegramText + " \n";  
                	}
                	TelegramText = TelegramText + "\n";
                }
            };
            sendTo('telegram', {
				user: benutzer,
				text: TelegramText,
                parse_mode: "HTML"
			});    
            break;
		case "ALLE ALEXAS AUS":
			AlexaAllPause();
			sendTo('telegram', {
				user: benutzer,
				text: "Alle Alexa Geräte wurden auf Pause gesetzt",
                parse_mode: "HTML"
			});  
			break;
        case "MÜLL":
            TelegramText = "<b>Altpapier</b>: " + getState("Datenpunkte.0.Wertstoffe.Papier").val + " (" +
                + getState("Datenpunkte.0.Wertstoffe.Papier_Resttage").val + " Tage) \n" +
                "<b>Bio</b>: " + getState("Datenpunkte.0.Wertstoffe.Bio").val + " (" +
                + getState("Datenpunkte.0.Wertstoffe.Bio_Resttage").val + " Tage) \n" +
                "<b>Restmüll</b>: " + getState("Datenpunkte.0.Wertstoffe.Restmüll").val + " (" +
                + getState("Datenpunkte.0.Wertstoffe.Restmüll_Resttage").val + " Tage) \n" +
                "<b>Wertstoffe</b>: " + getState("Datenpunkte.0.Wertstoffe.Wertstoffe").val + " ("
                + getState("Datenpunkte.0.Wertstoffe.Wertstoffe_Resttage").val + " Tage) \n";
            sendTo('telegram', {
				user: benutzer,
				text: TelegramText,
                parse_mode: "HTML"
			});    
            break;
        case "STATUS":
            TelegramText = "Der Status der Geräte ist: \n";
            for (var i=0; i<SwitchDevices.length;i++) {
                var statetext = getState(SwitchDevices[i].Objekt).val;
                if (!isNumber(statetext)) {
                    if (statetext) {statetext = "an"};
                    if (!statetext) {statetext = "aus"};
                }
                TelegramText = TelegramText + (SwitchDevices[i].Ort) + " - " + (SwitchDevices[i].Name) + ": " + statetext + "\n";
            }
            sendTo('telegram', {
                user: benutzer,
                text: TelegramText,
            });  
            break;
        case "ALEXASAY":
            sendTo('telegram', {
                user: benutzer,
                text: "Welche Alexa soll reden?",
                reply_markup: {
                    inline_keyboard: Alexas,
                    resize_keyboard:   false, 
                    one_time_keyboard: true
    
                }
            });               
            break;            
        case "FENSTER":
            TelegramText = "Der Status der Geräte ist: \n";
            if (getState('iqontrol.0.Lists.offene Fenster + Tueren.offen').val >0) {
                TelegramText = "Folgende Fenster oder Türen sind geöffnet: \n" 
                    + (getState('iqontrol.0.Lists.offene Fenster + Tueren.offen_NAMES_LIST').val);
                
            } else {
                TelegramText = "Es sind keine Fenster oder Türen geöffnet :-)";
            }
            sendTo('telegram', {
                user: benutzer,
                text: TelegramText,
            });  
            break;
        case "WETTER":
            break;    
        case "TEMPERATUREN":
            TelegramText = "Die Temperaturen sind: \n";
            //Hole alle Temperatursensoren
            var temperatures = getObject("enum.functions.temperaturen_alias").common.members; 
            temperatures?.sort();
            for(let i = 0; i < temperatures.length; i++) {                
                //ermittle die Temperatur und den Raum (genauer: die Aufzählungsid des Raumes)	
                var temperature = getState(temperatures[i]).val;

                TelegramText = TelegramText + (temperatures[i].split("_")[1]) + ": " + temperature + " °C \n";
            }
            sendTo('telegram', {
                user: benutzer,
                text: TelegramText,
            });              

			break;
        case (cmd.startsWith("ALEXA")):
            break;            
		case "MENU":
        case "MENÜ":
			//Reset previous selections
			for( var i in SwitchDevices ){
				SwitchDevices[i].selection=true;
			}
			MenuFrageKey('Wo willst du etwas tun?', 'Ort', SwitchDevices);
			break;
		default: 
            //console.log("DEFAULT");
            //=== MENÜ ========================================================================================
			if (command.startsWith("___")) {
				command = command.slice(3,command.length); 
				var KeyVal = command.split(",");
				var Key   = KeyVal[0];
				var Value = KeyVal[1];

				if (Key == 'Ort') {
					MenuAntwortDeselect(SwitchDevices, Key, Value);
					MenuFrageKey('Welches Gerät willst du steuern?', 'Name', SwitchDevices);
				}
				else if (Key == 'Name') {
					MenuAntwortDeselect(SwitchDevices, Key, Value);
					ID=Array2ID(SwitchDevices, Key, Value);
					MenuFrageDevice(ID, SwitchDevices);
				}
				else if (Key.startsWith("*")) {
					Key=Key.slice(1,Key.length);
					ID=Array2ID(SwitchDevices, 'Name', Key);
                    setState(SwitchDevices[ID].Objekt, SwitchDevices[ID][Value]);
                    //console.log ("Type of: " + typeof(SwitchDevices[ID][Value])); Ermittelt den Typ						
					console.log("+++ Setze: "+SwitchDevices[ID].Name + " in: " + SwitchDevices[ID].Ort + " auf: "+ SwitchDevices[ID][Value]+" +++");
					
					//Alexa Sonderlocke
                    //console.log ("Test:" + (SwitchDevices[ID].Objekt.includes("alexa")));
					if (SwitchDevices[ID].Objekt.includes("alexa")) {
                        if (SwitchDevices[ID][Value] === 0) {
                            //console.log ("Setze Alexa Gerät auf Pause");
                            var AlexaPause = (SwitchDevices[ID].Objekt).replace(".volume",".controlPause");                       
                            setState(AlexaPause, true); //den Pauseknopf drücken
                        } else {
                            //console.log ("Setze Alexa Gerät auf Play");
                            var AlexaPlay = (SwitchDevices[ID].Objekt).replace(".volume",".controlPlay");                       
                            setState(AlexaPlay, true); //den Pauseknopf drücken                           
                        }
					} 	

                    // console.log (SwitchDevices[ID][Value]);
                    // console.log (Value);
                    if ((SwitchDevices[ID][Value] === false) || (SwitchDevices[ID][Value] === true)) {
                        MenuAntwort(SwitchDevices, SwitchDevices[ID].Name, Value);
                    } else {
					    MenuAntwort(SwitchDevices, SwitchDevices[ID].Name, SwitchDevices[ID][Value]);
                    }
				}
				else {
					console.log("Else: ___" + command);
				}
			}
			else {
					console.log("Else: " + command);
            //=== ROLLLADEN ===================================================================================    
                var cmdSelector = command.substring(0,1);                
                if (cmdSelector === "%") {                        
                    //log("Rollläden gefunden");

                    var RollladenSwitch=[
                        {text: "zu", callback_data: "§" + command + "$zu"},
                        {text: "25%", callback_data: "§" + command + "$25"},
                        {text: "50%", callback_data: "§" + command + "$50"},
                        {text: "75%", callback_data: "§" + command + "$75"},
                        {text: "auf", callback_data: "§" + command + "$auf"}
                    ];
                    sendTo('telegram', {
                        user: benutzer,
                        text: "Du hast >" + command.substring(1) + "< gewählt. \n Welche Position soll der Rollladen einnehmen?",
                        reply_markup: {
                            inline_keyboard: [RollladenSwitch],
                            resize_keyboard:   false, 
                            one_time_keyboard: true

                        }
                    });   
                } else if (cmdSelector === "§") {         
                   log ("Rollladen Switch: " + command);  
                    //$ finden
                    var Divider = command.indexOf("$");
                    var Rollo = command.substring(2,Divider);
                    var RolloState = command.substring(Divider+1);
                    if (RolloState =="auf") {RolloState = "100"};
                    if (RolloState =="zu") {RolloState = "0"};
                    //log(Divider);
                    //log(">"+Rollo+"<");
                    //log(RolloState);

                    //find Objekt Attribut
                    
                    for (var i=0;i<Rollladen.length; i++) {
                        if (Rollladen[i][0].text == Rollo)  {                                
                            setState(Rollladen[i][0].Objekt,parseInt(RolloState));
                            log(">" + Rollo + "< auf Position " + RolloState + " gesetzt.");
                            sendTo('telegram', {
                                user: benutzer,
                                answerCallbackQuery: {
                                text: ">" + Rollo + "< auf Position " + RolloState + " gesetzt.", 
                                showAlert: false // Optional parameter
                                }
                            })
                        }      
                    };
            //=== ALEXA TEXT ==================================================================================    
                } else if (cmdSelector === "?") {         

                    command = command.slice(1,command.length); 

                    for (var i=0;i<Alexas.length; i++) {
                        if (Alexas[i][0].text == command) {  
                            //Alexa-Gerät Objektbasis ermitteln
                            //Quelle ist: alexa2.1.Echo-Devices.G0911M0793154C71.Player.volume
                            //benötigt wird:
                            //alexa2.0.Echo-Devices.G2A0U2048495012U.Commands.speak
                            //alexa2.0.Echo-Devices.G2A0U2048495012U.Commands.speak-volume

                            var tmpObjectArray=Alexas[i][0].Objekt.split(".");
                            var Objectbase = tmpObjectArray[0]+"."+tmpObjectArray[1]+"."+tmpObjectArray[2]+"."+
                                tmpObjectArray[3]+".Commands.";
                            
                            setState(Objectbase+"speak-volume","35");
                            setState(Objectbase+"speak",getState("0_userdata.0.Hilfsdatenpunkte.AlexaTexttoSay").val);          
                        }      
                    };                

                    sendTo('telegram', {
                        user: benutzer,
                        answerCallbackQuery: {
                        text: "Nachricht wurde an >" + command + "< gesendet.", 
                        showAlert: false // Optional parameter
                        }
                    })

                } else {
                    SendHelpMessage(benutzer);
                }
			}
 
    }
    });
 