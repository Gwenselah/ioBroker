// -----------------------------------------------------------------------------
// ----- Abfragen von Werten aus der Datenbank (SQL) ---------------------------
// -----------------------------------------------------------------------------

// ----- Datenpunkt der ausgelesen werden soll ---------------------------------
var id = "alias.0.Temperaturen.Temperatur_Aussen"; 

// ----- Datenpunkte in die gespeichert werden soll ----------------------------
var maxid = 'Datenpunkte.0.Temperaturen.Draussen.Max24';
var minid = 'Datenpunkte.0.Temperaturen.Draussen.Min24';
var dt = 24;//Zeitraum in Stunden
    dt = dt*3600*1000;

// ----- Datenpunkte anlegen ---------------------------------------------------
//Befehl muss korrigierrt werden, der State wird als String und nicht als Zahl und ohne Unit angelegt
//createState(maxid, " ");
//createState(minid, " ");
//log('1. ) Datenpunkte angelegt ');

SQLAbfrage(id);
WriteHTML();

// maximum, minimum
function minimum(result) {
    ///log(JSON.stringify(result.result));
    setState(minid, result.result[0].MinVal);
}
 
function maximum(result) {
    ///log('Fn Max'+ JSON.stringify(result.result));
    setState(maxid, result.result[0].MaxVal);
}
 
//----- SQL-Abfrage durchführen
function SQLAbfrage () {

//    log('2. ) Datenpunkt => ' + id);
//    log('2a.) Abfrage    => SELECT * FROM iobroker.datapoints WHERE name = \'' + id + '\'');
    sendTo('sql.0', 'query', 'SELECT * FROM iobroker.datapoints WHERE name = \'' + id + '\'', GetResults);
}
//---------------------------------------
function GetResults (dpoint) {
    var end_time = new Date().getTime();
    var start_time = new Date().getTime() - dt;
/*    log('3. ) Funktion -> GetResults aufrufen');

    log('3a.) Startzeit : ' + start_time);
    log('3b.) Endzeit   : ' + end_time);
    log('     Datenpunkt: ' + dpoint.result);
    log('3c.) result    : ' + JSON.stringify(dpoint.result) + ' -//- ' + start_time);
    log('     Datenpunkt: ' + dpoint.result[0].id + ' ---//--- ' + dpoint.result[0].name);
    log('     MinVal: SELECT Round(Min(val),1) As MinVal FROM iobroker.ts_number WHERE ts >= ' + start_time + ' AND id=' + dpoint.result[0].id + ' GROUP BY id');
    log('     MAxVal: SELECT Round(Max(val),1) As MaxVal FROM iobroker.ts_number WHERE ts >= ' + start_time + ' AND id=' + dpoint.result[0].id + ' GROUP BY id');*/
    sendTo('sql.0', 'query', 'SELECT Round(Min(val),1) As MinVal FROM iobroker.ts_number WHERE ts >= ' + start_time + ' AND id=' + dpoint.result[0].id + ' GROUP BY id',minimum);
    sendTo('sql.0', 'query', 'SELECT Round(Max(val),1) As MaxVal FROM iobroker.ts_number WHERE ts >= ' + start_time + ' AND id=' + dpoint.result[0].id + ' GROUP BY id',maximum);
}

function GetUVIndex(){
    //uvindex in Text wandeln
    var uvindex = 0;
    uvindex = getState("mqtt.0.weather.solarweatherstation.uvindex").val;
    var uvindexText = "";
    if (uvindex < 3) {
        uvindexText = "niedrig - Kein Schutz erforderlich" }
    if ((uvindex >= 3) && (uvindex < 6)) {
        uvindexText = "mäßig - Schutz erforderlich: Hut, T-Shirt, Sonnenbrille, Sonnencreme" } 
    if ((uvindex >= 6) && (uvindex < 8)) {
        uvindexText = "hoch - Schutz erforderlich: Hut, T-Shirt, Sonnenbrille, Sonnencreme. Mittags den Schatten zu suchen" } 
    if ((uvindex >= 8) && (uvindex < 11)) {
        uvindexText = "sehr hoch - zusätzlicher Schutz erforderlich: Aufenthalt zwischen 11 und 15 Uhr im Freien möglichst vermeiden" }
    if (uvindex >= 11) {
        uvindexText = "extrem - zusätzlicher Schutz erforderlich: Aufenthalt im Freien auch in Randzeiten möglichst vermeiden" }   
    return uvindexText;
}

