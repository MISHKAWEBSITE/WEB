const chars = "×#-_¯—0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";

class Glitch {
  constructor(el, timeGlitch = 200, timePerLetter = 10) {
    this.el            = el;
    this.innerText     = "";
    this.charArray     = [];
    this.timeGlitch    = timeGlitch;
    this.timePerLetter = timePerLetter;
    this.maxCount      = Math.floor(this.timeGlitch / this.timePerLetter);
    this.count         = 0;
    this.intervalId    = null;
    this.timeoutId     = null;
  }
  init() {
    this.innerText = this.el.innerText;
    this.charArray = this.innerText.split("");
  }
  randomize() {
    const arr = this.charArray.slice();
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== " ") {
        arr[i] = chars[Math.floor(chars.length * Math.random())];
      }
    }
    this.el.innerText = arr.join("");
  }
  update() {
    if (this.count++ >= this.maxCount) {
      this.el.innerText = this.innerText;
      this.count = 0;
    } else {
      this.randomize();
    }
  }
  start() {
    this.intervalId = setInterval(() => this.update(), this.timePerLetter);
    this.timeoutId  = setTimeout(() => this.stop(), this.timeGlitch);
  }
  stop() {
    clearInterval(this.intervalId);
    clearTimeout(this.timeoutId);
    this.el.innerText = this.innerText;
    this.count = 0;
  }
}

function initAllGlitch() {
  document
    .querySelectorAll("a, button, .LOGBUNAFTER, [data-email-element], [data-contact-element]")
    .forEach(el => {
      const g = new Glitch(el);
      g.init();
      el.addEventListener("mouseover", () => g.start());
      el.addEventListener("mouseout",  () => g.stop());
    });
}

function setupNavButtons() {
  document.querySelectorAll(".LOGBUNAFTER").forEach(el => {
    el.addEventListener("click", e => {
      e.preventDefault();
      const txt = el.textContent.trim().toLowerCase();
      if (txt === "contact") {
        window.location.href = "./HTML/CONTACT.html";
      } else if (txt === "about") {
        window.location.href = "./HTML/ABOUT.html";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAllGlitch();
  setupNavButtons();
});


console.log(`WEB_DEVELOPMENT: ARCH1, R001, ACID`);
console.log(`INSPIRED_BY: MIAO, Dragonfly, ertdfgcvb, Ivan Picelj, and .nfo's`);