var timeout, timeout2, On_call_states, callerName, caller, speak, Intervall;

on({id: "tr-064.0.callmonitor.ringing", val: true}, function (obj) {
  var value = obj.state.val;
  var oldValue = obj.oldState.val;
  (function () {if (timeout) {clearTimeout(timeout); timeout = null;}})();
  timeout = setTimeout(function () {
    if (getState("tr-064.0.callmonitor.toPauseState").val == 'ring') {
      timeout2 = setTimeout(function () {
        On_call_states = getState("tr-064.0.callmonitor.toPauseState").val;
        callerName = getState("tr-064.0.callmonitor.inbound.callerName").val;
        caller = getState("tr-064.0.callmonitor.inbound.caller").val;
        speak = 'alexa2.0.Echo-Devices.G2A0U2048495012U.Commands.speak'; 
        setState('alexa2.0.Echo-Devices.G2A0U2048495012U.Commands.speak-volume',35);

        if (callerName == '' && caller == '') {
          setStateDelayed(speak, 'Ein Anruf von Unbekannt', false, parseInt(0, 10), false);
          sendTo("telegram", "send", {
            text: ('Ein Anruf von Unbekannt')           
          });
        } else if (callerName == '') {
          setStateDelayed(speak, ('Ein Anruf von ' + String(caller)), false, parseInt(0, 10), false);
          sendTo("telegram", "send", {
            text: ('Ein Anruf von ' + String(caller))           
          });          
        } else if (callerName != '') {
          setStateDelayed(speak, ('Ein Anruf von ' + String(callerName)), false, parseInt(0, 10), false);
          sendTo("telegram", "send", {
            text: ('Ein Anruf von ' + String(callerName))           
          });          
        }
        Intervall = setInterval(function () {
          On_call_states = getState("tr-064.0.callmonitor.toPauseState").val;
          if (On_call_states == 'end' || On_call_states == 'connect') {
            (function () {if (Intervall) {clearInterval(Intervall); Intervall = null;}})();
          } else if (callerName == '' && caller == '') {
            setStateDelayed(speak, 'Ein Anruf von Unbekannt', false, parseInt(0, 10), false);
          } else if (callerName == '') {
            setStateDelayed(speak, ('Ein Anruf von ' + String(caller)), false, parseInt(0, 10), false);
          } else if (callerName != '') {
            setStateDelayed(speak, ('Ein Anruf von ' + String(callerName)), false, parseInt(0, 10), false);
          }
        }, 8000);
      }, 2000);
    }
  }, 1000);
});