function GetHitzeIndex(){
    //Heatindex in Text wandeln
    //HI starts working above 26,7 °C
    var heatindexc = 0;
    heatindexc = getState("mqtt.0.weather.solarweatherstation.heatindexc").val;
    var heatindexText = "";
    if (heatindexc <26.7) {
        heatindexText = "Keine Gefahr" }
    if ((heatindexc >= 26.7) && (heatindexText < 32)) {
        heatindexText = "Vorsicht – Bei längeren Zeiträumen und körperlicher Aktivität kann es zu Erschöpfungserscheinungen kommen" } 
    if ((heatindexc >= 32) && (heatindexText < 40)) {
        heatindexText = "Erhöhte Vorsicht – Es besteht die Möglichkeit von Hitzeschäden wie Sonnenstich, Hitzekrampf und Hitzekollaps" } 
    if ((heatindexc >= 40) && (heatindexText < 54)) {
        heatindexText = "Gefahr – Sonnenstich, Hitzekrampf und Hitzekollaps sind wahrscheinlich; Hitzschlag ist möglich" }
    if (heatindexc >= 54) {
        heatindexText = "Erhöhte Gefahr – Hitzschlag und Sonnenstich sind wahrscheinlich" }      
    return heatindexText;
}

//==========================================================================================
function WriteHTML() {
    var HTML = getState("Datenpunkte.0.HTML.iQontrol.Wetter_Template").val;
    
    HTML = HTML.replace("%Tempcurrent%",getState("alias.0.Temperaturen.Temperatur_Aussen").val + "°C");

    HTML = HTML.replace("%TempMinMax%",getState("Datenpunkte.0.Temperaturen.Draussen.Min24").val + "°C/" 
        + getState("Datenpunkte.0.Temperaturen.Draussen.Max24").val + "°C");
    
    HTML = HTML.replace("%abshpa%",getState("mqtt.0.weather.solarweatherstation.abshpa").val + " hpa");

    HTML = HTML.replace("%relhpa%",getState("mqtt.0.weather.solarweatherstation.relhpa").val + " hpa");

    HTML = HTML.replace("%humi%",getState("sainlogic.0.weather.current.outdoorhumidity").val + "%");
                    
    HTML = HTML.replace("%uvindex%",GetUVIndex);
                 
    HTML = HTML.replace("%heatindexc%",GetHitzeIndex);

//    HTML = HTML.replace("%trendinwords%",getState("mqtt.0.weather.solarweatherstation.trendinwords").val);
//    HTML = HTML.replace("%zambrettiysays%",getState("mqtt.0.weather.solarweatherstation.zambrettisays").val);
//    HTML = HTML.replace("%accuracy%",getState("mqtt.0.weather.solarweatherstation.accuracy").val + "%");

//    HTML = HTML.replace("",getState("").val);

    HTML = HTML.replace("%dewpointc%",getState("mqtt.0.weather.solarweatherstation.dewpointc").val + "°C");
    HTML = HTML.replace("%spreadc%",getState("mqtt.0.weather.solarweatherstation.spreadc").val + "°C");
    setState("Datenpunkte.0.HTML.iQontrol.Wetter",HTML);
}

//==========================================================================================
on({id: "alias.0.Temperaturen.Temperatur_Aussen", change: 'ne'}, function (obj) {
    WriteHTML();
})

// ----- Funktion alle 10 Minuten aufrufen
schedule("*/10 * * * *", function(){
    SQLAbfrage(id);
    WriteHTML();
});

