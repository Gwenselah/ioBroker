on({id: ['alias.0.Solar.InverterMeasurement','fronius.0.inverter.1.PDC','fronius.0.inverter.1.PDC_2'], change: "ne"}, function (obj) {
    var Summe = getState('alias.0.Solar.InverterMeasurement').val +
        getState('fronius.0.inverter.1.PDC').val + getState('fronius.0.inverter.1.PDC_2').val;
    //log(Summe);
    setState('0_userdata.0.energy.electricity.meter.SolarTotal',Summe,true);
})


on({id:'alias.0.PowerMeasurement.Haus_PhaseGesamt', change: "ne"}, function (obj) {
    var value = obj.state.val;
    if (value < 0 ) {
        setState('0_userdata.0.energy.electricity.meter.out',-1*value,true);
        setState('0_userdata.0.energy.electricity.meter.in',0,true);
    } else {
        setState('0_userdata.0.energy.electricity.meter.in',value,true);
        setState('0_userdata.0.energy.electricity.meter.out',0,true);
    }

}) 

//Summe Lifetime erzeugte Energie
on({id: ['fronius.0.inverter.1.TOTAL_ENERGY','fronius.0.inverter.1.PDC','alias.0.Solar.InverterMeasurementTotal'], change: "ne"}, function (obj) {
    var Summe = getState('fronius.0.inverter.1.TOTAL_ENERGY').val + getState('alias.0.Solar.InverterMeasurementTotal').val ;
    //log(Summe);
    setState('0_userdata.0.energy.electricity.meter.SolarEnergyTotal',Summe,true);
})
