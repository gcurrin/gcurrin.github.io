// Replace with randomization if desired
const maxGuesses = 6;
let currentRow = 0;

const board = document.getElementById("board");
const input = document.getElementById("guessInput");
const message = document.getElementById("message");
const keyboard = document.getElementById("keyboard");
const wordlist = document.getElementById("wordList");
console.log(wordlist);
const keyStatus = {}; // Store status of each key for coloring
console.log("Version 0.6");
let targetWord = "PLANT";
const wordList = initialize();
generateWord();

// Create board
for (let i = 0; i < maxGuesses * 5; i++) {
  const tile = document.createElement("div");
  tile.className = "tile";
  board.appendChild(tile);
}

// Create keyboard layout
const keyboardLayout = [
  "QWERTYUIOP",
  "ASDFGHJKL",
  "ZXCVBNM",
];

const functionKeys = [
    "ENTER",
    "BACK",
    "New Word"
];

keyboardLayout.forEach(row => {
  for (const char of row) {
    const key = document.createElement("button");
    key.className = "key";
    key.textContent = char;
    key.dataset.key = char;
    key.onclick = () => handleKey(char);
    keyboard.appendChild(key);
  }
});

functionKeys.forEach(word =>wordToButton(word));

function wordToButton(word){
    const key = document.createElement("button");
    key.className = "key";
    key.textContent = word === "BACK" ? "←" : word;
    key.dataset.key = word;
    key.onclick = () => handleKey(word);
    bigbuttons.appendChild(key);
}
function handleKey(key) {
  if (input.disabled) return;

  if (key === "BACK") {
    input.value = input.value.slice(0, -1);
  } else if (key === "ENTER") {
    submitGuess();
  } else if (key === "New Word"){
    generateWord()
  }else if (input.value.length < 5) {
    input.value += key;
  }
}

function initialize(){
    const chosen = wordlist.textContent;
    return chosen
    .split(/\r?\n/)
    .map(w => w.trim())
    .filter(w => w.length === 5);
}
function generateWord(){
    targetWord = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
    console.log(targetWord);
}


function submitGuess() {

  const guess = input.value.toUpperCase();
  if (guess.length !== 5) {
    message.textContent = "Guess must be 5 letters.";
    return;
  }

  if (currentRow >= maxGuesses) {
    message.textContent = "No more guesses!";
    return;
  }

  for (let i = 0; i < 5; i++) {
    const tile = board.children[currentRow * 5 + i];
    const letter = guess[i];
    tile.textContent = letter;

    let status = "absent";
    if (letter === targetWord[i]) {
      status = "correct";
    } else if (targetWord.includes(letter)) {
      status = "present";
    }

    tile.classList.add(status);
    updateKeyColor(letter, status);
  }

  if (guess === targetWord) {
    message.textContent = "🎉 Correct! You guessed the word!";
    input.disabled = true;
    return;
  }

  currentRow++;
  input.value = "";

  if (currentRow === maxGuesses) {
    message.textContent = `❌ Out of guesses! The word was ${targetWord}`;
    input.disabled = true;
  }
}

function updateKeyColor(letter, status) {
  // Avoid overwriting better statuses (correct > present > absent)
  const priority = { correct: 3, present: 2, absent: 1 };
  const existing = keyStatus[letter];

  if (!existing || priority[status] > priority[existing]) {
    keyStatus[letter] = status;
    const keys = document.querySelectorAll(`.key[data-key="${letter}"]`);
    keys.forEach(k => {
      k.classList.remove("correct", "present", "absent");
      k.classList.add(status);
    });
  }
}