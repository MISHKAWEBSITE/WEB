function updateClock() {
    const clockEl = document.getElementById('clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hours}:${minutes}:${seconds}`;
  }
  setInterval(updateClock, 1000);
  updateClock();
  



document.addEventListener('DOMContentLoaded', function() {

  const spinner = document.querySelector('.activity');
  
  if (!spinner) {
    console.error('no .activity found');
    return;
  }
  
  spinner.classList.remove('spinning');
  
  let isScrolling = false;
  let scrollTimeout = null;
  let spinnerIndex = 0;
  let spinInterval = null;
  
  const SPINNER_CHARS = ['|', '/', '-', '\\', '|', '/', '-', '\\'];
  
  function updateSpinner() {
    spinnerIndex = (spinnerIndex + 1) % SPINNER_CHARS.length;
    spinner.textContent = SPINNER_CHARS[spinnerIndex];
  }
  
  function startAnimation() {
    if (spinInterval === null) {
      spinInterval = setInterval(updateSpinner, 80); 
    }
  }
  
  function stopAnimation() {
    if (spinInterval !== null) {
      clearInterval(spinInterval);
      spinInterval = null;
    }
  }
  
  function handleScroll() {
   
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    if (!isScrolling) {
      isScrolling = true;
      startAnimation();
    }
    
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      stopAnimation();
    }, 200);
  }
  
  let scrollActive = false;
  window.addEventListener('scroll', () => {
    if (!scrollActive) {
      window.requestAnimationFrame(() => {
        handleScroll();
        scrollActive = false;
      });
      scrollActive = true;
    }
  });
  
  spinner.textContent = SPINNER_CHARS[0];
  
});











function changeText() {
  const e = document.getElementById("myDiv");
  let t = 0;
  const a = [" +_+"," "," 0_0"," $_$"," @_@"," x_x"," O_o"," >_<"," ·.·"," o_o"," ^-^",];
  let n = "", l = 0;
  
  setInterval(() => {
    if (l < a[t].length) {
      n += a[t][l];
      e.textContent = n;
      l++;
    } else {
      setTimeout(() => {
        t = (t + 1) % a.length;
        n = "";
        l = 0;
      }, 1000);
    }
  }, 100);
}

document.addEventListener('DOMContentLoaded', function() {
  changeText();
  
  document.querySelectorAll('.container').forEach(container => {
      container.style.width = "100%";
      container.style.maxWidth = "100%";
  });
});












const chars = "×#-_¯—0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
const EMAIL_ADDRESS = "mishka@tuta.com";

var Glitch = function(t, i, e, n, h, r) {
  this.selector = t,
  this.index = i,
  this.numberOfGlitchedLetter = e,
  this.innerText,
  this.charArray = [],
  this.charIndex = [],
  this.timeGlitch = n,
  this.timeBetweenGlitch = r,
  this.timePerLetter = h,
  this.maxCount = Math.floor(this.timeGlitch / this.timePerLetter),
  this.count = 0,
  this.intervalId = null,
  this.timeoutId = null
};

Glitch.prototype.init = function() {
  this.innerText = this.selector.innerText,
  this.charArray = this.innerText.split(""),
  this.numberOfGlitchedLetter = this.charArray.length,
  this.defineCharIndexToRandomize()
};

Glitch.prototype.defineCharIndexToRandomize = function() {
  this.charIndex = [];
  for (let t = 0; t < this.numberOfGlitchedLetter; t++) {
    let i = t;
    this.charIndex.push(i)
  }
};

Glitch.prototype.randomize = function() {
  let t = Array.from(this.charArray);
  for (let i = 0; i < this.numberOfGlitchedLetter; i++) {
    let e = Math.floor(42 * Math.random()),
    n = this.charIndex[i];
    " " !== t[n] && (t[n] = chars[e])
  }
  this.selector.innerText = t.join("")
};

Glitch.prototype.update = function() {
  this.count >= this.maxCount - 1 ? (
    this.selector.innerText = this.innerText,
    this.defineCharIndexToRandomize(),
    this.count = 0
  ) : (
    this.randomize(),
    this.count++
  )
};

Glitch.prototype.startGlitch = function() {
  let t = this;
  this.intervalId = setInterval((function() {
    t.update()
  }), 10);
  this.timeoutId = setTimeout((function() {
    t.stopGlitch()
  }), 200)
};

