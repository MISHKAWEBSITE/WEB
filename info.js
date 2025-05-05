const chars = "×#-_¯—0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
var Glitch = function(t, i, e, n, h, r) {
this.selector = t, this.index = i, this.numberOfGlitchedLetter = e, this.innerText, this.charArray = [], this.charIndex = [], this.timeGlitch = n, this.timeBetweenGlitch = r, this.timePerLetter = h, this.maxCount = Math.floor(this.timeGlitch / this.timePerLetter), this.count = 0, this.intervalId = null, this.timeoutId = null
};
Glitch.prototype.init = function() {
this.innerText = this.selector.innerText, this.charArray = this.innerText.split(""), this.numberOfGlitchedLetter = this.charArray.length, this.defineCharIndexToRandomize()
}, Glitch.prototype.defineCharIndexToRandomize = function() {
this.charIndex = [];
for (let t = 0; t < this.numberOfGlitchedLetter; t++) {
  let i = t;
  this.charIndex.push(i)
}
}, Glitch.prototype.randomize = function() {
let t = Array.from(this.charArray);
for (let i = 0; i < this.numberOfGlitchedLetter; i++) {
  let e = Math.floor(42 * Math.random()),
      n = this.charIndex[i];
  " " !== t[n] && (t[n] = chars[e])
}
this.selector.innerText = t.join("")
}, Glitch.prototype.update = function() {
this.count >= this.maxCount - 1 ? (this.selector.innerText = this.innerText, this.defineCharIndexToRandomize(), this.count = 0) : (this.randomize(), this.count++)
}, Glitch.prototype.startGlitch = function() {
let t = this;
this.intervalId = setInterval((function() {
  t.update()
}), 10), this.timeoutId = setTimeout((function() {
  t.stopGlitch()
}), 200)
}, Glitch.prototype.stopGlitch = function() {
clearInterval(this.intervalId), clearTimeout(this.timeoutId), this.selector.innerText = this.innerText, this.count = 0
};
var glitchArray = [];

function initAllGlitch() {
var t = document.querySelectorAll("a, button");
for (let i = 0; i < t.length; i++) {
  let e = t[i],
      n = new Glitch(e, i, void 0, 200, 10, 400);
  n.init(), glitchArray.push(n), e.addEventListener("mouseover", (function() {
      n.startGlitch()
  })), e.addEventListener("mouseout", (function() {
      n.stopGlitch()
  }))
}
}
initAllGlitch();


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

window.addEventListener("scroll", () => {
  const e = window.scrollY;
  const t = parallaxContainer.offsetTop;
  const a = parallaxContainer.offsetHeight;
  const parallaxEffect = 0.5 * (e - t);
  parallaxImage.style.transform = `translateY(${Math.min(0, parallaxEffect)}px)`;

  parallaxContainer.style.width = "100%";
});

document.addEventListener('DOMContentLoaded', function() {
  changeText();
  
  document.querySelectorAll('.container').forEach(container => {
      container.style.width = "100%";
      container.style.maxWidth = "100%";
  });
});

function updateLine() {
  const lineElement = document.getElementById('dynamic-line');
  const screenWidth = window.innerWidth;
  const lineLength = Math.floor(screenWidth / 8); 
  lineElement.textContent = '/'.repeat(lineLength);
  
  lineElement.style.width = "100%";
  lineElement.style.textAlign = "center";
  lineElement.style.margin = "0 auto";
}

window.onload = function() {
  updateLine();

  document.body.style.width = "100%";
  document.body.style.margin = "0";
  document.body.style.padding = "0";
  document.body.style.overflow = "hidden"; 
};

window.onresize = updateLine;





function checkWidth() {
    if (window.innerWidth < 1110) {
      console.log("Ширина экрана меньше 1200px. Перенаправление...");
      window.location.href = "no-phone.html";
    }
  }

  window.addEventListener("load", checkWidth);

  window.addEventListener("resize", checkWidth);





