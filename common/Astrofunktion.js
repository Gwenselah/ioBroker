const sec = false; // Sekunden darstellen oder nicht
const fC = false; // forceCreation ein/aus
const pfad = "Astro"; // Pfad zum Objekt - Objektbaum-Hauptverzeichnis
// *****************************************************************************
// TAGESZEITEN - T E I L 
// Tageszeiten nach eigenem Gusto (Shifts siehe schedules weiter unten)
const tageszeiten = ["Nacht",
                   "Morgendämmerung",
                   "Sonnenaufgang",
                   "Morgen",
                   "Vormittag",
                   "Mittag",
                   "Nachmittag",
                   "Abend",
                   "Sonnenuntergang",
                   "Abenddämmerung"
                  ];
const idTageszeit = "javascript." + instance  + "." + pfad + ".Tageszeit.current" /*Tageszeit*/,
    idTageszeitNext = "javascript." + instance  + "." + pfad + ".Tageszeit.next";
 
createState(idTageszeit, "nächsten Wechsel abwarten", fC, {
  name: "Tageszeit",
  desc: "Name der Tageszeit",
  type: "string"
});   
createState(idTageszeitNext, "nächsten Wechsel abwarten", fC, {
  name: "nächste Tageszeit",
  desc: "Name der nächsten Tageszeit",
  type: "string"
});
function neue_tageszeit(abschnitt) {
  var akt = tageszeiten[parseInt(abschnitt, 10)],
  // wenn aktuelles Element ist letztes, dann nächstes ist erstes :-D
  nxt = (abschnitt + 1 === tageszeiten.length) ? tageszeiten[0] : tageszeiten[parseInt(abschnitt + 1, 10)];
  setState(idTageszeit, akt);
  setState(idTageszeitNext, nxt);
  log("neue Tagezeit: " + akt);
  log("nächte kommende Tagezeit: " + nxt);
}
// Nacht
schedule({
  astro: "nauticalDusk", 
  shift: 45
}, function () { 
  neue_tageszeit(0);
});
// Morgengdämmerung
schedule({
  astro: "nauticalDawn",
  shift: -45
}, function () {
  neue_tageszeit(1);
});
// Sonnenaufgang
schedule({
  astro: "sunrise"
}, function() {
  neue_tageszeit(2);
});
// Morgen
schedule({
  astro: "sunriseEnd"
}, function () {
  neue_tageszeit(3);
});
// Vormittag 
schedule({
  astro: "goldenHourEnd",
  shift: 60
}, function () {
  neue_tageszeit(4);
});
// Mittag
schedule({
  astro: "solarNoon",
  shift: -30
}, function () {
  neue_tageszeit(5);
});
// Nachmittag
schedule({
  astro: "solarNoon",
  shift: 30
}, function () {
  neue_tageszeit(6);
});
// Abend
schedule({
  astro: "goldenHour",
  shift: -60
}, function () {
  neue_tageszeit(7);
});
// Sonnenuntergang
schedule({
  astro: "sunsetStart",
}, function () {
  neue_tageszeit(8);
});
// Abenddämmerung (nach Sonnenuntergang)
schedule({
  astro: "sunset"
}, function () {
  neue_tageszeit(9);
});
// *****************************************************************************
// A S T O - T E I L 
/* Objekt Astrotag 
 Astrotag liegt zwischen Sonnauf- und untergang, 
 Astronacht liegt zwischen Sonnenunter- und aufgang */
