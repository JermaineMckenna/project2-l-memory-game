const flipSound = new Audio('audio/flip.wav');
const matchSound = new Audio('audio/match.wav');
const resetSound = new Audio('audio/reset.wav');
const winSound = new Audio('audio/win.wav');
const wrongSound = new Audio('audio/wrong.wav');

let soundMuted = false;

document.addEventListener('DOMContentLoaded', () => {
  // Mute button toggle
  document.getElementById('mute-btn').addEventListener('click', () => {
    soundMuted = !soundMuted;
    const allSounds = [flipSound, matchSound, resetSound, winSound, wrongSound];
    allSounds.forEach(sound => sound.muted = soundMuted);
    document.getElementById('mute-btn').textContent = soundMuted ? '🔇 Sound Off' : '🔊 Sound On';
  });

  // Instructions popup toggle
  const instructionsBtn = document.getElementById("instructionsBtn");
  const instructionsPopup = document.getElementById("instructionsPopup");
  const playGameBtn = document.getElementById("playGameBtn");

  instructionsBtn.addEventListener("click", e => {
    e.stopPropagation();
    instructionsPopup.classList.toggle("hidden");
  });

  playGameBtn.addEventListener("click", () => {
    instructionsPopup.classList.add("hidden");
  });

  // Hide popup if clicking outside
  window.addEventListener("click", e => {
    if (
      !instructionsPopup.classList.contains("hidden") &&
      !instructionsPopup.contains(e.target) &&
      !instructionsBtn.contains(e.target)
    ) {
      instructionsPopup.classList.add("hidden");
    }
  });

  // Initialize game
  createBoard(level);
});

// Reset & reload game with sound
function playResetSoundAndReload() {
  resetSound.currentTime = 0;
  resetSound.play();
  setTimeout(() => {
    window.location.reload();
  }, 300);
}

let moves = 0;
const moveCounter = document.getElementById('moveCounter');
const starRating = document.getElementById('starRating');

function updateMoves() {
  moves++;
  moveCounter.textContent = moves;
  updateStars();
}

function updateStars() {
  if (moves <= 12) {
    starRating.textContent = '★★★';
  } else if (moves <= 18) {
    starRating.textContent = '★★☆';
  } else {
    starRating.textContent = '★☆☆';
  }
}

let timer;
let time = 0;
let hasStarted = false;

function startTimer() {
  clearInterval(timer);
  time = 0;
  document.getElementById('timer').textContent = time;
  timer = setInterval(() => {
    time++;
    document.getElementById('timer').textContent = time;
  }, 1000);
}

const allEmojis = ["☺️", "😇", "😍", "🙃", "😎", "👾", "😸", "🐜", "🎃", "👻", "🐶", "🍕", "🚀", "🦄", "🐸"];
let level = 1;

function getEmojisForLevel(level) {
  const pairs = 2 + level * 2;
  return allEmojis.slice(0, pairs);
}

function createBoard(level) {
  const gameContainer = document.querySelector('.game');
  gameContainer.innerHTML = '';
  gameContainer.className = `game level-${level}`;

  hasStarted = false;
  time = 0;
  clearInterval(timer);
  document.getElementById('timer').innerText = time;

  // RESET moves and star rating
  moves = 0;
  moveCounter.textContent = moves;
  starRating.textContent = '★★★';

  const emojis = getEmojisForLevel(level);
  const gameEmojis = [...emojis, ...emojis];
  const shuffled = gameEmojis.sort(() => Math.random() - 0.5);

  for (let i = 0; i < shuffled.length; i++) {
    const box = document.createElement('div');
    box.className = 'item';
    box.innerHTML = `
      <div class="card">
        <div class="front"></div>
        <div class="back">${shuffled[i]}</div>
      </div>
    `;

    box.onclick = function () {
      if (this.classList.contains('boxOpen') || this.classList.contains('boxMatch')) return;

      if (!hasStarted) {
        startTimer();
        hasStarted = true;
      }

      flipSound.currentTime = 0;
      flipSound.play();
      this.classList.add('boxOpen');

      const openBoxes = document.querySelectorAll('.boxOpen');
      if (openBoxes.length === 2) {
        updateMoves();

        setTimeout(() => {
          const emoji1 = openBoxes[0].querySelector('.back').textContent;
          const emoji2 = openBoxes[1].querySelector('.back').textContent;

          if (emoji1 === emoji2) {
            openBoxes[0].classList.add('boxMatch');
            openBoxes[1].classList.add('boxMatch');
            matchSound.currentTime = 0;
            matchSound.play();
          } else {
            wrongSound.currentTime = 0;
            wrongSound.play();
          }

          openBoxes[0].classList.remove('boxOpen');
          openBoxes[1].classList.remove('boxOpen');

          const matched = document.querySelectorAll('.boxMatch').length;
          if (matched === gameEmojis.length) {
            winSound.currentTime = 0;
            winSound.play();
            clearInterval(timer);

            setTimeout(() => {
              if (level < 5) {
                alert(`✅ Level ${level} complete in ${time}s! Moving to Level ${level + 1}...`);
                level++;
                createBoard(level);
              } else {
                alert(`🎉 Congratulations! All levels complete! Final Time: ${time}s`);
              }
            }, 600);
          }
        }, 500);
      }
    };

    gameContainer.appendChild(box);
  }
}