//on({id: "telegram.0.communicate.request", ack: false, change: 'any'}, function (obj) {
on({id: "telegram.0.communicate.request", change: 'any'}, function (obj) {
    command = obj.state.val.substring(obj.state.val.indexOf(']')+1);
//    console.log("Received: " + command);
	var benutzer = obj.state.val.substring(1, obj.state.val.indexOf("]"));
    //console.log ("Benutzer:" + benutzer)
    // Menü beginnen
    var cmd = command.toUpperCase();
    log("Wetterbehandlung: " + cmd);
    var TelegramText="";
    if (cmd == "WETTER") {
        TelegramText = "<b>Temperatur:</b> " + getState('alias.0.Temperaturen.Temperatur_Aussen').val  + "°C\n";
        TelegramText += "<b>T. Min/Max 24h:</b> " + getState("Datenpunkte.0.Temperaturen.Draussen.Min24").val + "°C/" 
        + getState("Datenpunkte.0.Temperaturen.Draussen.Max24").val + "°C\n"
        TelegramText += "<b>Luftdruck abs/rel:</b> " + getState("mqtt.0.weather.solarweatherstation.abshpa").val + " hpa" +
            "/" + getState("mqtt.0.weather.solarweatherstation.relhpa").val + " hpa\n";
        TelegramText += "<b>Luftfeuchtigkeit: </b>" + getState("mqtt.0.weather.solarweatherstation.humi").val + "%\n" ;
            
        TelegramText += "<b>Taupunkt:</b> " + getState("mqtt.0.weather.solarweatherstation.dewpointc").val + "°C <b>Spread:</b> "
               + getState("mqtt.0.weather.solarweatherstation.spreadc").val + "°C\n";
        TelegramText += "<b>UV Index:</b> " + GetUVIndex() + "\n";
        TelegramText += "<b>Hitze Index:</b> " + GetHitzeIndex() + "\n\n";
//        TelegramText += "<b><u>Trend</u></b>\n";
//        TelegramText += "<b>Luftdruck:</b> " + getState("mqtt.0.weather.solarweatherstation.trendinwords").val + "\n";
//        TelegramText += "<b>Wettervorhersage:</b> " + getState("mqtt.0.weather.solarweatherstation.zambrettisays").val + "\n";
//        TelegramText += "<b>Vorhersagegenauigkeit:</b> " + getState("mqtt.0.weather.solarweatherstation.accuracy").val + "%";

        sendTo('telegram', {
            user: benutzer,
            text: TelegramText,
            parse_mode: "HTML"
        });            
    }
})

//==========================================================================================
//=== Wetter Kachel erzeugen
//==========================================================================================
const DP_Uhr_digital 				= '0_userdata.0.iQontrol.Uhr.Digital_Uhr_HTML_Uhrzeit_und_Datum_V7_neu';
const DP_Wetter_Vorschau 			= '0_userdata.0.iQontrol.Uhr.Wetter_Vorschau';
const DP_Wetter_Vorschau_Trigger	= '0_userdata.0.iQontrol.Uhr.Wetter_Vorschau_Trigger';
 
fctInit();
 
on({id:DP_Wetter_Vorschau_Trigger, val:true} , function (dp) {
  if (getState(DP_Wetter_Vorschau).val){
      setState(DP_Wetter_Vorschau, false);
  }else{
      setState(DP_Wetter_Vorschau, true);
  }
});
 
function fctInit(){
    if(!existsState(DP_Uhr_digital)) {
        createState(DP_Uhr_digital,
            {type: 'string', name: 'iQontrol Uhr', role: 'value', read: true , write: true}
        );
    }
    if(!existsState(DP_Wetter_Vorschau_Trigger)) {
        createState(DP_Wetter_Vorschau_Trigger,
            {type: 'boolean', name: 'Wetter Vorschau Trigger', role: 'button', read: false , write: true}
        );
    }
    if(!existsState(DP_Wetter_Vorschau)) {
        createState(DP_Wetter_Vorschau,
            {type: 'boolean', name: 'Wetter Vorschau', role: 'switch', read: true , write: true, def: false}
        );
    }
    setStateDelayed(DP_Uhr_digital, fctUhrzeitDatumWetter_V7(), 1000);
    schedule("*/10 * * * * *", function () {
        setState(DP_Uhr_digital, fctUhrzeitDatumWetter_V7());
    })
}
 
