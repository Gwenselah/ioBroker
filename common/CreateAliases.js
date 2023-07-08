/**************************************************************
Github - https://github.com/xCruziX/ioBroker-Creating-Alias/blob/master/CreateAlias.js
				Changelog
Version 1.1.5
- added flag for correcting source id

Version 1.1.4
- fix error by using bCreateAliasPath and bConvertExistingPath (has no target 9/Error creating alias-path)

Version 1.1.3
  - use callbacks in alias-path
  
**************************************************************/

/**************************************
		Flags /
		Variablen
***************************************/

// typeAlias = 'boolean'; // oder 'number'
// read = "val == 'Ein' ? true : false"; // Erkennung "Aus" --> false erfolgt automatisch  
// write = "val ? 'Ein' : 'Aus'";
// nameAlias = 'Licht Haustür';
// role = 'switch';
// desc = 'per Script erstellt';
// min = 0; // nur Zahlen
// max = 100; // nur Zahlen
// unit = '%'; // nur für Zahlen
// states = {0: 'Aus', 1: 'Auto', 2: 'Ein'}; // Zahlen (Multistate) oder Logikwert (z.B. Aus/Ein)
 
 
let bCreateAliasPath = false;  // If this flag is true, each folder is created seperately so rooms and functions can be assigned.

/*
Requirements: bCreateAliasPath == true
If this flag is true, existing folders in the path will be converted so rooms and functions can be assigned.
*/
let bConvertExistingPath = false;

/*
If the alias already exists and there is a difference between the new source id and the source id in the existing alias,
the source id will be changed.
This can be used for changing the source ids of an alias, for example for a devices change.
*/
let bCorrectSource = true;

/***************************************
		Dont't change anything from here /
		Ab hier nichts verändern
***************************************/

let arEnum = [];
let arId = [];
let timeoutAssignEnum;
var callbackAlias = undefined;
function createAlias(idSrc, idDst,raum, gewerk,typeAlias, read, write, nameAlias, role, desc, min, max, unit, states) {
  if(!idDst.includes('alias.0.'))
      idDst = 'alias.0.' + idDst;
  if(!existsObject(idSrc))
  {
      log('Source-Id ' + idSrc +' does not exists.','warn');
      return;
  }
  
  // Create the object Path for alias id, 
  // so you can assign rooms and function to the parents
  var createAliasPath = (id) => {
       if(bCreateAliasPath){
            let lisMergedIds = [];
            let mergedId = 'alias.0';
            id = id.replace(mergedId + '.', ''); // Remove prefix alias so it will not be changed
            let split = id.split('.'); 
            for(let i=0;i<split.length-1;i++){
                mergedId += '.' + split[i];
                lisMergedIds.push(mergedId);
            }
            
            function path(){
                if(lisMergedIds.length == 0) {// Zu Ende erstellt
                    alias();
                    return;
                }
                let tmpId = lisMergedIds[0];
                lisMergedIds.splice(0,1); // entferne element
                if(!existsObject(tmpId) || bConvertExistingPath){ // not exists
                    let obj;
                    if(existsObject(tmpId))
                        obj = getObject(tmpId);
                    else
                        obj = {};

                    let bApply = false;
                    if(obj != undefined){
                        if(obj.type == undefined || String(obj.type) != 'meta'){
                            obj.type = 'meta';
                            bApply = true;
                        }
                        if(obj.common == undefined){
                            obj.common = {};
                            obj.common.type = 'meta.folder';
                            bApply = true;
                        }
                        else if(obj.common.type == undefined || String(obj.common.type) != 'meta.folder'){
                            obj.common.type = 'meta.folder';
                            bApply = true;
                        }
                        if(obj.native == undefined){
                            obj.native = {};
                            bApply = true;
                        }
                    }
                    else{
                        path();
                        log('Object is undefined');
                        return;
                    }
                    

                    if(bApply){
                        setObject(tmpId, obj, (err) =>{
                        if(!err){
                            log('Created Alias-Path ' + tmpId);
                            path();
                        }
                        else
                            log('Error creating alias-path','error');
                    });
                    }
                    else
                        path();
                    
                }
            }
            path();
       }
       else
         alias();
  }
  
  
  function alias(){
      // Create alias object
      
        if(!existsObject(idDst)){
            let obj = {};
            obj.type = 'state';
            obj.common = getObject(idSrc).common;
            obj.common.alias = {};
            obj.common.alias.id = idSrc;
            if(typeAlias !== undefined) 
                obj.common.type = typeAlias;
            if(obj.common.read !== undefined) 
                obj.common.alias.read = read;
            if(obj.common.write !== undefined) 
                obj.common.alias.write = write;
            if(nameAlias !== undefined) 
                obj.common.name = nameAlias;
            if(role !== undefined) 
                obj.common.role = role;
            if(desc !== undefined) 
                obj.common.desc = desc;
            if(min !== undefined) 
                obj.common.min = min;
            if(max !== undefined) 
                obj.common.max = max;
            if(unit !== undefined) 
                obj.common.unit = unit;
            if(states !== undefined) 
                obj.common.states = states;

            obj.native = {};
//            obj.common.custom = []; // Damit die Zuordnung zu iQontrol, Sql etc. nicht übernommen wird
            obj.common.custom = {}; // Damit die Zuordnung zu iQontrol, Sql etc. nicht übernommen wird

            obj.common.smartName = {};

            if (raum !== undefined && raum.length > 0 && gewerk !== undefined && gewerk.length > 0) {
                //wenn raum und gewerk gesetzt ist, dann SmartName definieren, um die Namensautomatik vom iot auszuschalten
                obj.common.smartName.de = nameAlias;              

            };
        

            log('Created Alias-State ' + idDst);
            setObject(idDst, obj,(err) =>{ 
                if(!err)
                    startAttach(); 
                else
                    log('Error creating-alias','error');
            });
        } else if(bCorrectSource){
            // Check the Source ID
            //log('Checking Sourcepath');
            let obj = getObject(idDst);
            //log(obj);
            if(obj != undefined && obj.common != undefined && obj.common.alias != undefined && obj.common.alias.id != undefined
            && obj.common.alias.id != idSrc){
                let before = obj.common.alias.id;
                obj.common.alias.id = idSrc;
                setObject(idDst, obj,(err) =>{ 
                    if(!err){
                        log(idDst + ': Correcting Sourcepath from \''  + before + '\' to \'' +  idSrc + '\'');
                        startAttach(); 
                        setSmartName(); //weisst den Alias zu
                    }  else {
                        log('Error correcting path','error');
                    }});
            } else {
                startAttach();
                setSmartName(); //weisst den Alias zu
            }
        } else {
            startAttach(); //weisst Aufzählung Raum und Funktion zu
            setSmartName(); //weisst den Alias zu
        };
  }
  
  function setSmartName() {
    let obj = getObject(idDst);
    //log(obj);

    if (nameAlias == undefined) {
        if ((!obj.common.smartName) || obj.common.smartName.de) {
            //log ("smartName auf undefined setzen");      
            obj.common.smartName ={};
            setObject(idDst, obj,(err) =>{
                if(!err){
                    log(idDst + ': Deleting smartName');
                }  else {
                    log(idDst + ': Error Deleting smartName','error');
                }});
        };
    } else {
        if (obj.common.smartName == undefined || obj.common.smartName.de != nameAlias) {
            //log ("correct Smartname");
            if (raum !== undefined && raum.length > 0 && gewerk !== undefined && gewerk.length > 0) {
                //wenn raum und gewerk gesetzt ist, dann SmartName definieren, um die Namensautomatik vom iot auszuschalten          
                if (nameAlias != undefined) {
                    obj.common.smartName.de = nameAlias;    
                    setObject(idDst, obj,(err) =>{
                        if(!err){
                            log(idDst + ': Correcting smartName to \'' +  nameAlias + '\'');
                        }  else {
                            log(idDst + ': Error Correcting smartName to \'' +  nameAlias + '\'','error');
                        }});
                } 
            };
        }
//    } else {
//        log (idDst + ': smartName-tag im object has an error', 'warn')    
    }
  }
  
  // Save ID and Enum (room or function)
  var attach = (id, enu,value) => {
      if(id.length == 0){
          log('ID has lenght 0, can not attach to enum','warn');
          return;
      }
      if(value.length == 0){
          log('Value has lenght 0','warn');
          return;
      }
    
      let sEnuId = 'enum.' + enu + '.' + value;
      //log (sEnuId);
      if(enu.length > 0 && existsObject(sEnuId)) 
      {
          let obj = getObject(sEnuId)
          let members = obj.common.members;
          if(!members.includes(id)){
              arEnum.push(sEnuId);
              arId.push(id);
          }
      }
      else
   	      log('Can not find enum ' + sEnuId,'warn');
  }
 
 function startAttach(){
    let bRoom = raum !== undefined && raum.length > 0;
    let bGewerk = gewerk !== undefined && gewerk.length > 0;
    //log ('Start attach ' + bRoom + "/" + bGewerk);

    if(bRoom)
        attach(idDst,'rooms',raum);
    if(bGewerk)
        attach(idDst,'functions',gewerk);
    if(bRoom || bGewerk){
 /*ursprüngliche Funktion   
        if(timeoutAssignEnum){
            clearTimeout(timeoutAssignEnum);
            timeoutAssignEnum = null;
        }
        timeoutAssignEnum = setTimeout(function(){
            console.log("Callback Funktion wird aufgerufen");
            finishScript();
        },1000); 
*/        
        finishScript();
    }
 }
 
  createAliasPath(idDst);
}

