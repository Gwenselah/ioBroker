var ContromeRoomIDs =  [
    {Name: "Büro klein", RoomID: 1},
    {Name: "Schlafzimmer", RoomID: 2},
    {Name: "Bad", RoomID: 3},
    {Name: "Kai", RoomID: 4},
    {Name: "Lea", RoomID: 5},
    {Name: "Büro gross", RoomID: 6},
	{Name: "Flur", RoomID: 7},
    {Name: "WC", RoomID: 8},
    {Name: "Küche", RoomID: 9},
    {Name: "Wohnzimmer", RoomID: 10},
	{Name: "Windfang", RoomID: 11},
    {Name: "Kino", RoomID: 13}
];

var SwitchDevices = [
    { Name: 'Geschirrspüler', Ort: "Waschen und Spülen",   an: true, aus: false, Objekt: "alias.0.Steckdosen.Geschirrspüler", Beschreibung: "Steckdose an die der Geschirrspüler angeschlossen ist"},
    { Name: 'Trockner',    Ort: "Waschen und Spülen",   an: true, aus: false, Objekt: "alias.0.Steckdosen.Trockner", Beschreibung: "Steckdose an die der Trockner angeschlossen ist"},
    { Name: 'Waschmaschine Rechts',Ort: "Waschen und Spülen",   an: true, aus: false, Objekt: "alias.0.Steckdosen.Waschmaschine_Rechts", Beschreibung: "Steckdose an die die rechte Waschmaschine angeschlossen ist"},
    { Name: 'Waschmaschine Links',Ort: "Waschen und Spülen",   an: true, aus: false, Objekt: "alias.0.Steckdosen.Waschmaschine_Links",  Beschreibung: "Steckdose an die die linke Waschmaschine angeschlossen ist"},
    { Name: 'TV Steckdose', Ort: "Wohnzimmer",   an: true, aus: false, Objekt: "alias.0.Steckdosen.Wohnzimmer_Entertainment", Beschreibung: "Steckdose an die der Fernseher angeschlossen ist"},
    { Name: 'Ecklampe', Ort: "Wohnzimmer",   an: true, aus: false, Objekt: "alias.0.Licht.Wohnzimmer_Ecklampe", Beschreibung: "Ecklampe im Wohnzimmer"},
    { Name: 'Echo Dot Kai', Ort: "Kai",   an: 20, aus: 0, Objekt: "alexa2.1.Echo-Devices.G0911M0793154C71.Player.volume", Beschreibung: "Kai Alexa Player Lautstärke"},
    { Name: 'Echo Dot Lea', Ort: "Lea",   an: 20, aus: 0, Objekt: "alexa2.0.Echo-Devices.G0911M0894241XF5.Player.volume", Beschreibung: "Lea Alexa Player Lautstärke"},
    { Name: 'Echo Plus', Ort: "Esszimmer",   an: 20, aus: 0, Objekt: "alexa2.0.Echo-Devices.G2A0U2048495012U.Player.volume", Beschreibung: "Esszimmer Alexa Player Lautstärke"},
    { Name: 'Klimagerät', Ort: "Büro klein",   an: true, aus: false, Objekt: "alias.0.Steckdosen.Klimagerät", Beschreibung: "Klimagerät"},
    { Name: 'Schranklicht', Ort: "Wohnzimmer",   an: true, aus: false, Objekt: "alias.0.Licht.Wohnzimmer_Schranklicht", Beschreibung: "Schranklicht im Wohnzimmer"},
    { Name: 'Schranklampe', Ort: "Esszimmer",   an: true, aus: false, Objekt: "alias.0.Licht.Esszimmer_Schranklicht", Beschreibung: "Schranklicht im Esszimmer"},
    { Name: 'Deckenlampe', Ort: "Esszimmer",   an: true, aus: false, Objekt: "alias.0.Licht.Esszimmer_Deckenlampe", Beschreibung: "Deckenlampe im Esszimmer"},
    { Name: 'Deckenlicht', Ort: "Wohnzimmer",   an: true, aus: false, Objekt: "alias.0.Licht.Wohnzimmer_Deckenlampe", Beschreibung: "Deckenlampe im Wohnzimmer"},
    { Name: 'Statusdisplay', Ort: "Esszimmer",   an: true, aus: false, Objekt: "alias.0.Steckdosen.Statusdisplay", Beschreibung: "Schranklicht im Wohnzimmer"},
    { Name: 'XBOX und PC', Ort: "Büro klein",   an: true, aus: false, Objekt: "alias.0.Steckdosen.XBOX_PC", Beschreibung: "Entertainment im Dachgeschoss"},
    { Name: 'WLAN DG', Ort: "Schlafzimmer",   an: true, aus: false, Objekt: "alias.0.Steckdosen.WLAN_DG", Beschreibung: "WLAN im Dachgeschoss"},
    { Name: 'Weihnachtsbaum', Ort: "Wohnzimmer",   an: true, aus: false, Objekt: "alias.0.Licht.Weihnachtsbaum", Beschreibung: "Weihnachtsbaum"},
    { Name: '3D Drucker', Ort: "Büro groß",   an: true, aus: false, Objekt: "alias.0.Steckdosen.Ender", Beschreibung: "3D Drucker"},
    { Name: 'Arbeit', Ort: "Büro groß",   an: true, aus: false, Objekt: "alias.0.Steckdosen.Arbeit", Beschreibung: "Arbeitsplatz"},
    { Name: 'Mond', Ort: "Lea",   an: true, aus: false, Objekt: "alias.0.Licht.Lea_Mond", Beschreibung: "Leas Mond"},
    { Name: 'Deckenlicht Links', Ort: "Schlafzimmer",   an: true, aus: false, Objekt: "alias.0.Licht.Schlafzimmer_Lampe_Links", Beschreibung: "Deckenlampe Links"},
    { Name: 'Deckenlicht Rechts', Ort: "Schlafzimmer",   an: true, aus: false, Objekt: "alias.0.Licht.Schlafzimmer_Lampe_Rechts", Beschreibung: "Deckenlampe Rechts"},    
    { Name: 'Licht', Ort: "Garage",   an: true, aus: false, Objekt: "alias.0.Licht.Garage", Beschreibung: "Garagenlicht"},    
    { Name: 'Sitze', Ort: "Kino",   an: true, aus: false, Objekt: "alias.0.Steckdosen.Kinositze", Beschreibung: "Kinositze"},    
    { Name: 'Technik', Ort: "Kino",   an: true, aus: false, Objekt: "alias.0.Steckdosen.Kinotechnik", Beschreibung: "Kinotechnik"},    
    { Name: 'Licht Leinwand', Ort: "Kino",   an: true, aus: false, Objekt: "alias.0.Licht.Leinwand", Beschreibung: "Licht Leinwand"},    
    { Name: 'Licht Lounge', Ort: "Kino",   an: true, aus: false, Objekt: "alias.0.Licht.Lounge", Beschreibung: "Licht Lounge"},    
    { Name: 'Licht Parkett', Ort: "Kino",   an: true, aus: false, Objekt: "alias.0.Licht.Parkett", Beschreibung: "Licht Parkett"},    
    { Name: 'CPAP', Ort: "Schlafzimmer",   an: true, aus: false, Objekt: "alias.0.Steckdosen.CPAP", Beschreibung: "CPAP"}
];

