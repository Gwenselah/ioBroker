const basePath = "0_userdata.0.Steuerzentrale.ZigbeeWatchdog.";
const stateDevicesCount = basePath + "devices_count_all";
const stateDevicesLinkQuality = basePath + "devices_link_quality_list";
const stateDevicesOfflineCount = basePath + "devices_offline_count";
const stateDevicesOffline = basePath + "devices_offline_list";
const stateDevicesWithBatteryCount=basePath + "devices_battery_count";
const stateDevicesWithBattery=basePath + "devices_battery_list";
const stateDevicesInfoList=basePath + "devices_list_all";
const stateDevicesLastCheck=basePath + "lastCheck";
 
 
if (!existsObject(stateDevicesCount)) {createState(stateDevicesCount, 0, { read: true, write: true, desc: "Anzahl Geräte gesamt", name: "Anzahl Geräte gesamt",type: 'number' })};
if (!existsObject(stateDevicesLinkQuality)) {createState(stateDevicesLinkQuality, " ", { read: true, write: true, desc: "Liste Geräte Signalstärke", name: "Liste Geräte Signalstärke", type: 'string' })};
if (!existsObject(stateDevicesOfflineCount)) {createState(stateDevicesOfflineCount, 0, { read: true, write: true, desc: "Anzahl Geräte offline", name: "Anzahl Geräte offline",type: 'number' })};
if (!existsObject(stateDevicesOffline)) {createState(stateDevicesOffline, " ", { read: true, write: true, desc: "Liste Geräte offline", name: "Liste Geräte offline",type: 'string' })};
if (!existsObject(stateDevicesWithBattery)) {createState(stateDevicesWithBattery, " ", {read: true, write: true, desc: "Liste Geräte mit Batterie", name: "Liste Geräte mit Batterie", type: 'string'})};
if (!existsObject(stateDevicesWithBatteryCount)) {createState(stateDevicesWithBatteryCount, 0, {read: true, write: true, desc: "Anzahl Geräte mit Batterie", name: "Anzahl Geräte mit Batterie", type: 'number'})};
if (!existsObject(stateDevicesInfoList)) {createState(stateDevicesInfoList, " ", {read: true, write: true, desc: "Liste aller Geräte", name: "Liste aller Geräte", type: 'string'})};
if (!existsObject(stateDevicesLastCheck)) {createState(stateDevicesLastCheck, " ", {read: true, write: true, desc: "Zeitpunkt letzter Überprüfung", name: "Zeitpunkt letzter Überprüfung", type: 'string'})};    
 
 
 
