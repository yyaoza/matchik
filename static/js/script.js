"use strict";

let autocomplete = (inp, arr) => {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  let currentFocus;
  /*execute a function when someone writes in the text field:*/
  if(inp) inp.addEventListener("input", function(e) {
    let a, //OUTER html: variable for listed content with html-content
      b, // INNER html: filled with array-Data and html
      i, //Counter
      val = this.value;

    /*close any already open lists of autocompleted values*/
    closeAllLists();

    if (!val) {
      return false;
    }

    currentFocus = -1;

    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items list-group text-left");
    
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);

    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        b.setAttribute("class","list-group-item list-group-item-action");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function(e) {
          /*insert the value for the autocomplete text field:*/
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  
  /*execute a function presses a key on the keyboard:*/
  if(inp) inp.addEventListener("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  
  let addActive = (x) => {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("active");
  }
  
  let removeActive = (x) => {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("active");
    }
  }
  
  let closeAllLists = (elmnt) => {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function(e) {
    closeAllLists(e.target);
  });
  
};

var reader = new FileReader();
/*An array containing all the country names in the world:*/
let countries = [


"Cue",
"Roost",
"Bagaveev Corporation",
"BlockScore",
"Celery",
"Cellabus",
"Clear Genetics",
"Cloudastructure",
"Cobalt",
"DeepGram",
"Fountain",
"Honeybook",
"Leada",
"Lendsnap",
"Metadata",
"Networked Blogs",
"Padlet",
"Panorama",
"Peer5",
"PlateJoy",
"Pomello",
"Rank Science",
"Rigetti Computing",
"Seva Coffee",
"San Francisco Open Exchange",
"Sourcery",
"Stitch",
"Supply.ai",
"Tallyfy",
"Tap to Learn",
"uBiome",
"Unwind Me",
"Vayable",
"Volans-i",
"Volley",
"Wildfire",
"Wivity",
"DevColor",
"10 By 10",
"1000Memories",
"20n",
"21Squared",
"280 North",
"300milligrams",
"3sourcing",
"3Ten8",
"43Layers",
"4m3",
"500Friends",
"7 Cups of Tea",
"70 Million Jobs",
"955dreams",
"99gamers",
"AA Audience",
"Abacus",
"AbbeyPost",
"Able Health",
"Abra",
"Accredible",
"Acre Designs",
"Active Scaler",
"ActivityHero",
"Acuity.AI",
"Acunote",
"Adenda",
"Ader",
"AdEspresso",
"AdGrok",
"AdmitSee",
"Advano",
"Adventure Bucket List",
"Aella Credit",
"AeroFS",
"Aerones",
"AgFunder",
"AgileMD",
"Airbanq",
"AirBnb",
"Airfordable",
"AirHelp",
"Airmada",
"Airo Health",
"AirPair",
"Airpost",
"Airware",
"Aisle50",
"AitoeLabs",
"Akido Labs",
"Albert",
"Alfred",
"Algolia",
"Algoriz",
"AllVirtuous",
"Almabase",
"AlphaFlow",
"Alto",
"Alumnify",
"Amberbox",
"Ambition",
"Amiato",
"Amicus",
"Amper",
"Ample",
"Amplitude",
"Amulyte",
"click2stream",
"Anjuna",
"anyadir education",
"AnyRoad",
"Anyvite",
"Anywhere.fm",
"Apester (prev. Qmerce)",
"Meteor",
"ZenProspect",
"ApolloShield",
"Apozy",
"Appbistro",
"AppCanary",
"Appcubator",
"AppFuel",
"AppGroves",
"AppHarbor",
"AppRats",
"AppSlingr",
"AppSocially",
"Appsperse",
"ApptheGame",
"Apptimize",
"apptuto",
"AppZen",
"AptDeco",
"Aptible",
"Aptonomy",
"Workplace Arcade",
"Regalii",
"Ark",
"Arka",
"Armory",
"AROS",
"Arrivy",
"ArrowPass",
"ArtCorgi",
"Arthena",
"Assemblage",
"Assembly",
"Asseta",
"AstroPrint",
"Athelas",
"Atipica",
"Atlas Card",
"Atomwise",
"Auctio",
"Auctomatic",
"AudioBeta",
"AuditFile",
"Audm",
"Aumet",
"Auro Robotics",
"Authy",
"AutoHub",
"Automate Ads",
"Automatic",
"Ava",
"Avanoo",
"Avision Robotics",
"BabyList",
"Qidza",
"Back4App",
"Backand",
"BackerKit",
"Brace",
"Backlot Cars",
"Backtype",
"Badger",
"Baker",
"Balanced",
"Baloonr",
"Bankjoy",
"Bannerman",
"Barn & Willow",
"baydin",
"Bayes Impact",
"Beacon",
"BeatDeck",
"Beep",
"Beetailer",
"Bellabeat",
"Ben",
"Benchling",
"BenRevo",
"BetterView",
"BIGcontrols",
"Bigfinite",
"Bikanta",
"BillForward",
"BillionToOne",
"BillTrim",
"Binary VR",
"binpress",
"Biobot Analytics",
"Biographicon",
"Biomarker.io",
"BioRender.io",
"Birdnest Inc.",
"bites",
"Bitmovin",
"BitNami",
"BitProof",
"BitQuick",
"BitRefill",
"BitWall",
"Bizzy.io",
"BlackDrumm",
"Blavity",
"Edcanvas",
"BlinkTrade",
"Blinq",
"instant esports",
"Blitzz",
"BlockCypher",
"BlockSpring",
"BlockStack Labs",
"Bloom Credit",
"BloomAPI",
"BloomBoard",
"BloomJoy",
"Bloomthat",
"Blossom",
"BlueFrogGaming",
"Blueberry",
"Blueboard",
"BlueCrew",
"Bluefields.com",
"BlueSmart",
"Blumio",
"Blurbiz",
"Bodyport",
"Bohemian Guitars",
"Bombfell",
"Bonafide",
"Bonsai",
"Booktrope",
"Boom",
"Boon",
"Boostable",
"BoostedBoards",
"Bop.fm",
"BottlesTonight",
"Bountii",
"Bounty Hunter",
"BoxC",
"BrandBoards",
"Breaker",
"BrewPublik",
"Bridge",
"BridgeUs",
"Bright",
"Trellis",
"BrightFunnel",
"BrightLoop",
"brightnest",
"Browsarity",
"Bstow",
"BTCjam",
"BuildScience",
"BuildUp",
"BuildZoom",
"Bulletin",
"Calliope",
"Burrow",
"BurstIQ",
"Butter Systems",
"Buttercoin",
"Buxfer",
"BuzzSpice",
"Buzzstarter",
"Byte",
"Cadence",
"Caelum Health",
"California Dreamin'",
"Call9",
"Callisto",
"Cambly",
"Cambrian Genomics",
"CaptivateIQ",
"CarDash",
"CardFlick",
"CardPool",
"CareLedger",
"CareLuLu",
"CareMessage",
"CareSkore",
"Carlypso",
"Carrot Fertility",
"Carsabi",
"Carta Healthcare Inc.",
"CarWoo",
"Casetext",
"Castle",
"Catnip",
"Cattle Care",
"Cavalry",
"Vest",
"CellBreaker",
"chalkable",
"Chariot",
"Chart.io",
"Chatfuel",
"ChattingCat",
"Check My Campus",
"Checkbook.io",
"Checkr",
"Cheddar Up",
"Chesscademy",
"Chewse",
"Chorus",
"ChouxBox",
"Chronon",
"Chute",
"Cinder",
"Circle Medical",
"CirroSecure",
"Cirrus Identity",
"Citus Data",
"Cityblis",
"Cladwell",
"ClaimCompass",
"Clara Labs",
"Class Central",
"ClassConnect",
"ClassDojo",
"Classroom IQ",
"Classwork",
"Cleanify",
"Cleanly",
"ClearBrain",
"Clerky",
"Clever",
"Click & Grow",
"ClickFacts",
"clouber.io",
"Cloud Academy",
"Cloudant",
"Cloudkick",
"CloudMedX",
"Cloudstitch",
"Clowder",
"Clustrix",
"Clutch.io",
"CoachMarket",
"CoContest",
"Cocoon Cam",
"CocuSocial",
"Codecademy",
"CodeCombat",
"CodeEval",
"CodeHS",
"CodeNow",
"CodersClan",
"Coderwall",
"CodeUpStart",
"Coeio",
"Cofactor Genomics",
"Cognito Networks",
"Cognuse",
"Coin",
"Coinalytics",
"Coinbase",
"Coinding",
"CoinTent",
"CoinTracker",
"Collectly",
"Color Dating",
"Comeet",
"CommitChange",
"Compgun",
"Comprehend Systems",
"Compression Kinetics",
"CompStak",
"ConceptDrop",
"ConcertWith.me",
"Confident Cannibas",
"ConnectBright",
"ConstructVR",
"Construkts",
"Contactually",
"contentools",
"ContestMachine",
"ContextSmith",
"Contract Simply",
"Convox",
"Cooleaf",
"Copia",
"CoreOS",
"Correlia Biosystems",
"Cortex",
"Couple",
"Court Buddy",
"Courtmatics",
"Cover",
"Covetly",
"Cowlar",
"Cozy (previously Avenue)",
"Craft Coffee",
"CrateJoy",
"Creative Market",
"Credii",
"Credit Stacks",
"Crema.co",
"CribSpot",
"CricketHealth",
"Crocodoc",
"Croissant",
"Croma",
"CrowdAI",
"Crowdbooster",
"Crowdcast",
"Crowdery",
"CrowdMed",
"CrowdPlat",
"[crowd:rally]",
"Cruise",
"CryptoMove",
"Cryptoseal",
"Crysp",
"culturekitchen",
"Culture Robotics",
"Curious Hat",
"Curtsy",
"Custora",
"CyberX",
"Cycle",
"Cymmetria",
"Daily Aisle",
"DailyBooth",
"Dakwak",
"Damntheradio",
"Darmiyan",
"Data Marketplace",
"DataNitro",
"DataRank",
"Datasembly",
"Datatron",
"Dating Ring",
"DCHQ",
"Deako",
"Dealflicks",
"Dealupa",
"Dealyze",
"DeansList",
"DearBrightly",
"DebtEye",
"DecisiveHealth",
"Deep Relevance",
"Deep Science AI",
"DeferPanic",
"Deluux",
"Democracy Earth",
"Department of Better Technology",
"DeZyre",
"Dharma Labs",
"Diaspora",
"Diassess",
"Digital Currency Council",
"Digital Mortar",
"DigitalOutposts",
"DigitWhiz",
"Direct Match",
"DirectedEdge",
"Disclosures.io",
"Discover.ly",
"Disqus",
"Divvyshot",
"Doblet",
"docCheer",
"Docker",
"Donde",
"DoorDash",
"Doorman",
"DoseDr",
"Dost Education",
"Dot Dash Pay",
"Double Robotics",
"Doughbies",
"Down",
"Doxel",
"Draft",
"Dr Chrono",
"Dreambox",
"Dreamforge",
"Drip Capital",
"Drippler",
"Drive Motors",
"Drive Pulse",
"drone.io",
"DroneBase",
"Dropbox",
"Dropifi",
"Dropleaf",
"Dscovered",
"Easel",
"EasyPost",
"eBrandValue",
"Echo Locker",
"Echodio",
"Eden",
"EdPuzzle",
"Edshelf",
"Educents",
"Educreations",
"Eduvant",
"Edwin",
"Edyn",
"Efflux Systems",
"Eight",
"Electroloom",
"Elemeno Health",
"Eligible",
"Eloquent Labs",
"Elucd",
"Elucify",
"Embark",
"Embedly",
"Emburse",
"Emote",
"Enchanted Diamonds",
"Enflux",
"EnvKey",
"Enzyme",
"Equipboard",
"EquipmentShare",
"EquitySim",
"EquityZen",
"Errplane",
"Escher Reality",
"eSparkLearning",
"Estimote",
"Etacts",
"Etleap",
"eventable",
"Eventgeek",
"Eventjoy",
"everbill",
"EveryArt",
"Everyday.me",
"No Lean Season",
"Evry Health",
"Exabyte.io",
"Exec",
"Experiment",
"Exponent",
"EyesOnFreight",
"Fabric",
"FactoryFour",
"Indigo Fair",
"FairFly",
"FameBit",
"FamilyLeaf",
"Fan Stream",
"FanChatter",
"FanVibe",
"Farmeron",
"FarmLogs",
"FathomDB",
"Favor",
"Fearless VR",
"Feast",
"Feastly",
"Feather",
"Featherlight",
"Fellow",
"femeninas",
"Fibo",
"Fileboard",
"Filestack",
"FillMyFork",
"Final",
"Fingertips Lab",
"Finova Financial",
"Finrise",
"Firebase",
"FirstCut.io",
"FirstHand",
"First Impression",
"fitocracy",
"Five Stars",
"Fivetran",
"Fixed",
"Flagr",
"FlashRatings",
"Flaviar",
"Flexport",
"flexReceipts",
"Vidly / Fliggo",
"FlightCar",
"Flightcaster",
"FlightFox",
"Filp",
"FlipFlic",
"Flirtey",
"Float",
"Floobits",
"NowJS",
"Flowcast",
"Flowspace",
"FloydHub",
"Flutter",
"Flutterwave",
"FLYE",
"Flyer",
"Flynn",
"Flytenow",
"Fobo",
"Focal Systems",
"Fold",
"Folia Water",
"FollowTheCoin",
"FortAwesome",
"fontacto",
"Foodoro",
"FORCE",
"Forever Labs",
"Forrst",
"Foxpass",
"FoxType",
"Framed Data",
"Freedcamp",
"Freemit",
"FreshPlum",
"Friend Trusted",
"RunThere",
"FriendlyData",
"FriendSpot",
"Frisbee",
"Frogmetrics",
"Front",
"Frontleaf",
"FuelPanda",
"Fulfil.io",
"Function of Beauty",
"Funderful",
"FundersClub",
"Funji",
"Funnely",
"FutureAdvisor",
"FutureLeague",
"BeaconsInSpace",
"Gainful",
"Gamador",
"Gameday",
"GameLynx",
"Gameyola",
"Gantto",
"Gas Pos",
"GazeHawk",
"gazeMetrix",
"Gecko Robotics",
"Geddit",
"Geekatoo",
"Gemnote",
"Genius",
"Genome Compiler",
"Genoox",
"Georama",
"Get Lighthouse",
"GetAccept",
"GetGoing",
"GiftStarter",
"Gigabryte",
"Gigster",
"Gigwell",
"Ginko Bioworks",
"GinzaMetrics",
"GitLab",
"GitPrime",
"Give Campus",
"Giveffect",
"GiveIt100",
"EngageInbox",
"Givesurance",
"Gizmo",
"GlamST",
"Glassmap",
"Glidian",
"Glimpse K12",
"Gliph",
"GlobeKeeper",
"Globevestor",
"Gluwa",
"Goalbook",
"GOAT",
"Gobble",
"GoComm",
"GogoCoin",
"GoGoGrandparent",
"Gogohire",
"Goldbely",
"GoldenKey",
"GoLorry",
"Good Call Sports",
"Goodybag",
"Govlist",
"GoVoluntr",
"Graffiti Labs",
"Graft Concepts",
"Gravitational",
"Green Way Laboratories",
"GreenGar",
"Greentoe",
"Greo",
"Grid",
"GridRaster",
"Groove",
"GroupAhead",
"GroupCard",
"Grouper",
"groupiter",
"GroupTie",
"Convore",
"Growbot",
"GrubMarket",
"GTrack Technologies",
"Guidekick",
"Guilded",
"Gumball",
"Gun",
"Gustav",
"Gusto",
"GymHit",
"Habit Labs",
"HackerBay",
"Hackermeter",
"HackerRank",
"HackPad",
"Haiku",
"Halo Home",
"HaloLife",
"Hamptons Lane",
"HandStack",
"Hapara",
"Happy Inspector",
"HashRabbit",
"HauteDay",
"Havenly",
"Haywheel",
"Hazel Lane",
"Headnote",
"Headout",
"HealthCrowd",
"Health Sherpa",
"Heap Analytics",
"HeavyConnect",
"Hedgy",
"Helion Energy",
"Helix Nanotechnologies",
"HelloChair",
"HelloBit",
"Hello World",
"Heroic Labs",
"Heroku",
"HeTexted",
"Hexa",
"Hexel",
"Heysan",
"Heyzap",
"Hickory",
"HigherMe",
"HighlightCam",
"Hijro",
"Hingeto",
"HiOperator",
"Hipmunk",
"HipType",
"HireArt",
"HireHive",
"Hirevisor",
"HistoWiz",
"Hivy",
"Hobobe",
"Hogaru",
"Holidog",
"Homebot",
"HomeJoy",
"Honeydue",
"Honor",
"Hop",
"HoverChat",
"Hubchilla",
"Hum",
"Captain 401",
"Humble Bundle",
"Hunie",
"Hykso",
"Hyperink",
"Hyphen",
"iBillionaire",
"iCracked",
"imgfave",
"Imgix",
"imHome",
"Industrial Microbes",
"Immunity Project",
"Impraise",
"Improvado",
"Imubit",
"In Your Corner",
"Answerly.com",
"Incredible Health",
"Indee",
"Index",
"Indinero",
"Indio",
"Indivio",
"Wufoo",
"InfluxData",
"Infoharmoni",
"Chalk",
"InnaMed",
"Innovaccer",
"InnoVein",
"InsideWarehouse",
"InsiteVR",
"Instacart",
"InstaGIS",
"InstaGrok",
"Install Monetizer",
"InstantQ",
"Instavest",
"Instawork",
"Instrumentl",
"Interana",
"Intercom",
"Interstate",
"Interviewed",
"Iris Automations",
"Iron Ox",
"iSono Health",
"italist",
"iTOi",
"Ivee",
"Ivy",
"iWABOO",
"ixi-play",
"Jaco",
"Jellyfish Art",
"Jerpix",
"JetInsight",
"Joberator",
"Jopwell",
"Joy",
"Jumpcut",
"Junior Explorers",
"Just Appraised",
"JyMob",
"Kaizena",
"Kaleidoscope",
"Kamcord",
"KangaDo",
"Kanler",
"Kash",
"Kaymbu",
"Keewi Inc",
"Kestrel Materials",
"Keyboardio",
"Keychain Logistics",
"KeyWee",
"kibin",
"Kickback",
"KickPay",
"Kicksend",
"KickUp",
"KidPass",
"KidzJet",
"Kiko",
"KiLife Tech",
"KimKim",
"Kimono",
"Kip Health",
"Kippt",
"Kirkland North",
"KiteReaders",
"Kitterly",
"Knowmia",
"Kodable",
"Koemei",
"Kollecto",
"Kompyte",
"KonoLabs",
"Konsus",
"Kontagent",
"Koofers",
"Kudobuzz",
"Kuna Systems",
"kwik",
"Lab Sensor Solutions",
"Labdoor",
"Ladera Labs",
"Lambda School",
"Lampix",
"Landed",
"Lattice",
"LaunchBit",
"LaunchGram",
"LaunchHear",
"Launchpad Toys",
"launchrock",
"LaunchTrack",
"Lawdingo",
"Lawn Love",
"LawnGuru",
"Lawnmower",
"LawTrades",
"Lawyaw",
"Layer by Layer",
"Le Tote",
"LeadGenius",
"Leaky",
"LeanMarket",
"Leap",
"Motivate",
"Leapcure",
"LearningJar",
"Learnsprout",
"Ledger Investing",
"Legalist",
"GoRefi",
"LendEDU",
"Lendsquare",
"LendUp",
"Leon & George",
"Level",
"Level Family Therapy",
"Lever",
"Life Bot",
"Life360",
"Liftignighter",
"Lightbox VR",
"LightTable",
"LikeBetter",
"Lingt",
"LinguaTrip",
"Liquidspace",
"Lish",
"ListenLoop",
"Listia",
"ListRunner",
"Litmus Automation",
"Littlefund",
"LiveCanary",
"Lively",
"Lob",
"LocalOn",
"Locent",
"LogDNA",
"Lollipuff",
"LookAcross",
"Looklive",
"Loom",
"Loop Genomics",
"Loop Support",
"Loopt",
"AutoLotto",
"LoveWithFood",
"Lugg",
"Lully",
"Lumi",
"Luminist",
"Luminostics",
"Lumo",
"Lumoid",
"lvl5",
"LVL6",
"Lygos",
"Machine Zone",
"Macromoltek",
"Maderight",
"MadeSolid",
"Maestro Conference",
"Magic",
"Magic Instruments",
"Magic Bus",
"Mahmee",
"MailGun",
"MailLift",
"MailTime",
"MakeSchool",
"MapJam",
"Markerly",
"MarketBrief",
"Marketfox",
"Markhor",
"The Mars Reel",
"MashGin",
"Mashvisor",
"Mason America",
"Materialist",
"MathChat",
"Voxli",
"Mattermark",
"MatterPort",
"Mavin",
"May Mobility",
"Mayvenn",
"MDAcne",
"Meadow",
"Medigram",
"Medisas",
"Medumo",
"MedXT",
"Meetingbird",
"Meetings.io",
"MeetingSift",
"Meldium",
"Memebox",
"MeMeTales",
"Memora Health",
"MemSQL",
"Mentat",
"MentorCloud",
"Mere Coffee",
"Merlin",
"Mertado",
"MessageParty",
"Meta Space Glasses",
"Metapacket",
"MeterFeeder",
"MicroEval",
"MicroHealth",
"MightyHive",
"MightyQuiz",
"Mimir",
"Mindori",
"MineFold",
"MineralSoft",
"MinoMonsters",
"Mirror AI",
"Mission 100%",
"Missionmark",
"Misterbnb",
"MixerBox",
"Mixpanel",
"MixRank",
"MoBagel",
"Mobile Enerlytics",
"MobileSpan",
"Modbot",
"Modern Health",
"Modify",
"Mohound",
"MojiLaLa",
"Moki.TV",
"Molly",
"Moltin",
"MommaZoo",
"Monetsu",
"Moneytis",
"MonkeyLearn",
"Monogram",
"Monthli",
"MoPix",
"Mosa Mack Science",
"Moti",
"Mountary",
"Movebutter",
"Move Loot",
"Moveha",
"Movity",
"mRelief",
"Msg.ai",
"MTailor",
"Mth Sense",
"Mudflap",
"Multiply Labs",
"Mux",
"My90",
"Mycroft",
"Mycrophone",
"MyFavorito",
"Mystery Science",
"Mystro",
"Sycamore",
"myTips",
"MyVR",
"NanoNets",
"Natero",
"Native Tap",
"Naytev",
"Nebia",
"Neema",
"Neighbor.ly",
"NeoReach",
"Neptune.io",
"Net30",
"NetBeez",
"Netifi",
"Neura",
"Neuroware",
"New Incentives",
"New Story Charity",
"Newsblur",
"Newsbrane",
"NEXGENT",
"Nexi",
"Next Caller",
"Codevolve",
"NextInput",
"NexTravel",
"NFWare",
"Nightingale",
"Niles",
"Nimble",
"Ninite",
"Nitrocam",
"Nobex Technologies",
"Nodal",
"Nomiku",
"Nonnatech",
"Noora Health",
"NoRedInk",
"Notable Labs",
"Noteleaf",
"Nova",
"Nova Credit",
"nowmov",
"Ntensify",
"ZeroDB",
"Numina",
"NuntioLabs",
"nurseVersity",
"Nurx",
"Nutrigene",
"Nutshell Mail",
"Obie",
"ObserveAI",
"Octopart",
"Octopus",
"OffScale",
"Ohmygreen",
"OhLife",
"Oklo",
"Olark",
"OLSET",
"OMGPOP",
"Omniref",
"Omnisio",
"AdsOptimal",
"OncoBox",
"Ondigo",
"One Codex",
"One Degree",
"The One Health Company",
"One Month Rails",
"OneChronos",
"OneKloud",
"OneMob",
"OneSchool",
"OneSignal",
"OnFarm Systems",
"Open Listings",
"OSVehicle",
"OpenBike",
"OpenCurriculum",
"OpenDoor",
"Open Invest",
"Openland",
"OpenSea",
"OpenSponsorship",
"OpenTrons",
"Opez",
"Opsolutely",
"Optimizely",
"Alta5",
"Opzi",
"Orangewood Labs",
"Orankl",
"OrderAhead",
"OrderCircle",
"Orderly Health",
"OurHealthMate",
"Outbound",
"Outdoorsy",
"Outschool",
"Outsite",
"Ovia",
"Owners Circle",
"OwnLocal",
"Pachyderm",
"Pacifica Labs",
"PageLever",
"PagerDuty",
"Paid",
"Pakible",
"PalleTech",
"Pantheon",
"Paperspace",
"Paragon One",
"Parakey",
"Parallel Universe",
"Parenthoods",
"Paribus",
"Parse",
"Partender",
"Parting",
"Partnered",
"Patchd Medical",
"PathDrugomics",
"Pathrise",
"PatientBank",
"Paubox",
"Pawprint",
"PayByGroup",
"Payable",
"Paykind",
"PayTango",
"Pebble Technology",
"Peeq",
"Peer.im",
"Penny",
"People.ai",
"Perfect Audience",
"Perfect Price",
"Perlara",
"PersistIQ",
"PetCube",
"Photos I Like",
"Physio Health",
"Piccolo",
"Pick1",
"PickTrace",
"PicnicHealth",
"PicPlum",
"Pieceable",
"Pigeonly",
"Pijon",
"Airenvy",
"Pillsy",
"Pilotly",
"Pipefy",
"PipelineDB",
"Piper",
"Pit.ai",
"Pixc",
"Pixelapse",
"Placements",
"PlanGrid",
"Plasticity",
"PlateIQ",
"Birdly",
"Platzi",
"Playbook",
"PlayerDuel",
"Players' Lounge",
"Plickers",
"Plivo",
"Park Evergreen",
"Plotbox",
"Pluma",
"Pluot",
"Plurchase",
"Pluto AI",
"PocketSuite",
"Podium",
"Podo",
"Podozi",
"EasyEmail",
"PollEverywhere",
"Polly",
"Polymail",
"Pongr",
"Pop Up Archive",
"Popbasic",
"PopCuts",
"Poppy",
"Popular Pays",
"Populr",
"Posmetrics",
"Posterous",
"Postverta",
"Povio",
"Precious",
"PredictionIO",
"PreDxion Bio",
"Original Tech",
"PrePay",
"Preteckt",
"Pretty Instant",
"Priceonomics",
"Priime",
"Prim",
"primeloop",
"Printify",
"Prism IO",
"Privy",
"Prodigy",
"ProductHunt",
"ProductBIO",
"Profig",
"ProjectWedding",
"Prolaera",
"Promolta",
"Proof",
"Propable",
"Prophecy Services",
"ProSky",
"Protocol Labs",
"Protonet",
"Proven",
"Proxino",
"Proxy",
"Pubinno",
"Publikdemand",
"Publishizer",
"PullRequest",
"Puloli",
"Pulpix",
"Pulse",
"Punchd",
"PupBox",
"Purple",
"Pushbullet",
"Pushmarket",
"Puzzlium",
"Py",
"Pyka",
"QC Ware Corp.",
"Qlika",
"Qualio",
"Quantierra",
"Quantstamp",
"Quantum Insights",
"Quartzy",
"Quest",
"QueueDr",
"QueueHop",
"Quicklegal",
"QuickLogix",
"QuicklyChat",
"Quilt Data",
"Qulture.Rocks",
"analyticsMD",
"Qwil",
"Skip",
"RageOn",
"Rain",
"Rainforest QA",
"Raise",
"rakam",
"Rapchat",
"RapidAPI",
"Rapportive",
"rapt.fm",
"Raptor Maps",
"Ravti",
"Raxar Technology Corporation",
"LiveMed",
"Reactful",
"ReadMe",
"ReadWorks",
"ReadyForZero",
"Real Labs",
"RealAtom",
"RealCrowd",
"RealGifts",
"Realities.io",
"Realm",
"RealtyShares",
"Reble",
"ReclipIt",
"RecoverX",
"Reddit",
"Redeemr",
"Redspread",
"Reduced Energy Microsystems (REM)",
"ReelSurfer",
"Reesio",
"Regard",
"RegistryLove",
"Relationship Hero",
"reMail",
"Remark",
"Remind101",
"Remix",
"Remoov",
"reniac",
"RentHop",
"RentMineOnline",
"Rentobo",
"Replenish",
"Rescale",
"ReSchedule",
"Rescue Forensics",
"RescueTime",
"Resonance AI",
"Resource",
"Restocks",
"ResultsOnAir",
"RethinkDB",
"Retool",
"ReturnBase",
"Reveal",
"Revivn",
"Revl",
"Revlo",
"rewardli",
"Rezi",
"HealthWiz",
"Rickshaw",
"mindhelix",
"RideAlong",
"RideCell",
"RigPlenish",
"Riide",
"Riley",
"RingCaptcha",
"BitPagos",
"Rippling",
"Rize",
"Robby",
"RobinHealth",
"RocketLit",
"Rocketrip",
"ROHO",
"Roofr",
"Roomblocker",
"Roomstorm",
"ROSS Intelligence",
"Rover",
"RunMyErrand",
"SafeSkies Systems",
"SafetyWing",
"Saint Harridan",
"Sales Beach",
"SalesIntel",
"Secful",
"Samasource",
"Sand Hill Exchange",
"Sandbox",
"Scale",
"Scaphold.io",
"Scentbird",
"SchoolMint",
"Science Exchange",
"Quiki",
"Scopio",
"Scoutzie",
"Screenhero",
"ScreenLeap",
"Scribd",
"Scribe",
"ORobotix",
"Second Measure",
"Secured3D",
"Securly",
"Seed",
"Segment.io",
"Selfycart",
"Selligy",
"Semantics3",
"Sempre Health",
"SendBird",
"SendHub",
"Sendoid",
"SendTask",
"Sendwithus",
"Seneca Systems",
"Senexx",
"Senic",
"sense.ly",
"Sensilk",
"SensorHound",
"Sentinel",
"Andromium",
"Serica",
"Set Scouter",
"Shakr",
"ShapeScale",
"ShareRoot Inc",
"ShearShare",
"Shift Messenger",
"Shift Payments",
"ShiftDoc",
"ShiftLabs",
"ShipBob",
"Shippo",
"Shogun",
"Shone",
"72Lux",
"ShoppinPal",
"Shopseen",
"Shoptiques",
"Shopular",
"Shortlist",
"Shotput",
"Shout",
"Shoutfit",
"Shred Video",
"Shypmate",
"Siasto",
"Sickweather",
"Sidelines",
"SidelineSwap",
"Sift Science",
"SigOpt",
"sigSense",
"Silkroad Images",
"silver",
"Silvernest",
"SilverPush",
"Simbi",
"Simless",
"Simmr",
"Simperium",
"Simple Habit",
"SimpleCitizen",
"SimpleLegal",
"storytree",
"SimplifiMed",
"Simplifund",
"Uplette",
"SimplyInsured",
"Sinovia Technologies",
"SIRUM",
"Sixa",
"Sixty",
"Sketchbox",
"SketchDeck",
"SKURUN",
"Skylights",
"Skymind",
"Skyways",
"Slang",
"SlapVid",
"Sliced Investing",
"SlickLogin",
"Slidebean",
"Slidemail",
"Slik",
"Slinkset",
"Smarking",
"SmartAlto",
"SmartAsset",
"SmarterCookie",
"SmartestK12",
"SmartHires",
"SmartPath",
"Smartspot",
"SMB Rate",
"Smile Identity",
"Smyte",
"Snackpass",
"snapCard",
"Snapdocs",
"SnapEDA",
"Snapette",
"Snapjoy",
"Snappr",
"Snaptalent",
"Snipd",
"SocialCam",
"Socialfly",
"Socialight",
"SocialMoth",
"SocialPandas",
"Solugen",
"Solve",
"Songkick",
"SoundBetter",
"SoundFocus",
"SoundRex",
"SourceDNA",
"Sourceasy",
"Sourcify",
"Sown To Grow",
"Soylent",
"Spark Gift",
"BetterWorld Wireless",
"SpeakerGram",
"Spinach",
"Spinal Singularity",
"Spinnakr",
"SpinPunch",
"Spire",
"Splacer",
"Spoil",
"spoondate",
"SpoonRocket",
"Sporthold",
"Spot Angels",
"Sqoop",
"Sqoot",
"Sqreen",
"Squadle",
"Squire",
"StackLead",
"StackShare",
"Stampery",
"Stamplay",
"Standard Cognition",
"Standard Cyborg",
"Standard Treasury",
"Starcity",
"StartClosing",
"Statsbot",
"StatusPage",
"Statwing",
"Stealth Worker",
"STILT",
"Storyhunter",
"Storyline",
"Storypanda",
"StoryWorth",
"strapping",
"Streak.com",
"StreamLoan",
"Streamup",
"Streem",
"Strikingly",
"Stripe",
"StrongIntro",
"Strypes",
"StudyEdge",
"Studypool",
"StudyRoom",
"StudySoup",
"Style Lend",
"StyleBee",
"StyleUp",
"Stypi",
"Submittable",
"Substack",
"Sudden Coffee",
"Sugarcube",
"Suiteness",
"SunFarmer",
"Sunfolding",
"Sunu",
"Supergleu",
"Supermedium",
"SupplyBetter",
"SupplyHog",
"Surematics",
"Surreal VR",
"Survata",
"Survmetrics",
"Svbtle",
"Sverve",
"SwapBox",
"Sway",
"Swayable",
"Swyft",
"Swiftype",
"Swing Education",
"Swipes",
"Swish",
"SwitchEmbassy",
"switchcam",
"Symple",
"SynapseMX",
"Synata",
"Sywork",
"T + J Designs",
"Tackl",
"TagMonkey",
"Tagove",
"Talkable",
"TalkDesk",
"Talkray",
"TapDog",
"TapEngage",
"TapIn",
"Tappur",
"Tapzilla",
"Gradberry",
"TargetingMantra",
"Tarjimly",
"Tastemaker",
"TAXA Biotechnologies",
"TeachBoost",
"Tealet",
"TeamApart",
"Teaman & Company",
"teamly",
"Techmate",
"Teespring",
"Teevox",
"Teleborder",
"teliportme",
"TellFi",
"Templarbit",
"TenantTurner",
"TenderTree",
"Tenfoot",
"Tenjin",
"tEQuitable",
"Terascore",
"TerrAvion",
"Tesorio",
"TetraScience",
"Text IQ",
"Text To Ticket",
"TextPayMe",
"Thankster",
"The Athletic",
"Flex",
"The Human Utility",
"The Lobby",
"The Mednet",
"The Muse",
"The Pill Club",
"The Podcast App",
"Treeline",
"The Ticket Fairy",
"TheMidGame",
"Theorem LP",
"ThinAir",
"Think Gaming",
"Thinkature",
"Thinknum",
"Thread",
"Transcend Lighting",
"Thunkable",
"TicketStumbler",
"Tickle",
"Ticktate",
"TieSociety",
"Tika",
"Tilt",
"Timbuktu Labs",
"Tiny Review",
"Tioki",
"Tipe",
"Tipjoy",
"TL Biolabs",
"Token Transit",
"Tolemi",
"TomoGuides",
"Whim",
"TopHatch",
"Toshl",
"Totemic Labs",
"Totspot",
"Tout",
"Toutpost",
"Tovala",
"Toymail",
"Trac",
"TraceAir",
"Track",
"Trackin",
"Tracks.by",
"TradeBlock",
"TrailBehind",
"Traity",
"Trance",
"Transcriptic",
"Translate Abroad",
"Transtutors",
"Traveljoy",
"Treasury Prime",
"Treat",
"Trigger.io",
"Trinket",
"Triplebyte",
"TruckTrack",
"True Link Financial",
"Truebill",
"TrueCare24",
"TrueVault",
"TryFuel",
"TrustCloud",
"TrustEgg",
"trym",
"Tsumobi",
"Tule",
"Tutorspree",
"twitmusic",
"Two Tap",
"Tyche",
"Tylr Mobile",
"Ubicall",
"Ubiq",
"uCreate3D",
"Uguru",
"UMake",
"UmbaBox",
"Underground Cellar",
"Unimersiv",
"Uniquid",
"Universe",
"Unlimited Reality",
"UnnyWorld",
"Up All Night",
"Upcall",
"UpCodes",
"UpCraft Club",
"UpDroid",
"Upgraded",
"Upkeep Maintenance Management",
"UpLabs",
"Upshot",
"Uptime (Previously EyePiece)",
"URX",
"Uscoop",
"Userfox",
"UserGems",
"UtilityScore",
"UXcam",
"Vacayo",
"VadR",
"Valor Water Analytics",
"Value Voting",
"Vango",
"Vantage Sports",
"Vastrm",
"Vathys",
"Vatler",
"VayCayHero",
"Veed.me",
"Align Commerce",
"Verbling",
"Verecho",
"Verge Genomics",
"VergeSense",
"Vernox Labs",
"IQBoxy",
"Vessel",
"Vetcove",
"VetPronto",
"VIA Global Health",
"ViaCycle",
"VIDA & Co.",
"Vidcode",
"Cinemacraft",
"VideoNot.es",
"Videopixie",
"vid.io",
"Vidpresso",
"Villa",
"VillageDefense",
"VINEBOX",
"Vinsight",
"ViralGains",
"Virect",
"Virool",
"VirtualMin",
"Visabot",
"Visage",
"Visor",
"visual.ly",
"Vittana",
"vive",
"Summer",
"Mind My Business",
"Vize Software",
"Vizera Labs",
"VoiceGem",
"VOIQ",
"Volta",
"Voodoo Manufacturing",
"Vorga",
"Vote.org",
"Voxeet",
"Voyajoy",
"VR Motion",
"VRChive",
"vvall",
"Wakemate",
"Wakie",
"Wallarm",
"WalletKit",
"YongoPal",
"Wanderable",
"Watsi",
"Wattvision",
"waygum",
"WayUp",
"Weardrobe",
"Weave",
"Webflow",
"BarTab",
"WeddingLovely",
"WeDidIt",
"Weebly",
"WeFunder",
"Weilos",
"WeLink",
"WePay",
"WePlann",
"Wevorce",
"WhalePath",
"Wheelwell",
"WhereFor",
"Whill",
"Whiplash",
"Whirl",
"Whitenoise Networks",
"WhoAPI",
"Wideo",
"Willing",
"Willow",
"Club W",
"Wink Health",
"Win-Win",
"wise.io",
"WishPlz",
"Wit.ai",
"Women Who Code",
"Women.com",
"WorkAmerica",
"Workflowy",
"Workgeni.us",
"Worklete",
"WorkLife",
"WorkRamp",
"Workstir",
"WorldCover",
"Worldly Developments",
"Worthix",
"Wright Electric",
"Writewith",
"Wundrbar",
"Xberts",
"Xendo",
"XIX.ai",
"Xobni",
"Xockets",
"X-Zell",
"Yardbook",
"YayPay",
"Yellowdig",
"YesGraph",
"Yhat",
"Yodas",
"YoDerm",
"Yogome",
"Yoshi",
"YouFood",
"YouGotListings",
"Your Mechanic",
"YouStake",
"YouTeam",
"Yumbin",
"YumDots",
"Zainar",
"ZapChain",
"ZapGo",
"Zapier",
"ZBiotics",
"ZBoard",
"Zecter",
"Zen99",
"Zenamins",
"Zenbox",
"Zencoder",
"Zendar",
"ZendyHealth",
"Zenedy",
"Zenefits",
"Zenflow",
"Zengaming",
"Zentail",
"Zenter",
"Zenysis",
"Zeplin",
"ZeroCater",
"Zestful",
"Zesty",
"Zeus",
"Zidisha",
"Zigfu",
"Zillabyte",
"Zinc",
"Foodsmart",
"Zoomer",
"Zootrock",
"ZowPow",
"zPredicta",
"Zyudly Labs"
];

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"), countries);
/**
 * CREATES OUTPUT LIKE THIS:
 *
 * <div id="myInputautocomplete-list" class="autocomplete-items">
 *    <div>
 *       <strong>A</strong>fghanistan<input value="Afghanistan" type="hidden">
 *    </div>
 *    <div><strong>A</strong>lbania<input value="Albania" type="hidden"></div>
 *    <div><strong>A</strong>zerbaijan<input value="Azerbaijan" type="hidden"></div>
 *    ...
 *    ...
 *    ...
 * </div>
 */