var Doors = [
    {Name: "Büro klein Fenster", Objekt: 'alias.0.Fenster.Büro_klein'},
    {Name: "Schlafzimmer Fenster", Objekt: 'alias.0.Fenster.Schlafzimmer'},
    {Name: "Schlafzimmer Tür", Objekt: 'alias.0.Tueren.Schlafzimmer'},
    {Name: "WC Fenster", Objekt: 'alias.0.Fenster.WC'},
    {Name: "Wohnzimmer Tür Links", Objekt: 'alias.0.Tueren.Wohnzimmer_Links'},
    {Name: "Wohnzimmer Tür Rechts", Objekt: 'alias.0.Tueren.Wohnzimmer_Rechts'},
    {Name: "Küche Fenster", Objekt: 'alias.0.Fenster.Küche'},
    {Name: "Garagentor", Objekt: 'alias.0.Tueren.Garage'},
    {Name: "Kai Fenster", Objekt: 'alias.0.Fenster.Kai' },
    {Name: "Badezimmer Fenster", Objekt: 'alias.0.Fenster.Bad'},
    {Name: "Lea Tür", Objekt: 'alias.0.Tueren.Lea'},
    {Name: "Lea Fenster", Objekt: 'alias.0.Fenster.Lea'},
    {Name: "Büro groß Tür", Objekt: 'alias.0.Tueren.Büro_groß'},
    {Name: "Kino Fenster", Objekt: 'alias.0.Fenster.Kino'},
    {Name: "Waschküche Fenster", Objekt: 'alias.0.Fenster.Waschküche'}
];

