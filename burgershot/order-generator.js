'use strict';

let buffer = [];
let officersInvolved = new Set();
let darkmodeState;
const tableWidth = 3;

const menu = {
	// Combo Items:
	"Combination Items:": {
		header: true,
	},
	"Rimjob Combo": {
		price: 30,
		items: ["Rimjob", "Rimjob", "Rimjob", "Rimjob", "Rimjob", "Rimjob"],
	},
	// Variable combos:
	"Running Man": {
		price: 60,
		blackout: 51,
		emoji: '🏃',
		items: ["Fries", "Fries", "Rimjob", "Rimjob", "Soda"],
	},
	"Sugar Rush": {
		price: 35,
		blackout: 30,
		emoji: '🍬',
		items: ["Soda", "Cream Pie", "Rimjob"],
	},
	"Sweet Tooth": {
		price: 60,
		blackout: 51,
		emoji: '🦷',
		items: ["Milkshake", "Milkshake", "Cream Pie", "Cream Pie"],
	},
	"10-80": {
		price: 89,
		blackout: 77,
		emoji: '🔁',
		items: ["Heartstopper", "Milkshake", "Rimjob", "Rimjob", "Rimjob"],
	},
	"Flatliner": {
		price: 119,
		blackout: 101,
		emoji: '💓',
		items: ["Soda", "Heartstopper", "Heartstopper", "Rimjob", "Rimjob", "Rimjob"],
	},
	"Backdoor Blast": {
		price: 69,
		blackout: 58,
		emoji: '🚪',
		items: ["Torpedo", "Rimjob", "Milkshake"],
	},
	"Bloody Mary": {
		price: 80,
		blackout: 68,
		emoji: '🩸',
		items: ["Bleeder", "Fries", "Milkshake", "Cream Pie"],
	},
	"Dirty Laundry": {
		price: 99,
		blackout: 84,
		emoji: '🧺',
		items: ["Money Shot", "Money Shot", "Rimjob", "Cream Pie", "Soda"],
	},
	"Full Moon": {
		price: 140,
		emoji: '🌕',
		items: ["Fries", "Fries", "Fries", "Fries", "Soda", "Soda", "Heartstopper", "Rimjob"],
	},
	"Fiji": {
		price: 45,
		blackout: 38,
		emoji: '🌺',
		items: ["Torpedo", "Water", "Water"],
	},
	"Super Soaker": {
		price: 70,
		emoji: '🔫',
		items: ["Water", "Soda", "Rimjob", "Bleeder"],
	},
	"Salty Seaman": {
		price: 111,
		blackout: 94,
		emoji: '🧂',
		items: ["Milkshake", "Milkshake", "Milkshake", "Fries", "Fries", "Fries"],
	},
	"High Roller": {
		price: 75,
		emoji: '🤑',
		items: ["Money Shot", "Money Shot", "Soda"],
	},
	// Burger Meals:
	"Burger Meals:": {
		header: true,
	},
	"Murder Meal": {
		max: 5,
		price: 101,
		noDiscount: true,
		items: ["Murder Meal"],
	},
	"Heartstopper Meal": {
		price: 70,
		items: ["Heartstopper", "Fries", "Soda"],
	},
	"Money Shot Meal": {
		price: 70,
		items: ["Money Shot", "Fries", "Soda"],
	},
	"Torpedo Meal": {
		price: 70,
		items: ["Torpedo", "Fries", "Soda"],
	},
	"Bleeder Meal": {
		price: 70,
		items: ["Bleeder", "Fries", "Soda"],
	},
	"Meat Free Meal": {
		price: 70,
		items: ["Meat Free", "Fries", "Soda"],
	},
	// Individual Items:
	"Individual Items:": {
		header: true,
	},
	"Heartstopper": {
		price: 40,
		items: ["Heartstopper"],
	},
	"Money Shot": {
		price: 42,
		items: ["Money Shot"],
	},
	"Torpedo": {
		price: 42,
		items: ["Torpedo"],
	},
	"Bleeder": {
		price: 42,
		items: ["Bleeder"],
	},
	"Meat Free": {
		price: 30,
		items: ["Meat Free"],
	},
	"Water": {
		price: 10,
		items: ["Water"],
	},
	"Soda": {
		price: 20,
		items: ["Soda"]
	},
	"Milkshake": {
		price: 30,
		items: ["Milkshake"],
	},
	"Fries": {
		price: 15,
		items: ["Fries"],
	},
	"Rimjob": {
		price: 10,
		items: ["Rimjob"],
	},
	"Cream Pie": {
		price: 10,
		lastItem: true,
		items: ["Cream Pie"],
	}
};

const indivItems = [
	"Murder Meal", "Heartstopper", "Money Shot", "Torpedo", "Bleeder", "Water", "Meat Free",
	"Fries", "Soda", "Rimjob", "Cream Pie", "Milkshake", "Toy"
];

