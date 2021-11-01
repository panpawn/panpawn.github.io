'use strict';

let darkmodeState;

const header = `<table><tr style="font-weight: bold"><td><h1>B</h1></td><td><h1>I</h1></td><td><h1>N</h1></td><td><h1>G</h1></td><td><h1>O</h1></td></tr>`;

const cells = [
	"13A",
	"78s w/ no location",
	"The whold PD for this?",
	"Flees from traffic stop",
	"STOP RAMMING!",
	"Jewelery store minutes after 1hr",
	"Free passage no spikes",
	"An intercepter for this?",
	"Air-1 for this?",
	">goes to shoot empty tazer",
	"Amelia 13B",
	"Cop says fucka ladda 13B",
	"911 asking for job",
	"311 asking for job",
	"Bro why are they shooting?",
	"Crim calls cop W chaser",
	"Hostage at MRPD",
	"Cop crashes w/ no repair kit",
	"Air-1 goes down",
	"Someone says quiet over radio",
	"Someone steals cop car",
	"Guy wants to roll for jail time",
	"Suspect argues during felony stop",
	"MPX set to single fire mistakenly",
	"Forgot to turn watch/compass on",
	"ON MY 20!",
	"Crim demands bench trial",
	"Cop barrel rolls out of car",
	"Shooting outside MRPD",
	"Not in my eyes...",
	"Can you reduce my fine?",
	"Shooting at Alta apartments",
	"Misdemeanor ends in OIS",
	"Blank 911 call",
	"Houdini disappearing trick",
	"Someone calls cops pigs",
	"Shootout @ UwU Cafe",
	"Climbs construction site",
	"Car swap red garage",
	"Cop taken hostage",
	"All this for a D contract?",
	"Local runs over crim",
	"Car swap apartments wall",
	"Any HC around for a raid?",
	"Someone saves over MDW report",
	"Class 2 fire Alta apartments",
	"Processing while 13A pops",
	"Great Ocean Fleeca w/ no hostage",
	"Vault/Paleto right after each other",
	"99A M+ w/ no motor unit on duty",
	"VIN scratch used for heist",
	"Bike unit 13B",
	"2 groups fight for jewlery",
	"Gets donowalled on radio",
	"99A turns into OIS",
	"Crim asks cops to flip them",
	"Crim tells cop to stop being weird",
	"Secondary in chase PITs primary",
	">guy from apartments gave me the car",
	"Car swaps onto a motorcycle",
	"Crim asks for time served",
];

function generate() {
	let curDarkmode = document.getElementById('darkmode').checked;
	if (curDarkmode) {
		if (darkmodeState === 'false') updateDarkmode();
	} else if (!curDarkmode) {
		if (darkmodeState === 'true') updateDarkmode();
	}
}

// Listen for a click on the checkbox
function updateDarkmode() {
	// Then toggle (add/remove) the .dark-theme class to the body
	let darkmode = document.getElementById('darkmode').checked;
	if (darkmode) {
		localStorage.setItem("darkmode", true);
		darkmodeState = 'true';
	} else if (!darkmode) {
		localStorage.setItem("darkmode", false);
		darkmodeState = 'false';
	}
	document.body.classList.toggle('dark-theme');
}

function shuffle(array) {
	let currentIndex = array.length
	let randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}
	return array;
}

let pageReloaded = false;

let randGenerated = [];

function toggle(cell) {
	let element = document.getElementById(`cell-${cell}`);
	if (!element) return;
	element.classList.toggle('selected-bingo');
}

function reloadPage() {
	pageReloaded = true;
	loadPage();
}

function loadPage() {
	if (!pageReloaded) {
		let darkmodeSetting = localStorage.getItem("darkmode");
		if (!darkmodeSetting || darkmodeSetting === 'undefined' || darkmodeSetting === 'false') {
			localStorage.setItem("darkmode", false);
			darkmodeState = 'false';
		}
		if (darkmodeSetting == 'true') {
			document.getElementById('darkmode').checked = true;
			document.body.classList.toggle('dark-theme');
			darkmodeState = 'true';
		}
	}
	let randCells = shuffle(cells);
	let table = header;
	let totalCount = 0;
	let rowCount = 0;
	for (let i = 0; i < 25; i++) {
		let selected = randCells[totalCount];
		totalCount++;
		if (totalCount == 13) {
			selected = "FREE SPACE";
			table += "<td id=\"cell-" + selected + "\" onClick='toggle(\"" + selected + "\")'>"
			table += `${selected}`;
			table += `</td>`;
		} else {
			table += "<td id=\"cell-" + selected + "\" onClick='toggle(\"" + selected + "\")'>"
			table += selected;
			table += `</td>`;

			if ((i + 1) % 5 == 0 ) table += `</tr><tr>`;
		}
	}

	document.getElementById('bingo_table').innerHTML = table;
	toggle("FREE SPACE");

	let inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
	inputs.forEach(i => i.addEventListener('keyup', generate, false));

	let checkboxes = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
	checkboxes.forEach(i => i.addEventListener('click', generate, false));
}
