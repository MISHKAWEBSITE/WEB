
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
  
  // Improved dragging functionality
  let isDraggingItem = false;
  let currentScrollAnimation = null;
  let dragStartTime = null;
  
  scrollIndicator.addEventListener("mousedown", function(event) {
    isDraggingItem = true;
    document.body.style.userSelect = "none"; // Prevent text selection while dragging
    dragStartTime = Date.now();
    
    // Cancel any ongoing scroll animation
    if (currentScrollAnimation) {
      cancelAnimationFrame(currentScrollAnimation);
      currentScrollAnimation = null;
    }
    
    // Handle the initial click as a drag event
    handleDragMove(event);
  });
  
  document.addEventListener("mouseup", function() {
    if (isDraggingItem) {
      isDraggingItem = false;
      document.body.style.userSelect = "";
      dragStartTime = null;
      
      // Stop any ongoing animation immediately when mouse is released
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
  
  // Handle the dragging motion
  function handleDragMove(event) {
    const rect = scrollIndicator.getBoundingClientRect();
    const positionRatio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const targetScrollPosition = positionRatio * (document.body.scrollHeight - window.innerHeight);
    
    // Use improved lerp function for smoother movement
    improvedLerpScrollTo(targetScrollPosition);
  }
  
  // Improved linear interpolation for smoother scrolling with less "tail" effect
  function improvedLerpScrollTo(targetPosition) {
    if (currentScrollAnimation) {
      cancelAnimationFrame(currentScrollAnimation);
    }
    
    // Track animation duration to prevent excessive "tail"
    const maxAnimationDuration = 300; // ms
    const startTime = Date.now();
    
    function animate() {
      // Get current position
      const currentPosition = window.scrollY;
      const animationDuration = Date.now() - startTime;
      
      // Calculate the distance to move
      let lerpFactor = 0.25; // Slightly faster approach
      
      // Increase the lerp factor as time goes on to reduce the "tail" effect
      if (animationDuration > 150) {
        lerpFactor = 0.4; // Even faster approach when animation has been running a while
      }
      
      // Further increase the factor when we're close to target
      if (Math.abs(targetPosition - currentPosition) < 50) {
        lerpFactor = 0.5; // Much faster approach when close to target
      }
      
      const nextPosition = currentPosition + (targetPosition - currentPosition) * lerpFactor;
      
      // Apply the scroll
      window.scrollTo(0, nextPosition);
      
      // Determine if we should continue the animation
      const closeEnough = Math.abs(targetPosition - nextPosition) < 3; // Larger threshold
      const timeUp = animationDuration > maxAnimationDuration;
      
      if (!closeEnough && !timeUp && isDraggingItem) {
        currentScrollAnimation = requestAnimationFrame(animate);
      } else {
        // We're either close enough, time is up, or dragging stopped
        // Snap to exact position to eliminate "tail"
        if (Math.abs(targetPosition - nextPosition) < 20) {
          window.scrollTo(0, targetPosition);
        }
        currentScrollAnimation = null;
      }
    }
    
    currentScrollAnimation = requestAnimationFrame(animate);
  }
  
  // Smooth scrolling function for clicking
  function smoothScrollTo(targetPosition) {
    if (currentScrollAnimation) {
      cancelAnimationFrame(currentScrollAnimation);
    }
    
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 500; // Slightly shorter duration
    let startTime = null;
    
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Smooth easing function with faster finish
      const easedProgress = easeOutQuint(progress);
      
      window.scrollTo(0, startPosition + distance * easedProgress);
      
      if (timeElapsed < duration && progress < 0.99) {
        currentScrollAnimation = requestAnimationFrame(animation);
      } else {
        // Ensure we land exactly on target
        window.scrollTo(0, targetPosition);
        currentScrollAnimation = null;
      }
    }
    
    currentScrollAnimation = requestAnimationFrame(animation);
  }
  
  // Faster easing function with quicker finish
  function easeOutQuint(t) {
    return 1 - Math.pow(1 - t, 5);
  }
  
  // Original smooth easing
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

// Создаем кэш последних значений ASCII для сравнения
const lastAsciiValues = new Array(myCanvas.width * myCanvas.height).fill('');
const asciiElements = [];

// Инициализация DOM-элементов один раз
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

// Оптимизированная функция обновления ASCII
const updateAsciiOutput = () => {
  const imageData = myCtx.getImageData(0, 0, myCanvas.width, myCanvas.height).data;
  
  for (let y = 0; y < myCanvas.height; y++) {
    for (let x = 0; x < myCanvas.width; x++) {
      const pixelIndex = (y * myCanvas.width + x) * 4;
      const brightness = imageData[pixelIndex]; // Используем красный канал для яркости
      const asciiIndex = map_table[brightness];
      const char = ascii[asciiIndex];
      
      const index = y * myCanvas.width + x;
      // Обновляем только если значение изменилось
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
const asciiUpdateFrequency = 3; // Update ASCII only every 3 frames

// Для более стабильного FPS
let lastFrameTime = 0;
const targetFPS = 120;
const frameInterval = 1000 / targetFPS;

const loop = (timestamp) => {
  // Ограничиваем частоту кадров
  const elapsed = timestamp - lastFrameTime;
  if (elapsed < frameInterval) {
    requestAnimationFrame(loop);
    return;
  }
  lastFrameTime = timestamp - (elapsed % frameInterval);
  
  tick += 0.025;
  
  // Clear canvas with a single operation
  myCtx.fillStyle = "#000";
  myCtx.fillRect(0, 0, myCanvas.width, myCanvas.height);
  
  // Draw box
  myCtx.fillStyle = "#f4f4f4";
  myCtx.fillRect(box.x, box.y, box.w, box.h);
  
  // Draw lines
  line(box.x, box.y, 0, 0);
  line(box.x + box.w, box.y, myCanvas.width, 0);
  line(box.x, box.y + box.h, 0, myCanvas.height);
  line(box.x + box.w, box.y + box.h, myCanvas.width, myCanvas.height);
  
  // Draw gradient
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

// Инициализируем DOM-структуру один раз
initAsciiContainer();

// Начинаем анимацию
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
    notification.style.display = 'block';
  } else {
    notification.style.display = 'none';
  }
}

document.addEventListener("DOMContentLoaded", function() {
  document.body.appendChild(notification);
  checkWidth();
});

window.addEventListener("load", checkWidth);
window.addEventListener("resize", checkWidth);



console.log(`Devs: Archi, root, ACID, Klaus`);
console.log(`Inspired by: MIAO, Dragonfly, ertdfgcvb and .nfo's`);





















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
  let LIVE_updateSpeed = 42; //speed changer
  
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
  
  function LIVE_updateGame() {
    const prev = LIVE_data[LIVE_frame % 2];
    const curr = LIVE_data[(LIVE_frame + 1) % 2];
    const w = LIVE_cols;
    const h = LIVE_rows * 2;
    
    if (LIVE_isPressed && LIVE_cursorX >= 0 && LIVE_cursorY >= 0) {
      const cx = Math.floor(LIVE_cursorX);
      const cy = Math.floor(LIVE_cursorY * 2);
      const s = 3;
      
      // Создаем планер (glider) вместо случайных клеток
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
      }
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
  
  LIVE_startGame();
  
  return {
    setSpeed: window.LIVE_setSpeed,
    togglePause: window.LIVE_togglePause
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
    frameCount: Math.floor(Math.random() * 1000), // Рандомный начальный кадр
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






















  // PROJECTBOX - Изолированный скрипт
  (function() {
    // Конфигурация
    const PROJECTBOX_CONFIG = {
      baseWidth: 190,
      baseHeight: 140,
      spacingX: 50,  // Увеличено расстояние между карточками по горизонтали
      spacingY: 40,  // Увеличено расстояние между карточками по вертикали
      cursorInfluenceRadius: 260,
      maxRepulsion: 20,
      pixelSize: 10
    };
    
    // Данные карточек - замените на ваши данные
    const PROJECTBOX_DATA = [
      { title: "TECH", date: "2 мая 2025", content: "Прорыв в области квантовой запутанности открывает новые возможности для вычислений" },
      { title: "FINANCE", date: "28 апреля 2025", content: "Новая модель ИИ превзошла все ожидания в решении творческих задач" },
      { title: "ECOMMERCE", date: "15 апреля 2025", content: "Запуск нового телескопа позволит заглянуть еще дальше в глубины космоса" },
      { title: "PRIVATE/VIP", date: "10 апреля 2025", content: "Эффективность солнечных панелей достигла рекордных 45% в лабораторных условиях" },
      { title: "INDUSTRY_OT/ICS", date: "5 апреля 2025", content: "Нанороботы успешно использованы для доставки лекарств к опухолям" },
      { title: "GOVERNMENT", date: "1 апреля 2025", content: "Новая VR-система позволяет ощущать текстуры и температуру объектов" },
      { title: "RESEARCH/EDUCATION", date: "25 марта 2025", content: "Человекоподобный робот научился выполнять сложные манипуляции с предметами" },
      { title: "FOSS", date: "20 марта 2025", content: "Методы генной терапии успешно применены для лечения редких заболеваний" },
      { title: "STATE-OWNED", date: "15 марта 2025", content: "Сверхлегкий материал прочнее стали и гибкий как ткань создан учеными" },
      { title: "OUTSOURCING", date: "10 марта 2025", content: "Первая межконтинентальная квантовая сеть заработала в тестовом режиме" },
      { title: "CLOUD", date: "5 марта 2025", content: "Система прогнозирования трафика сократила пробки на 35% в тестовом городе" },
      { title: "SAAS", date: "1 марта 2025", content: "Неинвазивный интерфейс мозг-компьютер достиг скорости ввода 100 символов в минуту" },
      { title: "LEGAL", date: "25 февраля 2025", content: "Напечатанные органы успешно прошли первую фазу клинических испытаний" },
      { title: "NGO", date: "20 февраля 2025", content: "Беспилотные автомобили официально признаны безопаснее человека-водителя" },
      { title: "MEDICAL", date: "15 февраля 2025", content: "Новые очки AR заменяют экраны гаджетов виртуальными проекциями" },
      { title: "OUR_OWN", date: "15 февраля 2025", content: "Новые очки AR заменяют экраны гаджетов виртуальными проекциями" },
    ];

    // Переменные состояния
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
    
    // Инициализация
    function projectboxInit() {
      const container = document.getElementById('projectbox-container');
      if (!container) return;
      
      PROJECTBOX_STATE.containerWidth = container.clientWidth;
      PROJECTBOX_STATE.containerHeight = container.clientHeight;
      
      // Создание карточек с использованием flexbox
      for (let j = 0; j < 4; j++) {  // Задаем 4 ряда для высоты 800px
        for (let i = 0; i < 4; i++) {  // Задаем 4 карточки в ряду для ширины 1080px
          const box = document.createElement('div');
          box.className = 'projectbox-card';
          
          // Получение данных карточки
          const dataIndex = (i + j * 4) % PROJECTBOX_DATA.length;
          const card = PROJECTBOX_DATA[dataIndex];
          
          // Добавление содержимого
          box.innerHTML = `
            <div class="projectbox-title">${card.title}</div>
            <div class="projectbox-date">${card.date}</div>
            <div class="projectbox-content">${card.content}</div>
            <div class="projectbox-position">pos: ${i}×${j}</div>
          `;
          
          // Добавление в контейнер
          container.appendChild(box);
          
          // Сохранение данных карточки
          PROJECTBOX_STATE.boxes.push({
            element: box,
            i: i,
            j: j
          });
        }
      }
    }
    
    // Обновление позиций карточек
    function projectboxUpdateBoxes() {
      // Расчет скорости движения курсора
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
        
        // Получаем текущую позицию карточки относительно контейнера
        const rect = element.getBoundingClientRect();
        const containerRect = document.getElementById('projectbox-container').getBoundingClientRect();
        const centerX = rect.left - containerRect.left + rect.width / 2;
        const centerY = rect.top - containerRect.top + rect.height / 2;
        
        // Расчет расстояния от курсора до центра карточки
        const dx = PROJECTBOX_STATE.mouseX - centerX;
        const dy = PROJECTBOX_STATE.mouseY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Расчет целевой позиции для отталкивания
        let targetX = 0;
        let targetY = 0;
        
        if (distance < PROJECTBOX_CONFIG.cursorInfluenceRadius && distance > 0) {
          // Нормализация вектора направления
          const nx = -dx / distance;
          const ny = -dy / distance;
          
          // Сила отталкивания уменьшается с расстоянием, но увеличивается со скоростью курсора
          const speedFactor = 1 + PROJECTBOX_STATE.mouseSpeed / 50;
          const strength = PROJECTBOX_CONFIG.maxRepulsion * (1 - distance / PROJECTBOX_CONFIG.cursorInfluenceRadius) * speedFactor;
          
          // Применение пиксельного движения
          targetX = Math.round(nx * strength / PROJECTBOX_CONFIG.pixelSize) * PROJECTBOX_CONFIG.pixelSize;
          targetY = Math.round(ny * strength / PROJECTBOX_CONFIG.pixelSize) * PROJECTBOX_CONFIG.pixelSize;
          
          // Сохраняем целевую позицию
          box.targetX = targetX;
          box.targetY = targetY;
        } else {
          // Если курсор далеко, то целевая позиция - возврат с отдачей
          targetX = 0;
          targetY = 0;
          
          // Если мы близко к целевой позиции и еще движемся с достаточной скоростью, 
          // добавляем отдачу, меняя целевую позицию на противоположную
          if (Math.abs(box.currentX) < 4 && Math.abs(velocity.x) > 0.5) {
            targetX = -Math.sign(velocity.x) * 4;
          }
          
          if (Math.abs(box.currentY) < 4 && Math.abs(velocity.y) > 0.5) {
            targetY = -Math.sign(velocity.y) * 4;
          }
        }
        
        // Пружинная физика для более плавного движения с отдачей
        const spring = 0.2;  // Сила пружины
        const damping = 0.7; // Затухание (трение)
        
        // Вычисляем ускорение на основе разницы текущей и целевой позиции (закон Гука)
        const ax = (targetX - box.currentX) * spring;
        const ay = (targetY - box.currentY) * spring;
        
        // Обновляем скорость с учетом ускорения и затухания
        velocity.x = velocity.x * damping + ax;
        velocity.y = velocity.y * damping + ay;
        
        // Обновляем текущую позицию
        box.currentX += velocity.x;
        box.currentY += velocity.y;
        
        // Применяем пиксельное округление к финальной позиции для сохранения пиксельного эффекта
        const pixelX = Math.round(box.currentX / 2) * 2;
        const pixelY = Math.round(box.currentY / 2) * 2;
        
        // Применяем трансформацию для перемещения
        element.style.transform = `translate(${pixelX}px, ${pixelY}px)`;
        
        // Обновление отображения позиции
        const positionDiv = element.querySelector('.projectbox-position');
        positionDiv.textContent = `pos: ${i}×${j}`;
      });
      
      requestAnimationFrame(projectboxUpdateBoxes);
    }
    
    // Отслеживание позиции курсора
    function projectboxHandleMouseMove(event) {
      const container = document.getElementById('projectbox-container');
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      PROJECTBOX_STATE.mouseX = event.clientX - rect.left;
      PROJECTBOX_STATE.mouseY = event.clientY - rect.top;
    }
    
    // Обработка изменения размера окна
    function projectboxHandleResize() {
      const container = document.getElementById('projectbox-container');
      if (!container) return;
      
      // Удаление всех карточек
      PROJECTBOX_STATE.boxes.forEach(box => box.element.remove());
      PROJECTBOX_STATE.boxes = [];
      
      // Повторная инициализация
      projectboxInit();
    }
    
    // Настройка обработчиков событий
    function projectboxSetupEventListeners() {
      document.addEventListener('mousemove', projectboxHandleMouseMove);
      window.addEventListener('resize', projectboxHandleResize);
    }
    
    // Инициализация PROJECTBOX
    function projectboxStart() {
      projectboxInit();
      projectboxSetupEventListeners();
      projectboxUpdateBoxes();
    }
    
    // Запуск при загрузке страницы
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', projectboxStart);
    } else {
      projectboxStart();
    }
  })(); // Немедленно вызываемая функция для изоляции кода














// SlimeMold.js - изолированный модуль для симуляции слизней
// Для вставки в существующую страницу

(function(window, document) {
    'use strict';
    
    // Создаем уникальное пространство имен
    window.SlimeMoldNamespace = window.SlimeMoldNamespace || {};
    
    // Vector 2 module - изолирован внутри замыкания
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

    // Константы симуляции - скрыты внутри замыкания
    const WIDTH = 400;
    const HEIGHT = 400;
    const NUM_AGENTS = 1500;
    const DECAY = 0.9;
    const MIN_CHEM = 0.0001;

    // Константы агентов
    const SENS_ANGLE = 45 * Math.PI / 180;
    const SENS_DIST = 9;
    const AGT_SPEED = 1;
    const AGT_ANGLE = 45 * Math.PI / 180;
    const DEPOSIT = 1;

    // Текстуры для рендеринга
    const TEXTURE = [
        "  ``^@",
        " ..„v0",
    ];
    const OOB = ' ';

    const R = Math.min(WIDTH, HEIGHT)/2;

    // Вспомогательные функции
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

    // Класс агента
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

            // Rotate
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
                // Turn around at edge
                rotate = Math.PI / 2;
            }
            this.dir = v2.rot(this.dir, rotate);

            // Move
            this.pos = v2.add(this.pos, v2.mulN(this.dir, AGT_SPEED));
        }

        deposit(chem) {
            const { y, x } = v2.floor(this.pos);
            const i = y * HEIGHT + x;
            chem[i] = Math.min(1, chem[i] + DEPOSIT);
        }
    }

    // Класс симуляции
    class SlimeMoldSimulation {
        constructor(containerElement, options = {}) {
            if (!containerElement) {
                console.error('Container element must be provided!');
                return;
            }
            
            // Создаем симуляционный элемент если он не существует
            this.container = typeof containerElement === 'string' 
                ? document.getElementById(containerElement) 
                : containerElement;
                
            if (!this.container) {
                console.error('Container element not found!');
                return;
            }
            
            // Проверим, есть ли уже стили для этого контейнера
            if (!this.container.classList.contains('slime-mold-container')) {
                this.container.classList.add('slime-mold-container');
                this.container.style.position = 'relative';
                this.container.style.overflow = 'hidden';
                
                // Применяем цвет фона только если он явно указан в опциях
                // Иначе сохраняем существующий цвет из CSS
                if (options.backgroundColor) {
                    this.container.style.backgroundColor = options.backgroundColor;
                }
            }
            
            // Создаем элемент для симуляции
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
            
            this.metrics = { aspect: 0.5 }; // Типичное соотношение сторон для шрифтов моноширинных

            this.data = {};
            this.cursor = { pressed: false, x: 0, y: 0 };
            this.context = {
                rows: 0,
                cols: 0,
                frame: 0,
                metrics: this.metrics
            };
            this.buffer = [];

            // Инициализация
            this.boot();
            
            // Настройка слушателей событий
            this.setupEventListeners();
            
            // Запуск анимации
            this.animate();
        }

        boot() {
            this.data.chem = new Float32Array(HEIGHT * WIDTH);
            this.data.wip = new Float32Array(HEIGHT * WIDTH);

            this.initializeAgents();

            this.data.viewScale = { y: 100 / this.metrics.aspect, x: 100 };
            this.data.viewFocus = { y: 0.5, x: 0.5 };
            
            // Сброс состояния анимации
            this.isResetting = false;
            this.resetAnimationPhase = null;
            this.isMouseDown = false;
            
            // Обновление размеров симуляции
            this.updateDimensions();
        }

        initializeAgents() {
            this.data.agents = [];
            for (let agent = 0; agent < NUM_AGENTS; agent++) {
                this.data.agents.push(new Agent(
                    // Случайная позиция
                    v2.mulN(v2.addN(v2.mulN(randCircle(), 0.5), 1), 0.5 * WIDTH),
                    // Случайное направление
                    v2.rot(v2.vec2(1, 0), Math.random() * 2 * Math.PI),
                ));
            }
        }

        pre() {
            // Diffuse & decay
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

            // Sense, rotate, and move
            const isScattering = Math.sin(this.context.frame / 150) > 0.8;
            for (const agent of agents) {
                agent.scatter = isScattering;
                agent.react(chem);
            }

            // Deposit
            for (const agent of agents) {
                agent.deposit(chem);
            }

            // Update view params
            this.updateView();
        }

        updateView() {
            // Всегда поддерживаем центрированный вид
            const targetScale = {
                y: 1.1 * WIDTH / this.context.rows,
                x: 1.1 * WIDTH / this.context.rows * this.metrics.aspect,
            };

            if (this.data.viewScale.y !== targetScale.y || this.data.viewScale.x !== targetScale.x) {
                this.data.viewScale.y += 0.1 * (targetScale.y - this.data.viewScale.y);
                this.data.viewScale.x += 0.1 * (targetScale.x - this.data.viewScale.x);
            }

            // Всегда держать центрированным
            const targetFocus = { y: 0.5, x: 0.5 };
            
            if (this.data.viewFocus.y !== targetFocus.y || this.data.viewFocus.x !== targetFocus.x) {
                this.data.viewFocus.y += 0.1 * (targetFocus.y - this.data.viewFocus.y);
                this.data.viewFocus.x += 0.1 * (targetFocus.x - this.data.viewFocus.x);
            }
        }

        main(coord) {
            const { viewFocus, viewScale } = this.data;

            // Алгоритм масштабирования на основе ближайшего соседа
            const offset = {
                y: Math.floor(viewFocus.y * (HEIGHT - viewScale.y * this.context.rows)),
                x: Math.floor(viewFocus.x * (WIDTH - viewScale.x * this.context.cols)),
            };

            // "Ближайший сосед"
            const sampleFrom = {
                y: offset.y + Math.floor(coord.y * viewScale.y),
                x: offset.x + Math.floor(coord.x * viewScale.x),
            };

            // Следующая ячейка ближайшего соседа
            const sampleTo = {
                y: offset.y + Math.floor((coord.y + 1) * viewScale.y),
                x: offset.x + Math.floor((coord.x + 1) * viewScale.x),
            };

            if (!bounded(sampleFrom) || !bounded(sampleTo))
                return OOB;

            // При увеличении sampleW/H может быть 0
            const sampleH = Math.max(1, sampleTo.y - sampleFrom.y);
            const sampleW = Math.max(1, sampleTo.x - sampleFrom.x);

            // Объединяем все ячейки в [sampleFrom, sampleTo) в одно значение
            // Для этого случая хорошо работает значение на полпути между средним и максимальным
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

            // Взвешиваем val, чтобы получить лучшее распределение текстур
            val = Math.pow(val, 1/3);

            // Конвертируем значение ячейки в символ из карты текстур
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
                // Запускаем только фазу затухания
                this.prepareReset();
            });
            
            // Отслеживаем mouseup на всем документе
            this.mouseUpHandler = (e) => {
                if (this.isMouseDown) {
                    this.isMouseDown = false;
                    // Теперь завершаем процесс сброса
                    this.completeReset();
                }
            };
            document.addEventListener('mouseup', this.mouseUpHandler);

            this.resizeHandler = () => {
                this.updateDimensions();
            };
            window.addEventListener('resize', this.resizeHandler);

            // Начальное обновление
            this.updateDimensions();
        }

        updateDimensions() {
            const containerStyle = window.getComputedStyle(this.container);
            const containerWidth = parseInt(containerStyle.width);
            const containerHeight = parseInt(containerStyle.height);
            
            // Рассчитываем строки и столбцы на основе размеров контейнера и размера шрифта
            const fontSize = parseInt(window.getComputedStyle(this.simulationElement).fontSize);
            this.context.cols = Math.floor(containerWidth / (fontSize * 0.6));
            this.context.rows = Math.floor(containerHeight / fontSize);
            
            // Обновляем соотношение сторон
            this.metrics.aspect = (fontSize * 0.6) / fontSize;
        }

        prepareReset() {
            // Сохраняем исходное состояние
            this.originalAgents = [...this.data.agents];
            this.originalChem = new Float32Array(this.data.chem);
            
            // Сохраняем текущую позицию вида
            this.originalViewFocus = {
                x: this.data.viewFocus.x,
                y: this.data.viewFocus.y
            };
            
            // Переменные анимации
            this.resetStartTime = performance.now();
            this.resetAnimationPhase = 'fadeOut';
            
            // Запускаем цикл анимации, если он еще не запущен
            if (!this.isResetting) {
                this.isResetting = true;
                this.animateReset();
            }
        }

        completeReset() {
            // Продолжаем только если мы были в фазе затухания
            if (this.resetAnimationPhase === 'fadeOut') {
                // Подготавливаем новых агентов, но пока не делаем их видимыми
                this.newAgents = [];
                for (let agent = 0; agent < NUM_AGENTS; agent++) {
                    this.newAgents.push(new Agent(
                        // Начинаем из центра с случайным направлением
                        v2.mulN({x: 0.5, y: 0.5}, WIDTH),
                        v2.rot(v2.vec2(1, 0), Math.random() * 2 * Math.PI),
                    ));
                }
                
                // Полностью очищаем химическое поле
                this.data.chem = new Float32Array(HEIGHT * WIDTH);
                this.data.wip = new Float32Array(HEIGHT * WIDTH);
                
                // Переключаемся на фазу появления
                this.resetAnimationPhase = 'fadeIn';
                this.resetStartTime = performance.now();
            }
        }

        animateReset() {
            const timestamp = performance.now();
            const elapsed = timestamp - this.resetStartTime;
            const fadeDuration = 1500; // 1.5 секунды для каждой фазы
            const progress = Math.min(elapsed / fadeDuration, 1);
            // Используем кубическое сглаживание для более плавного эффекта
            const easedProgress = progress * (2 - progress);
            
            if (this.resetAnimationPhase === 'fadeOut') {
                // Фаза затухания
                
                // Постепенно уменьшаем химическое поле до нуля
                for (let i = 0; i < HEIGHT * WIDTH; i++) {
                    this.data.chem[i] = this.originalChem[i] * (1 - easedProgress);
                }
                
                // Анимируем фокус вида обратно к центру
                this.data.viewFocus = {
                    y: this.originalViewFocus.y + (0.5 - this.originalViewFocus.y) * easedProgress,
                    x: this.originalViewFocus.x + (0.5 - this.originalViewFocus.x) * easedProgress
                };
                
                // Медленно уменьшаем отложения агентов и перемещаем их к центру
                for (let i = 0; i < this.originalAgents.length; i++) {
                    if (i < this.data.agents.length) {
                        // Постепенно перемещаем агентов к центру
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
                            // Постепенно поворачиваем к центру
                            agent.dir = {
                                x: agent.dir.x * (1 - easedProgress) + normalizedDir.x * easedProgress,
                                y: agent.dir.y * (1 - easedProgress) + normalizedDir.y * easedProgress
                            };
                            
                            // Движемся к центру
                            const moveSpeed = dist * easedProgress * 0.02;
                            agent.pos = {
                                x: agent.pos.x + normalizedDir.x * moveSpeed,
                                y: agent.pos.y + normalizedDir.y * moveSpeed
                            };
                        }
                    }
                }
                
                // Продолжаем анимацию, если она не завершена или ждём отпускания мыши
                if (progress < 1 || this.isMouseDown) {
                    requestAnimationFrame(() => this.animateReset());
                } else {
                    // Если затухание завершено и мышь отпущена, переходим к появлению
                    this.completeReset();
                }
            } else if (this.resetAnimationPhase === 'fadeIn') {
                // Фаза появления - постепенно вводим новых агентов
                
                // Заменяем агентов на новых
                if (progress < 0.1) {
                    // Очищаем текущих агентов и подготавливаем новых
                    this.data.agents = [];
                    for (let i = 0; i < this.newAgents.length; i++) {
                        const agent = this.newAgents[i];
                        // Создаем копию, чтобы избежать изменения оригинала
                        this.data.agents.push(new Agent(
                            // Все начинают из центра
                            {x: agent.pos.x, y: agent.pos.y}, 
                            // Сохраняем исходное направление
                            {x: agent.dir.x, y: agent.dir.y}
                        ));
                    }
                }
                
                // Постепенно распространяем агентов из центра
                for (let i = 0; i < this.data.agents.length; i++) {
                    const agent = this.data.agents[i];
                    const originalAgent = this.newAgents[i];
                    
                    // Вычисляем целевую позицию на основе исходного направления и случайного расстояния
                    const randDist = Math.random() * WIDTH * 0.4 * easedProgress;
                    const targetPos = {
                        x: WIDTH/2 + originalAgent.dir.x * randDist,
                        y: HEIGHT/2 + originalAgent.dir.y * randDist
                    };
                    
                    // Двигаемся к целевой позиции
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
                        
                        // Постепенно перемещаемся из центра
                        const moveSpeed = 0.5 + 2 * easedProgress;
                        agent.pos = {
                            x: agent.pos.x + normalizedDir.x * moveSpeed,
                            y: agent.pos.y + normalizedDir.y * moveSpeed
                        };
                    }
                    
                    // Слегка рандомизируем направление для более естественного вида
                    if (Math.random() < 0.1) {
                        const randAngle = (Math.random() - 0.5) * Math.PI/2;
                        agent.dir = v2.rot(agent.dir, randAngle);
                    }
                }
                
                // Продолжаем анимацию, пока она не завершится
                if (progress < 1) {
                    requestAnimationFrame(() => this.animateReset());
                } else {
                    // Анимация завершена
                    this.isResetting = false;
                    // Сохраняем агентов, которые уже двигаются
                }
            }
        }
        
        // Публичные методы
        
        // Остановить симуляцию
        stop() {
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }
        }
        
        // Запустить симуляцию, если она остановлена
        start() {
            if (!this.animationFrame) {
                this.animate();
            }
        }
        
        // Полностью уничтожить симуляцию и очистить ресурсы
        destroy() {
            this.stop();
            
            // Удаляем обработчики событий
            document.removeEventListener('mouseup', this.mouseUpHandler);
            window.removeEventListener('resize', this.resizeHandler);
            
            // Удаляем DOM элементы
            if (this.simulationElement && this.simulationElement.parentNode) {
                this.simulationElement.parentNode.removeChild(this.simulationElement);
            }
            
            // Очищаем ссылки на данные
            this.data = null;
        }
    }
    
    // Экспортируем класс в наше пространство имен
    window.SlimeMoldNamespace.SlimeMoldSimulation = SlimeMoldSimulation;
    
    // Удобная функция для создания симуляции
    window.createSlimeMold = function(container, options = {}) {
        return new SlimeMoldSimulation(container, options);
    };
    
})(window, document);