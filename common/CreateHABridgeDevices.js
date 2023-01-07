var anz=0;
 
var habridgeURL = "http://10.1.24.16:80/api/devices"
var ioBrokerURL = "http://10.1.24.100:8087/set/"
 
/////////////////////////////////////////// 
function escapeRegExp(str) {
  return str.replace(/[\-[]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\><");
}
 
function delDevices(from_val,to_val,habridgeURL) {
    for (var i=from_val;i<=to_val;i++) {
      	var request = require('request');
		request.delete({
				headers: {'content-type': 'application/json'},
				url:     habridgeURL+"/"+i
		}, function(error, response, body) {
			if (error){
				return log(error, 'error');
			}
			log("Del Response: "+JSON.stringify(body));
		}); 
    }
}
 
function getDevice(val,habridgeURL) {
      	var request = require('sync-request');
		var erg = request.get({
				headers: {'content-type': 'application/json'},
				url:     habridgeURL+"/"+val
		}, function(error, response, body) {
			if (error){
				return log(error, 'error');
			}
			log("Get Response: "+body);
			log("GET-NAME:"+JSON.parse(body).name);
		});
}
 
function sendrequest(habridgeURL, params,id,devid){
    if (devid.length!==0) {  // ID Vorhanden, dh. hole Namen aus ha-bridge
      	var request = require('request');
		var erg = request.get({
				headers: {'content-type': 'application/json'},
				url:     habridgeURL+"/"+devid
		}, function(error, response, body) {
			if (error){
				return log(error, 'error');
			}
			// log("Get Response: "+body);
			// log("GET-NAME:"+JSON.parse(body).name);
            var name=JSON.parse(body).name;
            var addurl="";
            if (name===undefined) {
                log("NOT FOUND - "+devid);
                return;  // auskommentieren um nicht gefundene neu anzulegen!  <<<<<<<<<<<<<<<<<<<<<<<<<<<<
                params["id"]=null;
                sendrequest(habridgeURL, params,id,"");
            } else if (name.length>0) {
                params["name"]=name;
                addurl="/"+devid;
            }
            var request = require('request');
		    request.put({
				headers: {'content-type': 'application/json'},
				url:     habridgeURL+addurl,
				body:   params,
				json: true
		    }, function(error, response, body) {
			    if (error){
				    return log(error, 'error');
			    }
			    // log("Update Response: "+JSON.stringify(body));
	//		var regexp = escapeRegExp(ioBrokerURL)+"(.*)\\?value.*";
        	    log("update ok - "+devid); 
		    });
		});
    } else {
        var request = require('request');
		request.post({
				headers: {'content-type': 'application/json'},
				url:     habridgeURL,
				body:   params,
				json: true
		}, function(error, response, body) {
			if (error){
				return log(error, 'error');
			}
			// log("Response: "+JSON.stringify(body));
			var regexp = escapeRegExp(ioBrokerURL)+"(.*)\\?value.*";
            var patt = new RegExp(regexp);
            var result = patt.exec(body[0].onUrl);
            if (result!==null) {
			    log("ID für "+ decodeURI(result[1]) +" erhalten: " + body[0].id); 
			    if (!isNaN(body[0].id)) extendObject(decodeURI(result[1]), {common: {habridgeid: body[0].id}});
			} else {
			    log("update nok"); 
			}
		});
    }
}
 
function saveData(id,raum,devname,onurl,offurl,dimurl) {
	// log("Objekt: "+id);
	devid="";
	var params = {};
	if (isNaN((getObject(id).common.habridgeid))){
	    devid="";
    	log("++++++++ Neu "+id+devid+" ");
	} else {
	    devid=getObject(id).common.habridgeid;    
    	log("======== Update "+id+"-"+devid+"-");
	}
	    // devid="";  // add trotz ID
    	idu=encodeURI(id);
    	if (devid.length>0) {
    	    params["id"]=devid;
    	} 
    	params["name"]= devname;
    	params["deviceType"]= "switch";
    	params["onUrl"]= "[{\"item\":\""+ioBrokerURL+idu+"?value="+onurl+"\",\"type\":\"httpDevice\"}]";
    	if (offurl.length>0) params["offUrl"]= "[{\"item\":\""+ioBrokerURL+idu+"?value="+offurl+"\",\"type\":\"httpDevice\"}]";
    	if (dimurl.length>0) params["dimUrl"]= "[{\"item\":\""+ioBrokerURL+idu+"?value="+dimurl+"\",\"type\":\"httpDevice\"}]";
    	params["description"]= "\""+raum+"\"";
    	params["comments"]= id;
        //log (params);
    	sendrequest(habridgeURL,params,id,devid);
 
}
 
function callme(id,i,b,onurl,offurl,dimurl) {
       if (getObject(id) && anz<500) {
        var devname=getObject(id).common.name;
        var channel=getObject(id).common.name.split(":");
        var idteile=id.split(".");
        var dev="";
        var dp = getObject(id,"rooms");
        var raum=dp.enumNames;
        if (idteile.length>2) {
            dev=idteile[2];
        }
        if (raum.length===0) {
            raum="-"
        }
      if (b===false || raum!="-") { 
       anz=anz+1;
       log( '"'+id+'","'+channel[0]+'","'+devname+'","'+raum+'","'+dev+'"'+String.fromCharCode(10));
       saveData(id,raum,devname,onurl,offurl,dimurl);
      }
    } 
}
 
// callme 
//      id = Geraeteid
//      i  = Nummer (nicht verwendet)
//      b  = Nur Geräte mit Raum (true/false)
//      onurl = Wert für ON
//      offurl = Wert für OFF
//      dimurl = Wert für DIM ("${intensity.percent}")
 
//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 
//hier werden z.B. die im Unterverzeichnis L (gelernten) Geräte vom Broadlink übernommen.
//var states = $('broadlink2.0.*.L.*').each(function(id,i) { callme(id,i,false,"true","false",""); });
//hier die States
//var states = $('broadlink2.0.States.*').each(function(id,i) { callme(id,i,false,"true","false",""); });
//hire die Szenen
//var states = $('broadlink2.0.Scenes.*').each(function(id,i) { callme(id,i,false,"true","false",""); });
//hier wird der Scenen-Adapter von ioBroker bemüht. Alle Scenen werden importiert.
//var states = $('scene.0.*').each(function(id,i) { callme(id,i,false,"true","false",""); });
//hier werden alle Geräte von Homematic die einen Parameter SET… unterstützen übernommen
//var states = $('hm-rpc.0.*.SET*').each(function(id,i) { callme(id,i,true,"true","false",""); });
//hier werden alle Rollos (Erkennbar an LEVEL) übernommen. Hier wird 100 als Offen, 0 als Zu und Zwischenwerte möglich gesetzt.
//var states = $('hm-rpc.0.*.1.LEVEL').each(function(id,i) { callme(id,i,true,"100","0","${intensity.percent}"); });
//hier wird nur ein spezielles Rollo hinzugefügt.
//var states = $('hm-rpc.0.LEQ1023360.1.LEVEL').each(function(id,i) { callme(id,i,true,"100","0","${intensity.percent}"); });   

//kannst du entweder alle Devices löschen (von Nummer 25 bis 200 hier)
//oder lesen
//delDevices(25,200,habridgeURL);
//getDevice(25,habridgeURL);

//delDevices(100,104,habridgeURL);
var states = $('alias.0.Licht.Parkett').each(function(id,i) { callme(id,i,false,"true","false",""); });
var states = $('alias.0.Licht.Lounge').each(function(id,i) { callme(id,i,false,"true","false",""); });
var states = $('alias.0.Licht.Leinwand').each(function(id,i) { callme(id,i,false,"true","false",""); });

//nicht mehr aktualisieren lassen, da manuell in HA Bridge unter DIM on auf bri korrigiert wird
//var states = $('wled.0.8c4b14a6ded4.on').each(function(id,i) { callme(id,i,false,"true","false","${intensity.byte}"); });  

 
stopScript("");