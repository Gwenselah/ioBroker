// important, that ack=true
/* The adapter will provide the details in two states with different detail level

smart.lastCommand contains the received text including an info on type of query (intent). Example: "askDevice Status Rasenmäher"
smart.lastCommandObj* contains an JSON string that can be parsed to an object containing the following information
words contains the received words in an array
intent contains the type of query. Possible values currently are "askDevice", "controlDevice", "actionStart", "actionEnd", "askWhen", "askWhere", "askWho"
deviceId contains a deviceId identifying the device the request was send to, delivered by Amazon, will be empty string if not provided
sessionId contains a sessionId of the Skill session, should be the same if multiple commands were spoken, delivered by Amazon, will be empty string if not provided
userId contains a userId from the device owner (or maybe later the user that was interacting with the skill), delivered by Amazon, will be empty string if not provided
*/

// important, that ack=true
on({id: 'iot.0.smart.lastCommandObj', ack: true, change: 'any'}, obj => {
    // you have 200ms to prepare the answer and to write it into iot.X.smart.lastResponse
    const request = JSON.parse(obj.state.val);
    const response = {
        'responseText': 'Received phrase is: ' + request.words.join(' ') + '. Bye',
        'shouldEndSession': true
    };
    console.log ("Alexa words : " +  request.words.join(' '));
    console.log ("Alexa intent: " + request.intent);
    console.log ("Alexa deviceid: " + request.deviceid);
    console.log ("Alexa sessionid: " + request.sessionid);
    console.log ("Alexa userid: " + request.userid);

    // Return response via state
    setState('iot.0.smart.lastResponse', JSON.stringify(response)); // important, that ack=false (default)
    
    // or alternatively return as message
   // sendTo('iot.0', response);
});
/*
on({id: 'iot.0.smart.lastCommand', ack: true, change: 'any'}, obj => {
    // you have 200ms to prepare the answer and to write it into iot.X.smart.lastResponse
    log("### Last Command: " +obj.state.val);
    if(obj.state.val.match(/büro/) && obj.state.val.match(/luftfeuchtigkeit/))
    {
        var humVal = getState("hm-rpc.0.MEQxxxxxxx.1.HUMIDITY").val;
        setState("iot.0.smart.lastResponse", "Die Luftfeuchtigkeit im Büro liegt aktuell bei " +humVal+ " Prozent"); // important, that ack=false (default)
        //setState('iot.0.smart.lastResponse', 'Received phrase is: ' + obj.state.val); // important, that ack=false (default)
    }
});*/