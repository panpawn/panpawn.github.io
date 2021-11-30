'use strict';

let darkmodeState;

const Settings = {
	'MAIN_TABLE_WIDTH': 3,
	'DEFAULT_MAX_CAP': 100,
}
function rep(elem, quantity) {
	return `${elem}|`.repeat(quantity).split('|').slice(0, -1);
}

const Menu = {
	"Weapons:": {
		header: true,
	},
	"Diamondback DB9": {
		noIcon: true,
		price: 2500,
		items: [
			...rep("Steel", 15),
			...rep("Aluminium", 15),
		],
	},
	"Browning Hi-Power": {
		noIcon: true,
		price: 2500,
		items: [
			...rep("Steel", 15),
			...rep("Aluminium", 15),
		],
	},
	"Desert Eagle": {
		noIcon: true,
		price: 6000,
		items: [
			...rep("Aluminium", 130),
			...rep("Plastic", 130),
		],
	},
	"Glock 18C": {
		noIcon: true,
		price: 6000,
		items: [
			...rep("Aluminium", 80),
			...rep("Plastic", 70),
		],
	},
	"Uzi": {
		noIcon: true,
		price: 5000,
		items: [
			...rep("Aluminium", 30),
			...rep("Plastic", 60),
			...rep("Rubber", 30),
		],
	},
	"Mac-10": {
		noIcon: true,
		price: 5000,
		items: [
			...rep("Aluminium", 30),
			...rep("Plastic", 60),
			...rep("Rubber", 30),
		],
	},
	"Draco NAK9": {
		noIcon: true,
		price: 20000,
		items: [
			...rep("Aluminium", 300),
			...rep("Steel", 300),
			...rep("Rubber", 300),
		],
	},
	"Ammo:": {
		header: true,
	},
	"Sub Ammo X50": {
		noIcon: true,
		price: 700,
		items: [
			...rep("Aluminium", 20),
			...rep("Plastic", 1),
			...rep("Rubber", 1),
		],
	},
	"Rifle Ammo X50": {
		noIcon: true,
		price: 1500,
		items: [
			...rep("Aluminium", 10),
			...rep("Plastic", 10),
			...rep("Rubber", 10),
		],
	},
	"Lockpicks:": {
		header: true,
	},
	"Adv Lock Pick": {
		noIcon: true,
		price: 3000,
		items: [
			...rep("Aluminium", 50),
			...rep("Plastic", 50),
			...rep("Rubber", 50),
		],
	},
	"Lockpick Set": {
		noIcon: true,
		price: 300,
		items: [
			...rep("Aluminium", 5),
			...rep("Plastic", 3),
			...rep("Rubber", 3),
		],
	},
	"Misc:": {
		header: true,
	},
	"Thermite Charge": {
		noIcon: true,
		price: 8000,
		items: [
			...rep("Aluminium", 75),
			...rep("Copper", 75),
			...rep("Rubber", 50),
			...rep("Plastic", 75),
			...rep("Electronics", 100),
		],
	},
	"Molly": {
		noIcon: true,
		price: 3000,
		items: [
			...rep("Aluminium", 75),
			...rep("Whiskey", 3),
		],
	},
	"Sledge Hammer": {
		noIcon: true,
		price: 4000,
		items: [
			...rep("Steel", 75),
			...rep("Scrap Metal", 75),
		],
	},
	"Knuckle": {
		noIcon: true,
		price: 4000,
		items: [
			...rep("Aluminium", 125),
			...rep("Scrap Metal", 10),
		],
	},
	"Dagger": {
		noIcon: true,
		price: 4000,
		items: [
			...rep("Aluminium", 125),
			...rep("Scrap Metal", 10),
		],
	},
	"Standard Radio": {
		noIcon: true,
		price: 2000,
		items: [
			...rep("Electronics", 50),
		],
	},
	"Hand Cuffs": {
		noIcon: true,
		price: 10000,
		lastItem: true,
		items: [
			...rep("Scrap Metal", 500),
		],
	},
};

