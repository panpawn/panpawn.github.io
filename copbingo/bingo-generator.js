'use strict';

let darkmodeState;

const header = `<table><tr style="font-weight: bold"><td><h1>B</h1></td><td><h1>I</h1></td><td><h1>N</h1></td><td><h1>G</h1></td><td><h1>O</h1></td></tr>`;
const saveButton = "<button class=\"btn\" onClick='saveCurrentBoard()'><i class=\"fa fa-floppy-o\" aria-hidden=\"true\"></i> Save Board</button>";

const date = new Date();

const tdInlineStyle = `user-select: none; cursor: pointer;`;

const cells = [
	"13A",
	"78s w/ no location",
	"The whole PD for this?",
	"Flees from traffic stop",
	"Flees from felony stop",
	"STOP RAMMING!",
	"Free passage no spikes",
	"An intercepter for this?",
	"Air-1 for this?",
	">goes to shoot empty tazer",
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
	"Felony stop arguing",
	"Forgot to turn compass on",
	"ON MY 20!",
	"Crim demands bench trial",
	"Cop barrel rolls out of car",
	"Shooting outside MRPD",
	"Not in my eyes...",
	"Can you reduce my fine?",
	"Shooting at Alta apartments",
	"Misdemeanor ends in OIS",
	"Blank 911 call",
	"Houdini",
	"Someone calls cops pigs",
	"Ambush at gang block",
	"Climbs construction",
	"Car swap red garage",
	"Cop taken hostage",
	"All this for a D contract?",
	"Local runs over crim",
	"Car swap apartments wall",
	"Any HC around for a raid?",
	"Saved over MDW report",
	"Class 2 fire Alta apartments",
	"Processing while 13A pops",
	"Report writing while 13A pops",
	"Fleeca w/ no hostage",
	"Bike chase w/ no motor",
	"VIN scratch used for heist",
	"13B with no context",
	"2 groups fight for jewlery",
	"Donowalled on radio",
	"99A turns into OIS",
	"Crim asks cops to flip them",
	"STOP BEING WEIRD!",
	"My friends car, I swear!",
	"Car swaps onto a motorcycle",
	"Crim asks for time served",
	"Cop pulls over a local",
	"911 to check warrant status",
	"VCB in under 30 seconds",
	"Uses own gun in robbery",
	"Crim uses own car in robbery",
	"S class parked outside robbery",
	"Bike(s) go down tunnel station",
	"Crim says they know cop SOPs",
	"Blames scuff for being caught",
	"Lawyer requested",
	"Cone stalls car",
	"Turtled after jump",
	"Cop PITs cop",
	"Cop gets C4d",
	"Suspect refuses medical",
	"Mid chase hostage taken",
	"Trunk/glovebox checked",
	"VCB while Air-1 refueling",
	"Non-security loitering MRPD", 
	"Air-1 head pops",
	"IS YOUR BODYCAM ON?",
	"Weed planted in open field",
	"Cop 13A mins before storm",
	"Albert falls off vault roof",
	"LONG EYES!",
	"Isabelle May",
	"Hard 50 still mobile",
	"Dispatch 10-3's",
	"Quack in motorpool",
	"Someone bullies Mendez",
	"Barking on radio",
	"Snow laughs",
	"10-Bored",
	"Bjorn screams on radio",
	"MRPD out of toilet paper",
	"78s within first 5min of shift",
	"Criminals fail Bay City",
	"PD tow breaks law",
	"Bike swap",
	"Cop 13s at gas station",
	"Highway blaster",
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
	table = document.getElementById('bingo_table').innerHTML;
}

function toggle2() {
	return alert("ERROR: You cannot edit an old board! Start a new board to start playing.");
}

function reloadPage() {
	pageReloaded = true;
	loadPage();
}
function replaceAll(string, search, replace) {
	return string.split(search).join(replace);
}

let table = header;

function saveCurrentBoard() {
	let name = prompt(`Enter name to save board as`, `untitled board`);
	let cached = localStorage.getItem(`board-${name}`);
	if (!cached || cached == 'undefined' || cached === 'false') {
		let tableToSave = replaceAll(table, 'toggle(', 'toggle2(');
		name = name.trim();
		if (name.length > 30) return alert("ERROR: Name of saved board cannot be more than 30 characters long.");
		name += ` (${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()})`;
		localStorage.setItem(`board-${name}`, tableToSave);
		alert(`Board "${name}" saved!`);
	} else {
		alert(`ERROR: A board named "${name}" has already been saved!`);
		return;
	}
}

function showSavedBoards() {
	let cached = Object.keys(localStorage);
	let buffer = "<button class='btn' onClick='mainBoard()'><i class=\"fa fa-arrow-left\" aria-hidden=\"true\"></i> Back</button><br /><br />";
	let matches = 0;
	cached.forEach(key => {
		if (!key.startsWith(`board-`)) return;
		matches++;
		key = key.replace('board-', '');
		buffer += "- <button class='btn' onClick='showSaved(\"" + key + "\")'>" + key + "</button><br />";
	});
	if (!matches) buffer += `<i>(no saved boards <i class="fa fa-frown-o" aria-hidden="true"></i>)</i>`;
	document.getElementById('bingo_table').innerHTML = buffer;
	document.getElementById('save_button').innerHTML = '';
}

function mainBoard() {
	document.getElementById('bingo_table').innerHTML = table;
	document.getElementById('save_button').innerHTML = saveButton;
}

function deleteSaved(board) {
	localStorage.removeItem(`board-${board}`);
	alert(`Board "${board} has been deleted!`);
	showSavedBoards();
}

function showSaved(board) {
	let savedBoard = localStorage.getItem(`board-${board}`);
	if (savedBoard) {
		
		let buffer = "<strong>" + board + " <button class=\"btn\" onClick='deleteSaved(\"" + board + "\")' title=\"Delete this saved board\"><i  class=\"fa fa-trash-o\" aria-hidden=\"true\"></i> Delete</button></strong><br /><br />";
		document.getElementById('bingo_table').innerHTML = `${buffer}${savedBoard}`;
		document.getElementById('save_button').innerHTML = '';
	}
}
function loadPage() {
	table = header;
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
	
	let totalCount = 0;
	let rowCount = 0;
	for (let i = 0; i < 25; i++) {
		let selected = randCells[totalCount];
		totalCount++;
		if (totalCount == 13) {
			selected = "FREE SPACE";
			table += "<td id=\"cell-" + selected + "\" style='" + tdInlineStyle + "' onClick='toggle(\"" + selected + "\")'>"
			table += `${selected}`;
			table += `</td>`;
		} else {
			table += "<td id=\"cell-" + selected + "\" style='" + tdInlineStyle + "' onClick='toggle(\"" + selected + "\")'>"
			table += selected;
			table += `</td>`;

			if ((i + 1) % 5 == 0 ) table += `</tr><tr>`;
		}
	}
	table += '</table>';

	document.getElementById('bingo_table').innerHTML = table;
	document.getElementById('save_button').innerHTML = saveButton;
	toggle("FREE SPACE");

	let inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
	inputs.forEach(i => i.addEventListener('keyup', generate, false));

	let checkboxes = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
	checkboxes.forEach(i => i.addEventListener('click', generate, false));
}
