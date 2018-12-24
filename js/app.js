/*
 * List of cards
 */

const cards = [
	{
		'icon': 'anchor',
		'class': 'fa-anchor',
	},
	{
		'icon': 'bicycle',
		'class': 'fa-bicycle',
	},
	{
		'icon': 'bolt',
		'class': 'fa-bolt',
	},
	{
		'icon': 'bomb',
		'class': 'fa-bomb',
	},
	{
		'icon': 'cube',
		'class': 'fa-cube',
	},
	{
		'icon': 'diamond',
		'class': 'fa-diamond',
	},
	{
		'icon': 'leaf',
		'class': 'fa-leaf',
	},
	{
		'icon': 'plane',
		'class': 'fa-paper-plane-o',
	}
];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Create deck
 */

function createDeck() {
	const deck = document.getElementById('deck');

	for(let i=0; i<2; i++) {
		shuffle(cards);
		cards.forEach(item => {
			const card = document.createElement('li');
			card.classList.add('card', 'fa', `${item.class}`);
			card.dataset.icon = item.icon;							// card value
			deck.appendChild(card);
		});
	}
}

createDeck();

/*
 * Initial variables/values
 */

let values = {
	count: 0,
	cardOne: null,
	cardTwo: null,
	moveCounter: 0,
	rating: 3,
	winCounter: 0,
};

/*
 * Game timer
 */

function timer() {
	let seconds = 0;
	let minutes = 0;
	let hours = 0;
	timer.clock = setInterval(function() {
		seconds++;
		if(seconds === 60) {
			minutes++;
			seconds = 0;
		}
		if(minutes === 60) {
			hours++;
			seconds = 0;
			minutes = 0;
		}
		document.getElementById('timer').innerHTML = hours + "h " + minutes + "m " + seconds + "s";
	}, 1000);
}

/*
 * Resets/stops game timer
 */

function timerReset() {
	clearInterval(timer.clock);
}

/*
 * Display a selected card
 */

function cardShow(cardToShow) {
	cardToShow.classList.add('open', 'selected', 'show');
}

/*
 * Reset values used for comparing cards
 */

function resetCardCompareValues() {
	values.count = 0;
	values.cardOne = null;
	values.cardTwo = null;
}

/*
 * Move counter: track and display number of moves
 */

function incrementMoveCounter() {
	var moveCounterId = document.getElementById('moves');
	values.moveCounter++;
	moveCounterId.innerHTML = values.moveCounter;
}

/*
 * Compare cards, matched: permanently display selected cards
 */

function cardMatched() {
	var selected = document.querySelectorAll('.selected');
	selected.forEach(card => {
		card.classList.add('open', 'show');
		card.classList.remove('selected');
	});
	incrementMoveCounter();
	resetCardCompareValues();
}

/*
 * Compare cards, not matched: reset card selection
 */

function cardNotMatched() {
	var selected = document.querySelectorAll('.selected');
	selected.forEach(card => {
		card.classList.remove('open', 'selected', 'show');
	});
	incrementMoveCounter();
	resetCardCompareValues();
}

/*
 * Game rating:
 *  3 stars: game completed in less than 12 turns
 *  2 stars: game completed in less than 15 turns
 *  1 star:  game completed
 */

function gameRating(count) {
	var stars = document.getElementById('stars');
	if(values.moveCounter < 12 || values.moveCounter > 16) {
		return;
	} else if (values.moveCounter < 15) {
		stars.children[0].classList.add('hide');
		values.rating = 2;
	} else {
		stars.children[1].classList.add('hide');
		values.rating = 1;
	}
}

/*
 * Win modal: displays game duration and player rating
 */

function win() {
	var overlay = document.getElementById('overlay');
	var overlayContent = document.querySelector('.overlay .content');
	var time = document.getElementById("timer").innerText;

	if(time == "") {
		time = "0h 0m 0s";
	}

	timerReset();

	overlay.classList.add('show');
	overlayContent.innerHTML = "<h1>Congratulations!</h1><p>Match game completed in: <span style='white-space: nowrap;'>" + time  + "</span>.</p><p>You receive a " + values.rating + "-star rating.</p><button id='play-again' class='play-again' onclick='restartGame()'>Play Again</button>";
}

/*
 * Compare cards:
 *  1. 	if card count is less than 2:
 *  	1a. check if first card has been picked. if not, save it card #1; otherwise save it as card #2
 *  2.	compare card #1 and card #2
 *  	2a.	if cards match, increment win condition counter and continue; player wins when counter reaches 8
 *  	2b.	if cards don't match, update game rating and continue
 */

function compareCards(card) {
	if(values.count < 2) {
		values.count++;
		cardShow(card);
		if(values.cardOne === null) {
			values.cardOne = card.dataset.icon;
		} else {
			values.cardTwo = card.dataset.icon;
		}

		if(values.cardOne != null && values.cardTwo != null) {
			if(values.cardOne === values.cardTwo) {
				values.winCounter++;
				cardMatched();
				if(values.winCounter == 8) {
					win();
				}
			} else {
				gameRating(values.moveCounter);
				setTimeout(cardNotMatched, 850);
			}
		}
	}
}

/*
 * Start game: adds event listeners to each card and starts timer
 */

function startGame() {
	let cardList = document.querySelectorAll('.card');
	let timerTrigger = 0;

	cardList.forEach(card => {
		card.addEventListener('click', e => {
			let clicked = e.target;
			compareCards(clicked);

			if(timerTrigger < 1) {
				timer();
				timerTrigger++;
			}
		});
	});
}

startGame();

/*
 * Restart game by setting values to default
 */

function restartGame() {
	const deck = document.getElementById('deck');
	deck.innerHTML = '';

	resetCardCompareValues();
	timerReset();

	values.moveCounter = 0;
	values.rating = 3;
	values.winCounter = 0;

	var moveCounterId = document.getElementById('moves');
	values.moveCounter = 0;
	moveCounterId.innerHTML = values.moveCounter;

	var time = document.getElementById("timer");
	time.innerHTML = "0h 0m 0s";

	var cards = document.querySelectorAll('.card');
	cards.forEach(card => {
		card.classList.remove('open', 'selected', 'show');
	});

	var stars = document.getElementById('stars');
	stars.children[0].classList.remove('hide');
	stars.children[1].classList.remove('hide');

	if(document.getElementById('overlay') != null) {
		var overlay = document.getElementById('overlay');
		overlay.classList.remove('show');
	}

	createDeck();
	startGame();
}