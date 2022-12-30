function round(value, step) {
    step || (step = 1.0);
    var inv = 1.0 / step;
    return Math.round(value * inv) / inv;
}

function round2(value) {
    var pre = Math.floor(value);
    var post =((value*10)-(pre*10))/10;   //Wegen Floating Point Ungenauigkeiten
    post=post*100;
   // .00, .06, .12, .19, .25, .31, .38, .44, .50, .56, .62, .69, .75, .81, .88, .94
    if (post>=0) {var postnew=0;}
    if (post>=6) {var postnew=0.06;} 
    if (post>=12) {var postnew=0.12;} 
    if (post>=19) {var postnew=0.19;} 
    if (post>=25) {var postnew=0.25;} 
    if (post>=31) {var postnew=0.31;} 
    if (post>=38) {var postnew=0.38;} 
    if (post>=44) {var postnew=0.44;} 
    if (post>=50) {var postnew=0.50;} 
    if (post>=56) {var postnew=0.56;} 
    if (post>=62) {var postnew=0.63;} 
    if (post>=69) {var postnew=0.69;} 
    if (post>=75) {var postnew=0.75;} 
    if (post>=81) {var postnew=0.81;} 
    if (post>=88) {var postnew=0.88;} 
    if (post>=94) {var postnew=0.94;} 
    var sum=pre+postnew;
    log(sum.toString());
    return sum; 
}
log(round2(6.46).toString());
/*
log (round(11,0.125));
log (round(-11,0.125));
log (round(12.5,0.125));
log (round(11.6,0.125));
log (round(11.75,0.125));
log("--");

log (round(11,0.125));
log (round(-11.3,0.125));
log (round(-12.5,0.125));
log (round(-11.6,0.125));
log (round(-11.7,0.125));
log("--");
*/