Glitch.prototype.stopGlitch = function() {
  clearInterval(this.intervalId);
  clearTimeout(this.timeoutId);
  this.selector.innerText = this.innerText;
  this.count = 0
};

var glitchArray = [];

var isModalActive = false;

function resetGlitchArray() {
  for (let i = 0; i < glitchArray.length; i++) {
    if (glitchArray[i].intervalId) {
      clearInterval(glitchArray[i].intervalId);
    }
    if (glitchArray[i].timeoutId) {
      clearTimeout(glitchArray[i].timeoutId);
    }
  }
  
  glitchArray = [];
  
  initAllGlitch();
}

function initElementGlitch(element) {
  let glitch = new Glitch(element, glitchArray.length, void 0, 200, 10, 400);
  glitch.init();
  glitchArray.push(glitch);
  
  element.addEventListener("mouseover", function() {
    glitch.startGlitch();
  });
  
  element.addEventListener("mouseout", function() {
    glitch.stopGlitch();
  });
  
  return glitch;
}

function initAllGlitch() {
  var elements = document.querySelectorAll("a, button, .LOGBUNAFTER, [data-email-element]");
  for (let i = 0; i < elements.length; i++) {
    initElementGlitch(elements[i]);
  }
}

function copyToClipboard(text, message) {
  const tempInput = document.createElement('input');
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  
  showNotification(message);
}