function fctUhrzeitDatumWetter_V7() {
let str_Uhrzeit         = String(formatDate(new Date(), "hh:mm"));
let str_Datum           = String(formatDate(new Date(), "DD.MM.YYYY"));
let str_Wochentag       = String(formatDate(new Date(), "WW", "de"));
 
let str_color_body      = 'rgba(66, 66, 66, 1)';
let str_color_cell      = 'rgba(71, 87, 92, 0)';
let str_color_font      = 'rgba(255, 255, 255, 1)';
 
 
let str_position_font   = 'left'
let str_Tageszeit       = 'Tag';
let str_html            = '';
let str_html_head       = '';
let image_Wetter_Pfad   = './../iqontrol.meta/userimages/usericons/wetter/';
let img_Restabfall      = './../iqontrol.meta/userimages/usericons/Abfall/Restabfall_Tonne.png';
let img_Papiertonne     = './../iqontrol.meta/userimages/usericons/Abfall/Papier_Tonne.png';
let img_Gelber_Sack     = './../iqontrol.meta/userimages/usericons/Abfall/Gelbe_Tonne.png';
let img_Garbage_Truck   = './../iqontrol.meta/userimages/usericons/Abfall/Garbage_Truck.png';
let img_Bio_Tonne       = './../iqontrol.meta/userimages/usericons/Abfall/Bio_Tonne.png';
let cnt_waste           = 0;

// ##########################################################################
// CSS Style (Formatierung der HTML Elemente)
// ##########################################################################
str_html_head = str_html_head + '<head><meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">';
str_html_head = str_html_head + '<style>';
str_html_head = str_html_head + 'body {';
str_html_head = str_html_head + 'overflow:hidden;'; //Scrollbalken ausgeblendet
str_html_head = str_html_head + 'background-color:' + str_color_body + ';';
str_html_head = str_html_head + '}'; 
 
 
 
str_html_head = str_html_head + 'span {';
//Rahmen: abgerundete Ecken (5px), Strichstärke (0px = aus) und Farbe
//str_html_head = str_html_head + 'border-radius:5px;border-collapse:separate;border:1px solid gainsboro;border-color:White;';
//Textausrichtung
str_html_head = str_html_head + 'text-align:' + str_position_font + ';';
//Schriftfarbe
str_html_head = str_html_head + 'color:' + str_color_font + ';';
//Wer keine Hintergrundfarbe für die Boxen will, kommentiert die nachfolgende Zeile aus oder löscht sie.
//str_html_head = str_html_head + 'background-color:' + str_color_cell + ';';
str_html_head = str_html_head + '}';
 
str_html_head = str_html_head + 'td {';
str_html_head = str_html_head + 'padding-left:2vw;'; 
str_html_head = str_html_head + 'border-width:1px;';
str_html_head = str_html_head + 'border-style:solid;';
str_html_head = str_html_head + 'border-color:silver;';
str_html_head = str_html_head + '}';
 
str_html_head = str_html_head + 'img {';
str_html_head = str_html_head + 'height:5vw;';
str_html_head = str_html_head + 'width:5vw;';
str_html_head = str_html_head + '}';


str_html_head = str_html_head + '.container_column {';
str_html_head = str_html_head + 'display:flex;';
//Elemente werden untereinander dargestellt
str_html_head = str_html_head + 'flex-direction: column;';
str_html_head = str_html_head + 'justify-content: flex-start;';
//Rahmen: abgerundete Ecken (5px), Strichstärke (0px = aus) und Farbe
//str_html_head = str_html_head + 'border-radius:5px;border-collapse:separate;border:2px solid gainsboro;border-color:yellow;';
str_html_head = str_html_head + '}';
 
str_html_head = str_html_head + '.container_row {';
str_html_head = str_html_head + 'display: flex;';
//Elemente werden untereinander dargestellt
str_html_head = str_html_head + 'flex-direction: row;';
str_html_head = str_html_head + 'justify-content: space-between;';
//Rahmen: abgerundete Ecken (5px), Strichstärke (0px = aus) und Farbe
//str_html_head = str_html_head + 'border-radius:5px;border-collapse:separate;border:2px solid gainsboro;border-color:yellow;';
str_html_head = str_html_head + '}';
 
str_html_head = str_html_head + 'input {';
str_html_head = str_html_head + 'height:10vw;';
str_html_head = str_html_head + 'width:10vw;';
str_html_head = str_html_head + '}';
 
str_html_head = str_html_head + '.img_wetter {';
str_html_head = str_html_head + 'height:15vw;';
str_html_head = str_html_head + 'width:15vw;';
str_html_head = str_html_head + '}';
 
//Hier habt ihr die Möglichkeit, CSS Eigenschaften für jede Box einzeln einzutragen.
//Bspw. könnt ihr hier eine separate Hintergrundfarbe einstellen.
//Außerdem steuert ihr hier die Schriftgrößen der einzelnen Boxen
str_html_head = str_html_head + '.box_uhr {font-size:14vmax;}';
str_html_head = str_html_head + '.box_datum {font-size:4vmax;text-align:center;}';
str_html_head = str_html_head + '.box_wetter {font-size:4vmax;margin-right:1.5vw;text-align:center;}';
 
str_html_head = str_html_head + '.table_Wettervorschau {';
str_html_head = str_html_head + 'margin-top:4vw;';
str_html_head = str_html_head + 'border-collapse: collapse;';
str_html_head = str_html_head + 'font-size:3vmax;';
str_html_head = str_html_head + 'color:' + str_color_font + ';';
str_html_head = str_html_head + '}';
str_html_head = str_html_head + '</style>';
str_html_head = str_html_head + '<script type="text/javascript">';
str_html_head = str_html_head + 'function setState(stateId, value){';
str_html_head = str_html_head + 'sendPostMessage("setState", stateId, value);';
str_html_head = str_html_head + '}';
str_html_head = str_html_head + 'function sendPostMessage(command, stateId, value){';
str_html_head = str_html_head + 'message = { command: command, stateId: stateId, value: value};';
str_html_head = str_html_head + 'window.parent.postMessage(message, "*");';
str_html_head = str_html_head + '}';
str_html_head = str_html_head + '</script>';
str_html_head = str_html_head + '</head>';
 
// ##########################################################################
// Prüfen ob Tag oder Nacht um Sonne oder Mond Icons anzuzeigen
// ##########################################################################
//Wenn ihr den nachfolgenden Datenpunkt 'javascript.0.Astro.Tageszeit.current' auch habt, könnt ihr das einkommentieren --> /* und */ löschen
//--> dafür gibt es ein ASTRO Skript hier im Forum

switch (getState('javascript.0.Astro.Tageszeit.current').val){
    case "Sonnenuntergang":
    case "Abenddämmerung":
    case "Nacht":
    case "Morgendämmerung":
        str_Tageszeit = 'Nacht';
        break;
    default:
        break;
}
 
// ##########################################################################
// Ab hier werden die verschiedenen HTML Flex Container zusammengebaut
// ##########################################################################
//Box 1 = Uhrzeit und Wettersymbol
str_html = str_html + str_html_head + '<div class="container_row">';
str_html = str_html + '<span class="box_uhr"><b>' + str_Uhrzeit + ' Uhr</b></span>';
if (str_Tageszeit == 'Tag'){
      str_html = str_html + '<input type="image" class="img_wetter" onclick="setState(\'' + DP_Wetter_Vorschau_Trigger + '\', true)" src="' + image_Wetter_Pfad + getState('daswetter.0.NextHours2.Location_1.Day_1.current.symbol').val + '.png' + '" />';
}else{
      str_html = str_html + '<input type="image" class="img_wetter" onclick="setState(\'' + DP_Wetter_Vorschau_Trigger + '\', true)" src="' + image_Wetter_Pfad + 'mond/' + getState('daswetter.0.NextHours2.Location_1.Day_1.moon_symbol').val + '.png' + '" />';
}
str_html = str_html + '</div>';
 
//Box 2 = Wochentag/Datum, Abfallentsorgung und aktuelle Wetterdaten
str_Restabfall  = getState('Datenpunkte.0.Wertstoffe.Restmüll_Resttage').val;
str_Papiertonne = getState('Datenpunkte.0.Wertstoffe.Papier_Resttage').val;
str_Gelber_Sack = getState('Datenpunkte.0.Wertstoffe.Wertstoffe_Resttage').val;
str_Biotonne    = getState('Datenpunkte.0.Wertstoffe.Bio_Resttage').val;

str_html = str_html + '<div class="container_row">';
str_html = str_html + '<div class="container_column">';
str_html = str_html + '<span class="box_datum"><b><i>' + str_Wochentag + ', ' + str_Datum + '</i></b></span>';
str_html = str_html + '</div>';

str_html = str_html + '<div class="container_row">';
if ((str_Restabfall == 0) || (str_Restabfall == 1)){
    cnt_waste++;
    str_html = str_html + '<span><input type="image" onclick="setState(\'Datenpunkte.0.Wertstoffe.Wertstoffe_Vorschau_Trigger\', true)" src="' + img_Restabfall + '"></span>';
}
if ((str_Papiertonne == 0) || (str_Papiertonne == 1)){
    cnt_waste++;
    str_html = str_html + '<span><input type="image" onclick="setState(\'Datenpunkte.0.Wertstoffe.Wertstoffe_Vorschau_Trigger\', true)" src="' + img_Papiertonne + '"></span>';
}
if ((str_Gelber_Sack == 0) || (str_Gelber_Sack == 1)){
    cnt_waste++;
    str_html = str_html + '<span><input type="image" onclick="setState(\'Datenpunkte.0.Wertstoffe.Wertstoffe_Vorschau_Trigger\', true)" src="' + img_Gelber_Sack + '"></span>';
}
if ((str_Biotonne == 0) || (str_Biotonne == 1)){
    cnt_waste++;
    str_html = str_html + '<span><input type="image" onclick="setState(\'Datenpunkte.0.Wertstoffe.Wertstoffe_Vorschau_Trigger\', true)" src="' + img_Bio_Tonne + '"></span>';
}
if (cnt_waste == 0){
    str_html = str_html + '<span><input type="image" class="img_waste" onclick="setState(\'Datenpunkte.0.Wertstoffe.Wertstoffe_Vorschau_Trigger\', true)" src="' + img_Garbage_Truck + '"></span>';
}
str_html = str_html + '</div>';



str_html = str_html + '<div class="container_column">';
str_html = str_html + '<span class="box_wetter"><b><i>' + Math.round(getState('alias.0.Temperaturen.Temperatur_Aussen'/*Temperatursensor aussen ACTUAL TEMPERATURE*/).val) + '°C</i></b></span>';
if (str_Tageszeit == 'Tag'){
    str_html = str_html + '<span class="box_wetter"><i>' + getState('daswetter.0.NextHours2.Location_1.Day_1.current.symbol_desc').val + '</i></span>';
}else{
    str_html = str_html + '<span class="box_wetter"><i>' + str_Tageszeit + '</i></span>';
}
 
str_html = str_html + '</div>';
str_html = str_html + '</div>';

//Box 3 = Wettervorschau
str_html = str_html + '<div class="container_column">';
str_html = str_html + '<table class="table_Wettervorschau">';
 
str_html = str_html + '<tr>';
str_html = str_html + '<td>heute</td>';
str_html = str_html + '<td><img src="' + image_Wetter_Pfad + getState('daswetter.0.NextHours2.Location_1.Day_1.symbol').val + '.png' + '"/></td>';
str_html = str_html + '<td nowrap>' + getState('daswetter.0.NextHours2.Location_1.Day_1.tempmin').val + '°C bis ';
str_html = str_html + getState('daswetter.0.NextHours2.Location_1.Day_1.tempmax').val + '°C</td>';
//str_html = str_html + '<td>' + getState('daswetter.0.NextHours2.Location_1.Day_1.humidity_value').val + '%</td>';
str_html = str_html + '<td align=left>' + getState('daswetter.0.NextHours2.Location_1.Day_1.symbol_desc').val + '</td>';
str_html = str_html + '</tr>';
 
str_html = str_html + '<tr>';
str_html = str_html + '<td>' + getState('daswetter.0.NextHours2.Location_1.Day_2.day').val + '</td>';
str_html = str_html + '<td><img src="' + image_Wetter_Pfad + getState('daswetter.0.NextHours2.Location_1.Day_2.symbol').val + '.png' + '"/></td>';
str_html = str_html + '<td nowrap>' + getState('daswetter.0.NextHours2.Location_1.Day_2.tempmin').val + '°C bis ';
str_html = str_html + getState('daswetter.0.NextHours2.Location_1.Day_2.tempmax').val + '°C</td>';
//str_html = str_html + '<td>' + getState('daswetter.0.NextHours2.Location_1.Day_2.humidity_value').val + '%</td>';
str_html = str_html + '<td align=left>' + getState('daswetter.0.NextHours2.Location_1.Day_2.symbol_desc').val + '</td>';
str_html = str_html + '</tr>';
 
str_html = str_html + '<tr>';
str_html = str_html + '<td>' + getState('daswetter.0.NextHours2.Location_1.Day_3.day').val + '</td>';
str_html = str_html + '<td><img src="' + image_Wetter_Pfad + getState('daswetter.0.NextHours2.Location_1.Day_3.symbol').val + '.png' + '"/></td>';
str_html = str_html + '<td nowrap>' + getState('daswetter.0.NextHours2.Location_1.Day_3.tempmin').val + '°C bis ';
str_html = str_html + getState('daswetter.0.NextHours2.Location_1.Day_3.tempmax').val + '°C</td>';
//str_html = str_html + '<td>' + getState('daswetter.0.NextHours2.Location_1.Day_3.humidity_value').val + '%</td>';
str_html = str_html + '<td align=left>' + getState('daswetter.0.NextHours2.Location_1.Day_3.symbol_desc').val + '</td>';
str_html = str_html + '</tr>';
 
str_html = str_html + '<tr>';
str_html = str_html + '<td>' + getState('daswetter.0.NextHours2.Location_1.Day_4.day').val + '</td>';
str_html = str_html + '<td><img src="' + image_Wetter_Pfad + getState('daswetter.0.NextHours2.Location_1.Day_4.symbol').val + '.png' + '"/></td>';
str_html = str_html + '<td nowrap>' + getState('daswetter.0.NextHours2.Location_1.Day_4.tempmin').val + '°C bis ';
str_html = str_html + getState('daswetter.0.NextHours2.Location_1.Day_4.tempmax').val + '°C</td>';
//str_html = str_html + '<td>' + getState('daswetter.0.NextHours2.Location_1.Day_4.humidity_value').val + '%</td>';
str_html = str_html + '<td align=left>' + getState('daswetter.0.NextHours2.Location_1.Day_4.symbol_desc').val + '</td>';
str_html = str_html + '</tr>';
 
str_html = str_html + '<tr>';
str_html = str_html + '<td>' + getState('daswetter.0.NextHours2.Location_1.Day_5.day').val + '</td>';
str_html = str_html + '<td><img src="' + image_Wetter_Pfad + getState('daswetter.0.NextHours2.Location_1.Day_5.symbol').val + '.png' + '"/></td>';
str_html = str_html + '<td nowrap>' + getState('daswetter.0.NextHours2.Location_1.Day_5.tempmin').val + '°C bis ';
str_html = str_html + getState('daswetter.0.NextHours2.Location_1.Day_5.tempmax').val + '°C</td>';
//str_html = str_html + '<td>' + getState('daswetter.0.NextHours2.Location_1.Day_5.humidity_value').val + '%</td>';
str_html = str_html + '<td align=left>' + getState('daswetter.0.NextHours2.Location_1.Day_5.symbol_desc').val + '</td>';
str_html = str_html + '</tr>';
 
str_html = str_html + '</table>';
str_html = str_html + '</div>';
 
return str_html;
}
 
