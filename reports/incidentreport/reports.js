'use strict';

let buffer = [];
let officersInvolved = new Set();
let darkmodeState;

function report() {
	let callsign = document.getElementById('yourself').value.trim();
	if (callsign) localStorage.setItem('callsign', callsign);
	if (!callsign && localStorage.getItem('callsign')) callsign = localStorage.getItem('callsign');
	if (!callsign) callsign = '[missing]';
	const ind = "        ";
	let div1 = document.getElementById('div1').checked;
	let div2 = document.getElementById('div2').checked;
	let div3 = document.getElementById('div3').checked;
	let department = '';
	if (div1) department = "SASP";
	if (div2) department = "BCSO";
	if (div3) department = "SAHP";
	let title = document.getElementById('title').value.trim() || "[missing]";
	let date = new Date().toLocaleDateString('en-US');

	buffer = [];
	buffer.push("[TITLE]: " + title);
	buffer.push("");

	buffer.push("[DEPARTMENT]: " + department +
		ind + "[DATE]: " + date + ind +
		"[REPORTING OFFICER]: " + callsign);
	buffer.push("");
	buffer.push("[OFFICERS INVOLVED]:");
	buffer.push(callsign);

	let officersearch = document.getElementById('officersearch').value.trim();
	let suspect = document.getElementById('suspect').value.trim() || 'Unknown';
	suspect = suspect.split('\n').join('\n');
	let witnesses = document.getElementById('witnesses').value.trim();
	let evidence = document.getElementById('evidence').value.trim();
	let other = document.getElementById('other').value.trim() || "[missing]";
	let serialnumbers = document.getElementById('serialnumbers').value.trim() || "N/A";
	serialnumbers = serialnumbers.split('\n').join('\n');
	let linked = document.getElementById('linked').value.trim() || "";
	if (linked) linked = linked.split(',');

	let summary = other;

	let demands = [];
	

	searchOfficer(officersearch);
	buffer.push(...officersInvolved.values());
	buffer.push("");
	buffer.push("[SUSPECTS INVOLVED]:");
	buffer.push(suspect);
	buffer.push("");

	buffer.push("[WITNESSES]:");
	if (witnesses === '') {
		buffer.push("N/A");
	} else {
		witnesses = witnesses.split('\n');
		buffer.push(...witnesses);
	}
	buffer.push("");

	buffer.push("[REPORT OF INCIDENT]:-----------------------------------------------------------------------------------------------------------------------");
	buffer.push(summary.trim());

	buffer.push("");
	buffer.push("-------------------------------------------------------------------------------------------------------------------------------------------------");

	buffer.push("[EVIDENCE/PHOTOGRAPHS]:");
	if (evidence === '') {
		buffer.push("N/A");
	} else {
		evidence = evidence.split('\n');
		evidence.forEach(line => {
			buffer.push(line.replace('| SC', '| Security Camera Photo'));
		});
	}
	buffer.push("");

	buffer.push("[WEAPON SERIAL NUMBERS FOUND]:");
	buffer.push(serialnumbers);
	buffer.push("");

	if (linked) {
		buffer.push("");
		linked.forEach(incident => {
			if (incident) {
				buffer.push("[Linked Incident]:[[" + incident.trim() + "]]");
				buffer.push("");
			}
		});
	}

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
	loadOfficers();
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
		output += `<img src="../images/hat2.png" width="96" height="96">\n`;
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
