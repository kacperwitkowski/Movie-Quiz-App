const question = document.querySelector(".question--text");
const app = document.querySelector(".app");
const answerButtons = Array.from(document.querySelectorAll(".answers--single"));
const loseSound = document.querySelector(".lose-sound");
const winSound = document.querySelector(".win-sound");
const finalAnswer = document.querySelector(".final-answer");
const menubar = document.querySelector(".menubar");
const navigation = document.querySelector(".navigation");
const winsSpan = document.querySelector(".wins--span");
const loseSpan = document.querySelector(".loses--span");

const prizeTable = [
  100, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000,
  1000000,
];

function resetDarkKnight(state) {
  document.querySelector(".askDarkKnight").disabled = state;
  localStorage.setItem("clickedDarkKnight", state);
}

function resetWalter(state) {
  document.querySelector(".askWalter").disabled = state;
  localStorage.setItem("clickedState", state);
}

function resetFiftyFifty(state) {
  document.querySelector(".fiftyFifty").disabled = state;
  localStorage.setItem("clickedFiftyFifty", state);
}

function resetAskAudience(state) {
  document.querySelector(".askAudience").disabled = state;
  localStorage.setItem("clickedAskAudience", state);
}

function colorCalculate(state) {
  localStorage.setItem("currNumber", state);
}

prizeTable.forEach((el) => {
  let p = document.createElement("p");
  p.className = "prize-table--p";

  p.textContent = "$" + el;

  let p2 = document.createElement("p");
  p2.className = "prize-table--p2";

  p2.textContent = "$" + el;

  navigation.appendChild(p2);
  document.querySelector(".prize-table").appendChild(p);
});

const loseScreen = document.querySelector(".lose");

const winScreen = document.querySelector(".win");

function fillQuestionElements(data) {
  question.innerText = data.question;

  for (const i in data.answers) {
    const answerEl = document.querySelector(`.answers--${Number(i) + 1}`);
    answerEl.innerText = data.answers[i];
  }
}

function showNextQuestion() {
  fetch("/question")
    .then((r) => r.json())
    .then((data) => {
      fillQuestionElements(data);
    });
  answerButtons.forEach((btn) => (btn.style.backgroundColor = ""));
}

showNextQuestion();

const p = Array.from(document.querySelectorAll(".prize-table--p"));
const p2 = Array.from(document.querySelectorAll(".prize-table--p2"));

function handleAnswer(data) {
  answerButtons.forEach((btn) => (btn.disabled = "true"));
  const currCount = data.counter;

  if (!data.correct) {
    setTimeout(() => {
      answerButtons[data.goodAnswer].style.backgroundColor = "green";

      finalAnswer.pause();
      finalAnswer.currentTime = 0;
      wrongAnswerAudio.play();
      wrongAnswerAudio.volume = 0.3;
    }, 2499);
  } else {
    setTimeout(() => {
      answerButtons[data.goodAnswer].style.backgroundColor = "green";
      finalAnswer.pause();
      finalAnswer.currentTime = 0;
      correctAnswerAudio.play();
      correctAnswerAudio.volume = 0.3;
    }, 2500);
    setTimeout(() => {
      let crCount = currCount - 1;
      p[crCount].style.backgroundColor = "#00C1BC";
      p2[crCount].style.backgroundColor = "#00C1BC";
      colorCalculate(currCount);
    }, 3499);
  }

  setTimeout(() => {
    if (data.isGameOver) {
      app.style.display = "none";
      loseScreen.style.display = "block";
      wrongAnswerAudio.pause();
      wrongAnswerAudio.currentTime = 0;
      loseSound.play();
      loseSound.volume = 0.7;
      data.isGameOver = false;
      colorCalculate(0);
      p.forEach((el) => (el.style.backgroundColor = "transparent"));
      p2.forEach((el) => (el.style.backgroundColor = "transparent"));

      let decreaseWins = Number(localStorage.getItem("numOfLoses")) + 1;
      localStorage.setItem("numOfLoses", decreaseWins);

      document.querySelector(".lose--btn").addEventListener("click", () => {
        location.reload();
        app.style.display = "grid";
        loseScreen.style.display = "none";
        loseSound.pause();
        loseSound.currentTime = 0;
        resetWalter(false);
        resetDarkKnight(false);
        resetFiftyFifty(false);
        resetAskAudience(false);
        let numofloses = localStorage.getItem("numOfLoses");
        loseSpan.innerText = numofloses;
      });
    }
  }, 4300);
  setTimeout(() => {
    if (data.isWin) {
      app.style.display = "none";
      winScreen.style.display = "block";
      winSound.play();
      winSound.volume = 0.3;
      colorCalculate(0);
      p.forEach((el) => (el.style.backgroundColor = "transparent"));
      p2.forEach((el) => (el.style.backgroundColor = "transparent"));
      data.isWin = false;

      let incraseWins = Number(localStorage.getItem("numOfWins")) + 1;
      localStorage.setItem("numOfWins", incraseWins);

      document.querySelector(".win--btn").addEventListener("click", () => {
        location.reload();
        app.style.display = "grid";
        winScreen.style.display = "none";
        winSound.pause();
        winSound.currentTime = 0;
        resetWalter(false);
        resetDarkKnight(false);
        resetFiftyFifty(false);
        resetAskAudience(false);
        let numofwins = localStorage.getItem("numOfWins");
        winsSpan.innerText = numofwins;
      });
    }
  }, 4300);

  setTimeout(() => {
    answerButtons.forEach((btn) => {
      btn.removeAttribute("disabled");
      btn.classList.remove("crossed");
    });
    showNextQuestion();
  }, 4400);
}

answerButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    correctAnswerAudio.pause();
    correctAnswerAudio.currentTime = 0;
    wrongAnswerAudio.pause();
    wrongAnswerAudio.currentTime = 0;
    finalAnswer.play();
    finalAnswer.volume = 0.6;
    const answerIndex = Number(e.target.dataset.answer);
    sendAnswer(answerIndex);
    let clickedBtn = e.target.closest("button");
    clickedBtn.style.backgroundColor = "orange";
    setTimeout(() => {
      clickedBtn.style.backgroundColor = "red";
    }, 2500);
  });
});

function sendAnswer(answerIndex) {
  fetch(`/answer/${answerIndex}`, {
    method: "POST",
  })
    .then((res) => res.json())
    .then((data) => {
      handleAnswer(data);
    });
}

const walterModal = document.querySelector(".walter--modal");

function handleWalterAnswer(data) {
  setTimeout(() => {
    walterModal.style.display = "block";

    let html = `
    <div class="walter-img">
    <img class="walter--image" src="./img/walterWhite.png" alt="">
    </div>
     <div class="thought">
 <div class="thought--position thought--walter">
   ${data.text}
 </div>
</div>`;
    app.style.display = "none";
    document
      .querySelector(".walter--modal__content")
      .insertAdjacentHTML("afterbegin", html);
  }, 2750);
  walterAnimation();
  resetWalter(true);
}

function callToWalter() {
  fetch("/help/walter", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      handleWalterAnswer(data);
    });
}

document.querySelector(".askWalter").addEventListener("click", callToWalter);

function handleBatmanAnswer(data) {
  setTimeout(() => {
    batmanModal.style.display = "block";

    let html = `
   <div class="batman-img">
    <img class="batman-image" src="./img/batman.png" alt="">
    </div>
     <div class="thought">
 <div class="thought--position">
   ${data.text}
 </div>
</div>`;
    app.style.display = "none";
    document
      .querySelector(".batman--content")
      .insertAdjacentHTML("afterbegin", html);
  }, 1400);
  batmanAnimation();
  resetDarkKnight(true);
}

function callBatman() {
  fetch("/help/batman", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      handleBatmanAnswer(data);
    });
}
document.querySelector(".askDarkKnight").addEventListener("click", callBatman);

function handleFiftyFifty(data) {
  answerButtons.forEach((btn, i) => {
    let answersCopy = [answerButtons[i].innerText];
    let indexOfChar = answersCopy[0].indexOf(":");
    let asnwersSlice = answersCopy[0].slice(0, indexOfChar);

    if (data.answersToRemove.indexOf(btn.innerText) > -1) {
      btn.classList.add("crossed");
      btn.disabled = true;
    } else if (data.answersToRemove.indexOf(asnwersSlice) > -1) {
      btn.classList.add("crossed");
      btn.disabled = true;
    }
  });
  resetFiftyFifty(true);
}

function fiftyFiftyHelper() {
  fetch("/help/half", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      handleFiftyFifty(data);
      document.querySelector(".halfHalf").play();
    });
}

document
  .querySelector(".fiftyFifty")
  .addEventListener("click", fiftyFiftyHelper);

const allSpans = Array.from(
  document.querySelectorAll(".answers--single__span")
);

