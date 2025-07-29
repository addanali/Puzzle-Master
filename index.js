const puzzleBox = document.getElementById('puzzle');
let allTiles = [];
let count = 0;

for (let i = 1; i <= 9; i++) {
  allTiles.push(i);
}

function mixTiles(array) {
  for (let i = 0; i < 10; i++) {
    array.sort(() => Math.random() - 0.5);
  }
}

function showTiles() {
  puzzleBox.innerHTML = '';
  for (let i = 0; i < allTiles.length; i++) {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.dataset.position = i;
    tile.draggable = true;
    tile.textContent = allTiles[i];
    puzzleBox.appendChild(tile);
  }
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach(tile => {
    tile.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text', tile.dataset.position);
    });
    tile.addEventListener('dragover', (e) => e.preventDefault());
    tile.addEventListener('drop', (e) => {
      e.preventDefault();
      const fromIndex = parseInt(e.dataTransfer.getData('text'));
      const toIndex = parseInt(tile.dataset.position);
      if (isValidMove(fromIndex, toIndex)) {
        [allTiles[fromIndex], allTiles[toIndex]] = [allTiles[toIndex], allTiles[fromIndex]];
        showTiles();
        movecounter();
        if (isPuzzleSolved()) {
          document.getElementById('winMessage').style.display = 'block';
          document.getElementById('winMessage').textContent = "🎉 You won in " + count + " moves!";
          highscore();
        }
      }
    });
  });
}

function movecounter() {
  count++;
  document.getElementById('moveCounter').textContent = "Moves: " + count;
}

let bestScore = localStorage.getItem('highScore');
if (bestScore !== null) {
  bestScore = parseInt(bestScore);
  document.getElementById('highestscore').textContent = "High Score: " + bestScore;
} else {
  bestScore = null;
}

function highscore() {
  if (bestScore === null || count < bestScore) {
    bestScore = count;
    localStorage.setItem('highScore', bestScore);
    document.getElementById('highestscore').textContent = "High Score: " + bestScore;
  }
}

function isValidMove(from, to) {
  const validMoves = {
    0: [1, 3], 1: [0, 2, 4], 2: [1, 5],
    3: [0, 4, 6], 4: [1, 3, 5, 7], 5: [2, 4, 8],
    6: [3, 7], 7: [4, 6, 8], 8: [5, 7]
  };
  return validMoves[from].includes(to);
}

function isPuzzleSolved() {
  for (let i = 0; i < 9; i++) {
    if (allTiles[i] !== i + 1) return false;
  }
  return true;
}


document.getElementById('startBtn').addEventListener('click', () => {
  count = 0;
  document.getElementById('moveCounter').textContent = "Moves: 0";
  document.getElementById('winMessage').style.display = 'none';
  mixTiles(allTiles);
  showTiles();
});

document.getElementById('resetBtn').addEventListener('click', () => {
  localStorage.removeItem('highScore');
  location.reload();
});