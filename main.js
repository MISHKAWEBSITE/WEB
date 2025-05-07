
var AsciiMorph = (function() {
  'use strict';
  var element = null;
  var canvasDimensions = {};
  var renderedData = [];
  var framesToAnimate = [];
  var myTimeout = null;
  function extend(target, source) {
  for (var key in source) {
    if (!(key in target)) {
      target[key] = source[key];
    }
  }
  return target;
  }
  function repeat(pattern, count) {
    if (count < 1) return '';
    var result = '';
    while (count > 1) {
        if (count & 1) result += pattern;
        count >>= 1, pattern += pattern;
    }
    return result + pattern;
  }
  function replaceAt(string, index, character ) {
  return string.substr(0, index) + character + string.substr(index+character.length);
  }
  function init(el, canvasSize) {
  element = el;
  canvasDimensions = canvasSize;
  }
  function squareOutData(data) {
   var i;
  var renderDimensions = {
    x: 0,
    y: data.length
  };
  for( i = 0; i < data.length; i++ ) {
    if( data[i].length > renderDimensions.x) {
      renderDimensions.x = data[i].length
    }
  }
  for( i = 0; i < data.length; i++ ) {
    if( data[i].length < renderDimensions.x) {
      data[i] = (data[i] + repeat(' ', renderDimensions.x - data[i].length ));
    }
  }
  var paddings = {
    x: Math.floor((canvasDimensions.x - renderDimensions.x) / 2),
    y: Math.floor((canvasDimensions.y - renderDimensions.y) / 2)
  }
  for( var i = 0; i < data.length; i++ ) {
    data[i] = repeat(' ', paddings.x) + data[i] + repeat(' ', paddings.x);
  }
  for( var i = 0; i < canvasDimensions.y; i++ ) {
    if( i < paddings.y) {
      data.unshift( repeat(' ', canvasDimensions.x));
    } else if (i > (paddings.y + renderDimensions.y)) {
      data.push( repeat(' ', canvasDimensions.x));
    }
  }
  return data;
  }
  function getMorphedFrame(data) {
  var firstInLine, lastInLine = null;
  var found = false;
  for( var i = 0; i < data.length; i++) {
    var line = data[i];
    firstInLine = line.search(/\S/);
    if( firstInLine === -1) {
      firstInLine = null;
    }
    for( var j = 0; j < line.length; j++) {
      if( line[j] != ' ') {
        lastInLine = j;
      }
    }
    if( firstInLine !== null && lastInLine !== null) {
      data = crushLine(data, i, firstInLine, lastInLine)
      found = true;
    }
    firstInLine = null, lastInLine = null;
  }
  if( found ) {
    return data;
  } else {
    return false;
  }
  }
  function crushLine(data, line, start, end) {
  var centers = {
    x: Math.floor(canvasDimensions.x / 2),
    y: Math.floor(canvasDimensions.y / 2)
  }
  var crushDirection = 1;
  if( line > centers.y ) {
    crushDirection = -1;
  }
  var charA = data[line][start];
  var charB = data[line][end];
  data[line] = replaceAt(data[line], start, " ");
  data[line] = replaceAt(data[line], end, " ");
  if( !((end - 1) == (start + 1)) && !(start === end) && !((start + 1) === end)) {
    data[line + crushDirection] = replaceAt(data[line + crushDirection], (start + 1), '+*/\\'.substr(Math.floor(Math.random()*'+*/\\'.length), 1));
    data[line + crushDirection] = replaceAt(data[line + crushDirection], (end - 1), '+*/\\'.substr(Math.floor(Math.random()*'+*/\\'.length), 1));
  } else if ((((start === end) || (start + 1) === end)) && ((line + 1) !== centers.y && (line - 1) !== centers.y && line !== centers.y)) {
    data[line + crushDirection] = replaceAt(data[line + crushDirection], (start), '+*/\\'.substr(Math.floor(Math.random()*'+*/\\'.length), 1));
    data[line + crushDirection] = replaceAt(data[line + crushDirection], (end), '+*/\\'.substr(Math.floor(Math.random()*'+*/\\'.length), 1));
  }
  return data;
  }
  function render(data) {
  var ourData = squareOutData(data.slice());
  renderSquareData(ourData);
  }
  function renderSquareData(data) {
  element.innerHTML = '';
  for( var i = 0; i < data.length; i++ ) {
    element.innerHTML = element.innerHTML + data[i] + '\n';
  }
  renderedData = data;
  }
  function morph(data) {
  clearTimeout(myTimeout);
  var frameData = prepareFrames(data.slice());
  animateFrames(frameData);
  }
  function prepareFrames(data) {
  var deconstructionFrames = [];
  var constructionFrames = [];
  var clonedData = renderedData
  for(var i = 0; i < 100; i++) {
    var newData = getMorphedFrame(clonedData);
    if( newData === false) {
      break;
    }
    deconstructionFrames.push(newData.slice(0)); 
    clonedData = newData;
  }
  var squareData = squareOutData(data);
  constructionFrames.unshift(squareData.slice(0));
  for( var i = 0; i < 100; i++ ) {
    var newData = getMorphedFrame(squareData);
    if( newData === false) {
      break;
    }
    constructionFrames.unshift(newData.slice(0));
    squareData = newData;
  }
  return deconstructionFrames.concat(constructionFrames)
  }
  function animateFrames(frameData) {
  framesToAnimate = frameData;
  animateFrame();
  }
  function animateFrame() {
  myTimeout = setTimeout(function() {
    renderSquareData(framesToAnimate[0]);
    framesToAnimate.shift();
    if( framesToAnimate.length > 0 ) {
      animateFrame();
    }
  }, 20)
  }
  function main(element, canvasSize) {
  if( !element || !canvasSize ) {
    console.log("sorry, I need an element and a canvas size");
    return;   
  }
  init(element, canvasSize);
  }
  return extend(main, {
  render: render,
  morph: morph
  });
  })();
  var element = document.querySelector('.headerPreMax');
  AsciiMorph(element, {x: 8,y: 8});                       
  var asciis = [
  // [
  // "    ██     ██",
  // "  ██████ ██████",
  // "  ██████ ██████",
  // " █████ ████ ████",
  // "█████████████████",
  // "████████  ███████",
  // "  █████████████",
  // ],
[" __    __     __     ______     __  __     __  __     ______ ",
"/\\ `-./  \\   /\\ \\   /\\  ___\\   /\\ \\_\\ \\   /\\ \\/ /    /\\  __ \\ ",   
"\\ \\ \\-./\\ \\  \\ \\ \\  \\ \\___  \\  \\ \\  __ \\  \\ \\  _`-.  \\ \\  __ \\ ",
" \\ \\_\\ \\ \\_\\  \\ \\_\\  \\/\\_____\\  \\ \\_\\ \\_\\  \\ \\_\\ \\_\\  \\ \\_\\ \\_\\ ",
"  \\/_/  \\/_/   \\/_/   \\/_____/   \\/_/\\/_/   \\/_/\\/_/   \\/_/\\/_/ ",],
 //sub-zero
["              _      __    __        ",
"   ____ ___  (_)____/ /_  / /______ _",
"  / __ `__ \\/ / ___/ __ \\/ //_/ __ `/",
" / / / / / / (__  ) / / / ,< / /_/ / ",
"/_/ /_/ /_/_/____/_/ /_/_/|_|\\__,_/  ",
  ], // slant
["███╗   ███╗██╗███████╗██╗  ██╗██╗  ██╗ █████╗ ",
"████╗ ████║██║██╔════╝██║  ██║██║ ██╔╝██╔══██╗",
"██╔████╔██║██║███████╗███████║█████╔╝ ███████║",
"██║╚██╔╝██║██║╚════██║██╔══██║██╔═██╗ ██╔══██║",
"██║ ╚═╝ ██║██║███████║██║  ██║██║  ██╗██║  ██║",
"╚═╝     ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝",],
// ANSII SHADOW
    [
"   __  _____________ ____ _____  ",
"  /  |/  /  _/ __/ // / //_/ _ | ",
" / /|_/ // /_\\ \\/ _  / ,< / __ | ",
"/_/  /_/___/___/_//_/_/|_/_/ |_| ",
                                          
  ], // small slant
    [
"• ▌ ▄ ·. ▪  .▄▄ ·  ▄ .▄▄ •▄  ▄▄▄· ",
"·██ ▐███▪██ ▐█ ▀. ██▪▐██▌▄▌▪▐█ ▀█ ",
"▐█ ▌▐▌▐█·▐█·▄▀▀▀█▄██▀▐█▐▀▀▄·▄█▀▀█ ",
"██ ██▌▐█▌▐█▌▐█▄▪▐███▌▐▀▐█.█▌▐█ ▪▐▌",
"▀▀  █▪▀▀▀▀▀▀ ▀▀▀▀ ▀▀▀ ··▀  ▀ ▀  ▀ ",
    ], // ELITE
      [
"     _/\\/\\______/\\/\\__/\\/\\/\\/\\____/\\/\\/\\/\\/\\__/\\/\\____/\\/\\__/\\/\\____/\\/\\______/\\/\\_____",
"    _/\\/\\/\\__/\\/\\/\\____/\\/\\____/\\/\\__________/\\/\\____/\\/\\__/\\/\\__/\\/\\______/\\/\\/\\/\\___ ",
"   _/\\/\\/\\/\\/\\/\\/\\____/\\/\\______/\\/\\/\\/\\____/\\/\\/\\/\\/\\/\\__/\\/\\/\\/\\______/\\/\\____/\\/\\_",  
"  _/\\/\\__/\\__/\\/\\____/\\/\\____________/\\/\\__/\\/\\____/\\/\\__/\\/\\__/\\/\\____/\\/\\/\\/\\/\\/\\_   ",
" _/\\/\\______/\\/\\__/\\/\\/\\/\\__/\\/\\/\\/\\/\\____/\\/\\____/\\/\\__/\\/\\____/\\/\\__/\\/\\____/\\/\\_    ",
"__________________________________________________________________________________     ",
    ], //Ticks Slant
      [
"   \\  | _ _|   __|  |  |  |  /    \\",
"  |\\/ |   |  \\__ \\  __ |  . <    _ \\",
" _|  _| ___| ____/ _| _| _|\\_\\ _/  _\\",
    ], // small shadow
      [
".        :   ::: .::::::.   ::   .:   :::  .    :::.      ",
";;,.    ;;;  ;;;;;;`    `  ,;;   ;;,  ;;; .;;,. ;;`;;     ",
"[[[[, ,[[[[, [[['[==/[[[[,,[[[,,,[[[  [[[[[/'  ,[[ '[[,   ",
"$$$$$$$$`$$$ $$$  '''    $`$$$```$$$ _$$$$,   c$$$cc$$$c  ",
"888 Y88` 888o888 88b    dP 888   `88o`888`88o, 888   888  ",
"MMM  M'  `MMMMMM  `YMmMY`  MMM    YMM MMM `MMP`YMM   \\`\\``",                                                     
    ], // cosmike extended
      [
" ___ __ __    ________  ______   ___   ___   ___   ___   ________ ",
"/__//_//_/\\  /_______/\\/_____/\\ /__/\\ /__/\\ /___/\\/__/\\ /_______/\\ ",   
"\\::\\| \\| \\ \\ \\__.::._\\/\\::::_\\/_\\::\\ \\\\  \\ \\\\::.\\ \\\\ \\ \\\\::: _  \\ \\ ",  
" \\:.      \\ \\   \\::\\ \\  \\:\\/___/\\\\::\\/_\\ .\\ \\\\:: \\/_) \\ \\\\::(_)  \\ \\ ", 
"  \\:.\\-/\\  \\ \\  _\\::\\ \\__\\_::._\\:\\\\:: ___::\\ \\\\:. __  ( ( \\:: __  \\ \\ ",
"   \\. \\  \\  \\ \\/__\\::\\__/\\ /____\\:\\\\: \\ \\\\::\\ \\\\: \\ )  \\ \\ \\:.\\ \\  \\ \\ ",
"    \\__\\/ \\__\\/\\________\\/ \_____\\/ \\__\\/ \\::\\/ \\__\\/\\v__\\/  \\__\\/\\__\\/ ",
  ], // swamp land
    [
"    ___       ___       ___       ___       ___       ___ ",
"   /\\__\\     /\\  \\     /\\  \\     /\\__\\     /\\__\\     /\\  \\ ",
"  /::L_L_   _\\:\\  \\   /::\\  \\   /:/__/_   /:/ _/_   /::\\  \\ ",
" /:/L:\\__\\ /\\/::\\__\\ /\\:\\:\\__\\ /::\\/\\__\\ /::-`\\__\\ /::\\:\\__\\ ",
" \\/_/:/  / \\::/\\/__/ \\:\\:\\/__/ \\/\\::/  / \;:;-`,-`` \\/\\::/  / ",
"   /:/  /   \\:\\__\\    \\::/  /    /:/  /   |:|  |     /:/  / ",
"   \\/__/     \\/__/     \\/__/     \\/__/     \\|__|     \\/__/ ",
  ], // small isometric
    [
"__/\\\\\\\\____________/\\\\\\\\__/\\\\\\\\\\\\\\\\\\\\\\_____/\\\\\\\\\\\\\\\\\\\\\\____/\\\\\\________/\\\\\\__/\\\\\\________/\\\\\\_____/\\\\\\\\\\\\\\\\\\____ ",
" _\\/\\\\\\\\\\\\________/\\\\\\\\\\\\_\\/////\\\\\\///____/\\\\\\/////////\\\\\\_\\/\\\\\\_______\\/\\\\\\_\\/\\\\\\_____/\\\\\\//____/\\\\\\\\\\\\\\\\\\\\\\\\\\__ ",
"  _\\/\\\\\\//\\\\\\____/\\\\\\//\\\\\\_____\\/\\\\\\______\\//\\\\\\______\\///__\\/\\\\\\_______\\/\\\\\\_\\/\\\\\\__/\\\\\\//______/\\\\\\/////////\\\\\\_ ",
"   _\\/\\\\\\\\///\\\\\\/\\\\\\/_\\/\\\\\\_____\\/\\\\\\_______\\////\\\\\\_________\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_\\/\\\\\\\\\\\\//\\\\\\_____\\/\\\\\\_______\\/\\\\\\_ ",
"    _\\/\\\\\\__\\///\\\\\\/___\\/\\\\\\_____\\/\\\\\\__________\\////\\\\\\______\\/\\\\\\/////////\\\\\\_\\/\\\\\\//_\\//\\\\\\____\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_ ",
"     _\\/\\\\\\____\\///_____\\/\\\\\\_____\\/\\\\\\_____________\\////\\\\\\___\\/\\\\\\_______\\/\\\\\\_\\/\\\\\\____\\//\\\\\\___\\/\\\\\\/////////\\\\\\_ ",
"      _\\/\\\\\\_____________\\/\\\\\\_____\\/\\\\\\______/\\\\\\______\\//\\\\\\__\\/\\\\\\_______\\/\\\\\\_\/\\\\\\_____\\//\\\\\\__\\/\\\\\\_______\\/\\\\\\_ ",
"       _\\/\\\\\\_____________\\/\\\\\\__/\\\\\\\\\\\\\\\\\\\\\\_\\///\\\\\\\\\\\\\\\\\\\\\\/___\\/\\\\\\_______\\/\\\\\\_\\/\\\\\\______\\//\\\\\\_\\/\\\\\\_______\\/\\\\\\_ ",
"        _\\///______________\\///__\\///////////____\\///////////_____\\///________\\///__\\///________\\///__\\///________\\///__ ",
  ], // slant relief
    [                                     
" _____ _____ _____ _____ _____ _____ ",
"|     |     |   __|  |  |  |  |  _  | ",
"| | | |-   -|__   |     |    -|     | ",
"|_|_|_|_____|_____|__|__|__|__|__|__| ",
  ], // rectangles
    [
"   _____  .___  _________ ___ ___  ____  __.  _____  ",
"  /     \\ |   |/   _____//   |   \\|    |/ _| /  _  \\ ",
" /  \\ /  \\|   |\\_____  \\/    ~    \\      <  /  /_\\  \\ ",
"/    Y    \\   |/        \\    Y    /    |  \\/    |    \\ ",
"\\____|__  /___/_______  /\\___|_  /|____|__ \\____|__  / ",
"        \\/            \\/       \\/         \\/       \\/ ",
  ], // graffiti
    [
" __       __  ______   ______   __    __  __    __   ______ ",
"|  \\     /  \\|      \\ /      \\ |  \\  |  \\|  \\  /  \\ /      \\ ",
"| $$\\   /  $$ \\$$$$$$|  $$$$$$\\| $$  | $$| $$ /  $$|  $$$$$$\\ ",
"| $$$\\ /  $$$  | $$  | $$___\\$$| $$__| $$| $$/  $$ | $$__| $$ ",
"| $$$$\\  $$$$  | $$   \\$$    \\ | $$    $$| $$  $$  | $$    $$ ",
"| $$\\$$ $$ $$  | $$   _\\$$$$$$\\| $$$$$$$$| $$$$$\\  | $$$$$$$$ ",
"| $$ \\$$$| $$ _| $$_ |  \\__| $$| $$  | $$| $$ \\$$\\ | $$  | $$ ",
"| $$  \\$ | $$|   $$ \\ \\$$    $$| $$  | $$| $$  \\$$\\| $$  | $$ ",
" \\$$      \\$$ \\$$$$$$  \\$$$$$$  \\$$   \\$$ \\$$   \\$$ \\$$   \\$$ ",
    ], // big money se
    [
"   _______    ________  ________  _______   ____ ___  _______  ",
"  ╱       ╲╲ ╱        ╲╱        ╲╱    ╱  ╲╲╱    ╱   ╲╱       ╲╲ ",
" ╱        ╱╱_╱       ╱╱        _╱        ╱╱         ╱        ╱╱ ",
"╱         ╱╱         ╱-        ╱         ╱╱       _╱         ╱ ",
"╲__╱__╱__╱ ╲╲_______╱╲_______╱╱╲___╱____╱╲╲___╱___╱╲___╱____╱ ",
    ], // babyface leet
    [
"         ______  ____    __  __  __  __   ______ ",
" /'\\_/`\\/\\__  _\\/\\  _`\\ /\\ \\/\\ \\/\\ \\/\\ \\ /\\  _  \\ ",  
"/\\      \\/_/\\ \\/\\ \\,\\L\\_\\ \\ \\_\\ \\ \\ \\/'/'\\ \\ \\L\\ \\ ", 
"\\ \\ \\__\\ \\ \\ \\ \\ \\/_\\__ \\\\ \\  _  \\ \\ , <  \\ \\  __ \\ ",
" \\ \\ \\_/\\ \\ \\_\\ \\__/\\ \\L\\ \\ \\ \\ \\ \\ \\ \\\\`\\ \\ \\ \\/\\ \\ ",
"  \\ \\_\\\\ \\_\\/\\_____\\ `\\____\\ \\_\\ \\_\\ \\_\\ \\_\\\\ \\_\\ \\_\\ ",
"   \\/_/ \\/_/\\/_____/\\/_____/\\/_/\\/_/\\/_/\\/_/ \\/_/\\/_/ ",
                                                     
    ], // Larry 3D
  ];
  AsciiMorph.render(asciis[0]);
  var currentIndex = 2;
  setTimeout(function() {
  AsciiMorph.morph(asciis[1]);
  }, 1000);
  setInterval(function() {
  AsciiMorph.morph(asciis[currentIndex]);
  currentIndex++;
  currentIndex%= asciis.length;
  }, 3000);




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




