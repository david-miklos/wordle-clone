const squares = document.querySelectorAll('.board-square');
const loadingScreen = document.querySelector('.loading-screen');
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

async function init() {
  const word = await getWordOfTheDay();
  let currentGuess = '';
  let round = 0;
  let done = false;

  document.addEventListener('keydown', function handleKeyPress(event) {
    if (done) {
      return;
    }

    const action = event.key;

    if (action === 'Enter') {
      commitAnswer();
    }

    if (action === 'Backspace') {
      backspace();
    }

    if (isLetter(action)) {
      displayLetter(action);
    }
  });

  function displayLetter(letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      // display letter on correct sqaure
      squares[round * ANSWER_LENGTH + currentGuess.length].innerText = letter;
      currentGuess += letter.toLowerCase();
    }
  }

  function backspace() {
    currentGuess = currentGuess.slice(0, -1);
    // remove letter from correct sqaure
    squares[round * ANSWER_LENGTH + currentGuess.length].innerText = '';
  }

  async function commitAnswer() {
    if (currentGuess.length === ANSWER_LENGTH) {
      if (!(await isValid(currentGuess))) {
        flash();
        return;
      }

      wordMap = makeMap(word);
      markWord();

      if (currentGuess === word) {
        done = true;
        alert('You win! Congrats!');
        return;
      }

      round++;
      currentGuess = '';
      wordMap = makeMap(word);

      if (round === ROUNDS) {
        done = true;
        alert(`You lost! The word of the day was ${word.toUpperCase()}.`);
      }
    }
  }

  async function isValid(guess) {
    // The API will return back to you the word you sent and validWord which will be true or false. e.g.
    // { "word": "crane", "validWord": true } or { "word": "asdfg", "validWord": false }.
    setLoading(true);
    const res = await fetch('https://words.dev-apis.com/validate-word', {
      method: 'POST',
      body: JSON.stringify({ word: guess }),
    });
    const { validWord } = await res.json();
    setLoading(false);
    return validWord;
  }

  async function getWordOfTheDay() {
    // The response will look like this: {"word":"humph","puzzleNumber":3}
    // where the word is the current word of the day and the puzzleNumber is which puzzle of the day it is
    setLoading(true);
    const res = await fetch('https://words.dev-apis.com/word-of-the-day');
    const { word } = await res.json();
    setLoading(false);
    return word;
  }

  function flash() {
    // We are removing it and adding it back again to flash more than 1 time
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      squares[round * ANSWER_LENGTH + i].classList.remove('error');
    }
    setTimeout(function addClass() {
      for (let i = 0; i < ANSWER_LENGTH; i++) {
        squares[round * ANSWER_LENGTH + i].classList.add('error');
      }
    }, 10);
  }

  function markWord() {
    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (currentGuess.charAt(i) === word.charAt(i)) {
        wordMap[currentGuess.charAt(i)]--;
        markCorrect(i);
      } else if (
        word.includes(currentGuess.charAt(i)) &&
        wordMap[currentGuess.charAt(i)] > 0
      ) {
        wordMap[currentGuess.charAt(i)]--;
        markClose(i);
      } else {
        markWrong(i);
      }
    }
  }

  function markCorrect(position) {
    squares[round * ANSWER_LENGTH + position].classList.add('correct');
  }

  function markClose(position) {
    squares[round * ANSWER_LENGTH + position].classList.add('close');
  }

  function markWrong(position) {
    squares[round * ANSWER_LENGTH + position].classList.add('wrong');
  }

  function setLoading(value) {
    let isLoading = value;
    loadingScreen.classList.toggle('show', isLoading);
  }
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

// takes a word (like 'boost') and creates an object out of it
// (like {b: 1, o: 2, s: 1, t: 1}) so we can use that to
// make sure we get the correct amount of letters marked close
function makeMap(word) {
  obj = {};
  for (let i = 0; i < word.length; i++) {
    if (word.charAt(i) in obj) {
      obj[word.charAt(i)]++;
      continue;
    }
    obj[word.charAt(i)] = 1;
  }
  return obj;
}

init();
