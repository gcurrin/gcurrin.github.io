const targetWord = "PLANT"; // You can randomize this later
const maxGuesses = 6;
let currentRow = 0;

const board = document.getElementById("board");

// Create empty tiles
for (let i = 0; i < maxGuesses * 5; i++) {
  const tile = document.createElement("div");
  tile.className = "tile";
  board.appendChild(tile);
}

function submitGuess() {
  const input = document.getElementById("guessInput");
  const guess = input.value.toUpperCase();
  const message = document.getElementById("message");

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
    tile.textContent = guess[i];

    if (guess[i] === targetWord[i]) {
      tile.classList.add("correct");
    } else if (targetWord.includes(guess[i])) {
      tile.classList.add("present");
    } else {
      tile.classList.add("absent");
    }
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