on({id: ['alias.0.Solar.InverterMeasurement','fronius.0.inverter.1.PDC','fronius.0.inverter.1.PDC_2'], change: "ne"}, function (obj) {
    var Summe = getState('alias.0.Solar.InverterMeasurement').val +
        getState('fronius.0.inverter.1.PDC').val + getState('fronius.0.inverter.1.PDC_2').val;
    //log(Summe);
    setState('0_userdata.0.energy.electricity.meter.SolarTotal',Summe,true);
})