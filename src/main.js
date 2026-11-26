import './style.css';

// Durasi awal: atur di sini
const INITIAL = { hours: 0, minutes: 5, seconds: 0 };

const INITIAL_MS =
  ((INITIAL.hours * 60 + INITIAL.minutes) * 60 +
    INITIAL.seconds) * 1000;

const els = {
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
};
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

let remaining = INITIAL_MS; // sisa waktu (ms)
let endTime = 0;            // waktu selesai saat berjalan
let timerId = null;

const pad = (n) => String(n).padStart(2, '0');

function setValue(el, value) {
  const text = pad(value);
  if (el.textContent !== text) {
    el.textContent = text;
    el.classList.remove('tick');
    void el.offsetWidth; // restart animasi
    el.classList.add('tick');
  }
}

function render(ms) {
  const total = Math.ceil(ms / 1000);
  setValue(els.hours, Math.floor(total / 3600) % 24);
  setValue(els.minutes, Math.floor(total / 60) % 60);
  setValue(els.seconds, total % 60);
}

function updateButtons() {
  const running = timerId !== null;
  startBtn.disabled = running || remaining <= 0;
  stopBtn.disabled = !running;
}

function tick() {
  remaining = Math.max(0, endTime - Date.now());
  render(remaining);

  if (remaining === 0) {
    clearInterval(timerId);
    timerId = null;
    updateButtons();
  }
}

function start() {
  if (timerId !== null || remaining <= 0) return;
  endTime = Date.now() + remaining;
  timerId = setInterval(tick, 200); // interval kecil agar detik akurat
  updateButtons();
}

function stop() {
  if (timerId === null) return;
  remaining = Math.max(0, endTime - Date.now()); // simpan sisa waktu
  clearInterval(timerId);
  timerId = null;
  updateButtons();
}

function reset() {
  clearInterval(timerId);
  timerId = null;
  remaining = INITIAL_MS;
  render(remaining);
  updateButtons();
}

startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
resetBtn.addEventListener('click', reset);

render(remaining);
updateButtons();