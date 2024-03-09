//Awtrix zusammen mit Esszimemr Deckenlsampe schalten
on({id: 'alias.0.Licht.Esszimmer_Deckenlampe', change: 'ne'}, function() {
	//Wenn es Nacht ist, wird das Display mit der Deckenlampe geschaltet
	if (getState('javascript.0.Astro.Astrotag').val == false) {
		setState('awtrix-light.0.display.power',getState('alias.0.Licht.Esszimmer_Deckenlampe').val);
	}
})
on({id: 'javascript.0.Astro.Astrotag',val: true}, function(){
	//Wenn es Tag wird Display anschalten
	setState('awtrix-light.0.display.power',true);
})

schedule('55 22 * * *', function(){setState('awtrix-light.0.display.power',false)}); //zur Sicherheit trotzdem um 23 Uhr ausschalten