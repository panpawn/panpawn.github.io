'use strict';

const decrypt = {
	'a': '%&!3',
	'b': '$@!8',
	'c': '*(@1',
	'd': '^@)4',
	'e': '?,#2',
	'f': '&+=8',
	'g': '^#*3',
	'h': '#!;4',
	'i': '!~]2',
	'j': ']$#7',
	'k': '>)&3',
	'l': '<:#9',
	'm': '#{|6',
	'n': '-[?9',
	'o': '&^@7',
	'p': '*-&3',
	'q': '!-*5',
	'r': '+_&2',
	's': '~*&2',
	't': '&%@8',
	'u': '&^%2',
	'v': '*^&9',
	'w': '%@#7',
	'x': '!@(5',
	'y': '#(>3',
	'z': '@>{4',
	' ': 'XD',
	',': 'LOL',
	'?': 'HUH',
	'!': 'HA',
	'.': 'TEEHEE'
};

const characters = Object.keys(decrypt);

function trans() {
	let message = document.getElementById('message').value || '';
	if (!message) return;
	let trans = '';
	
	message = message.split('');
	message.forEach(character => {
		character = character.toLowerCase();
		if (characters.includes(character)) {
			trans += decrypt[character];
		}
	});
	document.getElementById('translation').innerHTML = `>> ${trans}`;
}

let inputs = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
inputs.forEach(i => i.addEventListener('keyup', trans, false));