const buttons = {
	"buffer": {
		html: '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp|&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp'
	},
	"new_order": {
		html: '<div class="btn" onclick="newOrder();" title="Clear current order"><i class="fa fa-refresh" aria-hidden="true"></i> New Order</div>',
	},
	"set_combos": {
		html: '<div class="btn" onclick="toggleCombos()" title="Select current active combos"><i class="fa fa-cog" aria-hidden="true"></i> Combo Settings</div>',
	},
	"save": {
		html: '<div class="btn" onclick="updateSelected()" title="Save selected combos"><i class="fa fa-floppy-o" aria-hidden="true"></i> Save Combination Items</div>',
	}
};

function getOccurrence(array, value) {
	return array.filter((v) => (v === value)).length;
}

function formatItems(items) {
	let newArray = [];
	let imageIcons = '';

	indivItems.forEach(item => {
		let occ = getOccurrence(items, item);
		let imageName = item.toLowerCase().replace(' ', '_');
		let imageIcon = `<img src="images/${imageName}.png" title="${occ}x ${item}" width="30" height="30"> `
		if (occ > 0) newArray.push(`- ${occ}x ${imageIcon}${item}`);
	});

	return newArray;
}

function add(item) {
	let number = Number(document.getElementById(`${item}-#`).innerText);
	let max = menu[item].max || 100;
	if (number + 1 <= max) {
		document.getElementById(`${item}-#`).innerText = number + 1;
		report();
	} else {
		alert(`You cannot add more than ${max}x ${item} in 1 order!`);
	}
}

function remove(item) {
	let number = Number(document.getElementById(`${item}-#`).innerText);
	if (number - 1 >= 0) {
		document.getElementById(`${item}-#`).innerText = Number(number) - 1;
		report();
	}
}

function getEmptyOrder() {
	buffer = [];
	buffer.push('<img src="images/bs-logo.svg" width="50%">');
	buffer.push("");
	buffer.push("<strong>ITEMS ORDERED:</strong>");
	buffer.push("");
	buffer.push("");
	buffer.push("");
	buffer.push(`<strong>SUBTOTAL:</strong> <span class="green">$0</span>`);
	document.getElementById('reportBody').innerHTML = buffer.join("\n");
}

