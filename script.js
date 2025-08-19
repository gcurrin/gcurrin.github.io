// Replace with randomization if desired
const maxGuesses = 6;
let currentRow = 0;

const board = document.getElementById("board");
const input = document.getElementById("guessInput");
const message = document.getElementById("message");
const keyboard = document.getElementById("keyboard");
const wordlist = document.getElementById("wordList");
const link = document.getElementById("dictionary");
const wordSet = document.getElementById("wordSet");
const setInput = document.getElementById("setInput");
let keyStatus = {}; // Store status of each key for coloring
console.log("Version 1.1");
let targetWord = "GILES";
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
    "Enter",
    "BACKSPACE",
    "Reset"
];

const setKey = document.createElement("button");
setKey.className = "key"
setKey.textContent = "Set Word";
setKey.onclick = () => handleKey("Set Word");
wordSet.appendChild(setKey);

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
document.addEventListener('keydown', function(event){
    handleKey(event.key)
})
function handleKey(key) {
  if (input.disabled) return;
  if (key === "Backspace") {
    input.value = input.value.slice(0, -1);
  } else if (key === "Enter") {
    submitGuess();
  } else if (key === "Reset"){
    location.reload()
  }else if(key === "Set Word"){
    console.log("assigning word")
    const guess = setInput.value.toUpperCase();
    if (guess.length !== 5) {
        message.textContent = "Word must be 5 letters.";
        return;
    }

    if(!wordList.includes(input.value.toLowerCase())){
        message.textContent = "Word must be a valid word.";
        return;
    }
    message.textContent = "";
    targetWord = guess;
    wordSet.style.display = "none"
    input.value = ""
  }else if (input.value.length < 5 && key.length ==1) {
    input.value += key;
  }
  const guess = input.value.toUpperCase();
  for (let i = 0; i < 5; i++) {
    const tile = board.children[currentRow * 5 + i];
    const letter = guess[i];
    tile.textContent = letter;

    // let status = "absent";
    // if (letter === targetWord[i]) {
    //   status = "correct";
    // } else if (targetWord.includes(letter)) {
    //   status = "present";
    // }

    //tile.classList.add(status);
    //updateKeyColor(letter, status);
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
    reset();
}

function reset(){
    keyStatus = {};//THis is wrong need to loop through and reset.
}


function submitGuess() {

  const guess = input.value.toUpperCase();
  if (guess.length !== 5) {
    message.textContent = "Guess must be 5 letters.";
    return;
  }

  if(!wordList.includes(input.value.toLowerCase())){
    message.textContent = "Guess must be a valid word.";
    return;
  }
  
  wordSet.style.display = "none"


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
    link.textContent = "Definition";
    link.href = "https://www.latindictionary.io/dictionary?q="+targetWord.toUpperCase();
    //input.disabled = true;
    return;
  }

  currentRow++;
  input.value = "";

  if (currentRow === maxGuesses) {
    message.textContent = `❌ Out of guesses! The word was ${targetWord}`;
    link.textContent = "Definition";
    link.href = "https://www.latindictionary.io/dictionary?q="+targetWord.toUpperCase();
    //input.disabled = true;
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