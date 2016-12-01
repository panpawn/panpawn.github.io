var won = 0;
var lost = 0;
var tied = 0;

function howRu(answer) { // asks how user is doing
	if (!answer) return false;
	var reply = '';
	if (answer === 'Good') {
		var goodReplies = ['That\'s nice to hear', 'Awesome', 'That\'s good', 'Great', 'That\'s swell', 'Glad to hear it', 'I\'m happy for you'];
		reply = goodReplies[Math.floor(Math.random() * goodReplies.length)] + ' <i class="fa fa-smile-o" aria-hidden="true"></i>';
	} else {
		reply = "<p>D'aww.. I have an idea <i class=\"fa fa-exclamation\" aria-hidden=\"true\"></i> do you think playing some rock-paper-scissors will cheer you up?</p>";
		reply += '<button onclick="question2(\'Yes\')">Yes</button> <button onclick="question2(\'No\')">No</button>';
	}
	return document.getElementById("reply").innerHTML = reply;
}

function question2(answer) { // answer to if they want to play rps
	if (!answer) return false;
	var reply = '';
	if (answer === 'Yes') {
		reply = 'Okay, pick: <button onclick="rps(\'Rock\')"><i class="fa fa-hand-rock-o"></i> Rock</button> <button onclick="rps(\'Paper\')"><i class="fa fa-hand-paper-o"></i> Paper</button> <button onclick="rps(\'Scissors\')"><i class="fa fa-hand-scissors-o"></i> Scissors</button>';
	} else if (answer === 'No') {
		reply = 'Alrighty then /o/';
	}
	return document.getElementById("reply").innerHTML = reply;
}

function rps(response) { // plays game
	if (!response) return false;
	var output = '';
	var tie = false;
	var options = ['Rock', 'Paper', 'Scissors'];
	var cpu = options[Math.floor(Math.random() * options.length)];
	if (response === cpu) {
		output = 'Tie, we both picked ' + response + '. <i class="fa fa-handshake-o" aria-hidden="true"></i>';
		tie = true;
		tied++;
	}
	var winnings = {
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
	if (winnings[response].beats !== cpu && !tie) {
		output += 'You lost! I chose ' + cpu + ', and ' + cpu + winnings[cpu].txt + response + '! <i class="fa fa-smile-o" aria-hidden="true"></i>';
		lost++;
	} else if (winnings[response].beats === cpu && !tie) {
		output += 'You won! I chose ' + cpu + ', but ' + response + winnings[response].txt + cpu + '! <i class="fa fa-frown-o" aria-hidden="true"></i>';
		won++;
	}
	playAgain();
	return document.getElementById("reply").innerHTML = output;
}

function playAgain() { // generates HTML prompting if user wants to play again
	document.getElementById("question").innerHTML = 'Wanna play again?<p style="text-align: right;">W: ' + won + ' | L: ' + lost + ' | T: ' + tied + '</p>';
	document.getElementById("buttons").innerHTML = '<button onclick="question2(\'Yes\')">Yes</button> ';
	document.getElementById("buttons").innerHTML += '<button onclick="question2(\'No\')">No</button>';
}
