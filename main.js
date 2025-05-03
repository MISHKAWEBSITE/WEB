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
  
  // Update the indicator based on scroll position
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
  
  console.log('Скрипт вращающейся палки инициализирован');
});













const ascii = ".:-=+*#%@";
const myCanvas = document.createElement("canvas");
myCanvas.width = 32;
myCanvas.height = 48;
const myCtx = myCanvas.getContext("2d");
const asciicontainer = document.querySelector(".ascii");

// Helper functions
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

// More efficient version of the original getAsciiOutput function
const getAsciiOutput = (t, o) => {
  let e = o.getImageData(0, 0, t.width, t.height).data;
  let a = "";
  for (let o = 0, x = e.length; o < x; o += 4) {
    let x = (o / 4) % t.width;
    let i = ascii[map_table[e[o]]];
    if (x == 0) {
      a += "<div>";
    }
    a += i == ascii[0] ? `<span style="color: #0a0a0a">${i}</span>` : i;
    if (x == t.width - 1) {
      a += "</div>";
    }
  }
  return a;
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
const asciiUpdateFrequency = 3; // Update ASCII only every 3 frames

const loop = () => {
  tick += 0.025;
  
  // Draw on canvas
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
    }
  }
  
  frameCount++;
  if (frameCount % asciiUpdateFrequency === 0) {
    asciicontainer.innerHTML = getAsciiOutput(myCanvas, myCtx);
  }
  
  requestAnimationFrame(loop);
};

loop();

window.addEventListener("mouseover", (t) => {
  mouseState = true;
});

window.addEventListener("mouseout", (t) => {
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
        font-family: DOS437;
        display: grid;
        font-size: 20px;
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
  [-cubeSize, -cubeSize, -cubeSize], // 0: back bottom left
  [cubeSize, -cubeSize, -cubeSize],  // 1: back bottom right
  [cubeSize, cubeSize, -cubeSize],   // 2: back top right
  [-cubeSize, cubeSize, -cubeSize],  // 3: back top left
  [-cubeSize, -cubeSize, cubeSize],  // 4: front bottom left
  [cubeSize, -cubeSize, cubeSize],   // 5: front bottom right
  [cubeSize, cubeSize, cubeSize],    // 6: front top right
  [-cubeSize, cubeSize, cubeSize]    // 7: front top left
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

// Mouse event handlers
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




     const skullPre = document.getElementById('skullPre');
     
     const originalText = skullPre.textContent;
     
     const bufferChars = "$§@#*?!:;,.^-+=_|/<>[]{}()\\~`'\"";
     
     let isEffectActive = false;
     
     function applyBufferEffect() {
       let newContent = '';
       
       const lines = originalText.split('\n');
       
       for (const line of lines) {
         let newLine = '';
         
         for (let i = 0; i < line.length; i++) {
           if (line[i] === ' ' || line[i] === '\n') {
             newLine += line[i];
             continue;
           }
           
           if (Math.random() < 0.10) {
             const randomChar = bufferChars[Math.floor(Math.random() * bufferChars.length)];
             newLine += randomChar;
           } else {
             newLine += line[i];
           }
         }
         
         newContent += newLine + '\n';
       }
       
       skullPre.textContent = newContent;
     }
     
     function restoreOriginalText() {
       skullPre.textContent = originalText;
     }
     
     function toggleEffectPeriodically() {
       if (isEffectActive) {
         restoreOriginalText();
         isEffectActive = false;
         
         setTimeout(toggleEffectPeriodically, Math.random() * 2000 + 2000);
       } 
       else {
         isEffectActive = true;
         
         let bufferDuration = Math.random() * 500 + 500;
         let frames = 0;
         
         let bufferInterval = setInterval(() => {
           applyBufferEffect();
           frames++;
           
           if (frames > bufferDuration / 200) {
             clearInterval(bufferInterval);
             restoreOriginalText();
             isEffectActive = false;
             
             setTimeout(toggleEffectPeriodically, Math.random() * 2000 + 2000);
           }
         }, 100);
       }
     }
     
     setTimeout(toggleEffectPeriodically, 2000);




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






// Создаем элемент уведомления заранее
const notification = document.createElement('div');
notification.id = 'phone-notification';
notification.style.position = 'fixed';
notification.style.top = '0';
notification.style.left = '0';
notification.style.width = '100%';
notification.style.height = '100%';
notification.style.backgroundColor = 'black'; // Изменил на черный фон
notification.style.zIndex = '9999';
notification.style.display = 'none';
notification.style.color = 'white'; // Добавил белый текст для лучшей видимости на черном фоне

notification.innerHTML = `
  <div class="greeting" style="font-size: 30px; padding-top: 50px;">
        <pre style="font-size: 6px; text-align: center;">
 __    __     __     ______     __  __     __  __     ______    
/\\ "-./  \\   /\\ \\   /\\  ___\\   /\\ \\_\\ \\   /\\ \\/ /    /\\  __ \\   
\\ \\ \\-./\\ \\  \\ \\ \\  \\ \\___  \\  \\ \\  __ \\  \\ \\  _"-.  \\ \\  __ \\  
 \\ \\_\\ \\ \\_\\  \\ \\_\\  \\/\\_____\\  \\ \\_\\ \\_\\  \\ \\_\\ \\_\\  \\ \\_\\ \\_\\ 
  \\/_/  \\/_/   \\/_/   \\/_____/   \\/_/\\/_/   \\/_/\\/_/   \\/_/\\/_/ </pre>
    <p class="greeting_hlwrld" style="text-align: center; font-size: 20px; font-family: 'Jersey', sans-serif; color: #FA4C14;">PHONE_ERROR</p>
  </div>
  <div style="padding: 40px; font-size: 12px; color: white;">You're on a phone.<br>
      mishka.ltd is not intended for viewing on a phone.<br>
      First of all, due to the .nfo style and animations, it cannot be properly adapted.
      Second, don't doomscroll through important information.<br><br>
      Come back to us from a computer or change your screen resolution. See you soon :*</div>
`;

// Функция для проверки ширины
function checkWidth() {
  if (window.innerWidth < 1180) {
    console.log("Ширина экрана меньше 1180px. Показываем уведомление...");
    notification.style.display = 'block';
  } else {
    notification.style.display = 'none';
  }
}

// Добавляем элемент на страницу и настраиваем слушатели событий
document.addEventListener("DOMContentLoaded", function() {
  document.body.appendChild(notification);
  checkWidth(); // Проверяем сразу после загрузки DOM
});

window.addEventListener("load", checkWidth);
window.addEventListener("resize", checkWidth);