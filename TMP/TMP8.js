
sendTo('telegram', {
    user: "Andy",
    text: "Tippe eine Zeile an:",
    reply_markup: {
        inline_keyboard: [[{ text: 'Klappe halten', callback_data: 'Alexa Klappe halten'}], [{ text: 'Ich bin gut', callback_data: 'Alexa Ich bin gut'}]]
    }
});

stopScript("");



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