function report() {
	buffer = [];
	buffer.push('<img src="images/bs-logo.svg" width="50%">');
	buffer.push("");
	let curDarkmode = document.getElementById('darkmode').checked;
	if (curDarkmode) {
		if (darkmodeState === 'false') updateDarkmode();
	} else if (!curDarkmode) {
		if (darkmodeState === 'true') updateDarkmode();
	}
	let total = 0;
	let allItems = [];
	if (selectingCombos) return;
	let discountSelected = document.getElementById('halfoff').checked;
	let blackoutSale = document.getElementById('blackout').checked;
	if (discountSelected && blackoutSale) {
		alert("You cannot have more than one sale/discount at once!");
		discountSelected = document.getElementById('halfoff').checked = false;
		blackoutSale = document.getElementById('blackout').checked = false;
	}

	Object.keys(menu).forEach(item => {
		if (menu[item].header) return;
		let selected = true;
		if (menu[item].emoji) selected = isSelected(item);

		if (!selected) return;
		let discount = (menu[item].noDiscount ? false : true);
		let price;
		if (blackoutSale && menu[item].blackout) {
			price = menu[item].blackout;
		} else {
			price = menu[item].price;
		}
		if (discountSelected && discount) price = Math.round(price / 2);
		let quantity = 0;
		quantity = document.getElementById(`${item}-#`).innerText;

		let items = menu[item].items;
		total += price * quantity;
		if (quantity) {
			let count = 0;
			while (count < quantity) {
				count++;
				allItems = allItems.concat(items);
			}
		}
	});
	buffer.push("<strong>ITEMS ORDERED:</strong>");
	let formatted = formatItems(allItems.sort());
	buffer.push(formatted.join('\n'));
	buffer.push("");
	buffer.push("");
	buffer.push(`<strong>SUBTOTAL:</strong> <span class="green">$${total}</span>`);

	return document.getElementById('reportBody').innerHTML = buffer.join("\n");
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


function isSelected(comboName) {
	let returnVal;
	let value = localStorage.getItem(`${comboName}-SELECTED`);
	if (!value || value === 'undefined' || value === 'false') {
		returnVal = false;
	} else {
		returnVal = true;
	}
	return returnVal;
}
let selectingCombos = false;
let pageReloaded = false;
function updateSelected() {
	if (!selectingCombos) return;
	Object.keys(menu).forEach(item => {
		if (!menu[item].header && menu[item].emoji) {
			let checked = document.getElementById(`${item}-SELECTED`).checked;
			localStorage.setItem(`${item}-SELECTED`, checked);
		}
	});
	toggleCombos();
	pageReloaded = true;
	loadPage();
	newOrder();
}

function toggleCombos() {
	let comboTableWidth = 2;
	selectingCombos = !selectingCombos;
	if (selectingCombos) {
		let buffer = `<table border="0"><tr><td colspan="${comboTableWidth}"><center><i>Select active combination items:</i></center></td></tr><tr>`;
		let count = 0;
		Object.keys(menu).forEach(item => {
			if (menu[item].header || !menu[item].emoji) return;
			let checked = (isSelected(item) ? "checked" : "");
			let tr = '';
			count++;
			if (count == comboTableWidth) {
				tr = `</tr><tr>`;
				count = 0;
			}
			buffer += `<td><input type="checkbox" id="${item}-SELECTED" name="${item}-SELECTED" value="${item}-SELECTED" ${checked}/>` +
				`<label for="${item}-SELECTED">${menu[item].emoji} ${item}</label></td>${tr}`;
		});
		for (let i = count; i < comboTableWidth; i++) {
			buffer += `<td></td>`;
		}
		buffer += `<tr><td colspan="${tableWidth}"><center>${buttons['save'].html}</center></td></tr>`;
		buffer += `</table>`;
		
		document.getElementById('table').innerHTML = buffer;
		document.getElementById('action-buttons').innerHTML = '';
	} else {
		document.getElementById('table').innerText = '';
	}
}

function getIcon(item) {
	if (item !== 'Murder Meal') {
		item = item.replace('Meal', '').replace('Combo', '').trim();
	}
	if (!menu[item]) return;
	let icon;
	if (menu[item].emoji) {
		icon = menu[item].emoji;
	} else {
		let fileName = `${item.toLowerCase().replace(' ', '_')}.png`;
		icon = `<img src="images/${fileName}" width="20" height="20">`;
	}
	return icon;
}

function newOrder() {
	Object.keys(menu).forEach(item => {
		if (menu[item].header) return;
		let selected = isSelected(item);
		if (menu[item].emoji && !selected) return;
		document.getElementById(`${item}-#`).innerText = 0;
	});
	pageReloaded = true;
	report();
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
	let table = '<table><tr>';
	let count = 0;
	Object.keys(menu).forEach(item => {
		if (menu[item].header) {
			for (let i = count; i < tableWidth; i++) {
				table += `<td></td>`;
			}
			table += `</tr><tr><td colspan="${tableWidth}"><center><strong><u>${item}</u></strong></center></td></tr><tr>`;
			count = 0;
		} else {
			let max = menu[item].max || 100;
			let icon = getIcon(item);
			let comboName = item;
			if (comboName.includes("Combo") || comboName.includes("Meal")) {
				if (comboName !== 'Murder Meal') {
					comboName = comboName.replace(" Combo", "").replace(" Meal", "");
				}
			}
			if (menu[item].emoji) {
				if (!isSelected(item)) return;
			} else {
				let fileName = `${comboName.toLowerCase().replace(' ', '_')}.png`;
			}
			let qty = 0;
			if (pageReloaded && (menu[item].emoji && isSelected(item))) {
				let element = document.getElementById(`${item}-#`);
				if (element) qty = document.getElementById(`${item}-#`).innerText;
			}

			table += "<td><center><button class=\"btn\" title='Add 1x " + item + "' onClick='add(\"" + item + "\")'><strong>" + icon + item + "</strong></button><br />" +
				`Qty: <strong><span id="${item}-#">${qty}</span></strong> | $${menu[item].price} | ` +
				"<i class=\"fa fa-minus-circle\" aria-hidden=\"true\" title='Remove 1x " + item + "' onClick='remove(\"" + item + "\")'></i></td>";
			count++;
			if (count == tableWidth) {
				table += `</tr><tr>`
				count = 0;
			}
			if (menu[item].lastItem) {
				for (let i = count; i < tableWidth; i++) {
					table += `<td></td>`;
				}
			}
		}
	});

	table += `</tr><tr><td colspan="${tableWidth}"><input type="checkbox" id="halfoff" name="halfoff" value="halfoff" />` +
		`<label for="halfoff">50% Discount (PD, EMS, BS Employees...)</label><br />` +
		`<input type="checkbox" id="blackout" name="blackout" value="blackout" />` +
		`<label for="blackout">Blackout Sale (certain items 15% off)</label></td>` +
		`</tr></table>`;

	document.getElementById('table').innerHTML = table;

	let activeButtons = `${buttons['buffer'].html}${buttons['new_order'].html}`;
	if (!selectingCombos) activeButtons += ` | ${buttons['set_combos'].html}`;
	document.getElementById('action-buttons').innerHTML = activeButtons;	

	if (!pageReloaded) getEmptyOrder();

	let inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
	inputs.forEach(i => i.addEventListener('keyup', report, false));

	let checkboxes = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
	checkboxes.forEach(i => i.addEventListener('click', report, false));

	let numbers = document.querySelectorAll('input[type="number"]');
	numbers.forEach(i => i.addEventListener('click', report, false));
}