function showNotification(message) {
  const overlay = document.createElement('div');
  overlay.className = 'notification-overlay';
  
  const notification = document.createElement('div');
  notification.className = 'custom-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <span>${message}</span>
    </div>
  `;
  
  overlay.appendChild(notification);
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    overlay.classList.add('visible');
    notification.classList.add('visible');
  }, 10);
  
  setTimeout(() => {
    overlay.classList.add('fade-out');
    notification.style.opacity = '0';
    notification.style.transform = 'scale(0.9)';
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
        isModalActive = false; 
        resetGlitchArray();
      }
    }, 500); 
  }, 2000);
}

function showEmailModal(email) {
  if (isModalActive) return; 
  isModalActive = true;
  
  const overlay = document.createElement('div');
  overlay.className = 'email-modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'email-modal';
  modal.innerHTML = `
    <div class="email-modal-content">
      <h2>EMAIL OPTIONS</h2>
      <div class="email-address">${email}</div>
      <div class="email-buttons">
        <button id="copyEmailBtn" class="LOGBUNAFTER">COPY</button>
        <button id="writeEmailBtn" class="LOGBUNAFTER">WRITE</button>
      </div>
    </div>
  `;
  
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  if (!document.getElementById('customStyles')) {
    const style = document.createElement('style');
    style.id = 'customStyles';
    style.textContent = `
      /* Базовые переменные для стилей */
      :root {
        --grad: linear-gradient(antiquewhite, antiquewhite);
        --thik: 1px;
        --size: 10px;
      }
      
      .LOGBUNAFTER {
        cursor: pointer;
        font-family: VT323;
        display: grid;
        font-size: 24px;
        width: 140px;
        position: relative;
        color: antiquewhite;
        transition: transform 0.1s ease, background-color 0.1s ease;
      }
      
      .LOGBUNAFTER::after {
        content: "";
        background: var(--grad) top left / var(--thik) var(--size),
        var(--grad) top left / var(--size) var(--thik),
        var(--grad) top right / var(--size) var(--thik),
        var(--grad) top right / var(--thik) var(--size),
        var(--grad) bottom left / var(--thik) var(--size),
        var(--grad) bottom left / var(--size) var(--thik),
        var(--grad) bottom right / var(--size) var(--thik),
        var(--grad) bottom right / var(--thik) var(--size);
        background-repeat: no-repeat;
        inset: 0;
        position: absolute;
      }
      
      .LOGBUNAFTER:hover {
        background-color: antiquewhite;
        color: #010101;
        border-radius: 1px;
      }
      
      .LOGBUNAFTER:hover::after {
        background: none;
      }
      
      .LOGBUNAFTER:active {
        background-color: antiquewhite;
        transform: scale(0.95);
      }
      
      .email-modal-overlay, .notification-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9998;
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      
      .email-modal-overlay.visible, .notification-overlay.visible {
        opacity: 1;
      }
      
      .fade-out {
        opacity: 0 !important;
        transition: opacity 0.5s ease;
      }
      
      .email-modal {
        background-color: #010101;
        color: antiquewhite;
        border: 1px solid antiquewhite;
        padding: 30px 50px;
        border-radius: 4px;
        z-index: 9999;
        font-family: DOS437;
        min-width: 300px;
        height: 180px;
        text-align: center;
        transform: scale(0.9);
        opacity: 0;
        transition: transform 0.4s ease, opacity 0.4s ease;
      }
      
      .email-modal.visible {
        transform: scale(1);
        opacity: 1;
      }
      
      .email-address {
        font-size: 26px;
        margin-bottom: 25px;
      }
      
      .email-buttons {
        display: flex;
        justify-content: space-around;
      }
      
      .custom-notification {
        background-color: #010101;
        color: antiquewhite;
        border: 1px solid antiquewhite;
        padding: 30px 50px;
        border-radius: 4px;
        z-index: 9999;
        font-family: 'VT323', monospace;
        font-size: 28px;
        transform: scale(0.9);
        opacity: 0;
        transition: transform 0.4s ease, opacity 0.4s ease;
      }
      
      .custom-notification.visible {
        transform: scale(1);
        opacity: 1;
      }
      
      .notification-content {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    `;
    document.head.appendChild(style);
  }
  
  setTimeout(() => {
    overlay.classList.add('visible');
    modal.classList.add('visible');
    
    const modalButtons = overlay.querySelectorAll('.LOGBUNAFTER');
    for (let i = 0; i < modalButtons.length; i++) {
      initElementGlitch(modalButtons[i]);
    }
  }, 10);
  
  document.getElementById('copyEmailBtn').addEventListener('click', function() {
    copyToClipboard(email, 'EMAIL_COPIED_SUCCESSFULLY');
    setTimeout(() => {
      closeModal(overlay);
    }, 100); 
  });
  
  document.getElementById('writeEmailBtn').addEventListener('click', () => {
    window.location.href = `mailto:${email}?subject=&body=Hello,friend!`;
    closeModal(overlay);
  });
  
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(overlay);
    }
  });
}

function closeModal(overlay) {
  overlay.classList.add('fade-out');
  const modal = overlay.querySelector('.email-modal') || overlay.querySelector('.custom-notification');
  if (modal) {
    modal.style.opacity = '0';
    modal.style.transform = 'scale(0.9)';
  }
  setTimeout(() => {
    if (document.body.contains(overlay)) {
      document.body.removeChild(overlay);
      isModalActive = false;
      resetGlitchArray();
    }
  }, 400); 
}

function setupEmailElement() {
  const emailElement = document.querySelector('[data-email-element]');
  
  if (emailElement) {

    if (emailElement.hasAttribute('href')) {
      emailElement.removeAttribute('href');
    }
    
    emailElement.style.cursor = 'pointer';
    
    emailElement.onclick = function(e) {
      if (e) e.preventDefault();
      showEmailModal(EMAIL_ADDRESS);
    };
  } else {

    setTimeout(setupEmailElement, 500);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setupEmailElement();
    initAllGlitch(); 
  });
} else {

  setupEmailElement();
  initAllGlitch(); 
}




const TOX_ID = "2800F4E2258D0A56175E40AF2CBAFAC3F43E4867B5C3A06DC638F4553A2E311086340A206E01";

function copyToxId() {
  const tempInput = document.createElement('input');
  tempInput.value = TOX_ID;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  
  showToxNotification();
}

function showToxNotification() {

  const overlay = document.createElement('div');
  overlay.className = 'tox-notification-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '9998';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.4s ease';
  
  const notification = document.createElement('div');
  notification.className = 'tox-notification';
  notification.style.backgroundColor = '#010101';
  notification.style.color = 'antiquewhite';
  notification.style.border = '1px solid antiquewhite';
  notification.style.padding = '30px 50px';
  notification.style.borderRadius = '4px';
  notification.style.fontFamily = 'DOS437, VT323, monospace';
  notification.style.fontSize = '24px';
  notification.style.transform = 'scale(0.9)';
  notification.style.opacity = '0';
  notification.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center;">
      <span>TOX_ID_COPIED_SUCCESSFULLY</span>
    </div>
  `;
  
  overlay.appendChild(notification);
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    overlay.style.opacity = '1';
    notification.style.opacity = '1';
    notification.style.transform = 'scale(1)';
  }, 10);
  
  setTimeout(() => {
    overlay.style.opacity = '0';
    notification.style.opacity = '0';
    notification.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, 500);
  }, 2000);
}

