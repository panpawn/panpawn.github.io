'use strict';

let buffer = [];

function report() {
	let callsign = document.getElementById('yourself').value.trim() || '[missing]';
	const ind = "          ";
    let div1 = document.getElementById('div1').checked;
	let div2 = document.getElementById('div2').checked;
	let div3 = document.getElementById('div3').checked;
	let department = '';
	if (div1) department = "SASP";
	if (div2) department = "BCSO";
	if (div3) department = "SAHP";
	let date = new Date().toLocaleDateString('en-US');
	

	
	buffer = [];
	
	buffer.push("[DEPARTMENT]: " + department + 
	ind + "[DATE]: " + date + ind + 
	"[OFFICER]: " + callsign);
	buffer.push("");
	buffer.push("[OFFICERS INVOLVED]:");
	buffer.push(callsign);

	let officers = document.getElementById('officers').value.trim();
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
	let resisting = document.getElementById('resisting').checked;
	let whichBank = document.getElementById('whichBank').value.trim() || '[missing]';
	let fpassage = document.getElementById('fpassage').checked;
	let moreDemands = document.getElementById('moreDemands').value.trim();
	let shotgun = document.getElementById('shotgun').checked;
	let otherDemand = document.getElementById('otherDemand').value.trim();
	let witnesses = document.getElementById('witnesses').value.trim();
	let evidence = document.getElementById('evidence').value.trim();
	let confiscated = document.getElementById('confiscated').value.trim();
	let months = document.getElementById('months').value || 0;
	let fine = document.getElementById('fine').value || 0;
	let plea1 = document.getElementById('plea1').checked;
	let plea2 = document.getElementById('plea2').checked;
	let plea3 = document.getElementById('plea3').checked;
	let medical = document.getElementById('medical').checked;
	let reduced1 = document.getElementById('yreduce').checked;
	let reduced2 = document.getElementById('nreduce').checked;
	let reduced = (reduced1 ? "YES" : "NO");
	let pd = document.getElementById('pd').value || "";
	if (pd) pd = "The suspect was processed at " + pd + ". ";
	let drugsales = document.getElementById('drugsale').checked;
	let drugs = document.getElementById('drugs').value || "";
	if (drugs) drugs = "The type of drug this person was selling was " + drugs + ". ";
	let houserobbery = document.getElementById('houserobbery').checked;
	let houserobberyarea = document.getElementById('houserobberyarea').value || "";
	if (houserobberyarea) houserobberyarea = "The " + houserobberyarea + " area was where the suspect was caught robbing houses. ";
	let other = document.getElementById('other').value.trim() || "";
	
	let summary = other + " " || "";
	if (jewlery) {
		summary += callsign + " responded to a call of a Jewlery Store being robbed. " +
		"Upon arriving on scene, we noticed there "+(suspects.endsWith("s") ? 'were' : 'was')+" " + suspects + ". " 
	}
	if (bank) {
		summary += callsign + " responded to a call of a Fleeca Bank being robbed. " +
		"The bank in question was the Fleeca by " + whichBank + ". " +
		"Upon arriving on scene, we noticed there "+(suspects.endsWith("s") ? 'were' : 'was')+" " + suspects + ". " 
	}
	if (shop) {
		summary += callsign + " responded to a call of a shop being robbed. " +
		"The shop in question was the shop by " + whichShop + ". " +
		"Upon arriving on scene, we noticed there "+(suspects.endsWith("s") ? 'were' : 'was')+" " + suspects + ". " 
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
		summary += "The suspect was caught doing a handoff in the area of a reported drug sale. " + drugs;
	}
	
	if (houserobbery) {
		summary += "The suspect was coming out of a house that was reported being robbed. " + houserobberyarea;
	}
	
	if (fevading) {
		summary += "The " + suspects + " attempted to evade police recklessly. The suspect in question ended up getting caught. ";
	} else if (evading) {
		summary += "The " + suspects + " attempted to evade police. The suspect in question ended up getting caught. ";
	}
	if (resisting) {
		summary += "The suspect resisted arrest by running from police. The suspect in question ended up getting caught. ";
	}
	if (medical) {
		summary += "The suspect got injured before reaching police custody, so they were offered and received medical treatment by medical professionals. ";
	}
	summary += pd;
	
	officers = officers.split('\n');
	buffer.push(...officers);
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

	buffer.push("[REPORT OF INCIDENT]: ----------");
	buffer.push(summary.trim());
	buffer.push("");

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
	if (confiscated === '') {
		buffer.push("N/A");
	} else {
		confiscated = confiscated.split('\n');
		buffer.push(...confiscated);
	}
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
		
	return document.getElementById('reportBody').innerHTML = buffer.join("<br />");
}

let inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
inputs.forEach(i => i.addEventListener('keyup', report, false));

let checkboxes = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
checkboxes.forEach(i => i.addEventListener('click', report, false));

let doCopy = false;

function copy () {
	doCopy = true;
	document.getElementById('reportBody').addEventListener('click', function() {
		if (doCopy) {
			let range, selection;
			if (document.body.createTextRange) {
				range = document.body.createTextRange();
				range.moveToElementText(this);
				range.select();
			} else if (window.getSelection) {
				selection = window.getSelection();
				range = document.createRange();
				range.selectNodeContents(this);
				selection.removeAllRanges();
				selection.addRange(range);
			}
			document.execCommand("copy");
			alert("The report has been copied to your clipboard.");
		}
		doCopy = false;
	}, false);
	document.getElementById('reportBody').click();
}