const idAstrotag =  "javascript." + instance + "." + pfad + ".Astrotag";
// Objekt für Uhrzeiten der Astrozeiten
const astrotime = {
  "elements" : [
      // Astrotag beginnt
      {
          "fname" : "sunrise", // function name
          "de" : {
              "name" : "Sonnenaufgang",
              "nxt" : "nächster",
              "desc" : ""
          },
          "en" : {
              "name" : "Sunrise",
              "desc" : "top edge of the sun appears on the horizon"
          },
          "astroday" : true //during astroday
      },
      {
          "fname" : "sunriseEnd", // function name
          "de" : {
              "name" : "Ende Sonnenaufgang",
              "nxt" : "nächstes",
              "desc" : ""
          },
          "en" : {
              "name" : "End of sunrise",
              "desc" : "bottom edge of the sun touches the horizon"
          },
          "astroday" : true //during astroday
      },
      {
          "fname" : "goldenHourEnd", // function name
          "de" : {
              "name" : "Ende der goldenen Stunde am Morgen",
              "nxt" : "nächstes",
              "desc" : ""
          },
          "en" : {
              "name" : "End of golden hour",
              "desc" : "morning golden hour (soft light, best time for photography) ends"
          },
          "astroday" : true //during astroday
      },
      {
          "fname" : "solarNoon", // function name
          "de" : {
              "name" : "Sonnenhöchststand",
              "nxt" : "nächster",
              "desc" : ""
          },
          "en" : {
              "name" : "Solar noon",
              "desc" : "sun is in the highest position"
          },
          "astroday" : true //during astroday
      },
      {
          "fname" : "goldenHour", // function name
          "de" : {
              "name" : "Goldene Stunde (am Abend)",
              "nxt" : "nächste",
              "desc" : ""
          },
          "en" : {
              "name" : "Golden hour",
              "desc" : "evening golden hour starts"
          },
          "astroday" : true //during astroday
      },
      {
          "fname" : "sunsetStart", // function name
          "de" : {
              "name" : "Beginn Sonnenuntergang",
              "nxt" : "nächster",
              "desc" : ""
          },
          "en" : {
              "name" : "Sunset starts",
              "desc" : "bottom edge of the sun touches the horizon"
          },
          "astroday" : true //during astroday
      },
      // Astronacht beginnt
      {
          "fname" : "sunset", // function name
          "de" : {
              "name" : "Sonnenuntergang",
              "nxt" : "nächster",
              "desc" : ""
          },
          "en" : {
              "name" : "Sunset",
              "desc" : "sun disappears below the horizon, evening civil twilight starts"
          },
          "astroday" : false //during astronight
      },
      {
          "fname" : "dusk",
          "de" : {
              "name" : "Abenddämmerung",
              "nxt" : "nächste",
              "desc" : ""
          },
          "en" : {
              "name" : "Dusk",
              "desc" : "evening nautical twilight starts"
          },
          "astroday" : false //during astronight
      },
      {
          "fname" : "nauticalDusk",
          "de" : {
              "name" : "nautische Abenddämmerung",
              "nxt" : "nächste",
              "desc" : ""
          },
          "en" : {
              "name" : "Nautical dusk",
              "desc" : "evening astronomical twilight starts"
          },
          "astroday" : false //during astronight
      },
      {
          "fname" : "nadir",
          "de" : {
              "name" : "Nadir",
              "nxt" : "nächster",
              "desc" : "Fußpunkt gegenüber dem Zenit"
          },
          "en" : {
              "name" : "Nadir",
              "desc" : "darkest moment of the night, sun is in the lowest position"
          },
          "astroday" : false //during astronight
      },
      {
          "fname" : "nauticalDawn",
          "de" : {
              "name" : "nautische Morgendämmerung",
              "nxt" : "nächste",
              "desc" : ""
          },
          "en" : {
              "name" : "Nautical dawn",
              "desc" : "morning nautical twilight starts"
          },
          "astroday" : false //during astronight
      },
      {
          "fname" : "dawn",
          "de" : {
              "name" : "Morgendämmerung",
              "nxt" : "nächste",
              "desc" : ""
          },
          "en" : {
              "name" : "dawn",
              "desc" : "morning nautical twilight ends, morning civil twilight starts"
          },
          "astroday" : false //during astronight
      }
 
  ]
};
 
function writeAstroTimes(i) {
  // führende Nummer zur Sortierung in Admin/Objekte
  var nr = (i+1 < 10) ? "0" + (i+1) : (i+1);
  // Erstelle Objekt, falls nicht bereits vorhanden
  var idAstroObject = "javascript." + instance + "." + pfad + ".Zeiten." + nr + " - " + astrotime.elements[i].fname;
  createState(idAstroObject, " ", fC, {
      name: astrotime.elements[i].de.nxt + " " + astrotime.elements[i].de.name + " Uhrzeit",
      desc: astrotime.elements[i].en.desc,
      type: "string"
  });
 
  setTimeout(function() { // kurz warten, damit Objekte ggf. erst angelgt werden können
      var astrotag = getState(idAstrotag).val,
          temp;
      var today = new Date();
      var tomorrow = new Date(today.setDate(today.getDate()+1));
      var next_event;
      if (astrotag) { 
          // Wenn Tag (Aufgang vorbei (erst wieder morgen, Untergang kommt noch heute)
          next_event = (astrotime.elements[i].astroday) ? tomorrow : today; // prüfen
      } else { 
          // nach Nacht (Untergang vorbei (erst wieder morgen, Aufgang kommt heute oder morgen)
          next_event = (astrotime.elements[i].astroday) ? today : tomorrow; // prüfen
      }
      var fname = astrotime.elements[i].fname;
      temp = getAstroDate(fname, next_event);
      setState(idAstroObject, checkSec(temp.toLocaleTimeString('de-DE', { hour12: false })) );
  }, 3 * 1000);
}
 
// Zeit mit oder ohne Sekunden anzeigen
function checkSec (zeit) {
  if (!sec) {
      var newString_arr = zeit.split(":");
      var newString = newString_arr[0] + ":" + newString_arr[1];
      return (newString);
  } else return (zeit);
}
 
function getAstroday() {
  // Astrotag bestimmen (boolean)
  createState(idAstrotag, false, fC, {
      type: "boolean",
      name: "Astrologischer Tag",
      desc: "Liegt die aktuelle Zeit zwischen Sonnenauf- und untergang"
  }); 
  setState(idAstrotag, isAstroDay());
}
 
function iterateAstrotimes() {
  // Zeiten für jede Astrozeit schreiben
  for (var i = 0; i < astrotime.elements.length; i++) {
      writeAstroTimes(i);
  }
}
 
// Astrotag checken
schedule("*/1 * * * *", function () { // jede Minute
  getAstroday();
  iterateAstrotimes();
});
 
iterateAstrotimes();
getAstroday();