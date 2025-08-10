/* jshint esversion: 6 */
const flipSound = new Audio('audio/flip.wav');
const matchSound = new Audio('audio/match.wav');
const resetSound = new Audio('audio/reset.wav');
const winSound = new Audio('audio/win.wav');
const wrongSound = new Audio('audio/wrong.wav');

let soundMuted = false;

let moves = 0;
let timer;
let time = 0;
let hasStarted = false;
let level = 1;

document.addEventListener('DOMContentLoaded', () => {
  const muteBtn = document.getElementById('mute-btn');
  const instructionsBtn = document.getElementById('instructionsBtn');
  const instructionsPopup = document.getElementById('instructionsPopup');
  const playGameBtn = document.getElementById('playGameBtn');
  const resetBtn = document.getElementById('reset-btn');
  const moveCounter = document.getElementById('moveCounter');
  const starRating = document.getElementById('starRating');
  const timerDisplay = document.getElementById('timer');

  // Sound toggle button
  muteBtn.addEventListener('click', () => {
    soundMuted = !soundMuted;
    const allSounds = [flipSound, matchSound, resetSound, winSound, wrongSound];
    allSounds.forEach(sound => sound.muted = soundMuted);
    muteBtn.textContent = soundMuted ? '🔇 Sound Off' : '🔊 Sound On';
  });

  // Instructions popup toggle
  instructionsBtn.addEventListener('click', e => {
    e.stopPropagation();
    instructionsPopup.classList.toggle('hidden');
  });

  playGameBtn.addEventListener('click', () => {
    instructionsPopup.classList.add('hidden');
  });

  window.addEventListener('click', e => {
    if (!instructionsPopup.classList.contains('hidden') &&
        !instructionsPopup.contains(e.target) &&
        !instructionsBtn.contains(e.target)) {
      instructionsPopup.classList.add('hidden');
    }
  });

  // Reset button event listener (replaces inline onclick)
  resetBtn.addEventListener('click', () => {
    resetSound.currentTime = 0;
    resetSound.play();
    setTimeout(() => {
      createBoard(level); // Soft reset, no page reload
    }, 300);
  });

  // Initialize the board after a slight delay to avoid mobile freeze
  setTimeout(() => {
    createBoard(level);
  }, 200);

  // Helper functions used by game
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

  function startTimer() {
    clearInterval(timer);
    time = 0;
    timerDisplay.textContent = time;
    timer = setInterval(() => {
      time++;
      timerDisplay.textContent = time;
    }, 1000);
  }

  const allEmojis = ["☺️", "😇", "😍", "🙃", "😎", "👾", "😸", "🐜", "🎃", "👻", "🐶", "🍕", "🚀", "🦄", "🐸"];

  // Calculate pairs so total cards fit evenly into grid columns
  function getPairsForLevel(level) {
    const columns = getColumnsForCurrentScreen();
    let pairs = 2 + level * 2;
    while ((pairs * 2) % columns !== 0) {
      pairs++;
    }
    return pairs;
  }

  function getEmojisForLevel(level) {
    const pairs = getPairsForLevel(level);
    return allEmojis.slice(0, pairs);
  }

  // Dynamically choose columns based on screen width
  function getColumnsForCurrentScreen() {
    if (window.innerWidth <= 480) {
      return 3;
    } else if (window.innerWidth <= 768) {
      return 4;
    } else {
      return 6;
    }
  }

  // Main board creation function
  function createBoard(levelParam) {
    const gameContainer = document.querySelector('.game');
    gameContainer.innerHTML = '';
    gameContainer.className = `game level-${levelParam}`;

    hasStarted = false;
    time = 0;
    clearInterval(timer);
    timerDisplay.innerText = time;

    moves = 0;
    moveCounter.textContent = moves;
    starRating.textContent = '★★★';

    const emojis = getEmojisForLevel(levelParam);
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

        if (!soundMuted) {
          flipSound.currentTime = 0;
          flipSound.play();
        }

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
              if (!soundMuted) {
                matchSound.currentTime = 0;
                matchSound.play();
              }
            } else {
              if (!soundMuted) {
                wrongSound.currentTime = 0;
                wrongSound.play();
              }
            }

            openBoxes[0].classList.remove('boxOpen');
            openBoxes[1].classList.remove('boxOpen');

            const matched = document.querySelectorAll('.boxMatch').length;
            if (matched === gameEmojis.length) {
              if (!soundMuted) {
                winSound.currentTime = 0;
                winSound.play();
              }
              clearInterval(timer);

              setTimeout(() => {
                if (levelParam < 5) {
                  alert(`✅ Level ${levelParam} complete in ${time}s! Moving to Level ${levelParam + 1}...`);
                  level = levelParam + 1;
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

    // Add filler items to keep grid balanced (optional)
    const cardCount = shuffled.length;
    const columns = getColumnsForCurrentScreen();
    const remainder = cardCount % columns;
    if (remainder !== 0) {
      const fillersNeeded = columns - remainder;
      for (let i = 0; i < fillersNeeded; i++) {
        const filler = document.createElement('div');
        filler.className = 'item hidden';
        gameContainer.appendChild(filler);
      }
    }

    gameContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }
});


