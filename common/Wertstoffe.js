on({id: "ical.0.data.table", change: "ne"}, function (obj) { UpdateWertstoffeTermine(); });

function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // note parts[1]-1
  return new Date(parts[2], parts[1]-1, parts[0]);
}

// Differenz in Tagen zwischen heute und dem Abfuhrtag berechnen
function dateDiff(datestring) {
    var today = new Date();
    var date = new Date(parseDate(datestring));
    date.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    var d1 =  (date.getTime() / 1000) /86400;
    var d2 =  (today.getTime() / 1000) /86400;

    var days = Math.floor(d1) - Math.floor(d2);
    return days;
}

function UpdateWertstoffeTermine() {
    var TerminWertstoffe = "";
    var TerminPapier = "";
    var TerminBio = "";
    var TerminRest = "";
    var Wertstoffe_Resttage = 0;
 
    var Termine = getState("ical.0.data.table").val;
 
    for (var i in Termine) {
        var Termin = Termine[i];
 
        if ( Termin.event == "Restmüll" && TerminRest == "" ) {
            TerminRest = Termin.date;
        }
         
        if ( Termin.event == "Biomüll" && TerminBio == "" ) {
            TerminBio = Termin.date;
        }
         
        if ( Termin.event == "Papier" && TerminPapier == "" ) {
            TerminPapier = Termin.date;
        }
         
        if ( Termin.event == "Wertstoffe" && TerminWertstoffe == "" ) {
            TerminWertstoffe = Termin.date;
        }
    }
 
    setState('Datenpunkte.0.Wertstoffe.Restmüll', TerminRest);
    setState('Datenpunkte.0.Wertstoffe.Bio', TerminBio);
    setState('Datenpunkte.0.Wertstoffe.Papier', TerminPapier);
    setState('Datenpunkte.0.Wertstoffe.Wertstoffe', TerminWertstoffe);
    
    setState('Datenpunkte.0.Wertstoffe.Restmüll_Resttage', dateDiff (TerminRest));
    setState('Datenpunkte.0.Wertstoffe.Bio_Resttage', dateDiff (TerminBio));
    setState('Datenpunkte.0.Wertstoffe.Papier_Resttage', dateDiff (TerminPapier));
    setState('Datenpunkte.0.Wertstoffe.Wertstoffe_Resttage', dateDiff (TerminWertstoffe));

}

function MuelltonnenWarnung() {
    console.log ("+++ Mülltonnenwarnung gestartet +++")
    var NotificationText = "";
    if (getState('Datenpunkte.0.Wertstoffe.Restmüll_Resttage').val == 1) {
        NotificationText = "Restmüll";
    }

    if (getState('Datenpunkte.0.Wertstoffe.Bio_Resttage').val == 1) {
        if (NotificationText === "") {
            NotificationText = "Biomüll";
        } else {
            NotificationText = NotificationText + ", Biomüll";
        }
    }

    if (getState('Datenpunkte.0.Wertstoffe.Papier_Resttage').val == 1) {
        if (NotificationText === "") {
            NotificationText = "Papiermüll";
        } else {
            NotificationText = NotificationText + ", Papiermüll";
        }
    }

    if (getState('Datenpunkte.0.Wertstoffe.Wertstoffe_Resttage').val == 1) {
        if (NotificationText === "") {
            NotificationText = "Wertstoffe";
        } else {
            NotificationText = NotificationText + ", Wertstoffe";
        }
    }
    //console.log (NotificationText);
    if (NotificationText) {
        sendTo("telegram", "send", {
            text: ('Bitte stelle folgende Tonnen an die Straße: ' + NotificationText)
        });
   
    }
}

// MuelltonnenWarnung();
UpdateWertstoffeTermine();

// Trigger Schedule
schedule('0 18 * * *', MuelltonnenWarnung);