function zigbeeWatchdog() {
 
    let maxMinutes = 300; // "Gerät offline" - Wert in Minuten: Gilt erst, wenn Gerät länger als X Minuten keine Meldung gesendet hat 
    let arrOfflineDevices = []; //JSON-Info alle offline-Geräte
    let arrLinkQualityDevices = []; //JSON-Info alle offline-Geräte
    let arrBatteryPowered = []; //JSON-Info alle batteriebetriebenen Geräte
    let arrListAllDevices = []; //JSON-Info Gesamtliste mit Info je Gerät
    let currDeviceString;
    let currDeviceBatteryString;
    let currRoom;
    let deviceName;
    let linkQuality;
    let lastContact;
    let lastContactString;
    let offlineDevicesCount;
    let deviceCounter=0;
    let batteryPoweredCount=0;
    let batteryHealth;
 
    const zigbee = $('zigbee.0.*.link_quality');
 
    zigbee.each(function (id, i) {
        currDeviceString = id.slice(0, (id.lastIndexOf('.') + 1) - 1);
        deviceName=getObject(currDeviceString).common.name
        currRoom = getObject(id, 'rooms').enumNames[0];
        if(typeof currRoom == 'object') currRoom = currRoom.de;
        
 
 
        // 1. Link-Qualität des Gerätes ermitteln
        //---------------------------------------
        
        linkQuality=parseFloat((100/255 * getState(id).val).toFixed(2)) + "%"; // Linkqualität in % verwenden
        //linkQuality=getState(id).val; // ALTERNATIV: Echt-Wert der Linkqualität (0-255) verwenden
        
        arrLinkQualityDevices.push({device: deviceName, room: currRoom, link_quality: linkQuality});
 
 
        // 2. Wann bestand letzter Kontakt zum Gerät
        //------------------------      
        lastContact = Math.round((new Date() - new Date(getState(id).ts)) / 1000 / 60);
        // 2b. wenn seit X Minuten kein Kontakt mehr besteht, nimm Gerät in Liste auf
        //Rechne auf Tage um, wenn mehr als 48 Stunden seit letztem Kontakt vergangen sind
        lastContactString=Math.round(lastContact) + " Minuten";
        if (Math.round(lastContact) > 100) {
            lastContactString=Math.round(lastContact/60) + " Stunden";
        } 
        if (Math.round(lastContact/60) > 48) {
            lastContactString=Math.round(lastContact/60/24) + " Tagen";
        } 
        if ( lastContact > maxMinutes) {
            arrOfflineDevices.push({device: deviceName, room: currRoom, lastContact: lastContactString});
        }
 
        // 3. Batteriestatus abfragen
        currDeviceBatteryString=currDeviceString+".battery";
        if (existsState(currDeviceBatteryString)) {
            batteryHealth=getState(currDeviceBatteryString).val + "%"; // Batteriestatus in %
            arrBatteryPowered.push({device: deviceName, room: currRoom, battery: batteryHealth});
        } else batteryHealth="-";
       
    arrListAllDevices.push({device: deviceName, room: currRoom, battery: batteryHealth, lastContact: lastContactString, link_quality: linkQuality});
 
    });
 
 
    // 1b. Zähle, wie viele Zigbee-Geräte existieren
    //---------------------------------------------       
    deviceCounter=arrLinkQualityDevices.length;
        //falls keine Geräte vorhanden sind, passe Datenpunkt-Inhalt der Geräte-Liste an
        if (deviceCounter == 0) { 
            arrLinkQualityDevices.push({device: "--keine--", room: "", link_quality: ""})
            arrListAllDevices.push({device: "--keine--", room: "", battery: "", lastContact: "", link_quality: ""});
        }
 
    // 2c. Wie viele Geräte sind offline?
    //------------------------   
    offlineDevicesCount=arrOfflineDevices.length;
        //falls keine Geräte vorhanden sind, passe Datenpunkt-Inhalt der Geräte-Liste an
        if (offlineDevicesCount == 0) { 
            arrOfflineDevices.push({device: "--keine--", room: "", lastContact: ""})
        }
 
    // 3c. Wie viele Geräte sind batteriebetrieben?
    //------------------------   
    batteryPoweredCount=arrBatteryPowered.length;
        //falls keine Geräte vorhanden sind, passe Datenpunkt-Inhalt der Geräte-Liste an
        if (batteryPoweredCount == 0) { 
            arrBatteryPowered.push({device: "--keine--", room: "", battery: ""})
        }
 
    // SETZE STATES
    setState(stateDevicesCount, deviceCounter);
    setState(stateDevicesLinkQuality, JSON.stringify(arrLinkQualityDevices));
    setState(stateDevicesOfflineCount, offlineDevicesCount);
    setState(stateDevicesOffline, JSON.stringify(arrOfflineDevices));
    setState(stateDevicesWithBatteryCount, batteryPoweredCount);
    setState(stateDevicesWithBattery, JSON.stringify(arrBatteryPowered));
    setState(stateDevicesInfoList, JSON.stringify(arrListAllDevices));
    setState(stateDevicesLastCheck, [formatDate(new Date(), "DD.MM.YYYY"),' - ',formatDate(new Date(), "hh:mm:ss")].join(''));
}
 
schedule("6 */1 * * *", function () {
    log("Run Zigbee-Watchdog");
    zigbeeWatchdog();
});
 
setTimeout (function () {
    log("Run Zigbee-Watchdog");
    zigbeeWatchdog();
}, 300);
