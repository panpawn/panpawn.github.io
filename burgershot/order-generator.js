'use strict';

let buffer = [];
let officersInvolved = new Set();
let darkmodeState;

const menu = {
	"Murder Meal": {
		max: 5,
		price: 101,
		noDiscount: true,
		items: ["Murder Meal"],
	},
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
	"Rimjob Combo": {
		price: 30,
		items: ["Rimjob", "Rimjob", "Rimjob", "Rimjob", "Rimjob", "Rimjob"],
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
		items: ["Cream Pie"],
	}
};


const indivItems = [
	"Murder Meal", "Heartstopper", "Money Shot", "Torpedo", "Bleeder", "Water", "Meat Free",
	"Fries", "Soda", "Rimjob", "Cream Pie", "Milkshake", "Toy"
];

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

function report() {
	buffer = [];
	buffer.push('<img src="images/bs-logo.svg" width="50%">');
	buffer.push("");
	let curDarkmode = document.getElementById('darkmode').checked;
	let total = 0;
	let allItems = [];
	let discountSelected = document.getElementById('halfoff').checked;
	let blackoutSale = document.getElementById('blackout').checked;
	if (discountSelected && blackoutSale) {
		alert("You cannot have more than one sale/discount at once!");
		discountSelected = document.getElementById('halfoff').checked = false;
		blackoutSale = document.getElementById('blackout').checked = false;
	}
		
	Object.keys(menu).forEach(item => {
		let discount = (menu[item].noDiscount ? false : true);
		let price;
		if (blackoutSale && menu[item].blackout) {
			price = menu[item].blackout;
		} else {
			price = menu[item].price;
		}
		if (discountSelected && discount) price = Math.round(price / 2);
		let quantity = document.getElementById(`${item}-#`).innerText;
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
	buffer.push(`<strong>SUB TOTAL:</strong> <span class="green">$${total}</span>`);
	if (curDarkmode) {
		if (darkmodeState === 'false') updateDarkmode();
	} else if (!curDarkmode) {
		if (darkmodeState === 'true') updateDarkmode();
	}

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

function loadPage() {
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
	let table = '<table border="1"><tr>';
	let count = 0;
	Object.keys(menu).forEach(item => {
		let max = menu[item].max || 100;
		let icon;
		let comboName = item;
		if (comboName.includes("Combo") || comboName.includes("Meal")) {
			if (comboName !== 'Murder Meal') {
				comboName = comboName.replace(" Combo", "").replace(" Meal", "");
			}
		}
		if (menu[item].emoji) {
			icon = menu[item].emoji;
		} else {
			let fileName = `${comboName.toLowerCase().replace(' ', '_')}.png`;
			icon = `<img src="images/${fileName}" width="20" height="20">`;
		}
		table += "<td><center><button class=\"btn\" onClick='add(\"" + item + "\")'><strong>" + icon + item + "</strong></button><br />" +
		//`${icon}` +
		`Qty: <strong><span id="${item}-#">0</span></strong> | $${menu[item].price} | ` +
		"<i class=\"fa fa-minus-circle\" aria-hidden=\"true\" onClick='remove(\"" + item + "\")'></i></td>";
		//"Qty: <span id=<button class=\"btn\" onClick='add(\"" + item + "\")'>" +
		//`<input type="number" min="0" max="${max}" id="${item}-#" name="${item}-#" placeholder="0"</center></td>`;
		count++;
		if (count == 4) {
			table += `</tr><tr>`
			count = 0;
		}
	});
	table += `</tr></table><br />`;
	table += `<input type="checkbox" id="halfoff" name="halfoff" value="halfoff" />` +
		`<label for="halfoff">50% Discount (PD, EMS, BS Employees...)</label><br />` +
		`<input type="checkbox" id="blackout" name="blackout" value="blackout" />` +
		`<label for="blackout">Blackout Sale (certain items 15% off)</label>`;
	document.getElementById('table').innerHTML = table;
	
	let inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
	inputs.forEach(i => i.addEventListener('keyup', report, false));

	let checkboxes = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
	checkboxes.forEach(i => i.addEventListener('click', report, false));

	let numbers = document.querySelectorAll('input[type="number"]');
	numbers.forEach(i => i.addEventListener('click', report, false));
}
