const fireContainer = document.getElementById('DOOMCONTAINER');

const flame = '...::/\\/\\/\\+=*abcdef01XYZ#';
let cols, rows;
let data = [];

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
const map = (value, inMin, inMax, outMin, outMax) => 
  (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
const mix = (a, b, t) => a * (1 - t) + b * t;
const smoothstep = (min, max, value) => {
  const x = clamp((value - min) / (max - min), 0, 1);
  return x * x * (3 - 2 * x);
};

function rndi(a, b = 0) {
  if (a > b) [a, b] = [b, a];
  return Math.floor(a + Math.random() * (b - a + 1));
}

function valueNoise() {
  const tableSize = 256;
  const r = new Array(tableSize);
  const permutationTable = new Array(tableSize * 2);
  
  for (let k = 0; k < tableSize; k++) {
    r[k] = Math.random();
    permutationTable[k] = k;
  }
  
  for (let k = 0; k < tableSize; k++) {
    const i = Math.floor(Math.random() * tableSize);
    [permutationTable[k], permutationTable[i]] = [permutationTable[i], permutationTable[k]];
    permutationTable[k + tableSize] = permutationTable[k];
  }
  
  return function(px, py) {
    const xi = Math.floor(px);
    const yi = Math.floor(py);
    const tx = px - xi;
    const ty = py - yi;
    const rx0 = xi % tableSize;
    const rx1 = (rx0 + 1) % tableSize;
    const ry0 = yi % tableSize;
    const ry1 = (ry0 + 1) % tableSize;
    
    const c00 = r[permutationTable[permutationTable[rx0] + ry0]];
    const c10 = r[permutationTable[permutationTable[rx1] + ry0]];
    const c01 = r[permutationTable[permutationTable[rx0] + ry1]];
    const c11 = r[permutationTable[permutationTable[rx1] + ry1]];
    
    const sx = smoothstep(0, 1, tx);
    const sy = smoothstep(0, 1, ty);
    
    const nx0 = mix(c00, c10, sx);
    const nx1 = mix(c01, c11, sx);
    
    return mix(nx0, nx1, sy);
  };
}

const noise = valueNoise();

// color: antiquewhite; is too yellow. IDK why. 
function setupStyles() {
  const style = document.createElement('style');
  style.textContent = `
    #DOOMCONTAINER {
      user-select: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      margin: 0;
      padding: 0;
      overflow: hidden;
      white-space: pre;
      font-family: monospace;
      font-size: 10px;
      line-height: 1;
      background-color: #010101;
      color: white;
      box-sizing: border-box;
      letter-spacing: 0;
      word-spacing: 0;
      text-rendering: geometricPrecision;
      -webkit-font-smoothing: none;
      font-smooth: never;
      z-index: 0;
    }
  `;
  document.head.appendChild(style);
}

function initializeFire() {
  fireContainer.style.display = 'block';
  
  fireContainer.style.width = '100vw';
  fireContainer.style.height = '100vh';
  
  const computedStyle = window.getComputedStyle(fireContainer);
  const fontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
  
  const containerWidth = fireContainer.clientWidth;
  const containerHeight = fireContainer.clientHeight;
  
  const testSpan = document.createElement('span');
  testSpan.style.fontFamily = 'monospace';
  testSpan.style.fontSize = fontSize + 'px';
  testSpan.style.visibility = 'hidden';
  testSpan.textContent = 'X';
  document.body.appendChild(testSpan);
  const charWidth = testSpan.getBoundingClientRect().width;
  const charHeight = fontSize;
  document.body.removeChild(testSpan);
  
  cols = Math.ceil(containerWidth / charWidth) + 1; // +1 для надежности
  rows = Math.ceil(containerHeight / charHeight);
  
  fireContainer.style.whiteSpace = 'pre';
  fireContainer.style.overflowX = 'hidden';
  
  data = new Array(cols * rows).fill(0);
  
}

let mousePressed = false;
let mouseX = -1, mouseY = -1;

fireContainer.addEventListener('mousemove', (e) => {
  const rect = fireContainer.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(fireContainer);
  const fontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
  
  const testSpan = document.createElement('span');
  testSpan.style.fontFamily = 'monospace';
  testSpan.style.fontSize = fontSize + 'px';
  testSpan.style.visibility = 'hidden';
  testSpan.textContent = 'X';
  document.body.appendChild(testSpan);
  const charWidth = testSpan.getBoundingClientRect().width;
  const charHeight = fontSize;
  document.body.removeChild(testSpan);
  
  mouseX = Math.floor((e.clientX - rect.left) / charWidth);
  mouseY = Math.floor((e.clientY - rect.top) / charHeight);
});

fireContainer.addEventListener('mousedown', () => {
  mousePressed = true;
});

document.addEventListener('mouseup', () => {
  mousePressed = false;
});

fireContainer.addEventListener('mouseleave', () => {
  mouseX = -1;
  mouseY = -1;
});

let startTime = performance.now();
let lastFrameTime = 0;
const frameRate = 24; // Средняя скорость (24 fps)
const frameInterval = 1000 / frameRate;

function updateFire(time) {
  if (time - lastFrameTime < frameInterval) {
    requestAnimationFrame(updateFire);
    return;
  }
  
  lastFrameTime = time;
  
  const context = {
    time: time - startTime,
    cols: cols,
    rows: rows
  };
  
  if (!mousePressed) {
    const t = context.time * 0.0012;
    const last = cols * (rows - 1);
    
    for (let i = 0; i < cols; i++) {
      const val = Math.floor(map(noise(i * 0.05, t), 0, 1, 5, 35));
      data[last + i] = Math.min(val, data[last + i] + 2);
    }
  } else if (mouseX >= 0 && mouseY >= 0 && mouseX < cols && mouseY < rows) {
    data[mouseX + mouseY * cols] = rndi(5, 40);
  }
  
  for (let i = 0; i < data.length; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const dest = row * cols + clamp(col + rndi(-1, 1), 0, cols - 1);
    const src = Math.min(rows - 1, row + 1) * cols + col;
    data[dest] = Math.max(0, data[src] - rndi(0, 2));
  }
  
  let result = '';
  
  for (let y = 0; y < rows; y++) {
    let row = '';
    for (let x = 0; x < cols; x++) {
      const idx = y * cols + x;
      const u = data[idx];
      
      if (u === 0) {
        row += ' ';
      } else {
        const charIndex = clamp(u, 0, flame.length - 1);
        row += flame[charIndex];
      }
    }
    while (row.length < cols) {
      row += ' ';
    }
    result += row + '\n';
  }
  
  fireContainer.textContent = result;
  
  requestAnimationFrame(updateFire);
}

function handleVisibilityChange() {
  if (!document.hidden) {
    lastFrameTime = 0;
    startTime = performance.now();
    requestAnimationFrame(updateFire);
  }
}

document.addEventListener("visibilitychange", handleVisibilityChange);

setupStyles();
initializeFire();
window.addEventListener('resize', () => {
  setTimeout(initializeFire, 100);
});
requestAnimationFrame(updateFire);


console.log(`We're not web developers — we threw this site together in a few days, just for fun. Yeah, it might look kinda shitty. That's because... it is.`);