const ascii = ".:-=+*#%@";
const myCanvas = document.createElement("canvas");
myCanvas.width = 32;
myCanvas.height = 48;
const myCtx = myCanvas.getContext("2d");
const asciicontainer = document.querySelector(".ascii");

const map = (t, o, e, a, x) => ((t - e) / (o - e)) * (a - x) + x;
const lerp = (t, o, e) => o + (e - o) * t;
const map_table = new Array(255).fill(1).map((t, o) => Math.ceil(map(o, 255, 0, 8, 0)));
const line = (t, o, e, a) => {
  myCtx.beginPath();
  let x = myCtx.createLinearGradient(t, o, e, a);
  x.addColorStop(0, "rgba(255, 255, 255, 0.75)");
  x.addColorStop(0.5, "rgba(255, 255, 255, 0.35)");
  x.addColorStop(1, "rgba(255, 255, 255, 0.12)");
  myCtx.strokeStyle = x;
  myCtx.moveTo(t, o);
  myCtx.lineTo(e, a);
  myCtx.stroke();
  myCtx.closePath();
};

const lastAsciiValues = new Array(myCanvas.width * myCanvas.height).fill('');
const asciiElements = [];

function initAsciiContainer() {
  asciicontainer.innerHTML = '';
  for (let y = 0; y < myCanvas.height; y++) {
    const rowDiv = document.createElement('div');
    asciicontainer.appendChild(rowDiv);
    
    const rowElements = [];
    for (let x = 0; x < myCanvas.width; x++) {
      const span = document.createElement('span');
      rowDiv.appendChild(span);
      rowElements.push(span);
    }
    asciiElements.push(rowElements);
  }
}

