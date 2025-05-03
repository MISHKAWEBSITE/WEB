

  // Код эффекта Doom Fire
  const fireContainer = document.getElementById('fire-container');
  
  // Оригинальный код реализации огня
  const flame = '...::/\\/\\/\\+=*abcdef01XYZ#';
  let cols, rows;
  let data = [];
  
  // Вспомогательные функции
  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  const map = (value, inMin, inMax, outMin, outMax) => 
    (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  const mix = (a, b, t) => a * (1 - t) + b * t;
  const smoothstep = (min, max, value) => {
    const x = clamp((value - min) / (max - min), 0, 1);
    return x * x * (3 - 2 * x);
  };
  
  // Случайное целое число
  function rndi(a, b = 0) {
    if (a > b) [a, b] = [b, a];
    return Math.floor(a + Math.random() * (b - a + 1));
  }
  
  // Функция шума
  function valueNoise() {
    const tableSize = 256;
    const r = new Array(tableSize);
    const permutationTable = new Array(tableSize * 2);
    
    // Создание массива случайных значений и инициализация таблицы перестановок
    for (let k = 0; k < tableSize; k++) {
      r[k] = Math.random();
      permutationTable[k] = k;
    }
    
    // Перемешивание значений таблицы перестановок
    for (let k = 0; k < tableSize; k++) {
      const i = Math.floor(Math.random() * tableSize);
      // swap
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
      
      // Случайные значения в углах ячейки с использованием таблицы перестановок
      const c00 = r[permutationTable[permutationTable[rx0] + ry0]];
      const c10 = r[permutationTable[permutationTable[rx1] + ry0]];
      const c01 = r[permutationTable[permutationTable[rx0] + ry1]];
      const c11 = r[permutationTable[permutationTable[rx1] + ry1]];
      
      // Ремаппинг tx и ty с использованием функции Smoothstep
      const sx = smoothstep(0, 1, tx);
      const sy = smoothstep(0, 1, ty);
      
      // Линейная интерполяция значений по оси x
      const nx0 = mix(c00, c10, sx);
      const nx1 = mix(c01, c11, sx);
      
      // Линейная интерполяция nx0/nx1 по оси y
      return mix(nx0, nx1, sy);
    };
  }
  
  const noise = valueNoise();
  
  // Инициализация размеров
  function initializeFire() {
    // Расчет размеров на основе размера шрифта и контейнера
    const computedStyle = window.getComputedStyle(fireContainer);
    const fontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
    
    const charWidth = fontSize * 0.6;
    const charHeight = fontSize;
    
    cols = Math.floor(window.innerWidth / charWidth);
    rows = Math.floor(window.innerHeight / charHeight);
    
    // Инициализация массива данных
    data = new Array(cols * rows).fill(0);
  }
  
  // Обработка нажатия мыши
  let mousePressed = false;
  let mouseX = -1, mouseY = -1;
  
  fireContainer.addEventListener('mousemove', (e) => {
    const rect = fireContainer.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(fireContainer);
    const fontSize = parseFloat(computedStyle.getPropertyValue('font-size'));
    
    const charWidth = fontSize * 0.6;
    const charHeight = fontSize;
    
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
  
  // Обновление и отрисовка огня
  let startTime = performance.now();
  let lastFrameTime = 0;
  const frameRate = 24; // Средняя скорость (24 fps)
  const frameInterval = 1000 / frameRate;
  
  function updateFire(time) {
    // Обновление только с заданной частотой кадров
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
    
    // Заполнение нижнего ряда шумом
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
    
    // Распространение к верху с некоторой случайностью
    for (let i = 0; i < data.length; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const dest = row * cols + clamp(col + rndi(-1, 1), 0, cols - 1);
      const src = Math.min(rows - 1, row + 1) * cols + col;
      data[dest] = Math.max(0, data[src] - rndi(0, 2));
    }
    
    // Отрисовка ASCII огня
    let result = '';
    
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const idx = y * cols + x;
        const u = data[idx];
        
        if (u === 0) {
          result += ' '; // Вставляет пробел
        } else {
          const charIndex = clamp(u, 0, flame.length - 1);
          result += flame[charIndex];
        }
      }
      result += '\n';
    }
    
    fireContainer.textContent = result;
    
    requestAnimationFrame(updateFire);
  }
  
  // Инициализация и запуск
  initializeFire();
  window.addEventListener('resize', initializeFire);
  requestAnimationFrame(updateFire);
