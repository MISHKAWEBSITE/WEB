document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("letter-container");
    const WIDTH      = container.clientWidth;
    const HEIGHT     = container.clientHeight;
    const CELL_SIZE  = 18;
    const COLS       = Math.floor(WIDTH  / CELL_SIZE);
    const ROWS       = Math.floor(HEIGHT / CELL_SIZE);
    const centerX    = WIDTH  / 2;
    const centerY    = HEIGHT / 2;
    const maxDist    = 160;
  
    const MIN_WEIGHT = 100;
    const MAX_WEIGHT = 900;
    // Радиусы цветовых зон, начиная от центра:
    const R_RED         = CELL_SIZE * 1;  // #ff0a00
    const R_DARK_ORANGE = CELL_SIZE * 2;  // #ff6200
    const R_ORANGE      = CELL_SIZE * 3;  // #ffad00
    const R_YELLOW      = CELL_SIZE * 4;  // #ffce2e
    const R_CYAN        = CELL_SIZE * 5;  // #6a8dec — голубой ближе к центру
    const R_BLUE        = CELL_SIZE * 6;  // #2546ff — средний синий
    const R_DARK_BLUE   = CELL_SIZE * 7;  // #0100cb — темно-синий на фоне
  
    // Скрытый canvas-маска для текста "CONTACT"
    const mask = document.createElement("canvas");
    mask.width  = WIDTH;
    mask.height = HEIGHT;
    const mCtx = mask.getContext("2d");
  
    document.fonts.ready.then(() => {
      mCtx.fillStyle = "#000";
      mCtx.fillRect(0, 0, WIDTH, HEIGHT);
      mCtx.fillStyle = "#fff";
      mCtx.font = "bold 120px sans-serif";
      mCtx.textAlign = "center";
      mCtx.textBaseline = "middle";
      mCtx.fillText("CONTACT", centerX, centerY);
  
      // Генерация сетки букв "a", пропуская область текста
      const letters = [];
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const x = col * CELL_SIZE + CELL_SIZE / 2;
          const y = row * CELL_SIZE + CELL_SIZE / 2;
          const pixel = mCtx.getImageData(x, y, 1, 1).data;
          if (pixel[0] > 128) continue;
  
          const span = document.createElement("div");
          span.className = "letter";
          span.textContent = "a";
          span.style.left = x + "px";
          span.style.top  = y + "px";
          container.appendChild(span);
          letters.push({ el: span, x, y });
        }
      }
  
      // Обновление веса шрифта и цвета по расстоянию
      function updateLetters(mx, my) {
        for (const item of letters) {
          const dx = item.x - mx;
          const dy = item.y - my;
          const dist = Math.hypot(dx, dy);
          let norm = dist / maxDist;
          if (norm > 1) norm = 1;
  
          const w = MIN_WEIGHT + (1 - norm) * (MAX_WEIGHT - MIN_WEIGHT);
  
          let color;
          if      (dist < R_RED)       color = "#ff0a00";
          else if (dist < R_DARK_ORANGE) color = "#ff6200";
          else if (dist < R_ORANGE)      color = "#ffad00";
          else if (dist < R_YELLOW)      color = "#ffce2e";
          else if (dist < R_CYAN)        color = "#6a8dec";
          else if (dist < R_BLUE)        color = "#2546ff";
          else                            color = "#0100cb"; // совпадает с фоном
  
          item.el.style.fontVariationSettings = `'wght' ${Math.round(w)}`;
          item.el.style.color = color;
        }
      }
  
      // "Инерция" движения точки
      let targetX = centerX, targetY = centerY;
      let currentX = centerX, currentY = centerY;
      let vx = 0, vy = 0;
      const SPRING  = 0.1;
      const DAMPING = 0.8;
  
      document.addEventListener("mousemove", e => {
        const rect = container.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
      });
  
      function animate() {
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        vx += dx * SPRING;
        vy += dy * SPRING;
        vx *= DAMPING;
        vy *= DAMPING;
        currentX += vx;
        currentY += vy;
  
        updateLetters(currentX, currentY);
        requestAnimationFrame(animate);
      }
  
      // Инициализация: все буквы невидимы (цвет = фон)
      for (const item of letters) {
        item.el.style.fontVariationSettings = `'wght' ${MIN_WEIGHT}`;
        item.el.style.color = "#0100cb";
      }
      animate();
    });
  });


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







































