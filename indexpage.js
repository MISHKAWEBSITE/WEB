const EMAIL_ADDRESS = "mishka@tuta.com";
const TELEGRAM_USERNAME = "https://ru.wiktionary.org/wiki/%D0%BD%D0%B0%D0%B5%D0%B1%D0%B0%D0%BB%D0%BE%D0%B2%D0%BE";
const TOX_ID = "2800F4E2258D0A56175E40AF2CBAFAC3F43E4867B5C3A06DC638F4553A2E311086340A206E01";

const chars = "×#-_¯—0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";

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
  var elements = document.querySelectorAll("a, button, .LOGBUNAFTER, [data-email-element], [data-contact-element]");
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

function showContactModal() {
  if (isModalActive) return; 
  isModalActive = true;
  
  const overlay = document.createElement('div');
  overlay.className = 'email-modal-overlay';
  
  const modal = document.createElement('div');
  modal.className = 'email-modal contact-modal';
  modal.innerHTML = `
    <div class="email-modal-content">
      <h2>CONTACT_OPTIONS</h2>
      <div class="contact-buttons">
        <button id="emailBtn" class="LOGBUNAFTER">EMAIL</button>
        <button id="telegramBtn" class="LOGBUNAFTER">TELEGRAM</button>
        <button id="toxBtn" class="LOGBUNAFTER">TOX</button>
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
    font-family: 'VT323', monospace;
    display: grid;
    place-items: center;
    font-size: 22px;
    width: 160px;
    height: 30px;
    background: none;
    border: none;
    position: relative;
    color: antiquewhite;
    transition: transform 0.1s ease, background-color 0.1s ease;
    &::after {
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
        font-family: VT323;
        min-width: 300px;
        text-align: center;
        transform: scale(0.9);
        opacity: 0;
        transition: transform 0.4s ease, opacity 0.4s ease;
      }
      
      .contact-modal {
        height: auto;
        padding-bottom: 40px;
      }
      
      .email-modal.visible {
        transform: scale(1);
        opacity: 1;
      }
      
      .email-address {
        font-size: 26px;
        margin-bottom: 25px;
      }
      
      .contact-buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 20px;
      }
      
      .contact-buttons .LOGBUNAFTER {
        margin: 0 auto;
      }
      
      .custom-notification {
        background-color: #010101;
        color: antiquewhite;
        padding: 30px 50px;  /* Это значение паддинга */
        border: 1px solid antiquewhite;
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
  
  document.getElementById('emailBtn').addEventListener('click', function() {
    copyToClipboard(EMAIL_ADDRESS, 'EMAIL_COPIED_SUCCESSFULLY');
    setTimeout(() => {
      closeModal(overlay);
    }, 100); 
  });
  
  document.getElementById('telegramBtn').addEventListener('click', function() {
    copyToClipboard(TELEGRAM_USERNAME, 'TELEGRAM_COPIED_SUCCESSFULLY');
    setTimeout(() => {
      closeModal(overlay);
    }, 100); 
  });
  
  document.getElementById('toxBtn').addEventListener('click', function() {
    copyToClipboard(TOX_ID, 'TOX_ID_COPIED_SUCCESSFULLY');
    setTimeout(() => {
      closeModal(overlay);
    }, 100); 
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

// Modified function to setup the contact button
function setupContactButton() {
  const contactButton = document.querySelector('.LOGBUNAFTER');
  
  if (contactButton) {
    if (contactButton.hasAttribute('href')) {
      contactButton.removeAttribute('href');
    }
    
    contactButton.style.cursor = 'pointer';
    
    contactButton.onclick = function(e) {
      if (e) e.preventDefault();
      showContactModal();
    };
  } else {
    // If button not found, try again in 500ms
    setTimeout(setupContactButton, 500);
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    setupContactButton();
    initAllGlitch(); 
  });
} else {
  // Page already loaded
  setupContactButton();
  initAllGlitch(); 
}





function goToPage(page) {
    window.location.href = page;
}





        const pt_targetPage = "./about.html"; 
        const pt_animationDuration = 1500;
        
        var PageTransitionMorph = (function() {
          'use strict';
          var pt_element = null;
          var pt_canvasDimensions = {};
          var pt_renderedData = [];
          var pt_framesToAnimate = [];
          var pt_myTimeout = null;
          
          function pt_extend(target, source) {
            for (var key in source) {
              if (!(key in target)) {
                target[key] = source[key];
              }
            }
            return target;
          }
          
          function pt_repeat(pattern, count) {
            if (count < 1) return '';
            var result = '';
            while (count > 1) {
                if (count & 1) result += pattern;
                count >>= 1, pattern += pattern;
            }
            return result + pattern;
          }
          
          function pt_replaceAt(string, index, character) {
            return string.substr(0, index) + character + string.substr(index+character.length);
          }
          
          function pt_init(el, canvasSize) {
            pt_element = el;
            pt_canvasDimensions = canvasSize;
          }
          
          function pt_squareOutData(data) {
            var i;
            var pt_renderDimensions = {
              x: 0,
              y: data.length
            };
            for (i = 0; i < data.length; i++) {
              if (data[i].length > pt_renderDimensions.x) {
                pt_renderDimensions.x = data[i].length;
              }
            }
            for (i = 0; i < data.length; i++) {
              if (data[i].length < pt_renderDimensions.x) {
                data[i] = (data[i] + pt_repeat(' ', pt_renderDimensions.x - data[i].length));
              }
            }
            var pt_paddings = {
              x: Math.floor((pt_canvasDimensions.x - pt_renderDimensions.x) / 2),
              y: Math.floor((pt_canvasDimensions.y - pt_renderDimensions.y) / 2)
            }
            for (var i = 0; i < data.length; i++) {
              data[i] = pt_repeat(' ', pt_paddings.x) + data[i] + pt_repeat(' ', pt_paddings.x);
            }
            for (var i = 0; i < pt_canvasDimensions.y; i++) {
              if (i < pt_paddings.y) {
                data.unshift(pt_repeat(' ', pt_canvasDimensions.x));
              } else if (i > (pt_paddings.y + pt_renderDimensions.y)) {
                data.push(pt_repeat(' ', pt_canvasDimensions.x));
              }
            }
            return data;
          }
          
          function pt_getMorphedFrame(data) {
            var pt_firstInLine, pt_lastInLine = null;
            var pt_found = false;
            for (var i = 0; i < data.length; i++) {
              var line = data[i];
              pt_firstInLine = line.search(/\S/);
              if (pt_firstInLine === -1) {
                pt_firstInLine = null;
              }
              for (var j = 0; j < line.length; j++) {
                if (line[j] != ' ') {
                  pt_lastInLine = j;
                }
              }
              if (pt_firstInLine !== null && pt_lastInLine !== null) {
                data = pt_crushLine(data, i, pt_firstInLine, pt_lastInLine);
                pt_found = true;
              }
              pt_firstInLine = null, pt_lastInLine = null;
            }
            if (pt_found) {
              return data;
            } else {
              return false;
            }
          }
          
          function pt_crushLine(data, line, start, end) {
            var pt_centers = {
              x: Math.floor(pt_canvasDimensions.x / 2),
              y: Math.floor(pt_canvasDimensions.y / 2)
            }
            var pt_crushDirection = 1;
            if (line > pt_centers.y) {
              pt_crushDirection = -1;
            }
            var pt_charA = data[line][start];
            var pt_charB = data[line][end];
            data[line] = pt_replaceAt(data[line], start, " ");
            data[line] = pt_replaceAt(data[line], end, " ");
            if (!((end - 1) == (start + 1)) && !(start === end) && !((start + 1) === end)) {
              data[line + pt_crushDirection] = pt_replaceAt(data[line + pt_crushDirection], (start + 1), '+*/\\'.substr(Math.floor(Math.random()*'+*/\\'.length), 1));
              data[line + pt_crushDirection] = pt_replaceAt(data[line + pt_crushDirection], (end - 1), '+*/\\'.substr(Math.floor(Math.random()*'+*/\\'.length), 1));
            } else if ((((start === end) || (start + 1) === end)) && ((line + 1) !== pt_centers.y && (line - 1) !== pt_centers.y && line !== pt_centers.y)) {
              data[line + pt_crushDirection] = pt_replaceAt(data[line + pt_crushDirection], (start), '+*/\\'.substr(Math.floor(Math.random()*'+*/\\'.length), 1));
              data[line + pt_crushDirection] = pt_replaceAt(data[line + pt_crushDirection], (end), '+*/\\'.substr(Math.floor(Math.random()*'+*/\\'.length), 1));
            }
            return data;
          }
          
          function pt_render(data) {
            var pt_ourData = pt_squareOutData(data.slice());
            pt_renderSquareData(pt_ourData);
          }
          
          function pt_renderSquareData(data) {
            pt_element.innerHTML = '';
            for (var i = 0; i < data.length; i++) {
              pt_element.innerHTML = pt_element.innerHTML + data[i] + '\n';
            }
            pt_renderedData = data;
          }
          
          function pt_morph(data) {
            clearTimeout(pt_myTimeout);
            var pt_frameData = pt_prepareFrames(data.slice());
            pt_animateFrames(pt_frameData);
          }
          
          function pt_prepareFrames(data) {
            var pt_deconstructionFrames = [];
            var pt_constructionFrames = [];
            var pt_clonedData = pt_renderedData;
            for (var i = 0; i < 100; i++) {
              var pt_newData = pt_getMorphedFrame(pt_clonedData);
              if (pt_newData === false) {
                break;
              }
              pt_deconstructionFrames.push(pt_newData.slice(0)); 
              pt_clonedData = pt_newData;
            }
            var pt_squareData = pt_squareOutData(data);
            pt_constructionFrames.unshift(pt_squareData.slice(0));
            for (var i = 0; i < 100; i++) {
              var pt_newData = pt_getMorphedFrame(pt_squareData);
              if (pt_newData === false) {
                break;
              }
              pt_constructionFrames.unshift(pt_newData.slice(0));
              pt_squareData = pt_newData;
            }
            return pt_deconstructionFrames.concat(pt_constructionFrames);
          }
          
          function pt_animateFrames(frameData) {
            pt_framesToAnimate = frameData;
            pt_animateFrame();
          }
          
          function pt_animateFrame() {
            pt_myTimeout = setTimeout(function() {
              pt_renderSquareData(pt_framesToAnimate[0]);
              pt_framesToAnimate.shift();
              if (pt_framesToAnimate.length > 0) {
                pt_animateFrame();
              }
            }, 20);
          }
          
          function pt_main(element, canvasSize) {
            if (!element || !canvasSize) {
              console.log("PageTransitionMorph: I need an element and a canvas size");
              return;   
            }
            pt_init(element, canvasSize);
          }
          
          return pt_extend(pt_main, {
            render: pt_render,
            morph: pt_morph
          });
        })();
        
        document.getElementById("AboutPage").addEventListener("click", function(event) {
          event.preventDefault();
          
          sessionStorage.setItem('pageTransition', 'active');
          
          const pt_overlay = document.createElement("div");
          pt_overlay.style.position = "fixed";
          pt_overlay.style.top = "0";
          pt_overlay.style.left = "0";
          pt_overlay.style.width = "100%";
          pt_overlay.style.height = "100%";
          pt_overlay.style.backgroundColor = "#010101";
          pt_overlay.style.zIndex = "9999";
          pt_overlay.style.display = "flex";
          pt_overlay.style.justifyContent = "center";
          pt_overlay.style.alignItems = "center";
          pt_overlay.style.opacity = "0";
          pt_overlay.style.transition = "opacity 100ms ease";
          document.body.appendChild(pt_overlay);
          
          const pt_animationContainer = document.createElement("pre");
          pt_animationContainer.style.color = "antiquewhite";
          pt_animationContainer.style.fontFamily = "monospace";
          pt_animationContainer.style.textAlign = "center";
          pt_animationContainer.style.fontSize = "12px";
          pt_overlay.appendChild(pt_animationContainer);
          
          const pt_asciiArt = [
" _____ _____ _____ _____ _____ _____ ",
"|     |     |   __|  |  |  |  |  _  | ",
"| | | |-   -|__   |     |    -|     | ",
"|_|_|_|_____|_____|__|__|__|__|__|__| ",
  ];
          
          const pt_emptyArt = Array(pt_asciiArt.length).fill(" ".repeat(20));
          
          PageTransitionMorph(pt_animationContainer, {
            x: Math.max(...pt_asciiArt.map(line => line.length)) + 4,
            y: pt_asciiArt.length + 4
          });
          
          setTimeout(() => {
            pt_overlay.style.opacity = "1";
            
            PageTransitionMorph.render(pt_emptyArt);
            
            setTimeout(() => {
              PageTransitionMorph.morph(pt_asciiArt);
              
              setTimeout(() => {
                PageTransitionMorph.morph(pt_emptyArt);
                
                setTimeout(() => {
                  window.location.href = pt_targetPage;
                }, pt_animationDuration);
              }, 800);
            }, 500);
          }, 10);
        });



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
 __    __     __     ______     __  __     __  __     ______    
/\\ "-./  \\   /\\ \\   /\\  ___\\   /\\ \\_\\ \\   /\\ \\/ /    /\\  __ \\   
\\ \\ \\-./\\ \\  \\ \\ \\  \\ \\___  \\  \\ \\  __ \\  \\ \\  _"-.  \\ \\  __ \\  
 \\ \\_\\ \\ \\_\\  \\ \\_\\  \\/\\_____\\  \\ \\_\\ \\_\\  \\ \\_\\ \\_\\  \\ \\_\\ \\_\\ 
  \\/_/  \\/_/   \\/_/   \\/_____/   \\/_/\\/_/   \\/_/\\/_/   \\/_/\\/_/ </pre>
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