const INDIVIDUAL_ITEMS = [
	"Aluminium", "Steel", "Refined Aluminium", "Refined Steel", "Plastic", "Refined Plastic", "Rubber", "Refined Rubber",
	"Copper", "Electronics", "Whiskey", "Scrap Metal", "Refined Scrap"
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
	},
	"deselect_combos": {
		html: '<div class="btn" onclick="deselectCombos()" title="Deselect all combos"><i class="fa fa-times-circle-o" aria-hidden="true"></i> Deselect All</div>',
	}
};

const discounts = {
	"half_off": {
		percent: .50,
		desc: '50% Discount (PD, EMS, BS Employees...)',
	},
	"blackout": {
		percent: .15,
		desc: 'Blackout Sale (15% off)',
	},
};

function getOccurrence(array, value) {
	return array.filter((v) => (v === value)).length;
}

let totalItems = 0;
function formatItems(items) {
	totalItems = 0;
	let newArray = [];
	let imageIcons = '';

	INDIVIDUAL_ITEMS.forEach(item => {
		let occ = getOccurrence(items, item);
		let imageName = item.toLowerCase().replace(' ', '_');
		let imageIcon = '';//`<img src="images/${imageName}.png" title="${occ}x ${item}" width="30" height="30"> `
		if (occ > 0) {
			newArray.push(`- ${occ}x ${imageIcon}${item}`);
			totalItems += occ;
		}
	});

	return newArray;
}

function add(item) {
	let elem = document.getElementById(`${item}-#`);
	if (!elem) return alert(`ERROR: ${item} is not available to add to the cart!`);
	let number = Number(elem.innerText);
	let max = Menu[item].max || Settings.DEFAULT_MAX_CAP;
	if (number + 1 <= max) {
		elem.innerText = number + 1;
		report();
	} else {
		alert(`You cannot add more than ${max}x ${item} in 1 order!`);
	}
}

function remove(item) {
	let elem = document.getElementById(`${item}-#`);
	if (!elem) return alert(`ERROR: ${item} is not available to remove to the cart!`);
	let number = Number(elem.innerText);
	if (number - 1 >= 0) {
		elem.innerText = Number(number) - 1;
		report();
	}
}

function set(item, quantity) {
	let elem = document.getElementById(`${item}-#`);
	if (!elem) return alert(`ERROR: ${item} is not available in the cart!`);
	if (isNaN(Number(quantity))) {
		return alert(`ERROR: ${quantity} is not a number!`);
	}
	quantity = Math.round(Number(quantity));
	let max = Menu[item].max || Settings.DEFAULT_MAX_CAP;
	if (max && quantity > max) {
		alert(`You cannot add more than ${max}x ${item} in 1 order!`);
		return;
	}
	elem.innerText = quantity;
	report();
}

function editQuantity(item) {
	let currentQuantity = 0;
	let elem = document.getElementById(`${item}-#`);
	if (elem) currentQuantity = elem.innerText;
	let quantity = prompt(`Enter quantity for ${item}:`, currentQuantity);
	if (!quantity) return set(item, 0);
	set(item, quantity);
}

function getEmptyOrder() {
	let buffer = [];
	buffer.push("<strong>MATERIALS NEEDED:</strong>");
	buffer.push("");
	buffer.push("");
	buffer.push(`<strong>TOTAL MATERIALS:</strong> <span class="blue">0x</span>`);
	buffer.push("");
	buffer.push("");
	buffer.push("<strong>ITEMS ORDERED:</strong>");
	buffer.push("");
	buffer.push("");
	buffer.push(`<strong>TOTAL MONEY:</strong> <span class="green">$0</span>`);
	document.getElementById('reportBody').innerHTML = buffer.join("\n");
}