const updateAsciiOutput = () => {
  const imageData = myCtx.getImageData(0, 0, myCanvas.width, myCanvas.height).data;
  
  for (let y = 0; y < myCanvas.height; y++) {
    for (let x = 0; x < myCanvas.width; x++) {
      const pixelIndex = (y * myCanvas.width + x) * 4;
      const brightness = imageData[pixelIndex];
      const asciiIndex = map_table[brightness];
      const char = ascii[asciiIndex];
      
      const index = y * myCanvas.width + x;
      if (lastAsciiValues[index] !== char) {
        lastAsciiValues[index] = char;
        const element = asciiElements[y][x];
        
        element.textContent = char;
        if (char === ascii[0]) {
          element.style.color = "#0a0a0a";
        } else {
          element.style.color = "";
        }
      }
    }
  }
};



const randomBox = () => ({
  x: Math.floor(10 * Math.random()) + 7,
  y: Math.floor(15 * Math.random()) + 7,
  sx: 0,
  sy: 0,
  w: 6,
  h: 10,
  progress: 0
});

let box = randomBox();
box.sx = box.x;
box.sy = box.y;
let nextPos = randomBox();
let tick = 0;
let mouseState = false;
let frameCount = 0;
const asciiUpdateFrequency = 3;

let lastFrameTime = 0;
const targetFPS = 120;
const frameInterval = 1000 / targetFPS;

