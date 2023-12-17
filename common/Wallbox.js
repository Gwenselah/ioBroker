
//https://github.com/Newan/ioBroker.easee
//chargerOpMode = Offline: 0, Disconnected: 1, AwaitingStart: 2, Charging: 3, Completed: 4, Error: 5, ReadyToCharge: 6
//dynamicCircuitCurrentPX -> All phases must be set within 500ms (script) otherwise the phase will be set to 0.

/*
 * @copyright 2020 Stephan Kreyenborg <stephan@kreyenborg.koeln>
 *
 * @author 2020 Stephan Kreyenborg <stephan@kreyenborg.koeln>
 *
 * Dieses Skript dient zur freien Verwendung in ioBroker zur Verbrauchserfassung der Shelly Geräte.
 * Jegliche Verantwortung liegt beim Benutzer. Das Skript wurde unter Berücksichtigung der bestmöglichen Nutzung
 * und Performance entwickelt.
 * Der Entwickler versichert, das keine böswilligen Systemeingriffe im originalen Skript vorhanden sind.
 *
 * Sollte das Skript wider Erwarten nicht korrekt funktionieren, so hast Du jederzeit die Möglichkeit, Dich auf
 * https://www.kreyenborg.koeln
 * für Unterstützung zu melden. Jedes Skript besitzt seine eigene Kommentarseite, auf der,
 * nach zeitlicher Möglichkeit des Autors, Hilfe angeboten wird. Ein Anrecht hierauf besteht nicht!
 * 
 * Ansprüche gegenüber Dritten bestehen nicht. 
 * 
 * Skript Name:        Zeitbereich
 * Skript Version:    1.0
 * Erstell-Datum:    16. April 2020
 * 
 * Beispiele
 * if (Zeitbereich("05:00:00","04:30:00")) {
 *    // Zeitbereich zwischen 5 Uhr morgens und 4:30 Uhr des nächsten Morgens
 *    // Hier kannst Du etwas ausführen lassen, was zu dem Zeitraum passt.
 * }
 *
 * if (Zeitbereich("09:00:00","13:00:00")) {
 *    // Zeitbereich zwischen 9 Uhr morgens und 13:00 Uhr mittags
 *    // Hier kannst Du etwas ausführen lassen, was zu dem Zeitraum passt.
 * }
 * oder ohne Sekunden
 * if (Zeitbereich("09:00","13:00")) {
 *    // Zeitbereich zwischen 9 Uhr morgens und 13:00 Uhr mittags
 *    // Hier kannst Du etwas ausführen lassen, was zu dem Zeitraum passt.
 * }
 */
function Zeitbereich(startTime,endTime) {
    // Aktuelles Datum abholen
    var currentDate = new Date();
    // Startdatum formatieren   
    var startDate = new Date(currentDate.getTime());
    startDate.setHours(startTime.split(":")[0]);
    startDate.setMinutes(startTime.split(":")[1]);
    if (startTime.split(":")[2]) {
        startDate.setSeconds(startTime.split(":")[2]);
    }
    // Enddatum formatieren
    var endDate = new Date(currentDate.getTime());
    endDate.setHours(endTime.split(":")[0]);
    endDate.setMinutes(endTime.split(":")[1]);
    if (endTime.split(":")[2]) {
        endDate.setSeconds(endTime.split(":")[2]);
    }
    //Setze Zeitbereich zurück
    var valid_time_frame = false
    
    if (endTime > startTime) {
        // Zeitbereich ist im gleichen Tag
        valid_time_frame = (currentDate >= startDate && currentDate <= endDate) ? true : false;
    } else {
        // Zeitbereich endet im nächsten Tag
        valid_time_frame = (currentDate >= endDate && currentDate <= startDate) ? false : true;
    }
    return valid_time_frame;
}

function WallboxAlert (TelegramText, AlexaText) {
    if (!TelegramText) {
        //log ("TelegramText ist leer")
    } else {
        sendTo('telegram', {
            user: "Andy",
            text: TelegramText,
            parse_mode: "HTML"
        }); 
    }

    if (!AlexaText) {
        //Dummy
    } else {
        if (Zeitbereich("07:00","22:00")) {
            setState("alexa2.0.Echo-Devices.G2A0U2048495012U.Commands.speak-volume",35);
            setState("alexa2.0.Echo-Devices.G2A0U2048495012U.Commands.speak",AlexaText);
        }
    }
}

on({id: "easee.0.EH9NK57L.status.chargerOpMode", change: 'ne'},(obj) => {
    var value = obj.state.val;
    switch (value) {
        case 0:
            log("Wallbox ist offline");
            WallboxAlert("Wallbox ist offline","Wallbox ist offline");
            break;
        case 1:
            log("Wallbox ist nicht verbunden");
            WallboxAlert("Wallbox ist nicht verbunden","Wallbox ist nicht mit dem Auto verbunden");
            break;
        case 2:
            log("Wallbox wartet auf den Start");
            WallboxAlert("Wallbox wartet auf den Start","Wallbox wartet auf den Start");
            break;
        case 3:
            log("Wallbox lädt");
            WallboxAlert("Wallbox lädt","Wallbox lädt");
            break;
        case 4:
            log("Wallbox hat fertig geladen");
            WallboxAlert("Wallbox hat fertig geladen","Wallbox hat fertig geladen");
            break;
        case 5:
            log("Wallbox hat einen Fehler");
            WallboxAlert("Wallbox hat einen Fehler","Wallbox hat einen Fehler");
            break;
        case 6:
            log("Wallbox ist bereit zum Laden");
            WallboxAlert("Wallbox ist bereit zum Laden","Wallbox ist bereit zum Laden");
            break;
        default:
            log("Wallbox hat einen unbekannten Status gemeldet");
            WallboxAlert("Wallbox hat einen unbekannten Status gemeldet","Wallbox hat einen unbekannten Status gemeldet");
            break;
    }
})