on({id:'Datenpunkte.0.Wertstoffe.Wertstoffe_Vorschau_Trigger', val:true} , function (dp) {
    fctAbfallentsorgungPopup();
});

function fctAbfallentsorgungPopup(){  
    sendTo("iqontrol.0", "send", {
        PopupMessage: fctWasteHTML('Popup'),
        PopupDuration: 4000
    });
}

function fctWasteHTML(Trigger) {
    let css                 = ''
    let str_HTML            = '';
    let str_HTML_head       = '';
    let img_Restabfall      = './../iqontrol.meta/userimages/usericons/Abfall/Restabfall_Tonne.png';
    let img_Papiertonne     = './../iqontrol.meta/userimages/usericons/Abfall/Papier_Tonne.png';
    let img_Gelber_Sack     = './../iqontrol.meta/userimages/usericons/Abfall/Gelbe_Tonne.png';
    let img_Bio_Tonne       = './../iqontrol.meta/userimages/usericons/Abfall/Bio_Tonne.png';

    css = css + 'body {';
    css = css + 'background-color: #005c78;';
    css = css + 'font-family:Verdana;';
    css = css + 'color: Silver;';
    css = css + '}';
    css = css + 'img {';
    css = css + 'height:25vw;';
    css = css + 'width:25vw;';
    css = css + '}';
    css = css + 'td, th {';
    css = css + 'border-width:1px;';
    css = css + 'border-style:solid;';
    css = css + 'border-color:black;';
    css = css + '}';
    css = css + '.box_column {';
    css = css + 'display:flex;';
    css = css + 'flex-direction: column;';
    css = css + 'justify-content: flex-start;';
    css = css + '/* border-radius:5px;border-collapse:separate;border:2px solid gainsboro;border-color:yellow; */';
    css = css + '}';
    css = css + '.img_popup {';
    css = css + 'height:70px;';
    css = css + 'width:70px;';
    css = css + '}';
    css = css + '.table {';
    css = css + 'border-collapse:collapse;';
    css = css + 'margin-top:4vw;';
    css = css + 'padding:2vw;';
    css = css + 'font-size:5vw;    ';
    css = css + 'color: Silver;';
    css = css + '}';
    css = css + '.table_popup {';
    css = css + 'border-collapse:collapse;';
    css = css + 'font-size:20px;';
    css = css + 'color: black;';
    css = css + '}';

    str_HTML_head = str_HTML_head + '<head><meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">';
    str_HTML_head = str_HTML_head + '<style>' + css + '" </style>';
    str_HTML_head = str_HTML_head + '</head>';

    //Tabelle Abfallentsorgung
    str_HTML = str_HTML + str_HTML_head + '<div class="box_column">';
    if (Trigger == 'Popup'){
        str_HTML = str_HTML + '<table class="table_popup">';
    }else{
        str_HTML = str_HTML + '<table class="table">';
    }

    str_HTML = str_HTML + '<tr>';
    str_HTML = str_HTML + '<th nowrap>' + getState('Datenpunkte.0.Wertstoffe.Restmüll_Resttage').val + ' Tage</th>';
    str_HTML = str_HTML + '<th nowrap>' + getState('Datenpunkte.0.Wertstoffe.Papier_Resttage').val + ' Tage</th>';
    str_HTML = str_HTML + '<th nowrap>' + getState('Datenpunkte.0.Wertstoffe.Wertstoffe_Resttage').val + ' Tage</th>';
    str_HTML = str_HTML + '<th nowrap>' + getState('Datenpunkte.0.Wertstoffe.Bio_Resttage').val + 'Tage </th>';
    str_HTML = str_HTML + '</tr>';
    
    str_HTML = str_HTML + '<tr>';
    if (Trigger == 'Popup'){
        str_HTML = str_HTML + '<td align="center"><img class="img_popup" src="' + img_Restabfall + '"/></td>';
        str_HTML = str_HTML + '<td align="center"><img class="img_popup" src="' + img_Papiertonne + '"/></td>';
        str_HTML = str_HTML + '<td align="center"><img class="img_popup" src="' + img_Gelber_Sack + '"/></td>';
        str_HTML = str_HTML + '<td align="center"><img class="img_popup" src="' + img_Bio_Tonne + '"/></td>';
    }else{
        str_HTML = str_HTML + '<td align="center"><img src="' + img_Restabfall + '"/></td>';
        str_HTML = str_HTML + '<td align="center"><img src="' + img_Papiertonne + '"/></td>';
        str_HTML = str_HTML + '<td align="center"><img src="' + img_Gelber_Sack + '"/></td>';
        str_HTML = str_HTML + '<td align="center"><img src="' + img_Bio_Tonne + '"/></td>';
    }
    str_HTML = str_HTML + '</tr>';

    str_HTML = str_HTML + '</table>';
    str_HTML = str_HTML + '</div>';

	return str_HTML;
}