const loop = (timestamp) => {
  const elapsed = timestamp - lastFrameTime;
  if (elapsed < frameInterval) {
    requestAnimationFrame(loop);
    return;
  }
  lastFrameTime = timestamp - (elapsed % frameInterval);
  
  tick += 0.025;
  
  myCtx.fillStyle = "#000";
  myCtx.fillRect(0, 0, myCanvas.width, myCanvas.height);
  
  myCtx.fillStyle = "#f4f4f4";
  myCtx.fillRect(box.x, box.y, box.w, box.h);
  
  line(box.x, box.y, 0, 0);
  line(box.x + box.w, box.y, myCanvas.width, 0);
  line(box.x, box.y + box.h, 0, myCanvas.height);
  line(box.x + box.w, box.y + box.h, myCanvas.width, myCanvas.height);
  
  myCtx.beginPath();
  let t = box.x + box.w / 2;
  let o = box.y + box.h / 2;
  let e = myCtx.createRadialGradient(t, o, 5, t, o, 20);
  e.addColorStop(0, "rgba(255, 255, 255, 0.5)");
  e.addColorStop(0.5, "rgba(0, 0, 0, 0)");
  e.addColorStop(1, "rgba(0, 0, 0, 0)");
  myCtx.fillStyle = e;
  myCtx.arc(t, o, 6 + 2.5 * Math.acos((Math.sin(tick) * Math.PI) / 4), 0, 2 * Math.PI);
  myCtx.fill();
  myCtx.closePath();
  
  if (!mouseState) {
    if (box.progress < 0.99) {
      box.progress += 0.005;
      box.x = lerp(box.progress, box.sx, nextPos.x);
      box.y = lerp(box.progress, box.sy, nextPos.y);
    } else {
      box = Object.assign({}, nextPos);
      box.sx = box.x;
      box.sy = box.y;
      nextPos = randomBox();
      box.progress = 0;
    }
  }
  
  frameCount++;
  if (frameCount % asciiUpdateFrequency === 0) {
    updateAsciiOutput();
  }
  
  requestAnimationFrame(loop);
};

initAsciiContainer();

requestAnimationFrame(loop);

window.addEventListener("mouseover", () => {
  mouseState = true;
});

window.addEventListener("mouseout", () => {
  mouseState = false;
});

window.addEventListener("mousemove", (t) => {
  if (mouseState) {
    box.x = map(t.clientX, window.innerWidth, 0, myCanvas.width, 0) - box.w / 2;
    box.y = map(t.clientY, window.innerHeight, 0, myCanvas.height, 0) - box.h / 2;
  }
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



const container = document.getElementById("cube-container");
    
const SCREEN_WIDTH = 20;
const SCREEN_HEIGHT = 20;
let x = SCREEN_WIDTH * SCREEN_HEIGHT;

let rotX = 0;
let rotY = 0;
let rotZ = 0;

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

const cubeSize = 3.6;

const vertices = [
  [-cubeSize, -cubeSize, -cubeSize],
  [cubeSize, -cubeSize, -cubeSize],
  [cubeSize, cubeSize, -cubeSize],
  [-cubeSize, cubeSize, -cubeSize],
  [-cubeSize, -cubeSize, cubeSize],
  [cubeSize, -cubeSize, cubeSize],
  [cubeSize, cubeSize, cubeSize],
  [-cubeSize, cubeSize, cubeSize]
];

const edges = [
  [0, 1], [1, 2], [2, 3], [3, 0], 
  [4, 5], [5, 6], [6, 7], [7, 4], 
  [0, 4], [1, 5], [2, 6], [3, 7]
];

function renderFrame() {
  const buffer = new Array(x).fill(' ');
  for (let i = 0; i < SCREEN_HEIGHT; i++) {
    buffer[(i + 1) * SCREEN_WIDTH - 1] = '\n';
  }
  
  const zBuffer = new Array(x).fill(-Infinity);
  
  // Calculate rotation matrices
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);
  const cosZ = Math.cos(rotZ);
  const sinZ = Math.sin(rotZ);
  
  const transformedVertices = vertices.map(v => {
    let [x, y, z] = v;
    
    let newY = y * cosX - z * sinX;
    let newZ = y * sinX + z * cosX;
    y = newY;
    z = newZ;
    
    let newX = x * cosY + z * sinY;
    newZ = -x * sinY + z * cosY;
    x = newX;
    z = newZ;
    
    newX = x * cosZ - y * sinZ;
    newY = x * sinZ + y * cosZ;
    x = newX;
    y = newY;
    
    z += 15;
    
    return [x, y, z];
  });
  
  for (const [i, j] of edges) {
    const [x1, y1, z1] = transformedVertices[i];
    const [x2, y2, z2] = transformedVertices[j];
    
    if (z1 <= 0 || z2 <= 0) continue;
    
    const scale = 20;
    const screenX1 = Math.round(SCREEN_WIDTH / 2 + x1 * scale / z1);
    const screenY1 = Math.round(SCREEN_HEIGHT / 2 + y1 * scale / z1);
    const screenX2 = Math.round(SCREEN_WIDTH / 2 + x2 * scale / z2);
    const screenY2 = Math.round(SCREEN_HEIGHT / 2 + y2 * scale / z2);
    
    drawLine(screenX1, screenY1, z1, screenX2, screenY2, z2, buffer, zBuffer);
  }
  
  container.innerHTML = buffer.join("");
}

function drawLine(x1, y1, z1, x2, y2, z2, buffer, zBuffer) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;
  
  const dz = z2 - z1;
  
  let x = x1;
  let y = y1;
  let step = 0;
  
  while (true) {
    // Only draw if in bounds
    if (x >= 0 && x < SCREEN_WIDTH - 1 && y >= 0 && y < SCREEN_HEIGHT) {
      const pos = x + SCREEN_WIDTH * y;
      
      const t = (dx > dy) ? Math.abs(x - x1) / dx : Math.abs(y - y1) / dy;
      const currentZ = z1 + t * dz;
      
      if (currentZ > zBuffer[pos]) {
        zBuffer[pos] = currentZ;
        
        buffer[pos] = "#";
      }
    }
    
    if (x === x2 && y === y2) break;
    
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
    
    step++;
    if (step > 2000) break;
  }
}

container.addEventListener('mousedown', (e) => {
  isDragging = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  pauseAnimation();
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaX = e.clientX - lastMouseX;
    const deltaY = e.clientY - lastMouseY;
    
    rotY += deltaX * 0.005;
    rotX += deltaY * 0.005;
    
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    
    renderFrame();
  }
});

document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    resumeAnimation();
  }
});

container.addEventListener('touchstart', (e) => {
  isDragging = true;
  lastMouseX = e.touches[0].clientX;
  lastMouseY = e.touches[0].clientY;
  pauseAnimation();
  e.preventDefault();
});

document.addEventListener('touchmove', (e) => {
  if (isDragging) {
    const deltaX = e.touches[0].clientX - lastMouseX;
    const deltaY = e.touches[0].clientY - lastMouseY;
    
    rotY += deltaX * 0.005;
    rotX += deltaY * 0.005;
    
    lastMouseX = e.touches[0].clientX;
    lastMouseY = e.touches[0].clientY;
    
    renderFrame();
    e.preventDefault();
  }
});

document.addEventListener('touchend', () => {
  if (isDragging) {
    isDragging = false;
    resumeAnimation();
  }
});

let animationId = null;

function animate() {
  rotX += 0.005;
  rotY += 0.01;
  rotZ += 0.003;
  renderFrame();
  animationId = requestAnimationFrame(animate);
}

function pauseAnimation() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}

