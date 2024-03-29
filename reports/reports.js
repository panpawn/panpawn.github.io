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
	let title = document.getElementById('title').value.trim() || "";
	let date = new Date().toLocaleDateString('en-US');

	buffer = [];
	if (title) {
		buffer.push("[TITLE]: " + title);
		buffer.push("");
	}
	buffer.push("[DEPARTMENT]: " + department +
		ind + "[DATE]: " + date + ind +
		"[ARRESTING OFFICER]: " + callsign);
	buffer.push("");
	buffer.push("[OFFICERS INVOLVED]:");
	buffer.push(callsign);

	let officersearch = document.getElementById('officersearch').value.trim();
	let suspect = document.getElementById('suspect').value.trim() || '[missing]';
	let suspects = document.getElementById('suspects').value || 1;
	suspects = suspects + " suspect" + (Number(suspects) > 1 ? "s" : "");
	let fingerprinted = document.getElementById('fingerprint').checked;
	let jewlery = document.getElementById('jewlery').checked;
	let bank = document.getElementById('bank').checked;
	let shop = document.getElementById('shop').checked;
	let whichShop = document.getElementById('whichShop').value.trim() || '[missing]';
	let kidnapping = document.getElementById('kidnapping').checked;
	let hostages = document.getElementById('hostages').value || 1;
	hostages = hostages + " hostage" + (Number(hostages) > 1 ? "s" : "");
	let fevading = document.getElementById('fevading').checked;
	let evading = document.getElementById('evading').checked;
	let shotCops = document.getElementById('shotcops').checked;
	let howManyCopsShot = document.getElementById('shotcopsnum').value || 1;
	let resisting = document.getElementById('resisting').checked;
	let whichBank = document.getElementById('whichBank').value.trim() || '[missing]';
	let fpassage = document.getElementById('fpassage').checked;
	let moreDemands = document.getElementById('moreDemands').value.trim();
	let shotgun = document.getElementById('shotgun').checked;
	let otherDemand = document.getElementById('otherDemand').value.trim();
	let witnesses = document.getElementById('witnesses').value.trim();
	let evidence = document.getElementById('evidence').value.trim();
	let confiscatedDNR = document.getElementById('confiscateddnr').value.trim();
	let confiscatedTBR = document.getElementById('confiscatedtbr').value.trim();
	let months = document.getElementById('months').value || 0;
	let fine = document.getElementById('fine').value || 0;
	let plea1 = document.getElementById('plea1').checked;
	let plea2 = document.getElementById('plea2').checked;
	let plea3 = document.getElementById('plea3').checked;
	let medical = document.getElementById('medical').checked;
	let reduced1 = document.getElementById('yreduce').checked;
	let reduced2 = document.getElementById('nreduce').checked;
	let otherBefore = document.getElementById('otherbefore').checked;
	let otherAfter = document.getElementById('otherafter').checked;
	let reduced = (reduced1 ? "YES" : "NO");
	let pd = document.getElementById('pd').value.trim() || "MRPD";
	let drugsales = document.getElementById('drugsale').checked;
	let drugs = document.getElementById('drugs').value || "";
	if (drugs) drugs = "The type of drug this person was selling was " + drugs + ". ";
	let houserobbery = document.getElementById('houserobbery').checked;
	let houserobberyarea = document.getElementById('houserobberyarea').value || "";
	if (houserobberyarea) houserobberyarea =  houserobberyarea.trim() + " area. ";
	let other = document.getElementById('other').value.trim() || "";
	let linked = document.getElementById('linked').value.trim() || "";
	if (linked) linked = linked.split(',');

	let summary = (otherBefore && other ? other + " " : "") || "";
	if (jewlery) {
		summary += callsign + " responded to a call of a Jewellery Store being robbed. " +
			"Upon arriving on scene, we noticed there " + (suspects.endsWith("s") ? 'were' : 'was') + " " + suspects + ". "
	}
	if (bank) {
		summary += callsign + " responded to a call of a Fleeca Bank being robbed. " +
			"The bank in question was the Fleeca by " + whichBank + ". " +
			"Upon arriving on scene, we noticed there " + (suspects.endsWith("s") ? 'were' : 'was') + " " + suspects + ". "
	}
	if (shop) {
		summary += callsign + " responded to a call of a shop being robbed. " +
			"The shop in question was the shop by " + whichShop + ". " +
			"Upon arriving on scene, we noticed there " + (suspects.endsWith("s") ? 'were' : 'was') + " " + suspects + ". "
	}

	if (kidnapping) {
		summary += "The " + suspects + " had " + hostages + " held at gunpoint. ";
	}

	let demands = [];
	if (fpassage) {
		summary += "After a tense negotiation with the " + suspects + ", we settled on ";
		demands.push('free passage');
		demands.push('no spike strips');
		if (moreDemands) demands.push(...moreDemands.split(','));
		if (otherDemand) demands.push(...otherDemand.split(','));

		if (demands.length === 1) {
			summary += demands[0];
		} else if (demands.length > 1) {
			const lastDemand = demands.pop();
			summary += demands.join(', ') + ' and ' + lastDemand;
		} else {
			summary += '[missing]';
		}
		summary += " for the safety of the hostage(s). ";
		if (shotgun) summary += "They agreed to drop their shotgun for 1 additional command. ";
		summary += "Scene command said that these demands were acceptable. One unit " +
			"stayed behind to collect the hostage(s), all others got ready to pursue. ";
	}

	if (drugsales) {
		summary += callsign + " responded to a call of drug sales. Upon arriving on scene, " + callsign +
		" caught the suspect doing a handoff. " + drugs;
	}

	if (houserobbery) {
		summary += callsign + " responded to a call of a house being robbed" +
		(houserobberyarea ? " in the " + houserobberyarea : ". ") + "Upon arriving on scene, " + callsign +
		" caught the suspect coming out of the same house that was reported being robbed. ";
	}

	if (fevading) {
		summary += "The suspect attempted to evade police recklessly. ";
	} else if (evading) {
		summary += "The suspect attempted to evade police. ";
	}
	if (resisting) {
		summary += "The suspect resisted arrest by running from police on foot. ";
	}
	if (shotCops) {
		summary += "The suspect shot " + howManyCopsShot + " police officer(s) with a firearm. Police returned fire had no choice but to incapacitate the suspect. ";
	}
	if (medical) {
		summary += "The suspect got injured before reaching police custody, so they were offered and received medical treatment by medical professionals. ";
	}
	summary += "The suspect in question ended up getting caught. ";
	summary += "The suspect was processed at " + pd + ". ";;

	searchOfficer(officersearch);
	buffer.push(...officersInvolved.values());
	buffer.push("");
	buffer.push("[SUSPECT INVOLVED]:");
	buffer.push(suspect);
	if (fingerprinted) {
		buffer.push("(Suspect was identified by their fingerprint)");
	}
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
	if (otherAfter && other) summary += other;
	buffer.push(summary.trim());

	buffer.push("");
	buffer.push("-------------------------------------------------------------------------------------------------------------------------------------------------");

	buffer.push("[EVIDENCE]:");
	if (evidence === '') {
		buffer.push("N/A");
	} else {
		evidence = evidence.split('\n');
		evidence.forEach(line => {
			buffer.push(line.replace('| SC', '| Security Camera Photo'));
		});
	}
	buffer.push("");
	buffer.push("[EVIDENCE LOG]:");
	let evidenceLogAdded = false;
	if (confiscatedDNR) {
		buffer.push("*DNR*");
		confiscatedDNR = confiscatedDNR.split('\n');
		buffer.push(...confiscatedDNR);
		evidenceLogAdded = true;
	}
	if (confiscatedTBR) {
		buffer.push("*TBR (@ " + pd + ")*");
		confiscatedTBR = confiscatedTBR.split('\n');
		buffer.push(...confiscatedTBR);
		evidenceLogAdded = true;
	}
	if (!evidenceLogAdded) buffer.push("N/A");

	buffer.push("");

	buffer.push("[CHARGES]:")
	buffer.push("(See arrest report)");
	buffer.push("");

	buffer.push("[SENTENCE]:");
	buffer.push("MONTHS: " + months + ind + "FINE: $" + fine);
	buffer.push("");
	buffer.push("[TIME REDUCED?]:");
	buffer.push(reduced);
	buffer.push("");

	let plea = "";
	if (plea1) {
		plea = "GUILTY";
	} else if (plea2) {
		plea = "NOT GUILTY";
	} else if (plea3) {
		plea = "NO CONTEST";
	}
	buffer.push("[PLEA]:");
	buffer.push("SUSPECT PLEAD " + plea + " TO ALL CHARGES");

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
