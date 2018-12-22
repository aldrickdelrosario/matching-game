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

let cardList = document.querySelectorAll('.card');
let count = 0;
let cardOne = null;
let cardTwo = null;
let matchCounter = 0;
let moveCounter = 0;
let rating = 3;
let timerReset = false;
let timerStop = false;
let winCounter = 0;

/*
 * Game timer
 */

function timer() {
	let seconds = 0;
	let minutes = 0;
	let hours = 0;
	let clock = setInterval(function() {
		if(timerReset === false) {
			if (timerStop === false) {
				seconds++;
				if(seconds === 60) {
					minutes++;
					seconds = 0;
				}
				if(minutes == 60) {
					hours++;
					seconds = 0;
					minutes = 0;
				}
			} else {
				clearInterval(clock);		// stop clock after win condition is met
			}
		} else {
			seconds = 0;
			minutes = 0;
			hours = 0;
			timerReset = false;
		}
		document.getElementById('timer').innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
	}, 1000);
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
	count = 0;
	cardOne = null;
	cardTwo = null;
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
 * Move counter: track and display number of moves
 */

function incrementMoveCounter() {
	var moveCounterId = document.getElementById('moves');
	moveCounter++;
	moves.innerHTML = moveCounter;
}

/*
 * Game rating:
 *  3 stars: game completed in less than 12 turns
 *  2 stars: game completed in less than 15 turns
 *  1 star:  game completed
 */

function gameRating(count) {
	var stars = document.getElementById('stars');
	if(count < 12 || count > 16) {
		return;
	} else if (count < 15) {
		stars.children[0].classList.add('hide');
		rating = 2;
	} else {
		stars.children[1].classList.add('hide');
		rating = 1;
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

	timerStop = true;
	timer();

	overlay.classList.add('show');
	overlayContent.innerHTML = "<h1>Congratulations!</h1><p>Match game completed in: " + time  + ".</p><p>You receive a " + rating + "-star rating.</p><button id='play-again' class='play-again' onclick='restartGame()'>Play Again</button>";
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
	if(count < 2) {
		count++;
		cardShow(card);
		if(cardOne === null) {
			cardOne = card.dataset.icon;
		} else {
			cardTwo = card.dataset.icon;
		}

		if(cardOne != null && cardTwo != null) {
			if(cardOne === cardTwo) {
				winCounter++;
				cardMatched();
				if(winCounter == 8) {
					win();
				}
			} else {
				gameRating(moveCounter);
				setTimeout(cardNotMatched, 850);
			}
		}
	}
}

/*
 * Start game: adds event listeners to each card and starts timer
 */

function startGame() {
	cardList.forEach(card => {
		card.addEventListener('click', function(e) {
			let clicked = e.target;

			compareCards(clicked);
		});
	});
	timer();
}

startGame();

/*
 * Restart game by setting values to default
 */

function restartGame() {
	count = 0;
	cardOne = null;
	cardTwo = null;
	matchCounter = 0;
	moveCounter = 0;
	rating = 3;
	timerReset = true;
	timerStop = false;
	winCounter = 0;

	timer();

	var moveCounterId = document.getElementById('moves');
	moveCounter = 0;
	moves.innerHTML = moveCounter;

	var cards = document.querySelectorAll('.card');
	cards.forEach(card => {
		card.classList.remove('open', 'selected', 'show');
	});

	var stars = document.getElementById('stars');
	stars.children[0].classList.remove('hide');
	stars.children[1].classList.remove('hide');

	var overlay = document.getElementById('overlay');
	overlay.classList.remove('show');
}