var Rollladen = [
    [{text: "Schlafzimmer Rollladen", Objekt: 'shelly.0.SHSW-25#00869E#1.Shutter.Position', callback_data: "%Schlafzimmer Rollladen"}],
    [{text: "Lea Rollladen Türe", Objekt: 'shelly.0.SHSW-25#007CC3#1.Shutter.Position', callback_data: "%Lea Rollladen Türe"}],
    [{text: "Lea Rollladen Fenster", Objekt: 'shelly.0.SHSW-25#68C63AF963F3#1.Shutter.Position', callback_data: "%Lea Rollladen Fenster"}],
    [{text: "Küche Rollladen", Objekt: 'shelly.0.SHSW-25#68C63AF98CD1#1.Shutter.Position', callback_data: "%Küche Rollladen"}],
    [{text: "Büro groß Rollladen", Objekt: 'shelly.0.SHSW-25#68C63AF994B6#1.Shutter.Position', callback_data: "%Büro groß Rollladen"}],
    [{text: "Kai Rollladen", Objekt: 'shelly.0.SHSW-25#68C63AF98402#1.Shutter.Position',callback_data: "%Kai Rollladen"}],
    [{text: "Bad Rollladen", Objekt: 'shelly.0.SHSW-25#C45BBE79438B#1.Shutter.Position',callback_data: "%Bad Rollladen"}],
    [{text: "Wohnzimmer Rollladen Links", Objekt: 'shelly.0.SHSW-25#00CDCF#1.Shutter.Position', callback_data: "%Wohnzimmer Rollladen Links"}],
    [{text: "Wohnzimmer Rollladen Rechts", Objekt: 'shelly.0.SHSW-25#00465F#1.Shutter.Position', callback_data: "%Wohnzimmer Rollladen Rechts"}]
	
];

var Alexas = [
        [{text: "Esszimmer", Objekt: 'alexa2.0.Echo-Devices.G2A0U2048495012U.Player.volume',callback_data: "?Esszimmer"}],
        [{text: "Kai", Objekt: 'alexa2.1.Echo-Devices.G0911M0793154C71.Player.volume',callback_data: "?Kai"}],
        [{text: "Lea", Objekt: 'alexa2.0.Echo-Devices.G0911M0894241XF5.Player.volume',callback_data: "?Lea"}],
        [{text: "Büro", Objekt: 'alexa2.0.Echo-Devices.G0911M089424202G.Player.volume',callback_data: "?Büro"}],
        [{text: "Xbox", Objekt: 'alexa2.0.Echo-Devices.G090XG1214250EJN.Player.volume',callback_data: "?XBOX"}],
        [{text: "Waschküche", Objekt: 'alexa2.0.Echo-Devices.G090LF1175040F6A.Player.volume',callback_data: "?Waschküche"}]        
    ];    
    