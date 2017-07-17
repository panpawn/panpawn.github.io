/**
 * Simple RPS game
 * by panpawn
 */

class RockPaperScissors {
	constructor() {
		this.score = {
			'win': 0,
			'loss': 0,
			'tie': 0,
		};
		this.winnings = {
			'Rock': {
				beats: 'Scissors',
				txt: ' crushes ',
			}, 'Paper': {
				beats: 'Rock',
				txt: ' covers ',
			}, 'Scissors': {
				beats: 'Paper',
				txt: ' cuts ',
			},
		};
		this.tie = false;
		this.options = ['Rock', 'Paper', 'Scissors'];
		this.goodReplies = ["That's nice to hear", "Awesome", "That's good", "Great", "That's swell", "Glad to hear it", "I'm happy for you"];
	}
	randomGoodReply() {
		return this.goodReplies[Math.floor(Math.random() * this.goodReplies.length)];
	}
	howRu(answer) {
		if (!answer) return;
		let reply = '';
		if (answer === 'Good') {
			reply += this.randomGoodReply();
		} else {
			reply += `<p>D'aww.. I have an idea <i class="fa fa-exclamation" aria-hidden="true"></i> do you think playing some rock-paper-scissors will cheer you up?</p>`;
			reply += `<button onclick="RPS.question2('Yes')">Yes</button> <button onclick="RPS.question2('No')">No</button>`;
		}
		return document.getElementById('reply').innerHTML = reply;//this.elements['reply'].innerHTML = reply;
	}
	question2(answer) {
		let reply = '';
		if (answer === 'Yes') {
			reply += `Okay, pick: ${this.getRPSButtons()}`;
		} else if (answer === 'No') {
			reply += 'Alrighty then /o/';
		}
		return document.getElementById('reply').innerHTML = reply;
	}
	getRPSButtons() {
		let buff = `<button onclick="RPS.playGame('Rock');" title="Pick Rock"><i class="fa fa-hand-rock-o"></i> Rock</button> ` +
			`<button onclick="RPS.playGame('Paper');" title="Pick Paper"><i class="fa fa-hand-paper-o"></i> Paper</button> ` +
			`<button onclick="RPS.playGame('Scissors');" title="Pick Scissors"><i class="fa fa-hand-scissors-o" title="Pick Scissors"></i> Scissors</button>`;
		return buff;
	}
	playGame(response) {
		if (!response) return;
		let output = '';
		let CPU = this.getCpuMove();
		if (response === CPU) {
			output = `Tie; we both picked ${response}. <i class="fa fa-handshake-o" aria-hidden="true"></i>`;
			this.tie = true;
			this.score['tie']++;
			this.playAgain();
			document.getElementById('reply').innerHTML = output;
			return;
		}
		if (this.winnings[response].beats !== CPU) {
			output = `You lost! I chose ${CPU}, and ${CPU}${this.winnings[CPU].txt}${response}! <i class="fa fa-smile-o" aria-hidden="true"></i>`;
			this.score['loss']++;
			console.log('loss');
		} else if (this.winnings[response].beats === CPU) {
			output = `You won! I chose ${CPU}, but ${response}${this.winnings[response].txt}${CPU}! <i class="fa fa-frown-o" aria-hidden="true"></i>`;
			this.score['win']++;
			console.log('win');
		}
		this.playAgain();
		return document.getElementById('reply').innerHTML = output;
	}
	playAgain() {
		document.getElementById('question').innerHTML = `Wanna play again?<p class="score">W: ${this.score['win']} | L: ${this.score['loss']} | T: ${this.score['tie']}</p>`;
		document.getElementById('buttons').innerHTML = `<button onclick="RPS.question2('Yes');">Yes</button> <button onclick="RPS.question2('No');">No</button>`;
	}
	getCpuMove() {
		return this.options[Math.floor(Math.random() * this.options.length)];
	}
}
const RPS = new RockPaperScissors();