function finishScript(){
	assignEnums();
}

// Add the saved IDs to the rooms/functions
function assignEnums(){
 //console.log ("Assign");
 if(arEnum.length == 0 || arId.length == 0){
      return;
 }

 if(arEnum.length != arId.length){
      log('Arrays have different size','error');
      return;
 }
 let mapEnumId = new Map();
 //log (arEnum.length);
 for(let i=0;i < arEnum.length; i++){
     let enu = arEnum[i];
     let id = arId[i];
     if(existsObject(id)){
    	 let obj = getObject(enu)
    	 let members;
    	 if(!mapEnumId.has(enu)){
    		 members = obj.common.members;
    		 mapEnumId.set(enu,members);
    	 }
    	 else
    		 members = mapEnumId.get(enu);    
    	 if(!members.includes(id)){
    		  log("Adding " + id + " to " + enu);
    		  members.push(id);
    	 }	      
     }
     else
         log('Can not find Alias ' + id,'error');
 }
  
  function setMembers(members,enu,map){
      let obj = getObject(enu);
      obj.common.members = members;
      setObject(enu,obj);
  }
  mapEnumId.forEach(setMembers);
}



/**********************************************************
  	END /
  	ENDE
**********************************************************/


//////////////////////////////
//  Fenster
//////////////////////////////
//einfache Fenstersensoren über rpc-Adapter in function fenster_alias
//{0: 'geschlossen', 1: 'geöffnet'}
//createAlias('hm-rpc.0.xxx.1.STATE'/*Wohnzimmer Fenster links STATE*/, 'Fenster.Wohnzimmer_Fenster_links', undefined, 'fenster_alias', 'number', undefined, undefined, undefined, 'window.value', 'per Script erstellt', 0, 1, '',{0: 'geschlossen', 1: 'geöffnet'})
//{false: 'geschlossen', true: 'geöffnet'}
//createAlias('hm-rpc.0.xxx.1.STATE'/*Küche Fenster links STATE*/, 'Fenster.Kueche_Fenster_links', undefined, 'fenster_alias', 'number',undefined, undefined, undefined, 'window.value', 'per Script erstellt', 0, 1, '',{0: 'geschlossen', 1: 'geöffnet'})
createAlias('deconz.0.Sensors.18.open'/*Schlafzimmer Fenster open*/, 'Fenster.Schlafzimmer', 'schlafzimmer', 'fenster_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'geschlossen', true: 'geöffnet'})
createAlias('deconz.0.Sensors.19.open'/*Büro klein Fenster open*/, 'Fenster.Büro_klein', 'büro_klein', 'fenster_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'geschlossen', true: 'geöffnet'})
createAlias('deconz.0.Sensors.20.open'/*Lea Fenster open*/, 'Fenster.Lea', 'lea', 'fenster_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'geschlossen', true: 'geöffnet'})
createAlias('deconz.0.Sensors.24.open'/*Bad Fenster open*/, 'Fenster.Bad', 'bad', 'fenster_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'geschlossen', true: 'geöffnet'})
createAlias('deconz.0.Sensors.25.open'/*Kino Fenster open*/, 'Fenster.Kino', 'kino', 'fenster_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'geschlossen', true: 'geöffnet'})
createAlias('deconz.0.Sensors.26.open'/*WC Fenster open*/, 'Fenster.WC', 'wc', 'fenster_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'geschlossen', true: 'geöffnet'})
createAlias('deconz.0.Sensors.27.open'/*Waschküche Fenster open*/, 'Fenster.Waschküche', 'waschkueche', 'fenster_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'geschlossen', true: 'geöffnet'})
createAlias('deconz.0.Sensors.7.open'/*Küchenfenster open*/, 'Fenster.Küche', 'Kueche', 'fenster_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'geschlossen', true: 'geöffnet'})
//createAlias('deconz.0.Sensors.8.open'/*Kai Fenster open*/, 'Fenster.Kai', 'kai', 'fenster_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'geschlossen', true: 'geöffnet'})

//////////////////////////////
//  Alarme
////////////////////////////// 
createAlias('deconz.0.Sensors.35.water'/*Wasseralarm*/, 'Alarm.Kinowasser', 'kino', 'alarm_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'ALARM'})



//////////////////////////////
//  Türen
////////////////////////////// 
//einfache Türensensoren über rpc-Adapter in function tueren_alias
createAlias('deconz.0.Sensors.21.open'/*Lea Tür open*/, 'Tueren.Lea', 'lea', 'tueren_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'geschlossen', true: 'geöffnet'})
createAlias('deconz.0.Sensors.22.open'/*Büro gross Tür open*/, 'Tueren.Büro_groß', 'büro_gross', 'tueren_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'geschlossen', true: 'geöffnet'})
createAlias('deconz.0.Sensors.23.open'/*Schlafzimmer Tür open*/, 'Tueren.Schlafzimmer', 'schlafzimmer', 'tueren_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'geschlossen', true: 'geöffnet'})
createAlias('deconz.0.Sensors.4.open'/*Wohnzimmer Türe rechts open*/, 'Tueren.Wohnzimmer_Rechts', 'wohnzimmer', 'tueren_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'geschlossen', true: 'geöffnet'})
createAlias('deconz.0.Sensors.5.open'/*Wohnzimmer Türe links open*/, 'Tueren.Wohnzimmer_Links', 'wohnzimmer', 'tueren_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'geschlossen', true: 'geöffnet'})
createAlias('deconz.0.Sensors.6.open'/*Garage open*/, 'Tueren.Garage', 'garage', 'tueren_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'geschlossen', true: 'geöffnet'})
createAlias('deconz.0.Sensors.8.open'/*Haustür open*/, 'Tueren.Haustür', 'windfang', 'tueren_alias', 'boolean', undefined, false, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'geschlossen', true: 'geöffnet'})

//////////////////////////////
//  Temperaturen
//////////////////////////////
//Temperaturen in function temperaturen_alias
createAlias('controme.0.1.actualTemperature'/*Büro klein actual temperature*/, 'Temperaturen.Temperatur_Büro_klein', 'büro_klein', 'temperaturen_alias', 'number', 'Math.round(val * 10) / 10', false, 'Büro klein', 'value.temperature', 'per Script erstellt', undefined, undefined, '°C', undefined)
createAlias('controme.0.2.actualTemperature'/*Schlafzimmer actual temperature*/, 'Temperaturen.Temperatur_Schlafzimmer', 'schlafzimmer', 'temperaturen_alias', 'number', 'Math.round(val * 10) / 10', false, 'Schlafzimmer', 'value.temperature', 'per Script erstellt', undefined, undefined, '°C', undefined)
createAlias('controme.0.3.actualTemperature'/*Bad actual temperature*/, 'Temperaturen.Temperatur_Bad', 'bad', 'temperaturen_alias', 'number', 'Math.round(val * 10) / 10', false, 'Bad', 'value.temperature', 'per Script erstellt', undefined, undefined, '°C', undefined)
createAlias('controme.0.4.actualTemperature'/*Kai actual temperature*/, 'Temperaturen.Temperatur_Kai', 'kai', 'temperaturen_alias', 'number', 'Math.round(val * 10) / 10', false, 'Kai', 'value.temperature', 'per Script erstellt', undefined, undefined, '°C', undefined)
createAlias('controme.0.5.actualTemperature'/*Lea actual temperature*/ ,'Temperaturen.Temperatur_Lea', 'lea', 'temperaturen_alias', 'number', 'Math.round(val * 10) / 10', false, 'Lea', 'value.temperature', 'per Script erstellt', undefined, undefined, '°C', undefined)
createAlias('controme.0.6.actualTemperature'/*Büro groß actual temperature*/, 'Temperaturen.Temperatur_Büro_gross', 'büro_gross', 'temperaturen_alias', 'number', 'Math.round(val * 10) / 10', false, 'Büro groß', 'value.temperature', 'per Script erstellt', undefined, undefined, '°C', undefined)
createAlias('controme.0.7.actualTemperature'/*Flur actual temperature*/, 'Temperaturen.Temperatur_Flur', 'windfang', 'temperaturen_alias', 'number', 'Math.round(val * 10) / 10', false, 'Windfang', 'value.temperature', 'per Script erstellt', undefined, undefined, '°C', undefined)
createAlias('controme.0.8.actualTemperature'/*WC actual temperature*/, 'Temperaturen.Temperatur_WC', 'wc', 'temperaturen_alias', 'number', 'Math.round(val * 10) / 10', false, 'WC', 'value.temperature', 'per Script erstellt', undefined, undefined, '°C', undefined)
createAlias('controme.0.9.actualTemperature'/*Küche actual temperature*/, 'Temperaturen.Temperatur_Küche', 'Kueche', 'temperaturen_alias', 'number', 'Math.round(val * 10) / 10', false, 'Küche', 'value.temperature', 'per Script erstellt', undefined, undefined, '°C', undefined)
createAlias('controme.0.10.actualTemperature'/*Wohnzimmer actual temperature*/, 'Temperaturen.Temperatur_Wohnzimmer', 'wohnzimmer', 'temperaturen_alias', 'number', 'Math.round(val * 10) / 10', false, 'Wohnzimmer', 'value.temperature', 'per Script erstellt', undefined, undefined, '°C', undefined)

createAlias('sainlogic.0.weather.current.1.outdoortemp'/*Kachelofen actual temperature*/, 'Temperaturen.Temperatur_Kachelofen', 'wohnzimmer', 'temperaturen_alias', 'number', 'Math.round(val * 10) / 10', false, 'Wohnzimmer', 'value.temperature', 'per Script erstellt', undefined, undefined, '°C', undefined)
createAlias('controme.0.11.actualTemperature'/*Windfang actual temperature*/, 'Temperaturen.Temperatur_Windfang', 'windfang', 'temperaturen_alias', 'number', 'Math.round(val * 10) / 10', false, 'Windfang', 'value.temperature', 'per Script erstellt', undefined, undefined, '°C', undefined)
createAlias('sainlogic.0.weather.current.outdoortemp'/*Außentemperature*/, 'Temperaturen.Temperatur_Aussen', 'herrenberg', 'temperaturen_alias', 'number', 'Math.round(val * 10) / 10', false, 'Draußen', 'value.temperature', 'per Script erstellt', undefined, undefined, '°C', undefined)

createAlias('shelly.0.SHHT-1#78D8B6#1.tmp.temperatureC'/*Kino1 (Shelly)*/, 'Temperaturen.Temperatur_Kino_Umwelt1', 'kino', 'temperaturen_alias', 'number', 'Math.round(val * 10) / 10', false, 'Kino', 'value.temperature', 'per Script erstellt', undefined, undefined, '°C', undefined)
createAlias('controme.0.13.actualTemperature'/*Kino actual temperature*/, 'Temperaturen.Temperatur_Kino_Umwelt3', 'kino', undefined, 'number', 'Math.round(val * 10) / 10', false, undefined, 'value.temperature', 'per Script erstellt', undefined, undefined, '°C', undefined)

//////////////////////////////
//  Luftfeuchtigkeit
//////////////////////////////
createAlias('shelly.0.SHHT-1#78D8B6#1.hum.value'/*Kino1 Humidity(Shelly)*/, 'Luftfeuchtigkeiten.Luftfeuchtigkeit_Kino_Umwelt1', 'kino', 'luftfeuchtigkeiten_alias', 'number', undefined, false, 'Kino_Luftfeuchtigkeit', 'value.temperature', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('sainlogic.0.weather.current.outdoorhumidity'/*Draussen*/, 'Luftfeuchtigkeiten.Luftfeuchtigkeit_Aussen', 'herrenberg', 'luftfeuchtigkeiten_alias', 'number', undefined, false, 'Aussen_Luftfeuchtigkeit', 'value.temperature', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)

//////////////////////////////
//  Steckdosen
//////////////////////////////
// Steckdosen in function steckdosen_alias
//{false: 'aus', true: 'an'}
//createAlias(, 'Steckdosen.Waschmaschine', undefined, 'steckdosen_alias', 'boolean', undefined, undefined, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('shelly.0.SHPLG-S#4022D882E6CC#1.Relay0.Switch'/*Arbeit POWER*/, 'Steckdosen.Arbeit', 'büro_gross', 'steckdosen_alias', 'boolean', undefined, undefined, 'Arbeit', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('sonoff.0.Disher.POWER'/*Disher POWER*/, 'Steckdosen.Geschirrspüler', 'Kueche', 'steckdosen_alias', 'boolean', undefined, undefined, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('sonoff.0.Dryer.POWER'/*Dryer POWER*/, 'Steckdosen.Trockner', 'waschkueche', 'steckdosen_alias', 'boolean', undefined, undefined, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('shelly.0.SHPLG-S#4022D881C2E0#1.Relay0.Switch'/*Ender POWER*/, 'Steckdosen.Ender', 'büro_gross', 'steckdosen_alias', 'boolean', undefined, undefined, 'Ender', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('sonoff.0.Statusdisplay.POWER'/*Statusdisplay POWER*/, 'Steckdosen.Statusdisplay', 'esszimmer', 'steckdosen_alias', 'boolean', undefined, undefined, 'Statusdisplay', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('sonoff.0.Washer_Left.POWER'/*Washer Left POWER*/, 'Steckdosen.Waschmaschine_Links', 'waschkueche', 'steckdosen_alias', 'boolean', undefined, undefined, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('sonoff.0.Washer_Right.POWER'/*Washer Right POWER*/, 'Steckdosen.Waschmaschine_Rechts', 'waschkueche', 'steckdosen_alias', 'boolean', undefined, undefined, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('sonoff.0.XBOX_PC.POWER'/*Xbox pc power*/, 'Steckdosen.XBOX_PC', 'büro_klein', 'steckdosen_alias', 'boolean', undefined, undefined, 'Computer Tina', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('deconz.0.Lights.3.on'/*Light 3 on*/, 'Steckdosen.Wohnzimmer_Entertainment', 'wohnzimmer', 'steckdosen_alias', 'boolean', undefined, undefined, 'Entertainment', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
//createAlias('deconz.0.Lights.4.on'/*Light 4 on*/, 'Steckdosen.WLAN_DG','schlafzimmer', 'steckdosen_alias', 'boolean', undefined, undefined, 'WLAN oben', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('deconz.0.Lights.5.on'/*Light 5 on*/, 'Steckdosen.Klimagerät', 'büro_gross', 'steckdosen_alias', 'boolean', undefined, undefined, 'Klimagerät', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('deconz.0.Lights.8.on'/*undefined on*/, 'Steckdosen.CPAP', 'schlafzimmer', 'steckdosen_alias', 'boolean', undefined, undefined, 'CPAP', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('sonoff.0.Kinositze.POWER', 'Steckdosen.Kinositze', 'kino', 'steckdosen_alias', 'boolean', undefined, undefined, 'Kinositze', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('sonoff.0.Kino.POWER1', 'Steckdosen.Kinotechnik', 'kino', 'steckdosen_alias', 'boolean', undefined, undefined, 'Kinotechnik', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('shelly.0.SHPLG-S#4022D88353D0#1.Relay0.Switch'/*KaiPc power*/, 'Steckdosen.KaiPC', 'kai', 'steckdosen_alias', 'boolean', undefined, undefined, 'KaiPC', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('shelly.0.shellypro1#30c6f78ad5e8#1.Relay0.Switch'/*Sprechstelle power*/, 'Steckdosen.Sprechstelle', 'esszimmer', 'steckdosen_alias', 'boolean', undefined, undefined, 'Sprechstelle', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('shelly.0.SHPLG-S#4022D882E4CB#1.Relay0.Switch'/*Wohnzimmer Couch*/, 'Steckdosen.Couch', 'wohnzimmer', 'steckdosen_alias', 'boolean', undefined, undefined, 'Couch', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('shelly.0.SHSW-1#E2D477#1.Relay0.Switch'/*Terrasse*/, 'Steckdosen.Terrasse', 'terrasse', 'steckdosen_alias', 'boolean', undefined, undefined, 'Terrasse', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('shelly.0.SHPLG-S#C8C9A3A5016E#1.Relay0.Switch'/*Satanlage*/, 'Steckdosen.Satanlage', 'waschkueche', 'steckdosen_alias', 'boolean', undefined, undefined, 'Satanlage', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('shelly.0.SHPLG-S#C8C9A3A5C4F9#1.Relay0.Switch'/*Wallbox*/, 'Steckdosen.Wallbox', 'garage', 'steckdosen_alias', 'boolean', undefined, undefined, 'Satanlage', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})



//////////////////////////////
//  Licht
//////////////////////////////
//Licht in function licht_alias
//{false: 'aus', true: 'an'}
//createAlias(, 'Licht.Badezimmer_Licht_links', undefined, 'licht_alias', 'boolean', undefined, undefined, 'Badezimmer links', 'switch.light', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('shelly.0.SHPLG-S#F8CDE9#1.Relay0.Switch'/*Switch*/, 'Licht.Lea_Mond', 'lea', 'licht_alias', 'boolean', undefined, undefined, 'Mond', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('shelly.0.SHSW-1#E09CD6#1.Relay0.Switch'/*Switch*/, 'Licht.Wohnzimmer_Deckenlampe', 'wohnzimmer', 'licht_alias', 'boolean', undefined, undefined, 'Wohnzimmer Deckenlampe', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('shelly.0.SHSW-1#E1FE99#1.Relay0.Switch'/*Switch*/, 'Licht.Esszimmer_Deckenlampe', 'esszimmer', 'licht_alias', 'boolean', undefined, undefined, 'Esszimmer Deckenlampe', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('shelly.0.SHSW-25#483FDA82436B#1.Relay0.Switch'/*Switch*/, 'Licht.Schlafzimmer_Lampe_Links', 'schlafzimmer', 'licht_alias', 'boolean', undefined, undefined, 'Schlafzimmmer Lampe Links', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('shelly.0.SHSW-25#483FDA82436B#1.Relay1.Switch'/*Switch*/, 'Licht.Schlafzimmer_Lampe_Rechts', 'schlafzimmer', 'licht_alias', 'boolean', undefined, undefined, 'Schlafzimmmer Lampe Rechts', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('deconz.0.Lights.1.on'/*Light 1 on*/, 'Licht.Esszimmer_Schranklicht', 'esszimmer', 'licht_alias', 'boolean', undefined, undefined, 'Esszimmer Schranklicht', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('deconz.0.Lights.2.on'/*Light 2 on*/, 'Licht.Wohnzimmer_Ecklampe', 'wohnzimmer', 'licht_alias', 'boolean', undefined, undefined, 'Wohnzimmer Ecklampe', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('fritzdect.0.DECT_087610274750.state'/*Switch Status and Control*/, 'Licht.Wohnzimmer_Schranklicht', 'wohnzimmer', 'licht_alias', 'boolean', undefined, undefined, 'Wohnzimmer Schranklicht', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('sonoff.0.Weihnachtsbaum.POWER'/*Light 2 on*/, 'Licht.Weihnachtsbaum', 'wohnzimmer', 'licht_alias', 'boolean', undefined, undefined, 'Weihnachtsbaum', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('shelly.0.SHSW-1#E2D5C6#1.Relay0.Switch'/*Switch*/, 'Licht.Garage', 'garage', 'licht_alias', 'boolean', undefined, undefined, 'Garage', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})

createAlias('sonoff.0.Kino.POWER2'/*Kino  POWER2*/, 'Licht.Parkett', 'kino', 'licht_alias', 'boolean', undefined, undefined, 'Parkett Licht', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('sonoff.0.Kino.POWER3'/*Kino  POWER3*/, 'Licht.Leinwand', 'kino', 'licht_alias', 'boolean', undefined, undefined, 'Leinwand Licht', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('sonoff.0.Kino.POWER4'/*Kino  POWER4*/, 'Licht.Lounge', 'kino', 'licht_alias', 'boolean', undefined, undefined, 'Lounge Licht', 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('wled.0.8c4b14a6ded4.on'/*On / Off*/, 'Licht.Kino_LED_on', 'kino', 'licht_alias', 'boolean', undefined, undefined, undefined, 'switch', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})
createAlias('wled.0.8c4b14a6ded4.bri'/*Brightness of the light*/, 'Licht.Kino_LED_bri', 'kino', undefined, 'number', undefined, undefined, undefined, 'value.brightness', 'per Script erstellt', undefined, undefined, undefined, {false: 'aus', true: 'an'})


//////////////////////////////
//  Batterien Prozent
//////////////////////////////
//createAlias(, 'Batterien_Prozent.Ha', undefined, 'batterien_prozent_alias', 'number', undefined, false, 'Haussteuerung Tablet', 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.18.battery'/*Schlafzimmer Fenster battery*/, 'Batterien_Prozent.Schlafzimmer_Fenster', 'schlafzimmer', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.19.battery'/*Büro klein Fenster battery*/, 'Batterien_Prozent.Büro_klein_Fenster', 'büro_klein', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.20.battery'/*Lea Fenster battery*/, 'Batterien_Prozent.Lea_Fenster', 'lea', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.21.battery'/*Lea Tür battery*/, 'Batterien_Prozent.Lea_Tür', 'lea', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.22.battery'/*Büro gross battery*/, 'Batterien_Prozent.Büro_groß_Tür', 'büro_gross', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.23.battery'/*Schlafzimmer Tür battery*/, 'Batterien_Prozent.Schlafzimmer_Tür', 'schlafzimmer', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.24.battery'/*Bad Fenster battery*/, 'Batterien_Prozent.Bad_Fenster', 'bad', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.25.battery'/*Kino Fenster battery*/, 'Batterien_Prozent.Kino_Fenster', 'kino', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.26.battery'/*WC Fenster battery*/, 'Batterien_Prozent.WC_Fenster', 'wc', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.27.battery'/*Waschküche Fenster battery*/, 'Batterien_Prozent.Waschküche_Fenster', 'waschkueche', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.30.battery'/*TRADFRI remote control  battery*/, 'Batterien_Prozent.Remote_Control_Tina', 'schlafzimmer', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.31.battery'/*TRADFRI remote control  battery*/, 'Batterien_Prozent.Remote_Control_Andy', 'schlafzimmer', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.4.battery'/*Wohnzimmer Türe rechts battery*/, 'Batterien_Prozent.Wohnzimmer_Türe_Rechts', 'wohnzimmer', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.5.battery'/*Wohnzimmer Türe links battery*/, 'Batterien_Prozent.Wohnzimmer_Türe_Links', 'wohnzimmer', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.6.battery'/*Garage battery*/, 'Batterien_Prozent.Garage', 'garage', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.7.battery'/*Küchenfenster battery*/, 'Batterien_Prozent.Küchenfenster', 'Kueche', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
//createAlias('deconz.0.Sensors.8.battery'/*Kai Fenster battery*/, 'Batterien_Prozent.Kai_Fenster', undefined, 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.8.battery'/*Haustür battery*/, 'Batterien_Prozent.Haustür_Fenster', 'windfang', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('shelly.0.SHHT-1#78D8B6#1.bat.value'/*Shelly HT im Kino Batterie*/, 'Batterien_Prozent.Kino1', 'kino', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('deconz.0.Sensors.35.battery'/*Wasser battery*/, 'Batterien_Prozent.Kinowassersensor', 'kino', 'batterien_prozent_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)



//////////////////////////////
//  Batterien_Volt
//////////////////////////////
//2 x Batterien Volt Anzeige in function batterien_volt_alias
createAlias('mqtt.0.weather.solarweatherstation.battv'/*Wetterstation Spannung*/, 'Batterien_Volt.Wetterstation', 'herrenberg', 'batterien_volt_alias', 'number', undefined, undefined, undefined, 'value.voltage', 'per Script erstellt', undefined, undefined, 'Volt', undefined)
//createAlias('hm-rpc.0.xxx.0.OPERATING_VOLTAGE'/*Küche Fenster links:0 OPERATING VOLTAGE*/, 'Batterien_Volt.Kueche_Fenster_links', undefined, 'batterien_volt_alias', 'number', undefined, undefined, 'Küche Fenster links', 'value.voltage', 'per Script erstellt', undefined, undefined, 'Volt', undefined)
 
 

//////////////////////////////
//  Rollladen
//////////////////////////////
//createAlias(, 'Rollladen.XXX', undefined, 'rollladen_alias', 'number', undefined, false, 'Haussteuerung Tablet', 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('shelly.0.SHSW-25#00869E#1.Shutter.Position'/*Position Schlafzimmer*/, 'Rollladen.Schlafzimmer', 'schlafzimmer', 'rollladen_alias', 'number', undefined, false, 'Rollladen Schlafzimmer', 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('shelly.0.SHSW-25#00869E#1.Shutter.Pause'/*Stop Schlafzimmer*/,'Rollladen.Schlafzimmer_Stop', 'schlafzimmer', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#00869E#1.Shutter.Open'/*Open Schlafzimmer*/,'Rollladen.Schlafzimmer_Open', 'schlafzimmer', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#00869E#1.Shutter.Close'/*Close Schlafzimmer*/,'Rollladen.Schlafzimmer_Close', 'schlafzimmer', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)

createAlias('shelly.0.SHSW-25#68C63AF98402#1.Shutter.Position'/*Position Kai*/, 'Rollladen.Kai', 'kai', 'rollladen_alias', 'number', undefined, false, 'Rollladen Kai', 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('shelly.0.SHSW-25#68C63AF98402#1.Shutter.Pause'/*Stop Kai*/,'Rollladen.Kai_Stop', 'kai', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#68C63AF98402#1.Shutter.Open'/*Open Kai*/,'Rollladen.Kai_Open', 'kai', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#68C63AF98402#1.Shutter.Close'/*Close Kai*/,'Rollladen.Kai_Close', 'kai', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)

createAlias('shelly.0.SHSW-25#68C63AF963F3#1.Shutter.Position'/*Position Lea Fenster*/, 'Rollladen.Lea_Fenster', 'lea', 'rollladen_alias', 'number', undefined, false, 'Rollladen Lea Fenster', 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('shelly.0.SHSW-25#68C63AF963F3#1.Shutter.Pause'/*Stop Lea_Fenster*/,'Rollladen.Lea_Fenster_Stop', 'lea', 'rollladen_alias',  'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#68C63AF963F3#1.Shutter.Open'/*Open Lea_Fenster*/,'Rollladen.Lea_Fenster_Open', 'lea', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#68C63AF963F3#1.Shutter.Close'/*Close Lea_Fenster*/,'Rollladen.Lea_Fenster_Close', 'lea', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)

createAlias('shelly.0.SHSW-25#007CC3#1.Shutter.Position'/*Position Lea Türe*/, 'Rollladen.Lea_Türe', 'lea', 'rollladen_alias', 'number', undefined, false, 'Rollladen Lea Türe', 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('shelly.0.SHSW-25#007CC3#1.Shutter.Pause'/*Stop Lea_Türe*/,'Rollladen.Lea_Türe_Stop', 'lea', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#007CC3#1.Shutter.Open'/*Open Lea_Türe*/,'Rollladen.Lea_Türe_Open', 'lea', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#007CC3#1.Shutter.Close'/*Close Lea_Türe*/,'Rollladen.Lea_Türe_Close', 'lea', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)

createAlias('shelly.0.SHSW-25#68C63AF994B6#1.Shutter.Position'/*Position* Büro groß*/, 'Rollladen.Büro_groß', 'büro_gross', 'rollladen_alias', 'number', undefined, false, 'Rollladen Büro groß', 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('shelly.0.SHSW-25#68C63AF994B6#1.Shutter.Pause'/*Stop Büro_groß*/,'Rollladen.Büro_groß_Stop', 'büro_gross', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#68C63AF994B6#1.Shutter.Open'/*Open Büro_groß*/,'Rollladen.Büro_groß_Open', 'büro_gross', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#68C63AF994B6#1.Shutter.Close'/*Close Büro_groß*/,'Rollladen.Büro_groß_Close', 'büro_gross', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)

createAlias('shelly.0.SHSW-25#00CDCF#1.Shutter.Position'/*Position Wohnzimmer Rollladen Links*/, 'Rollladen.Wohnzimmer_Links', 'wohnzimmer', 'rollladen_alias', 'number', undefined, false, 'Rollladen Wohnzimmer Links', 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('shelly.0.SHSW-25#00CDCF#1.Shutter.Pause'/*Stop Wohnzimmer_Links*/,'Rollladen.Wohnzimmer_Links_Stop', 'wohnzimmer', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#00CDCF#1.Shutter.Open'/*Open Wohnzimmer_Links*/,'Rollladen.Wohnzimmer_Links_Open', 'wohnzimmer', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#00CDCF#1.Shutter.Close'/*Close Wohnzimmer_Links*/,'Rollladen.Wohnzimmer_Links_Close', 'wohnzimmer', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)

createAlias('shelly.0.SHSW-25#4C7525348982#1.Shutter.Position'/*Position Wohnzimmer Rollladen Rechts*/, 'Rollladen.Wohnzimmer_Rechts', 'wohnzimmer', 'rollladen_alias', 'number', undefined, false, 'Rollladen Wohnzimmer Rechts', 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('shelly.0.SHSW-25#4C7525348982#1.Shutter.Pause'/*Stop Wohnzimmer*/,'Rollladen.Wohnzimmer_Rechts_Stop', 'wohnzimmer', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#4C7525348982#1.Shutter.Open'/*Open Wohnzimmer*/,'Rollladen.Wohnzimmer_Rechts_Open', 'wohnzimmer', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#4C7525348982#1.Shutter.Close'/*Close Wohnzimmer*/,'Rollladen.Wohnzimmer_Rechts_Close', 'wohnzimmer', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)

createAlias('shelly.0.SHSW-25#68C63AF98CD1#1.Shutter.Position'/*Position Küche*/, 'Rollladen.Küche', 'Kueche', 'rollladen_alias', 'number', undefined, false, 'Rollladen Küche', 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('shelly.0.SHSW-25#68C63AF98CD1#1.Shutter.Pause'/*Stop Küche*/,'Rollladen.Küche_Stop', 'Kueche', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#68C63AF98CD1#1.Shutter.Open'/*Open Küche*/,'Rollladen.Küche_Open', 'Kueche', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#68C63AF98CD1#1.Shutter.Close'/*Close Küche*/,'Rollladen.Küche_Close', 'Kueche', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)

createAlias('shelly.0.SHSW-25#C45BBE79438B#1.Shutter.Position'/*Position Bad*/, 'Rollladen.Bad', 'bad', 'rollladen_alias', 'number', undefined, false, 'Rollladen Bad', 'value', 'per Script erstellt', undefined, undefined, 'Prozent', undefined)
createAlias('shelly.0.SHSW-25#C45BBE79438B#1.Shutter.Pause'/*Stop Bad*/,'Rollladen.Bad_Stop', 'bad', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#C45BBE79438B#1.Shutter.Open'/*Open Bad*/,'Rollladen.Bad_Open', 'bad', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)
createAlias('shelly.0.SHSW-25#C45BBE79438B#1.Shutter.Close'/*Close Bad*/,'Rollladen.Bad_Close', 'bad', 'rollladen_alias', 'boolean', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, undefined, undefined)

//////////////////////////////
//  Power Measurement
//////////////////////////////
//createAlias(''/**/,'PowerMeasurement.', '', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHPLG-S#F8CDE9#1.Relay0.Power'/*Lea Mond*/,'PowerMeasurement.LeaMond', 'lea', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHPLG-S#4022D881C2E0#1.Relay0.Power'/*Ender*/,'PowerMeasurement.Ender', 'büro_gross', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHPLG-S#4022D882E6CC#1.Relay0.Power'/*Arbeitstisch*/,'PowerMeasurement.Arbeitstisch', 'büro_gross', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHPLG-S#4022D882E4CB#1.Relay0.Power'/*Wohnzimmer Couch*/,'PowerMeasurement.WohnzimmerCouch', 'wohnzimmer', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHPLG-S#4022D88353D0#1.Relay0.Power'/*KaiPC*/,'PowerMeasurement.KaiPC', 'kai', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHPLG-S#C8C9A3A5C4F9#1.Relay0.Power'/*Wallbox*/,'PowerMeasurement.Wallbox', 'garage', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHSW-25#007CC3#1.Shutter.Power'/*Lea Rollladen Türe*/,'PowerMeasurement.LeaRollladenTuere', 'lea', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHSW-25#68C63AF963F3#1.Shutter.Power'/*Lea Rollladen Fenster*/,'PowerMeasurement.LeaRollladenFenster', 'lea', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHSW-25#00869E#1.Shutter.Power'/*Schlafzimmer Fenster*/,'PowerMeasurement.SchlafzimmerFenster', 'schlafzimmer', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHSW-25#00CDCF#1.Shutter.Power'/*Wohnzimmer Rollladen Links*/,'PowerMeasurement.WohnzimmerRollladenLinks', 'wohnzimmer', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHSW-25#4C7525348982#1.Shutter.Power'/*Wohnzimmer Rollladen Rechts*/,'PowerMeasurement.WohnzimmerRollladenRechts', 'wohnzimmer', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHSW-25#483FDA82436B#1.Relay0.Power'/*Schlafzimmer Licht Links*/,'PowerMeasurement.SchlafzimmerLichtLinks', 'schlafzimmer', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHSW-25#483FDA82436B#1.Relay1.Power'/*Schlafzimmer Licht Rechts*/,'PowerMeasurement.SchlafzimmerLichtRechts', 'schlafzimmer', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHSW-25#68C63AF98402#1.Shutter.Power'/*Kai Rollladen*/,'PowerMeasurement.KaiRollladen', 'kai', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHSW-25#68C63AF98CD1#1.Shutter.Power'/*Küche Rollladen*/,'PowerMeasurement.KuecheRollladen', 'Kueche', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHSW-25#68C63AF994B6#1.Shutter.Power'/*Büro gross Rollladen*/,'PowerMeasurement.BüroGroßRollladen', 'büro_gross', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('shelly.0.SHSW-25#C45BBE79438B#1.Shutter.Power'/*Bad Rollladen*/,'PowerMeasurement.BadRollladen', 'bad', 'powermeasurement_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)

createAlias('sonoff.0.Disher.ENERGY_Power'/*Disher ENERGY*/, 'PowerMeasurement.Geschirrspüler', 'Kueche', 'powermeasurement_alias', 'number', undefined, undefined, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('sonoff.0.Dryer.ENERGY_Power'/*Dryer ENERGY*/, 'PowerMeasurement.Trockner', 'waschkueche', 'powermeasurement_alias', 'number', undefined, undefined, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('sonoff.0.Washer_Left.ENERGY_Power'/*Washer Left ENERGY*/, 'PowerMeasurement.Waschmaschine_Links', 'waschkueche', 'powermeasurement_alias', 'number', undefined, undefined, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('sonoff.0.Washer_Right.ENERGY_Power'/*Washer Right ENERGY*/, 'PowerMeasurement.Waschmaschine_Rechts', 'waschkueche', 'powermeasurement_alias', 'number', undefined, undefined, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('sonoff.0.XBOX_PC.ENERGY_Power'/*Xbox pc ENERGY*/, 'PowerMeasurement.XBOX_PC', 'büro_klein', 'powermeasurement_alias', 'number', undefined, undefined, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('sonoff.0.Kinositze.ENERGY_Power'/*Kinositze ENERGY*/, 'PowerMeasurement.Kinositze', 'kino', 'powermeasurement_alias', 'number', undefined, undefined, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)
createAlias('sonoff.0.Weihnachtsbaum.ENERGY_Power'/*Weihnachtsbaum Power*/, 'PowerMeasurement.Weihnachtsbaum', 'wohnzimmer', 'powermeasurement_alias', 'number', undefined, undefined, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)



//der Werte dürfen nicht in den PowerMeasuerment Alias
createAlias('mqtt.0.powermeter.main.value'/*Hauszählerstand*/,'PowerMeasurement.Hauszähler', 'waschkueche', undefined, 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'kWh', undefined)
createAlias('shelly.0.SHPLG-S#C8C9A3A5C4F9#1.Relay0.Energy'/*Wallbox*/,'PowerMeasurement.WallboxTotal', 'garage', undefined, 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'kWh', undefined)

//Solar
createAlias('shelly.0.SHPLG-S#7C87CEB4BB7A#1.Relay0.Power'/*Inverter*/,'Solar.InverterMeasurement', 'terrasse', 'solar_alias', 'number', undefined, false, undefined, 'value', 'per Script erstellt', undefined, undefined, 'Watt', undefined)


stopScript("");