function resumeAnimation() {
  if (animationId === null) {
    animationId = requestAnimationFrame(animate);
  }
}

animate();




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


















(function() {
  const MISHKA_ANIMATION = {
    TAU: Math.PI * 2,
    
    terminal: null,
    terminalId: 'terminal',
    cols: 0,
    rows: 0,
    grid: [],
    frameCount: Math.floor(Math.random() * 1000),
    animationFrameId: null,
    isRunning: false,
    
    init: function() {
      this.terminal = document.getElementById(this.terminalId);
      
      if (!this.terminal) {
        console.error('No #terminal found');
        return this;
      }
      
      this.addTestChar();
      this.initializeTerminal();
      
      window.addEventListener('resize', () => {
        this.initializeTerminal();
      });
      
      this.terminal.addEventListener('mouseenter', () => {
        this.start();
      });
      
      this.terminal.addEventListener('mouseleave', () => {
        this.stop();
      });
      
      // Рендерим начальный рандомный кадр без запуска анимации
      this.renderRandomFrame();
      
      return this;
    },
    
    addTestChar: function() {
      const oldTest = document.getElementById('mishka-test-char');
      if (oldTest) oldTest.remove();
      
      const testChar = document.createElement('span');
      testChar.id = 'mishka-test-char';
      testChar.innerHTML = 'M';
      testChar.style.visibility = 'hidden';
      testChar.style.position = 'absolute';
      testChar.style.fontFamily = getComputedStyle(this.terminal).fontFamily;
      testChar.style.fontSize = getComputedStyle(this.terminal).fontSize;
      testChar.style.fontWeight = getComputedStyle(this.terminal).fontWeight;
      testChar.style.lineHeight = getComputedStyle(this.terminal).lineHeight;
      testChar.style.whiteSpace = 'pre';
      
      document.body.appendChild(testChar);
      this.charWidth = testChar.getBoundingClientRect().width;
      testChar.remove();
    },
    
    initializeTerminal: function() {
      if (!this.terminal) return;
      
      const style = getComputedStyle(this.terminal);
      const paddingLeft = parseFloat(style.paddingLeft) || 0;
      const paddingRight = parseFloat(style.paddingRight) || 0;
      const paddingTop = parseFloat(style.paddingTop) || 0;
      const paddingBottom = parseFloat(style.paddingBottom) || 0;
      const borderLeft = parseFloat(style.borderLeftWidth) || 0;
      const borderRight = parseFloat(style.borderRightWidth) || 0;
      const borderTop = parseFloat(style.borderTopWidth) || 0;
      const borderBottom = parseFloat(style.borderBottomWidth) || 0;
      
      const availableWidth = this.terminal.clientWidth - paddingLeft - paddingRight - borderLeft - borderRight;
      const availableHeight = this.terminal.clientHeight - paddingTop - paddingBottom - borderTop - borderBottom;
      
      const fontSize = parseFloat(style.fontSize);
      const lineHeight = parseFloat(style.lineHeight) || fontSize;
      
      const charWidth = this.charWidth || fontSize * 0.6;
      
      this.cols = Math.floor(availableWidth / charWidth) + 1;
      this.rows = Math.floor(availableHeight / lineHeight);
      
      this.cols = Math.min(this.cols, 200);
      this.rows = Math.min(this.rows, 50);
      
      this.grid = [];
      for (let y = 0; y < this.rows; y++) {
        let row = [];
        for (let x = 0; x < this.cols; x++) {
          row.push(' ');
        }
        this.grid.push(row);
      }
      
      this.renderRandomFrame();
    },
    
    renderGrid: function() {
      if (!this.terminal) return;
      
      let output = '';
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
          output += this.grid[y][x];
        }
        if (y < this.rows - 1) {
          output += '\n';
        }
      }
      this.terminal.textContent = output;
    },
    
    // Новый метод для отрисовки рандомного кадра
    renderRandomFrame: function() {
      if (!this.terminal) return;
      
      const context = {
        frame: this.frameCount,
        cols: this.cols,
        rows: this.rows
      };
      
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
          const coord = {
            x: x,
            y: y,
            index: y * this.cols + x
          };
          
          const char = this.main(coord, context);
          this.grid[y][x] = (char === undefined || char === null) ? ' ' : char;
        }
      }
      
      this.renderGrid();
    },
    
    main: function(coord, context) {
      const a = context.frame * 0.02;
      const f = Math.floor((1 - Math.cos(a)) * 10) + 1;
      const g = Math.floor(a / this.TAU) % 10 + 1;
      const i = coord.index % (coord.y * g + 1) % (f % context.cols);
      
      return "MISHKA"[i];
    },
    
    animate: function() {
      if (!this.terminal) return;
      
      this.frameCount++;
      
      const context = {
        frame: this.frameCount,
        cols: this.cols,
        rows: this.rows
      };
      
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.cols; x++) {
          const coord = {
            x: x,
            y: y,
            index: y * this.cols + x
          };
          
          const char = this.main(coord, context);
          this.grid[y][x] = (char === undefined || char === null) ? ' ' : char;
        }
      }
      
      this.renderGrid();
      
      if (this.isRunning) {
        this.animationFrameId = requestAnimationFrame(() => this.animate());
      }
    },
    
    start: function() {
      if (!this.isRunning && this.terminal) {
        this.isRunning = true;
        this.animate();
      }
      return this;
    },
    
    stop: function() {
      this.isRunning = false;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
      return this;
    },
    
    destroy: function() {
      this.stop();
      
      window.removeEventListener('resize', this.initializeTerminal);
      
      if (this.terminal) {
        this.terminal.removeEventListener('mouseenter', this.start);
        this.terminal.removeEventListener('mouseleave', this.stop);
        this.terminal.textContent = '';
      }
      
      return this;
    }
  };
  
  window.MISHKA_ANIMATION = {
    init: function() {
      return MISHKA_ANIMATION.init();
    },
    start: function() {
      return MISHKA_ANIMATION.start();
    },
    stop: function() {
      return MISHKA_ANIMATION.stop();
    },
    destroy: function() {
      return MISHKA_ANIMATION.destroy();
    }
  };
  
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    MISHKA_ANIMATION.init();
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      MISHKA_ANIMATION.init();
    });
  }
})();






















  (function() {
    const PROJECTBOX_CONFIG = {
      baseWidth: 190,
      baseHeight: 140,
      spacingX: 50,  
      spacingY: 40, 
      cursorInfluenceRadius: 260,
      maxRepulsion: 20,
      pixelSize: 10
    };
    
    const PROJECTBOX_DATA = [
      { title: "EXECUTIVE OPS", date: "they love us", content: "Operational support, data control, digital concealment" },
      { title: "LOCAL INFRASTRUCTURE", date: "most of us live here", content: "Threat mitigation, infrastructure testing, conflict resolution" },
      { title: "EU ZONE", date: "others of us live here", content: "Compliance stress-testing, red team scenarios, access audits" },
      { title: "ASIA PARTNERSHIPS", date: "we like them, cool guys", content: "Endpoint defense, surveillance analysis, threat surface reduction" },
      { title: "OPEN SOURCE SECURITY", date: "hi, Richard", content: "Security audits, backdoor hunting, patch review" },
      { title: "FINANCIAL SYSTEMS", date: "Q1/2024", content: "Web-facing exploit simulation, wallet security, API resilience" },
      { title: "RESEARCH NETWORKS", date: "N/a", content: "Airgap testing, software sandboxing, opsec training" },
      { title: "FOSS MAINTENANCE", date: "N/a", content: "Contributor verification, supply chain scanning, CI/CD watchdogs" },
      { title: "STATE-LEVEL", date: "N/a", content: "Fuzzing, signal exposure mapping, hardware interception testing" },
      { title: "VENDOR SECURITY", date: "N/a", content: "Pipeline integrity checks, access audits, delivery chain stress" },
      { title: "CLOUD ARCHITECTURE", date: "N/a", content: "Isolation validation, metadata leakage checks, IAM hardening" },
      { title: "SAAS PRODUCTS", date: "N/a", content: "Auth flow misuses, tenant bleedover, uptime-exploit balancing" },
    ];

    const PROJECTBOX_STATE = {
      boxes: [],
      containerWidth: 0,
      containerHeight: 0,
      numX: 0,
      numY: 0,
      marginX: 0,
      marginY: 0,
      mouseX: 0,
      mouseY: 0,
      lastMouseX: 0,
      lastMouseY: 0,
      mouseSpeed: 0
    };
    
    function projectboxInit() {
      const container = document.getElementById('projectbox-container');
      if (!container) return;
      
      PROJECTBOX_STATE.containerWidth = container.clientWidth;
      PROJECTBOX_STATE.containerHeight = container.clientHeight;
      
      for (let j = 0; j < 3; j++) {  
        for (let i = 0; i < 4; i++) {  
          const box = document.createElement('div');
          box.className = 'projectbox-card';
          
          const dataIndex = (i + j * 4) % PROJECTBOX_DATA.length;
          const card = PROJECTBOX_DATA[dataIndex];
          
          box.innerHTML = `
            <div class="projectbox-title">${card.title}</div>
            <div class="projectbox-date">${card.date}</div>
            <div class="projectbox-content">${card.content}</div>
            <div class="projectbox-position">pos: ${i}×${j}</div>
          `;
          
          container.appendChild(box);
          
          PROJECTBOX_STATE.boxes.push({
            element: box,
            i: i,
            j: j
          });
        }
      }
    }
    
    function projectboxUpdateBoxes() {
      const dx = PROJECTBOX_STATE.mouseX - PROJECTBOX_STATE.lastMouseX;
      const dy = PROJECTBOX_STATE.mouseY - PROJECTBOX_STATE.lastMouseY;
      PROJECTBOX_STATE.mouseSpeed = Math.sqrt(dx*dx + dy*dy);
      PROJECTBOX_STATE.mouseSpeed = Math.min(PROJECTBOX_STATE.mouseSpeed, 50);
      
      PROJECTBOX_STATE.lastMouseX = PROJECTBOX_STATE.mouseX;
      PROJECTBOX_STATE.lastMouseY = PROJECTBOX_STATE.mouseY;
      
      PROJECTBOX_STATE.boxes.forEach(box => {
        if (!box.velocity) {
          box.velocity = { x: 0, y: 0 };
          box.targetX = 0;
          box.targetY = 0;
          box.currentX = 0;
          box.currentY = 0;
        }
        
        const { element, i, j, velocity, currentX, currentY } = box;
        
        const rect = element.getBoundingClientRect();
        const containerRect = document.getElementById('projectbox-container').getBoundingClientRect();
        const centerX = rect.left - containerRect.left + rect.width / 2;
        const centerY = rect.top - containerRect.top + rect.height / 2;
        
        const dx = PROJECTBOX_STATE.mouseX - centerX;
        const dy = PROJECTBOX_STATE.mouseY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let targetX = 0;
        let targetY = 0;
        
        if (distance < PROJECTBOX_CONFIG.cursorInfluenceRadius && distance > 0) {
          const nx = -dx / distance;
          const ny = -dy / distance;
          
          const speedFactor = 1 + PROJECTBOX_STATE.mouseSpeed / 50;
          const strength = PROJECTBOX_CONFIG.maxRepulsion * (1 - distance / PROJECTBOX_CONFIG.cursorInfluenceRadius) * speedFactor;
          
          targetX = Math.round(nx * strength / PROJECTBOX_CONFIG.pixelSize) * PROJECTBOX_CONFIG.pixelSize;
          targetY = Math.round(ny * strength / PROJECTBOX_CONFIG.pixelSize) * PROJECTBOX_CONFIG.pixelSize;
          
          box.targetX = targetX;
          box.targetY = targetY;
        } else {
          targetX = 0;
          targetY = 0;
          
          if (Math.abs(box.currentX) < 4 && Math.abs(velocity.x) > 0.5) {
            targetX = -Math.sign(velocity.x) * 4;
          }
          
          if (Math.abs(box.currentY) < 4 && Math.abs(velocity.y) > 0.5) {
            targetY = -Math.sign(velocity.y) * 4;
          }
        }
        
        const spring = 0.2;  
        const damping = 0.7;
        
        const ax = (targetX - box.currentX) * spring;
        const ay = (targetY - box.currentY) * spring;
        
        velocity.x = velocity.x * damping + ax;
        velocity.y = velocity.y * damping + ay;
        
        box.currentX += velocity.x;
        box.currentY += velocity.y;
        
        const pixelX = Math.round(box.currentX / 2) * 2;
        const pixelY = Math.round(box.currentY / 2) * 2;
        
        element.style.transform = `translate(${pixelX}px, ${pixelY}px)`;
        
        const positionDiv = element.querySelector('.projectbox-position');
        positionDiv.textContent = `pos: ${i}×${j}`;
      });
      
      requestAnimationFrame(projectboxUpdateBoxes);
    }
    
    function projectboxHandleMouseMove(event) {
      const container = document.getElementById('projectbox-container');
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      PROJECTBOX_STATE.mouseX = event.clientX - rect.left;
      PROJECTBOX_STATE.mouseY = event.clientY - rect.top;
    }
    
    function projectboxHandleResize() {
      const container = document.getElementById('projectbox-container');
      if (!container) return;
      
      PROJECTBOX_STATE.boxes.forEach(box => box.element.remove());
      PROJECTBOX_STATE.boxes = [];
      
      projectboxInit();
    }
    
    function projectboxSetupEventListeners() {
      document.addEventListener('mousemove', projectboxHandleMouseMove);
      window.addEventListener('resize', projectboxHandleResize);
    }
    
    function projectboxStart() {
      projectboxInit();
      projectboxSetupEventListeners();
      projectboxUpdateBoxes();
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', projectboxStart);
    } else {
      projectboxStart();
    }
  })();









