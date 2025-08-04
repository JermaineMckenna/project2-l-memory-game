const flipSound = new Audio('audio/flip.wav');
const matchSound = new Audio('audio/match.wav');
const resetSound = new Audio('audio/reset.wav');
const winSound = new Audio('audio/win.wav');
const wrongSound = new Audio('audio/wrong.wav');

let soundMuted = false;
document.getElementById('mute-btn').addEventListener('click', () => {
  soundMuted = !soundMuted;
  const allSounds = [flipSound, matchSound, resetSound, winSound, wrongSound];
  allSounds.forEach(sound => sound.muted = soundMuted);
  document.getElementById('mute-btn').textContent = soundMuted ? '🔇 Sound Off' : '🔊 Sound On';
});

function playResetSoundAndReload() {
  resetSound.currentTime = 0;
  resetSound.play();
  setTimeout(() => {
    window.location.reload();
  }, 300);
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
  document.getElementById('timer').innerText = time;
  clearInterval(timer);

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

    document.addEventListener("DOMContentLoaded", function () {
  const instructionsBtn = document.getElementById("instructionsBtn");
  const instructionsPopup = document.getElementById("instructionsPopup");
  const closePopup = document.getElementById("closePopup");
  const playGameBtn = document.getElementById("playGameBtn");

  // Show popup when "Instructions" is clicked
  instructionsBtn.addEventListener("click", function () {
    instructionsPopup.classList.remove("hidden");
  });

  // Close popup when "X" is clicked
  closePopup.addEventListener("click", function () {
    instructionsPopup.classList.add("hidden");
  });

  // Close popup when "Play Game" is clicked
  playGameBtn.addEventListener("click", function () {
    instructionsPopup.classList.add("hidden");
    // Optional: start game logic here
  });

  // Optional: Close popup by clicking outside the box
  window.addEventListener("click", function (e) {
    if (e.target === instructionsPopup) {
      instructionsPopup.classList.add("hidden");
    }
  });
});


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
                alert(`🎉 All levels complete! Final Time: ${time}s`);
              }
            }, 600);
          }
        }, 500);
      }
    };

    gameContainer.appendChild(box);
  }
}

createBoard(level);
