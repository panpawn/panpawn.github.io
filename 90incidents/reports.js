'use strict';

let buffer = [];
let officersInvolved = new Set();
let darkmodeState;
let alreadySpecifiedRobbery = false;
let ROBBERY_STATE = 'JEWLERY';

function report() {
	let callsign = document.getElementById('yourself').value.trim();
	if (callsign) localStorage.setItem('callsign', callsign);
	if (!callsign) callsign = '[missing]';
	const ind = "        ";
	let date = new Date().toLocaleDateString('en-US');

	buffer = [];
	buffer.push("[REPORTING OFFICER]:");
	buffer.push(callsign);	

	let scenecommand = document.getElementById('scenecommand').value;
	let negotiator = document.getElementById('negotiator').value;
	if (scenecommand || negotiator) buffer.push('');

	if (scenecommand) buffer.push(`[SCENE COMMAND]: ${scenecommand}`);
	if (negotiator) buffer.push(`[NEGOTIATOR]: ${negotiator}`);
	buffer.push('');

	let robbery = document.getElementById('robberytype').value;
	let robberyString = '';

	if (robbery.trim() === 'Fleeca Bank') {
		document.getElementById('whatStore').style.display = 'none';
		document.getElementById('whatFleeca').style.display = 'block';
		let specific = document.getElementById('specificBank').value;
		robberyString = `${robbery} at ${specific}`;
		//document.getElementById('specificBank').disabled = false;
		ROBBERY_STATE = 'FLEECA';
	}
	if (robbery.trim() === '24/7 Store') {
		document.getElementById('whatFleeca').style.display = 'none';
		document.getElementById('whatStore').style.display = 'block';
		let specific = document.getElementById('specificStore').value;
		robberyString = `${robbery} at ${specific}`;
		ROBBERY_STATE = '24/7';
	} 
	if (robbery.trim() === 'Jewlery Store') {
		document.getElementById('whatFleeca').style.display = 'none';
		document.getElementById('whatStore').style.display = 'none';
		robberyString = robbery;
		// we are clearing this in case something else was selected previously
		ROBBERY_STATE = 'JEWLERY';
	}

	/*
	if (ROBBERY_STATE === 'FLEECA') {
		let specific = document.getElementById('specificBank').value;
		robbery = `${robbery} at ${specific}`;
	}
	if (ROBBERY_STATE === '24/7') {
		let specific = document.getElementById('specificStore').value;
		robbery = `${robbery} at ${specific}`;
	}
	*/

	buffer.push(`[DETAILS | DEMANDS]:`);
	buffer.push(`During normal patrol, we had a report of a robbery (10-90) alarm going off at a/the ${robberyString}. Once scene command was established, they assigned ${callsign} to create an incident report.`);
	buffer.push('');
	let hostages = document.getElementById('hostages').value;
	let robbersinside = document.getElementById('robbersinside').value;
	let robbersoutside = document.getElementById('robbersoutside').value;
	buffer.push(`After setting up the perimeter around the area, we began negotiations. During the negotiations, we learned there were:`);
	buffer.push(` - ${robbersinside} unidentified suspect(s) on the inside`);
	buffer.push(` - ${robbersoutside} unidentified suspect(s) on the outside assisting (allegedly)`);
	buffer.push(` - ${hostages} hostage(s) being held at gunpoint`);
	buffer.push('');

	let demands = [];
	let demandsText = '';
	if (document.getElementById('fpassage').checked) demands.push("free passage");
	if (document.getElementById('nspikes').checked) demands.push("no spike strips");
	if (document.getElementById('nair').checked) demands.push("no helicopter/air1");
	if (document.getElementById('nspeed').checked) demands.push("no speed unit");
	let otherDemands = document.getElementById('otherdemands').value.trim();
	if (otherDemands) demands.push(...otherDemands.split(','));
	if (demands.length > 1) {
		const lastDemand = demands.pop();
		demandsText += `${demands.join(', ')} and ${lastDemand}`;
	} else {
		demandsText = demands;
	}

	let hostagestayer = document.getElementById('hostagestayer').value;
	let stayedBack = (hostagestayer ? hostagestayer.trim() : 'a unit');
	buffer.push(`The ${robbersinside} unidentified suspect(s) demanded ${demandsText} for the safety of the ${hostages} hostage(s).` +
		` Once they were ready on the inside, scene command prepared a lineup for the pursuit. Scene command assigned ${stayedBack} to stay back for the hostage and collect their contact information.`);
	buffer.push('');

	buffer.push(`[VEHICLE | CHASE]:`);
	let plate = document.getElementById('vehicleplate').value;
	let vehicledesc = document.getElementById('vehicledesc').value;
	if (vehicledesc) vehicledesc = ` which was a ${vehicledesc}${(plate ? ' (PLATE: ' + plate + ')' : '')}`;
	buffer.push(`We then let them get into their vehicle${vehicledesc}. Once everyone was ready, the chase started and they attempted to evade from police recklessly.`);
	buffer.push('');

	let medicalSelected = document.getElementById('medicalattention');
	let medicalInformation = {
		'Was requested by multiple suspects': {
			label: 'WAS REQUESTED',
			text: 'After we apprehended the suspects, they requested medical attention. We then transported them to Saint Fiacre where they got further medical attention.',
		},
		'Was requested by one suspect': {
			label: 'ONE REQUESTED',
			text: 'After we apprehended the suspects, one of them requested or needed medical attention. We then transported that suspect to Saint Fiacre where they got further medical attention.',
		},
		'Was not requested or needed': {
			label: 'WAS NOT REQUESTED',
			text: 'After we apprehended the suspects, they did not request or need any medical attention.',
		}
	};
	let medical = medicalSelected.options[medicalSelected.selectedIndex].text;
	buffer.push(`[MEDICAL ATTENTION | ${medicalInformation[medical].label}]:`);
	buffer.push(medicalInformation[medical].text);
	buffer.push('');

	let processed = document.getElementById('processedat').value;
	buffer.push('[PROCESSED]:');
	buffer.push(`All of the apprehended suspects were processed at ${processed}.`);
	
	let curDarkmode = document.getElementById('darkmode').checked;
	if (curDarkmode) {
		if (darkmodeState === 'false') updateDarkmode();
	} else if (!curDarkmode) {
		if (darkmodeState === 'true') updateDarkmode();
	}

	return document.getElementById('reportBody').innerHTML = buffer.join("\n");
}

let inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
inputs.forEach(i => i.addEventListener('keyup', report, false));

let checkboxes = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
checkboxes.forEach(i => i.addEventListener('click', report, false));

let selectOptions = document.querySelectorAll('select');
selectOptions.forEach(i => i.addEventListener('click', report, false));

function loadName() {
	let callsign = '';
	if (localStorage.getItem('callsign')) callsign = localStorage.getItem('callsign');
	document.getElementById('yourself').value = callsign;
}

// Listen for a click on the button
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

function loadDarkmode() {
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
	loadName();
	if (ROBBERY_STATE === 'JEWLERY') {
		document.getElementById('whatFleeca').style.display = 'none';
		document.getElementById('whatStore').style.display = 'none';
	}
	//loadOfficers();
}

let officers = null;
let matched = [];

const replaceNames = {
	'Bucky Killbourne': 'Bucky Langston',
	'Xander Langston': 'Xander Killbourne'
};

function loadOfficers() {
	let cachedOfficers = localStorage.getItem("officers");
	if (!officers) {
		let xhr = new XMLHttpRequest();
		try {
			xhr.open("GET", "https://celestial.network/legacyrp/sasp", false);
			xhr.send(null);

			officers = JSON.parse(xhr.responseText).data;
			officers = officers.map(officer => officer.callsign + ' ' +
				(replaceNames[officer.full_name] ? replaceNames[officer.full_name] : officer.full_name));
			localStorage.setItem('officers', xhr.responseText);
		} catch (e) {
			if (cachedOfficers) {
				cachedOfficers = JSON.parse(cachedOfficers).data;
				officers = cachedOfficers.map(officer => officer.callsign + ' ' + officer.full_name);
				alert('Failed to load officers data from roster; using cached officers data...');
			} else {
				alert('Failed to load officers data from roster & no cache value stored!');
			}
		}
	}
}

function searchOfficer(search) {
	if (!search) {
		document.getElementById('officerslist').innerHTML = '';
		return;
	}
	search = search.toLowerCase();

	if (!officers) loadOfficers();

	let results = officers.filter(officer => officer.toLowerCase().includes(search));
	let resultsCap = 5;
	let count = 0;
	let finalResults = [];
	results.forEach(result => {
		count++;
		if (count > resultsCap) return;
		result = result.trim();
		finalResults.push("<button title='Add this officer to the list of officers involved' onClick='toggleOfficer(\"" + result + "\")'>" + result + "</button>");
	});
	document.getElementById('officerslist').innerHTML = finalResults.join("<br />");
}

function toggleOfficer(id) {
	if (officersInvolved.has(id)) {
		console.log("Removing " + id + "...");
		officersInvolved.delete(id);
	} else {
		console.log("Adding " + id + "...");
		officersInvolved.add(id);

		document.getElementById('officersearch').value = "";
	}
	report();
	updateOfficers();
}

function updateOfficers() {
	let output = "";
	for (let id of officersInvolved.values()) {
		output += `<div class="chip">\n`;
		output += `<img src="images/hat2.png" width="96" height="96">\n`;
		output += `${id}\n`;
		output += `<span class="closebtn" title="Remove this officer from the list of officers involved" style="cursor: default;" onclick='toggleOfficer(\"${id}\")'><i class="fa fa-times-circle-o" aria-hidden="true"></i>
</span>\n`;
		output += `</div>`
	}

	document.getElementById('officersAdded').innerHTML = "<br />" + output;
}

function showCopiedPopup() {
	let popup = document.getElementById("myPopup");
	popup.classList.toggle("show");
	setTimeout(function() {
		popup.classList.toggle("show");
	}, 3500);
}

document.getElementById('copyReport').addEventListener('click', copy, false);
function clearSelection() {
	if (window.getSelection) {
		window.getSelection().removeAllRanges();
	} else if (document.selection) {
		document.selection.empty();
	}
}
function copy() {
	document.getElementById('reportBody').select();
	try {
		document.execCommand('copy');
		showCopiedPopup();
		clearSelection();
	} catch(e) {
		console.log("Copy error: " + e);
	}
}