;(function() {
    const steps      = Array.from(document.querySelectorAll('.step-default'));
    const indicators = Array.from(document.querySelectorAll('.step-indicator'));
    const connectors = Array.from(document.querySelectorAll('.step-connector-inner'));
    const backBtn    = document.getElementById('back-btn');
    const nextBtn    = document.getElementById('next-btn');
    const optionBtns = document.querySelectorAll('.option-button');
    const finalRec   = document.getElementById('final-recipient');
    const finalMsgEl = document.getElementById('final-message');
  
    let current   = 1;
    const total   = steps.length;
    let animating = false;
  
    init();
  
    function init() {
      // Скрываем все шаги и выводим первый
      steps.forEach(s => {
        s.style.visibility = 'hidden';
        s.className        = 'step-default';
      });
      showStep(1, null);
  
      // Клик по опциям
      optionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          optionBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        });
      });
  
      backBtn.addEventListener('click', () => {
        if (current > 1) showStep(current - 1, 'backward');
      });
  
      nextBtn.addEventListener('click', () => {
        if (current < total) {
          showStep(current + 1, 'forward');
        } else {
          // Отправка письма
          const subject = document
            .querySelector('.option-button.active')
            ?.textContent.trim() || '';
          const name = document
            .getElementById('user-name')
            .value.trim() || '';
          const body = document
            .getElementById('email-body')
            .value || '';
  
          const mailto = 
            `mailto:mishka@tuta.com?` +
            `subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(`FROM: ${name}\n\n${body}`)}`;
  
          window.location.href = mailto;
        }
      });
    }
  
    function showStep(step, dir) {
      const prev   = current;
      const prevEl = steps[prev - 1];
      const nextEl = steps[step - 1];
  
      if (dir === null) {
        nextEl.style.visibility = 'visible';
        nextEl.classList.add('active');
        current = step;
        updateUI();
        return;
      }
      if (animating) return;
      animating = true;
  
      // Анимация выхода
      prevEl.classList.remove('active');
      prevEl.classList.add(dir === 'forward' ? 'exit-left' : 'exit-right');
      setTimeout(() => {
        prevEl.style.visibility = 'hidden';
        prevEl.classList.remove('exit-left','exit-right');
      }, 380);
  
      // Анимация входа
      nextEl.style.visibility = 'visible';
      nextEl.classList.add(dir === 'forward' ? 'enter-right' : 'enter-left');
      requestAnimationFrame(() => {
        nextEl.classList.remove('enter-left','enter-right');
        nextEl.classList.add('active');
      });
  
      setTimeout(() => {
        current = step;
        if (current === total) populateFinal();
        updateUI();
        animating = false;
      }, 380);
    }
  
    function updateUI() {
      // Индикаторы
      indicators.forEach((ind, i) => {
        ind.classList.remove('inactive','active','complete');
        if (i + 1 < current)       ind.classList.add('complete');
        else if (i + 1 === current) ind.classList.add('active');
        else                         ind.classList.add('inactive');
      });
      // Коннекторы
      connectors.forEach((c, i) => {
        c.style.width = (current - 1 > i) ? '100%' : '0';
      });
      // Кнопки
      backBtn.disabled    = current === 1;
      nextBtn.textContent = (current === total) ? 'Send' : 'Next';
    }
  
    function populateFinal() {
      const name = document.getElementById('user-name').value.trim() || '';
      const body = document.getElementById('email-body').value || '';
  
      finalRec.textContent  = 'mishka@tuta.com';
      finalMsgEl.textContent = ` ${body}`;
    }
  })();
  

console.log(`WEB_DEVELOPMENT: ARCH1, R001, ACID`);
console.log(`INSPIRED_BY: MIAO, Dragonfly, ertdfgcvb, Ivan Picelj, and .nfo's`);