window.copyToxId = copyToxId;

document.addEventListener('DOMContentLoaded', function() {
  const toxButton = document.getElementById('copyButtonTOX');
  if (toxButton) {
    toxButton.onclick = copyToxId;
  }
});




const TG_ID = "UNAVAILABLE";

function copyTgId() {
  const tempInput = document.createElement('input');
  tempInput.value = TG_ID;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  
  showTgNotification();
}

function showTgNotification() {
  const overlay = document.createElement('div');
  overlay.className = 'tg-notification-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '9998';
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.4s ease';
  
  const notification = document.createElement('div');
  notification.className = 'tg-notification';
  notification.style.backgroundColor = '#010101';
  notification.style.color = 'antiquewhite';
  notification.style.border = '1px solid antiquewhite';
  notification.style.padding = '30px 50px';
  notification.style.borderRadius = '4px';
  notification.style.fontFamily = 'DOS437, VT323, monospace';
  notification.style.fontSize = '24px';
  notification.style.transform = 'scale(0.9)';
  notification.style.opacity = '0';
  notification.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
  
  notification.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center;">
      <span>UNAVAILABLE</span>
    </div>
  `;
  
  overlay.appendChild(notification);
  document.body.appendChild(overlay);
  
  setTimeout(() => {
    overlay.style.opacity = '1';
    notification.style.opacity = '1';
    notification.style.transform = 'scale(1)';
  }, 10);
  
  setTimeout(() => {
    overlay.style.opacity = '0';
    notification.style.opacity = '0';
    notification.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    }, 500);
  }, 2000);
}

window.copyTgId = copyTgId;

document.addEventListener('DOMContentLoaded', function() {
  const tgButton = document.getElementById('ButtonTLGRM');
  if (tgButton) {
    tgButton.onclick = copyTgId;
  }
});







const scrollIndicatorBars = document.getElementById("scroll-indicator-bars");
const scrollProgress = document.getElementById("scroll-progress");
const scrollIndicator = document.getElementById("scroll-indicator");
const maxBars = 20;

function updateScrollIndicator() {
  const scrollPercentage = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100, 100);
  const filledBars = Math.round(scrollPercentage / 100 * maxBars);
  const barDisplay = Array(filledBars).fill("|").join("") + Array(maxBars - filledBars).fill("-").join("");
  scrollIndicatorBars.innerHTML = barDisplay;
  scrollProgress.textContent = `${Math.round(scrollPercentage).toString().padStart(3, "0")}`;
}

updateScrollIndicator();

window.addEventListener("scroll", updateScrollIndicator);

scrollIndicator.addEventListener("click", function(event) {
  const rect = scrollIndicator.getBoundingClientRect();
  const clickPositionRatio = (event.clientX - rect.left) / rect.width;
  
  const targetScrollPosition = clickPositionRatio * (document.body.scrollHeight - window.innerHeight);
  
  smoothScrollTo(targetScrollPosition);
});

let isDraggingItem = false;
let currentScrollAnimation = null;
let dragStartTime = null;

scrollIndicator.addEventListener("mousedown", function(event) {
  isDraggingItem = true;
  document.body.style.userSelect = "none"; 
  dragStartTime = Date.now();
  
  if (currentScrollAnimation) {
    cancelAnimationFrame(currentScrollAnimation);
    currentScrollAnimation = null;
  }
  
  handleDragMove(event);
});

document.addEventListener("mouseup", function() {
  if (isDraggingItem) {
    isDraggingItem = false;
    document.body.style.userSelect = "";
    dragStartTime = null;
    
    if (currentScrollAnimation) {
      cancelAnimationFrame(currentScrollAnimation);
      currentScrollAnimation = null;
    }
  }
});

document.addEventListener("mousemove", function(event) {
  if (isDraggingItem) {
    handleDragMove(event);
  }
});

function handleDragMove(event) {
  const rect = scrollIndicator.getBoundingClientRect();
  const positionRatio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  const targetScrollPosition = positionRatio * (document.body.scrollHeight - window.innerHeight);
  
  improvedLerpScrollTo(targetScrollPosition);
}

function improvedLerpScrollTo(targetPosition) {
  if (currentScrollAnimation) {
    cancelAnimationFrame(currentScrollAnimation);
  }
  
  const maxAnimationDuration = 300;
  const startTime = Date.now();
  
  function animate() {
    const currentPosition = window.scrollY;
    const animationDuration = Date.now() - startTime;
    
    let lerpFactor = 0.25;
    
    if (animationDuration > 150) {
      lerpFactor = 0.4;
    }
    
    if (Math.abs(targetPosition - currentPosition) < 50) {
      lerpFactor = 0.5; 
    }
    
    const nextPosition = currentPosition + (targetPosition - currentPosition) * lerpFactor;
    
    window.scrollTo(0, nextPosition);
    
    const closeEnough = Math.abs(targetPosition - nextPosition) < 3;
    const timeUp = animationDuration > maxAnimationDuration;
    
    if (!closeEnough && !timeUp && isDraggingItem) {
      currentScrollAnimation = requestAnimationFrame(animate);
    } else {
      if (Math.abs(targetPosition - nextPosition) < 20) {
        window.scrollTo(0, targetPosition);
      }
      currentScrollAnimation = null;
    }
  }
  
  currentScrollAnimation = requestAnimationFrame(animate);
}

function smoothScrollTo(targetPosition) {
  if (currentScrollAnimation) {
    cancelAnimationFrame(currentScrollAnimation);
  }
  
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 500; 
  let startTime = null;
  
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    const easedProgress = easeOutQuint(progress);
    
    window.scrollTo(0, startPosition + distance * easedProgress);
    
    if (timeElapsed < duration && progress < 0.99) {
      currentScrollAnimation = requestAnimationFrame(animation);
    } else {
      window.scrollTo(0, targetPosition);
      currentScrollAnimation = null;
    }
  }
  
  currentScrollAnimation = requestAnimationFrame(animation);
}

function easeOutQuint(t) {
  return 1 - Math.pow(1 - t, 5);
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}















(function() {
    function LIVE_set(val, x, y, w, h, buf) {
      if (x < 0 || x >= w) return;
      if (y < 0 || y >= h) return;
      buf[y * w + x] = val;
    }
    
    function LIVE_get(x, y, w, h, buf) {
      if (x < 0 || x >= w) return 0;
      if (y < 0 || y >= h) return 0;
      return buf[y * w + x];
    }
    
    let LIVE_cols, LIVE_rows;
    let LIVE_data = [];
    let LIVE_timeoutId;
    let LIVE_isPaused = false;
    let LIVE_frame = 0;
    let LIVE_cursorX = -1;
    let LIVE_cursorY = -1;
    let LIVE_isPressed = false;
    let LIVE_updateSpeed = 42;
    let LIVE_lastRandomBlock = 0;
    let LIVE_randomBlockInterval = 30;
    let LIVE_liveCellCount = 0;
    let LIVE_prevLiveCellCount = 0;
    let LIVE_stableCount = 0;
    
    const LIVE_canvas = document.getElementById('LIVECANVAS');
    
    function LIVE_init() {
      const LIVE_container = document.getElementById('LIVECONTAINER');
      const fontSize = 16;
      const containerWidth = LIVE_container.clientWidth || window.innerWidth * 0.9;
      const containerHeight = LIVE_container.clientHeight || window.innerHeight * 0.8;
      
      LIVE_cols = Math.floor(containerWidth / (fontSize * 0.6));
      LIVE_rows = Math.floor(containerHeight / fontSize);
      
      LIVE_cols = Math.min(LIVE_cols, 150);
      LIVE_rows = Math.min(LIVE_rows, 80);
      
      const len = LIVE_cols * LIVE_rows * 2;
      
      LIVE_data[0] = [];
      LIVE_data[1] = [];
      
      for (let i = 0; i < len; i++) {
        const v = Math.random() > 0.5 ? 1 : 0;
        LIVE_data[0][i] = v;
        LIVE_data[1][i] = v;
      }
      
      LIVE_canvas.style.width = `${LIVE_cols * fontSize * 0.6}px`;
      LIVE_canvas.style.height = `${LIVE_rows * fontSize}px`;
    }
  
    function LIVE_addRandomBlock(prev, w, h) {
      const patterns = [
        [
          [1, 1],
          [1, 1]
        ],
        [
          [1, 1, 1]
        ],
        [
          [0, 1, 0],
          [0, 0, 1],
          [1, 1, 1]
        ],
        [
          [1, 1],
          [1, 0]
        ],
        [
          [1, 1, 0],
          [1, 0, 1],
          [0, 1, 0]
        ],
        [
          [1, 0, 1],
          [0, 1, 0],
          [1, 0, 1]
        ]
      ];
  
      let liveCells = [];
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          if (LIVE_get(x, y, w, h, prev) === 1) {
            liveCells.push({x, y});
          }
        }
      }
  
      if (liveCells.length > 0) {
        const numPatterns = Math.max(1, Math.floor(Math.random() * 3));
        
        for (let p = 0; p < numPatterns; p++) {
          const randomCellIndex = Math.floor(Math.random() * liveCells.length);
          const cell = liveCells[randomCellIndex];
          
          const pattern = patterns[Math.floor(Math.random() * patterns.length)];
          
          const offsetX = Math.floor(Math.random() * 14) - 7;
          const offsetY = Math.floor(Math.random() * 14) - 7;
          
          for (let y = 0; y < pattern.length; y++) {
            for (let x = 0; x < pattern[y].length; x++) {
              if (pattern[y][x] === 1) {
                LIVE_set(1, cell.x + x + offsetX, cell.y + y + offsetY, w, h, prev);
              }
            }
          }
        }
      } else {
        const randomX = Math.floor(Math.random() * w);
        const randomY = Math.floor(Math.random() * h);
        
        const glider = [
          [0, 0, 1],
          [1, 0, 1],
          [0, 1, 1]
        ];
        
        for (let y = 0; y < glider.length; y++) {
          for (let x = 0; x < glider[y].length; x++) {
            LIVE_set(glider[y][x], randomX + x, randomY + y, w, h, prev);
          }
        }
      }
    }
    
    function LIVE_updateGame() {
      const prev = LIVE_data[LIVE_frame % 2];
      const curr = LIVE_data[(LIVE_frame + 1) % 2];
      const w = LIVE_cols;
      const h = LIVE_rows * 2;
      
      if (LIVE_isPressed && LIVE_cursorX >= 0 && LIVE_cursorY >= 0) {
        const cx = Math.floor(LIVE_cursorX);
        const cy = Math.floor(LIVE_cursorY * 2);
        
        const glider = [
          [0, 0, 1],
          [1, 0, 1],
          [0, 1, 1]
        ];
        
        for (let y = 0; y < glider.length; y++) {
          for (let x = 0; x < glider[y].length; x++) {
            LIVE_set(glider[y][x], cx + x - 1, cy + y - 1, w, h, prev);
          }
        }
      }
      
      LIVE_prevLiveCellCount = LIVE_liveCellCount;
      LIVE_liveCellCount = 0;
      
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const current = LIVE_get(x, y, w, h, prev);
          const neighbors =
            LIVE_get(x - 1, y - 1, w, h, prev) +
            LIVE_get(x,     y - 1, w, h, prev) +
            LIVE_get(x + 1, y - 1, w, h, prev) +
            LIVE_get(x - 1, y,     w, h, prev) +
            LIVE_get(x + 1, y,     w, h, prev) +
            LIVE_get(x - 1, y + 1, w, h, prev) +
            LIVE_get(x,     y + 1, w, h, prev) +
            LIVE_get(x + 1, y + 1, w, h, prev);
          
          const i = x + y * w;
          if (current == 1) {
            curr[i] = neighbors == 2 || neighbors == 3 ? 1 : 0;
          } else {
            curr[i] = neighbors == 3 ? 1 : 0;
          }
          
          if (curr[i] === 1) {
            LIVE_liveCellCount++;
          }
        }
      }
      
      if (Math.abs(LIVE_liveCellCount - LIVE_prevLiveCellCount) < 5) {
        LIVE_stableCount++;
      } else {
        LIVE_stableCount = 0;
      }
      
      let shouldAddBlock = false;
      
      let dynamicInterval = LIVE_randomBlockInterval;
      if (LIVE_liveCellCount < 30) {
        dynamicInterval = 10;
      } else if (LIVE_liveCellCount < 100) {
        dynamicInterval = 20;
      } else {
        dynamicInterval = 40;
      }
      
      if (LIVE_stableCount > 5) {
        dynamicInterval = Math.max(5, dynamicInterval / 2);
      }
      
      if (LIVE_frame - LIVE_lastRandomBlock > dynamicInterval) {
        shouldAddBlock = true;
      } else if (LIVE_liveCellCount < 20) {
        shouldAddBlock = Math.random() < 0.4;
      } else if (LIVE_stableCount > 10) {
        shouldAddBlock = Math.random() < 0.3;
      }
      
      if (shouldAddBlock) {
        LIVE_addRandomBlock(curr, w, h);
        LIVE_lastRandomBlock = LIVE_frame;
      }
      
      LIVE_frame++;
    }
    
    function LIVE_render() {
      const curr = LIVE_data[(LIVE_frame + 1) % 2];
      const w = LIVE_cols;
      const h = LIVE_rows * 2;
      
      let output = '';
      
      for (let y = 0; y < LIVE_rows; y++) {
        for (let x = 0; x < LIVE_cols; x++) {
          const idx = x + y * 2 * LIVE_cols;
          const upper = curr[idx];
          const lower = curr[idx + LIVE_cols];
          
          if (upper && lower) output += '█';
          else if (upper) output += '▀';
          else if (lower) output += '▄';
          else output += ' ';
        }
        output += '\n';
      }
      
      LIVE_canvas.textContent = output;
    }
    
    function LIVE_gameLoop() {
      if (!LIVE_isPaused) {
        LIVE_updateGame();
      }
      LIVE_render();
      
      LIVE_timeoutId = setTimeout(LIVE_gameLoop, LIVE_updateSpeed);
    }
    
    function LIVE_startGame() {
      LIVE_init();
      LIVE_gameLoop();
    }
    
    function LIVE_handleMouseMove(e) {
      const rect = LIVE_canvas.getBoundingClientRect();
      LIVE_cursorX = Math.floor((e.clientX - rect.left) / rect.width * LIVE_cols);
      LIVE_cursorY = Math.floor((e.clientY - rect.top) / rect.height * LIVE_rows);
    }
    
    function LIVE_handleMouseDown() {
      LIVE_isPressed = true;
    }
    
    function LIVE_handleMouseUp() {
      LIVE_isPressed = false;
    }
    
    function LIVE_handleMouseLeave() {
      LIVE_isPressed = false;
      LIVE_cursorX = -1;
      LIVE_cursorY = -1;
    }
    
    function LIVE_handleResize() {
      clearTimeout(LIVE_timeoutId);
      LIVE_startGame();
    }
    
    LIVE_canvas.addEventListener('mousemove', LIVE_handleMouseMove);
    LIVE_canvas.addEventListener('mousedown', LIVE_handleMouseDown);
    LIVE_canvas.addEventListener('mouseup', LIVE_handleMouseUp);
    LIVE_canvas.addEventListener('mouseleave', LIVE_handleMouseLeave);
    window.addEventListener('resize', LIVE_handleResize);
    
    window.LIVE_setSpeed = function(speed) {
      LIVE_updateSpeed = speed;
    };
    
    window.LIVE_togglePause = function() {
      LIVE_isPaused = !LIVE_isPaused;
      return LIVE_isPaused;
    };
    
    window.LIVE_setRandomInterval = function(frames) {
      LIVE_randomBlockInterval = frames;
    };
    
    LIVE_startGame();
    
    return {
      setSpeed: window.LIVE_setSpeed,
      togglePause: window.LIVE_togglePause,
      setRandomInterval: window.LIVE_setRandomInterval
    };
  })();





console.log(`WEB_DEVELOPMENT: ARCH1, R001, ACID`);
console.log(`INSPIRED_BY: MIAO, Dragonfly, ertdfgcvb, Ivan Picelj, and .nfo's`);
console.log(`We're not web developers — we threw this site together in a few days, just for fun. Yeah, it might look kinda shitty. That's because... it is.`);