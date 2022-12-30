function CorrectTempValues (Temperature) {
    if (Temperature >= 0) {
        return Temperature
    } else {
        var pre = Math.floor(Temperature);
        var post = Temperature-pre;
        pre=pre-1;
        //post=(1-post);
        return (pre-post);
    }

}

log ("1 -> " + CorrectTempValues(1));
log ("0 -> " + CorrectTempValues(0));
log ("-1 -> " + CorrectTempValues(-1));
log ("-1.25 -> " + CorrectTempValues(-1.25));
log ("-1.5 -> " + CorrectTempValues(-1.5));
log ("-1.75 -> " + CorrectTempValues(-1.75));
log ("-2 -> " + CorrectTempValues(-2));
log ("-2.25 -> " + CorrectTempValues(-2.25));
log ("-2.5 -> " + CorrectTempValues(-2.5));
log ("-2.75 -> " + CorrectTempValues(-2.75));