function handleAudienceAnswer(data) {
  data.chart.forEach((el, i) => {
    answerButtons[i].innerText = `${answerButtons[i].innerText}: ${el}%`;
  });
  resetAskAudience(true);
}

function questionToTheAudience() {
  fetch("/help/audience", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      handleAudienceAnswer(data);
    });
}
document
  .querySelector(".askAudience")
  .addEventListener("click", questionToTheAudience);

const wrongAnswerAudio = document.getElementById("wrong-answer");
const correctAnswerAudio = document.getElementById("correct-answer");

const batmanLoader = document.querySelector(".batman-loading");
const batmanSound = document.querySelector(".batman-audio");

const batmanAnimation = () => {
  batmanLoader.classList.add("active");
  batmanSound.play();
  setTimeout(() => {
    batmanLoader.classList.remove("active");
    batmanSound.pause();
    batmanSound.currentTime = 0;
  }, 1500);
};

const batmanModal = document.querySelector(".batman");

document.querySelector(".batman--close").addEventListener("click", () => {
  batmanModal.style.display = "none";
  app.style.display = "grid";
});

document
  .querySelector(".walter--modal__close")
  .addEventListener("click", () => {
    walterModal.style.display = "none";
    walterGif.style.display = "none";
    app.style.display = "grid";
  });

const walterSound = document.querySelector(".breaking-audio");

const walterGif = document.querySelector(".walter");

const walterAnimation = () => {
  walterGif.style.display = "block";
  app.style.display = "none";
  walterSound.play();
  walterSound.volume = 0.3;
  setTimeout(() => {
    walterSound.pause();
    walterSound.currentTime = 0;
    walterGif.style.display = "none";
  }, 3000);
};

const soundsOff = document.querySelector(".sounds-switch");

const audioList = Array.from(document.querySelectorAll(".audio"));

const handleAudioMute = () => {
  audioList.forEach((el) => {
    el.muted = !el.muted;
  });
  soundsOff.classList.toggle("mute");
};

soundsOff.addEventListener("click", handleAudioMute);

const info = document.querySelector(".info");

document.querySelector(".info-btn").addEventListener("click", () => {
  info.style.display = "block";
});

document.querySelector(".info--close").addEventListener("click", () => {
  info.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === info) {
    info.style.display = "none";
  }
});

const statistics = document.querySelector(".statistics");

document.querySelector(".stats-btn").addEventListener("click", () => {
  statistics.style.display = "block";
});

document.querySelector(".statistics--close").addEventListener("click", () => {
  statistics.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === statistics) {
    statistics.style.display = "none";
  }
});

document.querySelector(".menu-show").addEventListener("click", () => {
  navigation.classList.add("navigation--open");
  menubar.classList.add("menubar--open");
});
document.querySelector(".navigation--close").addEventListener("click", () => {
  navigation.classList.remove("navigation--open");
  menubar.classList.remove("menubar--open");
});

window.addEventListener("load", () => {
  let currCountNum = localStorage.getItem("currNumber");

  for (i = 0; i < currCountNum; i++) {
    p[i].style.backgroundColor = "#00C1BC";
    p2[i].style.backgroundColor = "#00C1BC";
  }

  if (localStorage.getItem("clickedState") === "false") {
    resetWalter(false);
  }
  if (localStorage.getItem("clickedState") === "true") {
    resetWalter(true);
  }
  if (localStorage.getItem("clickedDarkKnight") === "false") {
    resetDarkKnight(false);
  }
  if (localStorage.getItem("clickedDarkKnight") === "true") {
    resetDarkKnight(true);
  }
  if (localStorage.getItem("clickedFiftyFifty") === "false") {
    resetFiftyFifty(false);
  }
  if (localStorage.getItem("clickedFiftyFifty") === "true") {
    resetFiftyFifty(true);
  }
  if (localStorage.getItem("clickedAskAudience") === "false") {
    resetAskAudience(false);
  }
  if (localStorage.getItem("clickedAskAudience") === "true") {
    resetAskAudience(true);
  }

  let numofwins = localStorage.getItem("numOfWins");
  winsSpan.innerText = numofwins;

  let numofloses = localStorage.getItem("numOfLoses");
  loseSpan.innerText = numofloses;
});

document.querySelector(".statistics--reset").addEventListener("click", () => {
  localStorage.setItem("numOfWins", 0);
  localStorage.setItem("numOfLoses", 0);
  loseSpan.innerText = 0;
  winsSpan.innerText = 0;
});