document.addEventListener('DOMContentLoaded', function() {
  const spinner = document.querySelector('.activity');
  
  if (!spinner) {
    console.error('Элемент .activity не найден!');
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

// Initial update
updateScrollIndicator();

// Update on scroll
window.addEventListener("scroll", updateScrollIndicator);

// Make the indicator interactive for clicking
scrollIndicator.addEventListener("click", function(event) {
  // Calculate click position relative to the indicator
  const rect = scrollIndicator.getBoundingClientRect();
  const clickPositionRatio = (event.clientX - rect.left) / rect.width;
  
  // Calculate the target scroll position
  const targetScrollPosition = clickPositionRatio * (document.body.scrollHeight - window.innerHeight);
  
  // Smooth scroll to the target position
  smoothScrollTo(targetScrollPosition);
});

// Add dragging functionality
let isDraggingItem = false;

scrollIndicator.addEventListener("mousedown", function() {
  isDraggingItem = true;
  document.body.style.userSelect = "none"; // Prevent text selection while dragging
});

document.addEventListener("mouseup", function() {
  isDraggingItem = false;
  document.body.style.userSelect = "";
});

document.addEventListener("mousemove", function(event) {
  if (isDraggingItem) {
    const rect = scrollIndicator.getBoundingClientRect();
    const positionRatio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const targetScrollPosition = positionRatio * (document.body.scrollHeight - window.innerHeight);
    window.scrollTo(0, targetScrollPosition);
  }
});

// Smooth scrolling function
function smoothScrollTo(targetPosition) {
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 500; // ms
  let startTime = null;
  
  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easeProgress = easeInOutCubic(progress);
    
    window.scrollTo(0, startPosition + distance * easeProgress);
    
    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }
  
  // Easing function for smooth animation
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  requestAnimationFrame(animation);
}



const notification = document.createElement('div');
notification.id = 'phone-notification';
notification.style.position = 'fixed';
notification.style.top = '0';
notification.style.left = '0';
notification.style.width = '100%';
notification.style.height = '100%';
notification.style.backgroundColor = '#010101';
notification.style.zIndex = '9999';
notification.style.display = 'none';
notification.style.color = 'antiquewhite';
notification.innerHTML = `
 <div style="font-size: 30px; padding-top: 20px;">
 <pre style="font-size: 6px; text-align: center;">
 ** _**___ **  **______
/\\ "-./ \\ /\\ \\ /\\ ___\\ /\\ \\_\\ \\ /\\ \\/ / /\\ __ \\
\\ \\ \\-./\\ \\ \\ \\ \\ \\ \\___ \\ \\ \\ __ \\ \\ \\ *"-. \\ \\ *_ \\
\\ \\_\\ \\ \\_\\ \\ \\_\\ \\/\\_____\\ \\ \\_\\ \\_\\ \\ \\_\\ \\_\\ \\ \\_\\ \\_\\
\\/_/ \\/_/ \\/_/ \\/_____/ \\/_/\\/_/ \\/_/\\/_/ \\/_/\\/_/ </pre>
 <p style="text-align: center; font-size: 20px; font-family: 'Jersey', sans-serif; color: #FA4C14;">PHONE_ERROR</p>
 </div>
 <div style="padding: 40px; font-size: 12px; color: white;">You're on a phone.<br>
 You still won't understand or get into our work the way you would on a computer. So please, don't use your phone.<br><br>
 See you soon :*</div>
`;

function checkWidth() {
  if (window.innerWidth < 1100) {
    console.log("Width less than 1100px.");
    notification.style.display = 'block';
  } else {
    notification.style.display = 'none';
  }
}

function initNotification() {
  if (!document.getElementById('phone-notification')) {
    document.body.appendChild(notification);
    checkWidth();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNotification);
} else {
  initNotification();
}

window.addEventListener('load', checkWidth);
window.addEventListener('resize', checkWidth);

window.addEventListener('orientationchange', checkWidth);

setTimeout(checkWidth, 500);