(function(window, document) {
    'use strict';
    
    window.SlimeMoldNamespace = window.SlimeMoldNamespace || {};
    
    const v2 = {
        vec2: (x, y) => ({ x, y }),
        add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y }),
        addN: (a, n) => ({ x: a.x + n, y: a.y + n }),
        mulN: (a, n) => ({ x: a.x * n, y: a.y * n }),
        rot: (v, angle) => ({
            x: v.x * Math.cos(angle) - v.y * Math.sin(angle),
            y: v.x * Math.sin(angle) + v.y * Math.cos(angle)
        }),
        floor: (v) => ({ x: Math.floor(v.x), y: Math.floor(v.y) })
    };

    const WIDTH = 400;
    const HEIGHT = 400;
    const NUM_AGENTS = 1500;
    const DECAY = 0.9;
    const MIN_CHEM = 0.0001;

    const SENS_ANGLE = 45 * Math.PI / 180;
    const SENS_DIST = 9;
    const AGT_SPEED = 1;
    const AGT_ANGLE = 45 * Math.PI / 180;
    const DEPOSIT = 1;

    const TEXTURE = [
        "  ``^@",
        " ..„v0",
    ];
    const OOB = ' ';

    const R = Math.min(WIDTH, HEIGHT)/2;

    function bounded(vec) {
        return ((vec.x-R)**2 + (vec.y-R)**2 <= R**2);
    }

    function blur(row, col, data) {
        let sum = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const val = data[(row + dy) * HEIGHT + (col + dx)] || 0;
                sum += val;
            }
        }
        return sum / 9;
    }

    function randCircle() {
        const r = Math.sqrt(Math.random());
        const theta = Math.random() * 2 * Math.PI;
        return {
            x: r * Math.cos(theta),
            y: r * Math.sin(theta)
        };
    }

    class Agent {
        constructor(pos, dir) {
            this.pos = pos;
            this.dir = dir;
            this.scatter = false;
        }

        sense(m, chem) {
            const senseVec = v2.mulN(v2.rot(this.dir, m * SENS_ANGLE), SENS_DIST);
            const pos = v2.floor(v2.add(this.pos, senseVec));
            if (!bounded(pos))
                return -1;
            const sensed = chem[pos.y * HEIGHT + pos.x];
            if (this.scatter)
                return 1 - sensed;
            return sensed;
        }

        react(chem) {
            // Sense
            let forwardChem = this.sense(0, chem);
            let leftChem = this.sense(-1, chem);
            let rightChem = this.sense(1, chem);

            let rotate = 0;
            if (forwardChem > leftChem && forwardChem > rightChem) {
                rotate = 0;
            }
            else if (forwardChem < leftChem && forwardChem < rightChem) {
                if (Math.random() < 0.5) {
                    rotate = -AGT_ANGLE;
                }
                else {
                    rotate = AGT_ANGLE;
                }
            }
            else if (leftChem < rightChem) {
                rotate = AGT_ANGLE;
            }
            else if (rightChem < leftChem) {
                rotate = -AGT_ANGLE;
            }
            else if (forwardChem < 0) {
                rotate = Math.PI / 2;
            }
            this.dir = v2.rot(this.dir, rotate);

            this.pos = v2.add(this.pos, v2.mulN(this.dir, AGT_SPEED));
        }

        deposit(chem) {
            const { y, x } = v2.floor(this.pos);
            const i = y * HEIGHT + x;
            chem[i] = Math.min(1, chem[i] + DEPOSIT);
        }
    }

    class SlimeMoldSimulation {
        constructor(containerElement, options = {}) {
            if (!containerElement) {
                console.error('Container element must be provided!');
                return;
            }
            
            this.container = typeof containerElement === 'string' 
                ? document.getElementById(containerElement) 
                : containerElement;
                
            if (!this.container) {
                console.error('Container element not found!');
                return;
            }
            
            if (!this.container.classList.contains('slime-mold-container')) {
                this.container.classList.add('slime-mold-container');
                this.container.style.position = 'relative';
                this.container.style.overflow = 'hidden';
                
                if (options.backgroundColor) {
                    this.container.style.backgroundColor = options.backgroundColor;
                }
            }
            
            this.simulationElement = document.createElement('div');
            this.simulationElement.style.position = 'absolute';
            this.simulationElement.style.top = '0';
            this.simulationElement.style.left = '0';
            this.simulationElement.style.width = '100%';
            this.simulationElement.style.height = '100%';
            this.simulationElement.style.fontFamily = 'monospace';
            this.simulationElement.style.fontSize = options.fontSize || '12px';
            this.simulationElement.style.lineHeight = '1';
            this.simulationElement.style.whiteSpace = 'pre';
            this.simulationElement.style.color = options.color || 'antiquewhite';
            this.simulationElement.style.cursor = 'pointer';
            
            this.container.appendChild(this.simulationElement);
            
            this.metrics = { aspect: 0.5 };

            this.data = {};
            this.cursor = { pressed: false, x: 0, y: 0 };
            this.context = {
                rows: 0,
                cols: 0,
                frame: 0,
                metrics: this.metrics
            };
            this.buffer = [];

            this.boot();
            
            this.setupEventListeners();
            
            this.animate();
        }

        boot() {
            this.data.chem = new Float32Array(HEIGHT * WIDTH);
            this.data.wip = new Float32Array(HEIGHT * WIDTH);

            this.initializeAgents();

            this.data.viewScale = { y: 100 / this.metrics.aspect, x: 100 };
            this.data.viewFocus = { y: 0.5, x: 0.5 };
            
            this.isResetting = false;
            this.resetAnimationPhase = null;
            this.isMouseDown = false;
            
            this.updateDimensions();
        }

        initializeAgents() {
            this.data.agents = [];
            for (let agent = 0; agent < NUM_AGENTS; agent++) {
                this.data.agents.push(new Agent(
                    v2.mulN(v2.addN(v2.mulN(randCircle(), 0.5), 1), 0.5 * WIDTH),
                    v2.rot(v2.vec2(1, 0), Math.random() * 2 * Math.PI),
                ));
            }
        }

        pre() {
            for (let row = 0; row < HEIGHT; row++) {
                for (let col = 0; col < WIDTH; col++) {
                    let val = DECAY * blur(row, col, this.data.chem);
                    if (val < MIN_CHEM)
                        val = 0;
                    this.data.wip[row * HEIGHT + col] = val;
                }
            }
            const swap = this.data.chem;
            this.data.chem = this.data.wip;
            this.data.wip = swap;

            const { chem, agents } = this.data;

            const isScattering = Math.sin(this.context.frame / 150) > 0.8;
            for (const agent of agents) {
                agent.scatter = isScattering;
                agent.react(chem);
            }

            for (const agent of agents) {
                agent.deposit(chem);
            }

            this.updateView();
        }

        updateView() {
            const targetScale = {
                y: 1.1 * WIDTH / this.context.rows,
                x: 1.1 * WIDTH / this.context.rows * this.metrics.aspect,
            };

            if (this.data.viewScale.y !== targetScale.y || this.data.viewScale.x !== targetScale.x) {
                this.data.viewScale.y += 0.1 * (targetScale.y - this.data.viewScale.y);
                this.data.viewScale.x += 0.1 * (targetScale.x - this.data.viewScale.x);
            }

            const targetFocus = { y: 0.5, x: 0.5 };
            
            if (this.data.viewFocus.y !== targetFocus.y || this.data.viewFocus.x !== targetFocus.x) {
                this.data.viewFocus.y += 0.1 * (targetFocus.y - this.data.viewFocus.y);
                this.data.viewFocus.x += 0.1 * (targetFocus.x - this.data.viewFocus.x);
            }
        }

        main(coord) {
            const { viewFocus, viewScale } = this.data;

            const offset = {
                y: Math.floor(viewFocus.y * (HEIGHT - viewScale.y * this.context.rows)),
                x: Math.floor(viewFocus.x * (WIDTH - viewScale.x * this.context.cols)),
            };

            const sampleFrom = {
                y: offset.y + Math.floor(coord.y * viewScale.y),
                x: offset.x + Math.floor(coord.x * viewScale.x),
            };

            const sampleTo = {
                y: offset.y + Math.floor((coord.y + 1) * viewScale.y),
                x: offset.x + Math.floor((coord.x + 1) * viewScale.x),
            };

            if (!bounded(sampleFrom) || !bounded(sampleTo))
                return OOB;

            const sampleH = Math.max(1, sampleTo.y - sampleFrom.y);
            const sampleW = Math.max(1, sampleTo.x - sampleFrom.x);

            let max = 0;
            let sum = 0;
            for (let x = sampleFrom.x; x < sampleFrom.x + sampleW; x++) {
                for (let y = sampleFrom.y; y < sampleFrom.y + sampleH; y++) {
                    const v = this.data.chem[y * HEIGHT + x] || 0;
                    max = Math.max(max, v);
                    sum += v;
                }
            }
            let val = sum / (sampleW * sampleH);
            val = (val + max) / 2;

            val = Math.pow(val, 1/3);

            const texRow = (coord.x + coord.y) % TEXTURE.length;
            const texCol = Math.ceil(val * (TEXTURE[0].length - 1));
            const char = TEXTURE[texRow][texCol] || ' ';

            return char;
        }

        render() {
            this.buffer = [];
            for (let y = 0; y < this.context.rows; y++) {
                let row = '';
                for (let x = 0; x < this.context.cols; x++) {
                    row += this.main({ x, y });
                }
                this.buffer.push(row);
            }
            this.simulationElement.textContent = this.buffer.join('\n');
        }

        animate() {
            this.context.frame++;
            this.pre();
            this.render();
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }

        setupEventListeners() {
            this.isMouseDown = false;
            
            this.simulationElement.addEventListener('mousedown', (e) => {
                this.isMouseDown = true;
                this.prepareReset();
            });
            
            this.mouseUpHandler = (e) => {
                if (this.isMouseDown) {
                    this.isMouseDown = false;
                    this.completeReset();
                }
            };
            document.addEventListener('mouseup', this.mouseUpHandler);

            this.resizeHandler = () => {
                this.updateDimensions();
            };
            window.addEventListener('resize', this.resizeHandler);

            this.updateDimensions();
        }

        updateDimensions() {
            const containerStyle = window.getComputedStyle(this.container);
            const containerWidth = parseInt(containerStyle.width);
            const containerHeight = parseInt(containerStyle.height);
            
            const fontSize = parseInt(window.getComputedStyle(this.simulationElement).fontSize);
            this.context.cols = Math.floor(containerWidth / (fontSize * 0.6));
            this.context.rows = Math.floor(containerHeight / fontSize);
            
            this.metrics.aspect = (fontSize * 0.6) / fontSize;
        }

        prepareReset() {
            this.originalAgents = [...this.data.agents];
            this.originalChem = new Float32Array(this.data.chem);
            
            this.originalViewFocus = {
                x: this.data.viewFocus.x,
                y: this.data.viewFocus.y
            };
            
            this.resetStartTime = performance.now();
            this.resetAnimationPhase = 'fadeOut';
            
            if (!this.isResetting) {
                this.isResetting = true;
                this.animateReset();
            }
        }

        completeReset() {
            if (this.resetAnimationPhase === 'fadeOut') {
                this.newAgents = [];
                for (let agent = 0; agent < NUM_AGENTS; agent++) {
                    this.newAgents.push(new Agent(
                        v2.mulN({x: 0.5, y: 0.5}, WIDTH),
                        v2.rot(v2.vec2(1, 0), Math.random() * 2 * Math.PI),
                    ));
                }
                
                this.data.chem = new Float32Array(HEIGHT * WIDTH);
                this.data.wip = new Float32Array(HEIGHT * WIDTH);
                
                this.resetAnimationPhase = 'fadeIn';
                this.resetStartTime = performance.now();
            }
        }

        animateReset() {
            const timestamp = performance.now();
            const elapsed = timestamp - this.resetStartTime;
            const fadeDuration = 1500; // 1.5 секунды для каждой фазы
            const progress = Math.min(elapsed / fadeDuration, 1);
            const easedProgress = progress * (2 - progress);
            
            if (this.resetAnimationPhase === 'fadeOut') {
                
                for (let i = 0; i < HEIGHT * WIDTH; i++) {
                    this.data.chem[i] = this.originalChem[i] * (1 - easedProgress);
                }
                
                this.data.viewFocus = {
                    y: this.originalViewFocus.y + (0.5 - this.originalViewFocus.y) * easedProgress,
                    x: this.originalViewFocus.x + (0.5 - this.originalViewFocus.x) * easedProgress
                };
                
                for (let i = 0; i < this.originalAgents.length; i++) {
                    if (i < this.data.agents.length) {
                        const agent = this.data.agents[i];
                        const center = { x: WIDTH / 2, y: HEIGHT / 2 };
                        const dirToCenter = {
                            x: center.x - agent.pos.x,
                            y: center.y - agent.pos.y
                        };
                        const dist = Math.sqrt(dirToCenter.x * dirToCenter.x + dirToCenter.y * dirToCenter.y);
                        if (dist > 0) {
                            const normalizedDir = {
                                x: dirToCenter.x / dist,
                                y: dirToCenter.y / dist
                            };
                            agent.dir = {
                                x: agent.dir.x * (1 - easedProgress) + normalizedDir.x * easedProgress,
                                y: agent.dir.y * (1 - easedProgress) + normalizedDir.y * easedProgress
                            };
                            
                            const moveSpeed = dist * easedProgress * 0.02;
                            agent.pos = {
                                x: agent.pos.x + normalizedDir.x * moveSpeed,
                                y: agent.pos.y + normalizedDir.y * moveSpeed
                            };
                        }
                    }
                }
                
                if (progress < 1 || this.isMouseDown) {
                    requestAnimationFrame(() => this.animateReset());
                } else {
                    this.completeReset();
                }
            } else if (this.resetAnimationPhase === 'fadeIn') {
                
                if (progress < 0.1) {
                    this.data.agents = [];
                    for (let i = 0; i < this.newAgents.length; i++) {
                        const agent = this.newAgents[i];
                        this.data.agents.push(new Agent(
                            {x: agent.pos.x, y: agent.pos.y}, 
                            {x: agent.dir.x, y: agent.dir.y}
                        ));
                    }
                }
                
                for (let i = 0; i < this.data.agents.length; i++) {
                    const agent = this.data.agents[i];
                    const originalAgent = this.newAgents[i];
                    
                    const randDist = Math.random() * WIDTH * 0.4 * easedProgress;
                    const targetPos = {
                        x: WIDTH/2 + originalAgent.dir.x * randDist,
                        y: HEIGHT/2 + originalAgent.dir.y * randDist
                    };
                    
                    const dirToTarget = {
                        x: targetPos.x - agent.pos.x,
                        y: targetPos.y - agent.pos.y
                    };
                    
                    const dist = Math.sqrt(dirToTarget.x * dirToTarget.x + dirToTarget.y * dirToTarget.y);
                    if (dist > 0) {
                        const normalizedDir = {
                            x: dirToTarget.x / dist,
                            y: dirToTarget.y / dist
                        };
                        
                        const moveSpeed = 0.5 + 2 * easedProgress;
                        agent.pos = {
                            x: agent.pos.x + normalizedDir.x * moveSpeed,
                            y: agent.pos.y + normalizedDir.y * moveSpeed
                        };
                    }
                    
                    if (Math.random() < 0.1) {
                        const randAngle = (Math.random() - 0.5) * Math.PI/2;
                        agent.dir = v2.rot(agent.dir, randAngle);
                    }
                }
                
                if (progress < 1) {
                    requestAnimationFrame(() => this.animateReset());
                } else {
                    this.isResetting = false;
                }
            }
        }
        
        stop() {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }
        }
        
        start() {
            if (!this.animationFrame) {
                this.animate();
            }
        }
        
        destroy() {
            this.stop();
            
            document.removeEventListener('mouseup', this.mouseUpHandler);
            window.removeEventListener('resize', this.resizeHandler);
            
            if (this.simulationElement && this.simulationElement.parentNode) {
                this.simulationElement.parentNode.removeChild(this.simulationElement);
            }
            
            this.data = null;
        }
    }
    
    window.SlimeMoldNamespace.SlimeMoldSimulation = SlimeMoldSimulation;
    
    window.createSlimeMold = function(container, options = {}) {
        return new SlimeMoldSimulation(container, options);
    };
    
})(window, document);