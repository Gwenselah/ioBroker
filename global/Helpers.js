function wait(ms){
   var start = new Date().getTime();
   var end = start;
   while(end < start + ms) {
     end = new Date().getTime();
  }
}


function printSubs() {

  var subscriptions =     getSubscriptions();

  var subscriptionCount = 0;



  for (var dp in subscriptions) {

      for (var i = 0; i < subscriptions[dp].length; i++) {

          subscriptionCount++;   

          log("Subscription: " + dp + " # im Script: " + subscriptions[dp][i].name + " # pattern: " + JSON.stringify(subscriptions[dp][i].pattern),"info");

      }

  }



  log("Anzahl Subscription: " + subscriptionCount);

}
printSubs();