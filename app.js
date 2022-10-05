const squares = document.querySelectorAll(".board-square");
const ANSWER_LENGTH = 5;
let currentGuess = "";
let round = 0;

function init() {
  document.addEventListener("keydown", function handleKeyPress(event) {
    const action = event.key;

    if (action === "Enter") {
      commitAnswer();
    }

    if (action === "Backspace") {
      backspace();
    }

    if (isLetter(action)) {
      displayLetter(action);
    }
  });
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function displayLetter(letter) {
  if (currentGuess.length < ANSWER_LENGTH) {
    // display letter on correct sqaure
    squares[round * ANSWER_LENGTH + currentGuess.length].innerText = letter;
    currentGuess += letter;
  }
}

function backspace() {
  currentGuess = currentGuess.slice(0, -1);
  // remove letter from correct sqaure
  squares[round * ANSWER_LENGTH + currentGuess.length].innerText = "";
}

function commitAnswer() {
  if (currentGuess.length === ANSWER_LENGTH) {
    // TODO validate word

    currentGuess = "";
    round++;
  }
}

init();
