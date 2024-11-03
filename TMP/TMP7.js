/*
var params = {
    user: 'heizung@badur.name',
	offset: '-3',
	password: '6@3IPI0KtS0kNCQNWy',
	offset_name:'ioBroker'
}

var myPowerInterval = [null];
const { get } = require('request');
var request = require('request');

function SendRequestToContromeOLD(ContromeRaumID){
	var URL='http://10.1.24.200/set/json/v1/1/roomoffset/'+ContromeRaumID+'/';
	console.log('Controme Offset/Function Trigger: ' + URL);
	request.post({url:URL, formData: params}, function optionalCallback(err, httpResponse, body) {
	  if (err) {
		return console.error('Controme Offset/upload failed:', err);
	  }
	  console.log('Controme Offset/Upload successful!  Server responded with:', body);
	});		
}

var URL='http://10.1.24.200/set/json/v1/1/roomoffset/1/';
console.log('Controme Offset/Function Trigger: ' + URL);
*/
var URL='http://10.1.24.200/set/json/v1/1/roomoffset/1/';
httpPost(URL,
    {form: {
        user: 'heizung@badur.name',
	    offset: '-3',
	    password: '6@3IPI0KtS0kNCQNWy',
	    offset_name:'ioBroker'}
    },
    (err, response) => {
      const data = response.data;
      log (data);
    }
);
