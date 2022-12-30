on({id: 'telegram.0.communicate.request', change: 'any'}, function (obj) {
    var stateval = getState('telegram.0.communicate.request').val;              // Statevalue in Variable schreiben
    var benutzer = stateval.substring(1,stateval.indexOf("]"));                 // Benutzer aus Statevalue extrahieren
    var befehl = stateval.substring(stateval.indexOf("]")+1,stateval.length);   // Befehl/Text aus Statevalue extrahieren

if (befehl.substring(0,1) !== "%") {
    sendTo('telegram', {
        user: benutzer,
        text: 'Für welchen Raum möchtest du den Status abfragen?',
        reply_markup: {
            inline_keyboard: [
//                    [{ text: 'alle Räume', callback_data: '%Status'}],
                [{ text: 'Wohnzimmer', callback_data: '%StatusWohnzimmer'}],
                [{ text: 'Flur', callback_data: '%StatusFlur'}],
                [{ text: 'Terrasse', callback_data: '%StatusTerrasse'}],
                [{ text: 'Garten', callback_data: '%StatusGarten'}],
            ]
            }
    });
    } else if (befehl === "%StatusWohnzimmer") {
            sendTo('telegram', {
            user: benutzer,
            text: 
                    'Schranklicht ' + 
                    ' %\nWohnzimmerlicht ' +
                    ' %\nEsszimmerlicht ' + 
                    '\nSteckdose Laptop ' + 
                    '\nSteckdose Tablet ' + 
                    '\nTerrassentür '
//            ,
  //          showAlert: true
            
        });
    } 

});
/*


on({id: "telegram.0.communicate.request", change: 'any'}, function(obj){
    log("1");
    var stateval = getState('telegram.0.communicate.request').val;
    var benutzer = stateval.substring(1,stateval.indexOf("]"));     
    var command  = stateval.substring(stateval.indexOf("]")+1,stateval.length);   
    log(command);
        sendTo('telegram.0', {
            user: benutzer,
            answerCallbackQuery: {
                text: command,
                showAlert: false // Optional parameter
            }
    });
});


/*
var KeyAr = [
            ['TV', ''],
            ['LEDs an', 'LEDs aus'],
            ['Computer an', 'Computer aus'],
            ['Diesel Preise', ''],
        ]

sendTo('telegram.0', {
    text:   'Bitte wähle ein Button',
    benutzer: "Andy",
    reply_markup: {
        inline_keyboard: KeyAr,
        resize_keyboard:   false,
        one_time_keyboard: true
    }
});*/

/*

    sendTo('telegram.0', {
        chatId: getState("telegram.0.communicate.requestChatId").val,
        text:   Frage,
        reply_markup: {
            inline_keyboard: KeyboardArray,
            resize_keyboard:   false, 
            one_time_keyboard: true
        }
    });

Rollladen.forEach(function(element) {



        if (element.Ort == "Wohnzimmer" || element.Ort == "Esszimmer") {
			if (element.Objekt.includes("alexa")) {
                //console.log ("Setze Alexa Gerät auf Pause");
                var AlexaPause = (element.Objekt).replace(".volume",".controlPause");                       
                setState(AlexaPause, true); //den Pauseknopf drücken
			} else {
				setState(element.Objekt, false);
			}
		};			

        */