function report() {
	let buffer = [];
	let curDarkmode = document.getElementById('darkmode').checked;
	if (curDarkmode) {
		if (darkmodeState === 'false') updateDarkmode();
	} else if (!curDarkmode) {
		if (darkmodeState === 'true') updateDarkmode();
	}
	let total = 0;

	let allItems = [];
	let allItemsOrdered = [];

	Object.keys(Menu).forEach(item => {
		if (Menu[item].header) return;
		let selected = true;
		if (Menu[item].emoji) selected = isSelected(item);

		if (!selected) return;
		let price = Menu[item].price;
		let quantity = 0;
		quantity = document.getElementById(`${item}-#`).innerText;

		let items = Menu[item].items;
		total += price * quantity;
		if (quantity) {
			let count = 0;
			if (quantity >= 1) allItemsOrdered.push(`- ${quantity}x ${item}`);
			while (count < quantity) {
				count++;
				allItems = allItems.concat(items);
			}
		}
	});
	buffer.push("<strong>MATERIALS NEEDED:</strong>");
	let formatted = formatItems(allItems.sort());
	buffer.push(formatted.join('\n'));
	buffer.push("");
	buffer.push(`<strong>TOTAL MATERIALS:</strong> <span class="blue">${totalItems}x</span>`);
	buffer.push("");
	buffer.push("");
	buffer.push("<strong>ITEMS ORDERED:</strong>");
	if (allItemsOrdered.length) buffer.push(allItemsOrdered.join("\n"));
	buffer.push("");
	buffer.push("");
	buffer.push(`<strong>TOTAL MONEY:</strong> <span class="green">$${total}</span>`);

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

let pageReloaded = false;

function updateSelected() {
	Object.keys(Menu).forEach(item => {
		if (!Menu[item].header && Menu[item].emoji) {
			let checked = document.getElementById(`${item}-SELECTED`).checked;
			localStorage.setItem(`${item}-SELECTED`, checked);
		}
	});
	pageReloaded = true;
	loadPage();
	newOrder();
}

function getIcon(item) {
	/*
	if (!Menu[item].fileRenameException) {
		item = item.replace('Meal', '').replace('Combo', '').trim();
	}
	if (!Menu[item]) return;
	*/
	if (Menu[item].noIcon) return '';
	/*
	let icon;
	if (Menu[item].emoji) {
		icon = Menu[item].emoji;
	} else {
		let fileName = `${item.toLowerCase().replace(' ', '_')}.png`;
		icon = `<img src="images/${fileName}" width="20" height="20">`;
	}
	*/
	return icon;
}

function newOrder() {
	Object.keys(Menu).forEach(item => {
		if (Menu[item].header) return;
		let selected = isSelected(item);
		if (Menu[item].emoji && !selected) return;
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
	Object.keys(Menu).forEach(item => {
		if (Menu[item].header) {
			for (let i = count; i < Settings.MAIN_TABLE_WIDTH; i++) {
				table += `<td></td>`;
			}
			table += `</tr><tr><td colspan="${Settings.MAIN_TABLE_WIDTH}"><center><strong><u>${item}</u></strong></center></td></tr><tr>`;
			count = 0;
		} else {
			let icon = getIcon(item);
			if (Menu[item].emoji) {
				if (!isSelected(item)) return;
			} else {
				let fileName = `${item.toLowerCase().replace(' ', '_')}.png`;
			}
			let qty = 0;
			if (pageReloaded && (Menu[item].emoji && isSelected(item))) {
				let element = document.getElementById(`${item}-#`);
				if (element) qty = document.getElementById(`${item}-#`).innerText;
			}

			table += "<td><center><button class=\"btn\" title='Add 1x " + item + "' onClick='add(\"" + item + "\")'><strong>" + icon + item + "</strong></button><br />" +
				`Qty: <strong><span id="${item}-#">${qty}</span></strong> | $${Menu[item].price} | ` +
				"<i class=\"fa fa-pencilfa fa-pencil-square\" aria-hidden=\"true\" title='Manually edit " + item + " quantity' onClick='editQuantity(\"" + item + "\")'></i> " +
				"<i class=\"fa fa-minus-circle\" aria-hidden=\"true\" title='Remove 1x " + item + "' onClick='remove(\"" + item + "\")'></i></td>";
			count++;
			if (count == Settings.MAIN_TABLE_WIDTH) {
				table += `</tr><tr>`
				count = 0;
			}
			if (Menu[item].lastItem) {
				for (let i = count; i < Settings.MAIN_TABLE_WIDTH; i++) {
					table += `<td></td>`;
				}
			}
		}
	});

	table += `</tr></table>`;

	document.getElementById('table').innerHTML = table;

	if (!pageReloaded) getEmptyOrder();

	let inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
	inputs.forEach(i => i.addEventListener('keyup', report, false));

	let checkboxes = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
	checkboxes.forEach(i => i.addEventListener('click', report, false));
}
