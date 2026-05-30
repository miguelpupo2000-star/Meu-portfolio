const phone = document.getElementById('phone');
const screen = document.getElementById('screen');
const notif = document.getElementById('notif');
const angleVal = document.getElementById('angleVal');
const modeBtns = document.querySelectorAll('.mode-btn');
const gyroContainer = document.getElementById('gyro-container');
const btnGyro = document.getElementById('btn-atirar-gyro');

// Criação automática das quinas 3D
const corners = ['tl', 'tr', 'bl', 'br'];
corners.forEach(c => {
  const cornerEl = document.createElement('div');
  cornerEl.className = `corner corner-${c}`;
  for (let i = 1; i <= 16; i++) {
    const layer = document.createElement('div');
    layer.className = 'c-layer';
    layer.style.transform = `translateZ(-${i}px)`;
    cornerEl.appendChild(layer);
  }
  phone.appendChild(cornerEl);
});

let currentMode = 'full';
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
  });
});

let targetRx = 0, targetRy = 0, targetPriv = 0;
let rx = 0, ry = 0, priv = 0;
let hasInteracted = false;
let time = 0;
let gyroAtivo = false; 

function lerp(a, b, t) { return a + (b - a) * t; }

// Loop de Animação Principal
function tick() {
  if (!hasInteracted && !gyroAtivo) {
    time += 0.015;
    targetRy = Math.sin(time) * 20;
    targetRx = Math.cos(time * 0.8) * 10;

    let dist = Math.sqrt(targetRx * targetRx + targetRy * targetRy);
    let maxTilt = 40;
    let normDist = Math.min(dist / maxTilt, 1);
    targetPriv = Math.pow(normDist, 1.2) * 0.98;
    angleVal.textContent = Math.round(normDist * 85) + '°';
  }

  rx = lerp(rx, targetRx, 0.08);
  ry = lerp(ry, targetRy, 0.08);
  priv = lerp(priv, targetPriv, 0.1);

  phone.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;

  if (currentMode === 'full') {
    screen.style.setProperty('--priv-opacity', priv);
    notif.style.setProperty('--notif-priv', 0);
  } else {
    screen.style.setProperty('--priv-opacity', 0);
    notif.style.setProperty('--notif-priv', priv);
  }

  requestAnimationFrame(tick);
}
tick();

// Captura do mouse no Computador
document.addEventListener('mousemove', function (e) {
  if (window.innerWidth <= 600) return;
  hasInteracted = true;
  var rect = phone.getBoundingClientRect();
  var cx = rect.left + rect.width / 2;
  var cy = rect.top + rect.height / 2;
  var dx = e.clientX - cx;
  var dy = e.clientY - cy;
  var maxDist = Math.min(window.innerWidth, window.innerHeight) * 0.45;
  var dist = Math.sqrt(dx * dx + dy * dy);
  var normDist = Math.min(dist / maxDist, 1);
  var maxTilt = 40;
  targetRy = (dx / maxDist) * maxTilt;
  targetRx = -(dy / maxDist) * maxTilt;
  targetRy = Math.max(-maxTilt, Math.min(maxTilt, targetRy));
  targetRx = Math.max(-maxTilt, Math.min(maxTilt, targetRx));
  var angle = Math.round(normDist * 85);
  targetPriv = Math.pow(normDist, 1.2) * 0.98;
  angleVal.textContent = angle + '°';
});

document.addEventListener('mouseleave', function () {
  if (window.innerWidth <= 600) return;
  targetRx = 0; targetRy = 0; targetPriv = 0;
  angleVal.textContent = '0°';
});

// ==================================================
// LÓGICA DO GIROSCÓPIO CORRIGIDA
// ==================================================
function tratarMovimentoCelular(e) {
  if (!gyroAtivo) return;

  hasInteracted = true;
  let tiltY = e.gamma; 
  let tiltX = e.beta - 60; 

  let maxTilt = 35;
  targetRy = Math.max(-maxTilt, Math.min(maxTilt, tiltY));
  targetRx = Math.max(-maxTilt, Math.min(maxTilt, tiltX));

  let dist = Math.sqrt(targetRx * targetRx + targetRy * targetRy);
  let normDist = Math.min(dist / maxTilt, 1);
  targetPriv = Math.pow(normDist, 1.2) * 0.98;
  angleVal.textContent = Math.round(normDist * 85) + '°';
}

if (window.innerWidth <= 600) {
  gyroContainer.style.display = 'block';
}

function ativarSensores() {
  gyroAtivo = true;
  window.addEventListener('deviceorientation', tratarMovimentoCelular);
  // Muda o texto sem quebrar as tags do HTML
  btnGyro.textContent = 'Desativar Giroscópio 3D';
  btnGyro.style.background = '#330a0a'; 
}

function desativarSensores() {
  gyroAtivo = false;
  window.removeEventListener('deviceorientation', tratarMovimentoCelular);
  targetRx = 0;
  targetRy = 0;
  targetPriv = 0;
  angleVal.textContent = '0°';
  // Retorna para o texto original
  btnGyro.textContent = 'Ativar Giroscópio 3D';
  btnGyro.style.background = '#262626'; 
}


btnGyro.addEventListener('click', function() {
  if (gyroAtivo) {
    desativarSensores();
  } else {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            ativarSensores();
          } else {
            alert('Permissão negada.');
          }
        })
        .catch(console.error);
    } else {
      ativarSensores();
    }
  }
});

// Relógio Real
const elementoHora = document.querySelector('.time');
function atualizarRelogio() {
  const agora = new Date();
  const horas = String(agora.getHours()).padStart(2, '0');
  const minutos = String(agora.getMinutes()).padStart(2, '0');
  elementoHora.textContent = `${horas}:${minutos}`;
}
atualizarRelogio();
setInterval(atualizarRelogio, 5000);

// CORREÇÃO DOS WALLPAPERS AQUI (Removido erro de sintaxe)
const opcoesWallpaper = document.querySelectorAll('.wall-option');
const elementoWallpaper = document.querySelector('.wallpaper');
opcoesWallpaper.forEach(opcao => {
  opcao.addEventListener('click', () => {
    opcoesWallpaper.forEach(opt => opt.style.borderColor = '#444');
    opcao.style.borderColor = '#ff3333';
    const novoFundo = opcao.getAttribute('data-bg');
    elementoWallpaper.style.background = novoFundo;
  });
});

document.addEventListener('touchstart', function () {
  if (window.innerWidth <= 600 && !gyroAtivo) {
    hasInteracted = false; 
  }
}, { passive: true });
