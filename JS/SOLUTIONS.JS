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




const TOX_ID = "334E971A867D5EE3A855CEA85CAC6D0BA44537114BF35A4EE2D79935A3DEC82BA449E901F426";

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







(function(){
  // ----------------------------
  // 1. Конфигурация (из скриншота)
  // ----------------------------
  const config = {
    waveSpeed: 0.13,
    waveFrequency: 1.50,
    waveAmplitude: 0.35,
    waveColor: [128, 128, 128],
    colorNum: 5,
    pixelSize: 7,
    disableAnimation: false,
    enableMouseInteraction: true,
    mouseRadius: 0.30,
    internalResolution: 1.0,
    patternComplexity: 3,
    colorIntensity: 1.30,
    ditherBias: 0.30
  };

  // ----------------------------
  // 2. Подготовка Canvas
  // ----------------------------
  const container = document.getElementById('dithered-wave-container');
  const canvas = document.getElementById('dithered-wave-canvas');
  const ctx = canvas.getContext('2d');

  const CONTAINER_WIDTH  = 1080;
  const CONTAINER_HEIGHT = 400;

  function resizeCanvas() {
    canvas.width  = Math.floor(CONTAINER_WIDTH  * config.internalResolution / config.pixelSize);
    canvas.height = Math.floor(CONTAINER_HEIGHT * config.internalResolution / config.pixelSize);
  }
  resizeCanvas();

  let mouseX = 0, mouseY = 0;
  let time = 0;

  // ----------------------------
  // 3. Dithering (Bayer 4×4)
  // ----------------------------
  const bayerMatrix4x4 = [
    0/16,  8/16,  2/16, 10/16,
    12/16, 4/16, 14/16, 6/16,
    3/16, 11/16,  1/16, 9/16,
    15/16, 7/16, 13/16, 5/16
  ];

  // ----------------------------
  // 4. Таблица для Perlin-подобного шума
  // ----------------------------
  const p = new Array(512);
  const permutation = [
    151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,
    140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
  ];
  for (let i = 0; i < 256; i++) {
    p[i] = permutation[i];
    p[256 + i] = p[i];
  }

  function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function lerp(t, a, b) {
    return a + t * (b - a);
  }

  function grad(hash, x, y) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  function noise2D(x, y) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = fade(x);
    const v = fade(y);
    const a = p[X] + Y;
    const aa = p[a];
    const ab = p[a + 1];
    const b = p[X + 1] + Y;
    const ba = p[b];
    const bb = p[b + 1];
    return lerp(v,
      lerp(u, grad(p[aa], x, y), grad(p[ba], x - 1, y)),
      lerp(u, grad(p[ab], x, y - 1), grad(p[bb], x - 1, y - 1))
    );
  }

  // ----------------------------
  // 5. FBM (упрощённый)
  // ----------------------------
  function fbm(x, y) {
    let value = 0;
    let amplitude = 1;
    let frequency = config.waveFrequency;
    const octaves = 3 + Math.floor(config.patternComplexity * 2);
    for (let i = 0; i < octaves; i++) {
      value += amplitude * Math.abs(noise2D(x * frequency, y * frequency));
      frequency *= config.waveFrequency;
      amplitude *= config.waveAmplitude;
    }
    return value;
  }

  // ----------------------------
  // 6. Рекурсивный паттерн
  // ----------------------------
  function pattern(x, y) {
    const x2 = x - time * config.waveSpeed;
    const y2 = y - time * config.waveSpeed;
    if (config.patternComplexity >= 3) {
      return fbm(x - fbm(x + fbm(x2, y2), y), y);
    } else if (config.patternComplexity >= 2) {
      return fbm(x - fbm(x2, y2) * 0.5, y);
    } else {
      return fbm(x2, y2);
    }
  }

  // ----------------------------
  // 7. Функция дезеринга
  // ----------------------------
  function dither(value, x, y) {
    const matrixX = x & 3;
    const matrixY = y & 3;
    const threshold = bayerMatrix4x4[matrixY * 4 + matrixX] - 0.25;
    const step = 1 / (config.colorNum - 1);
    value += threshold * step;
    value = Math.max(0, Math.min(1, value - config.ditherBias));
    return Math.floor(value * (config.colorNum - 1) + 0.5) / (config.colorNum - 1);
  }

  // ----------------------------
  // 8. Основная отрисовка
  // ----------------------------
  function render() {
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    const aspectRatio = CONTAINER_WIDTH / CONTAINER_HEIGHT;
    const rect = container.getBoundingClientRect();
    const relMouseX = (mouseX - rect.left) / rect.width;
    const relMouseY = (mouseY - rect.top ) / rect.height;

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        let uvX = (x / canvas.width  - 0.5) * aspectRatio;
        let uvY =  (y / canvas.height - 0.5);

        let value = pattern(uvX * 2, uvY * 2);

        if (config.enableMouseInteraction && mouseX > 0 && mouseY > 0) {
          const mouseUvX = (relMouseX - 0.5) * aspectRatio;
          const mouseUvY =  (relMouseY - 0.5);
          const dist = Math.hypot(uvX - mouseUvX, uvY - mouseUvY);
          const effect = 1 - Math.min(1, Math.max(0, dist / config.mouseRadius));
          value -= 0.5 * effect;
        }

        value = Math.max(0, Math.min(1, value));
        value = dither(value, x, y);
        value *= config.colorIntensity;

        const i = (y * canvas.width + x) * 4;
        data[i    ] = Math.min(255, value * config.waveColor[0]);
        data[i + 1] = Math.min(255, value * config.waveColor[1]);
        data[i + 2] = Math.min(255, value * config.waveColor[2]);
        data[i + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  // ----------------------------
  // 9. Анимационный цикл (60 FPS)
  // ----------------------------
  let lastTime = performance.now();
  const targetFPS = 60;
  const frameTime = 1000 / targetFPS;

  function animate() {
    requestAnimationFrame(animate);
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    if (deltaTime >= frameTime) {
      if (!config.disableAnimation) {
        time += 0.016 * (deltaTime / frameTime);
      }
      render();
      lastTime = currentTime - (deltaTime % frameTime);
    }
  }

  // ----------------------------
  // 10. Отслеживание мыши
  // ----------------------------
  container.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  container.addEventListener('mouseleave', () => {
    mouseX = 0;
    mouseY = 0;
  });

  animate();
})();







    // Открытие по клику на кнопку
    document.querySelectorAll('.pixel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        const overlay = document.getElementById(modalId);
        overlay.classList.add('active');
      });
    });

    // Закрытие по клику на крестик
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', e => {
        e.target.closest('.modal-overlay').classList.remove('active');
      });
    });

    // Закрытие по клику вне окна (на оверлей)
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', e => {
        if (e.target === overlay) {
          overlay.classList.remove('active');
        }
      });
    });














    const wrapper = document.getElementById("gridblock");
    const rows = 11;
    const cols = 9;
    const totalItems = rows * cols;
    
    for (let i = 0; i < totalItems; i++) {
      const span = document.createElement("span");
      span.className = "gridblockspan";
      wrapper.appendChild(span);
    }
    
    const items = wrapper.querySelectorAll(".gridblockspan");
    
    const onPointerMove = (event) => {
      const mouseX = event.clientX || event.x;
      const mouseY = event.clientY || event.y;
      
      items.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.x + rect.width / 2;
        const centerY = rect.y + rect.height / 2;
        
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        
        const distance = Math.sqrt(Math.pow(deltaY, 2) + Math.pow(deltaX, 2));
        
        let angle = (180 * Math.acos(deltaX / distance)) / Math.PI;
        if (mouseY > centerY) {
          angle = angle;
        } else {
          angle = -angle;
        }
        
        const maxDistance = 240;
        let intensity = 1 - Math.min(distance / maxDistance, 1);
        intensity = Math.pow(intensity, 0.5);
        
        element.style.setProperty("--rotate", `${angle * intensity}deg`);
      });
    };
    
    window.addEventListener("pointermove", onPointerMove);
    
    const initialItem = items[Math.floor(totalItems / 2)];
    onPointerMove(initialItem.getBoundingClientRect());
    
    let ticking = false;
    window.addEventListener("pointermove", (event) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onPointerMove(event);
          ticking = false;
        });
        ticking = true;
      }
    });















console.log(`WEB_DEVELOPMENT: ARCH1, R001, ACID`);
console.log(`INSPIRED_BY: MIAO, Dragonfly, ertdfgcvb, Ivan Picelj, and .nfo's`);
console.log(`We're not web developers — we threw this site together in a few days, just for fun. Yeah, it might look kinda shitty. That's because... it is.`);
