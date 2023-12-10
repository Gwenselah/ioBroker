
on({id: ['alias.0.Fenster.Kai_links','alias.0.Fenster.Kai_rechts'], change: "ne"}, function (obj) {
    setState('0_userdata.0.Geräte.IsKaiWindowOpen',
        (getState('alias.0.Fenster.Kai_links').val || getState('alias.0.Fenster.Kai_links').val));
})

on({id: ['alias.0.Fenster.Schlafzimmer_links','alias.0.Fenster.Schlafzimmer_rechts'], change: "ne"}, function (obj) {
    setState('0_userdata.0.Geräte.IsSchlafzimmerWindowOpen',
        (getState('alias.0.Fenster.Schlafzimmer_links').val || getState('alias.0.Fenster.Schlafzimmer_rechts').val));
})
