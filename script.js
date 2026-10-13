/* ============================================================
   Para Celisbeth — una carta hecha de estrellas y flores
   por Jose ♡
   ============================================================ */

/* ---------- 1. FONDO: ESTRELLAS + ESTRELLAS FUGACES ---------- */
const canvas = document.getElementById('cosmos');
const ctx = canvas.getContext('2d');
let estrellas = [];
let estrellasFugaces = [];
let W, H;

function ajustarCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  crearEstrellas();
}

function crearEstrellas() {
  const cantidad = Math.min(260, Math.floor((W * H) / 8500));
  estrellas = [];
  for (let i = 0; i < cantidad; i++) {
    estrellas.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.3,
      alfa: Math.random(),
      velocidad: Math.random() * 0.015 + 0.004,
      tono: Math.random(),
    });
  }
}

function colorEstrella(tono) {
  if (tono > 0.7) return '255, 214, 228';
  if (tono > 0.4) return '214, 200, 255';
  return '255, 255, 255';
}

function dibujarEstrellas() {
  ctx.clearRect(0, 0, W, H);

  for (const s of estrellas) {
    s.alfa += s.velocidad;
    const brillo = 0.35 + Math.abs(Math.sin(s.alfa)) * 0.65;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${colorEstrella(s.tono)}, ${brillo})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `rgba(${colorEstrella(s.tono)}, ${brillo})`;
    ctx.fill();
  }
  ctx.shadowBlur = 0;

  if (Math.random() < 0.007) {
    estrellasFugaces.push({
      x: Math.random() * W * 0.7,
      y: Math.random() * H * 0.4,
      len: Math.random() * 160 + 90,
      vel: Math.random() * 7 + 6,
      vida: 1,
    });
  }
  estrellasFugaces = estrellasFugaces.filter((f) => f.vida > 0);
  for (const f of estrellasFugaces) {
    const grad = ctx.createLinearGradient(f.x, f.y, f.x + f.len, f.y + f.len * 0.4);
    grad.addColorStop(0, `rgba(255, 255, 255, ${f.vida})`);
    grad.addColorStop(1, 'rgba(255, 143, 177, 0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(f.x, f.y);
    ctx.lineTo(f.x + f.len, f.y + f.len * 0.4);
    ctx.stroke();
    f.x += f.vel;
    f.y += f.vel * 0.4;
    f.vida -= 0.012;
  }
  requestAnimationFrame(dibujarEstrellas);
}

window.addEventListener('resize', ajustarCanvas);
ajustarCanvas();
requestAnimationFrame(dibujarEstrellas);

/* ---------- 2. CORAZONES FLOTANTES DE LA PORTADA ---------- */
(function corazonesFlotantes() {
  const cont = document.getElementById('corazones-flotantes');
  const simbolos = ['♡', '♥', '✿', '✦'];
  setInterval(() => {
    const c = document.createElement('span');
    c.className = 'corazon-flota';
    c.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
    c.style.left = `${Math.random() * 100}%`;
    c.style.fontSize = `${14 + Math.random() * 22}px`;
    c.style.animationDuration = `${7 + Math.random() * 7}s`;
    c.style.color = Math.random() > 0.5 ? '#ff8fb1' : '#c79cff';
    cont.appendChild(c);
    setTimeout(() => c.remove(), 15000);
  }, 700);
})();

/* ---------- 3. PISO DE FLORES DE LA PORTADA ---------- */
(function pisoFlores() {
  const cont = document.getElementById('flores-portada');
  const colores = ['#ff8fb1', '#ffb3d1', '#c79cff', '#ffd98a', '#ffffff', '#ff9ec4'];
  for (let i = 0; i < 16; i++) {
    const flor = document.createElement('div');
    const c = colores[i % colores.length];
    flor.className = 'flor-css';
    flor.style.animationDelay = `${(Math.random() * 3).toFixed(2)}s`;
    flor.style.height = `${60 + Math.random() * 40}px`;
    flor.innerHTML = `
      <div class="tallo"></div>
      <div class="cabeza" style="background: radial-gradient(circle at 40% 35%, #fff, ${c} 60%, #b03a66);"></div>`;
    cont.appendChild(flor);
  }
})();

/* ---------- 4. NAVEGACIÓN ENTRE PANTALLAS ---------- */
function mostrarPantalla(id) {
  document.querySelectorAll('.pantalla').forEach((p) => p.classList.remove('activa'));
  const destino = document.getElementById(id);
  destino.classList.add('activa');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- 5. EL SOBRE SE ABRE ---------- */
const sobre = document.getElementById('btn-abrir');
let sobreAbierto = false;
sobre.addEventListener('click', () => {
  if (sobreAbierto) return;
  sobreAbierto = true;
  sobre.classList.add('abierto');
  setTimeout(() => {
    mostrarPantalla('pantalla-carta');
    escribirCarta();
  }, 1100);
});

/* ---------- 6. MÁQUINA DE ESCRIBIR: LA CARTA ---------- */
const TEXTO_CARTA = `No sé en qué momento exacto te volviste tan importante, Celi.

Sé que no hace mucho que nos conocemos, y quizá por eso esto me da un poco de nervios... pero no quería seguir guardándomelo.

Me gusta todo de ti, aunque si tuviera que elegir: tu sonrisa y tus ojos. Se me quedan grabados y me acompañan el resto del día.

No pretendo robarte tiempo ni apurarte. Solo quería que supieras, con calma y de verdad, que me gustas. Muchísimo.

Y que si algún día me regalas un poquito más de tu tiempo, prometo cuidarlo y hacerte sentir especial.`;

const nodoTexto = document.getElementById('texto-carta');
const firma = document.querySelector('.firma');
let cartaYaEscrita = false;

function escribirCarta() {
  if (cartaYaEscrita) return;
  cartaYaEscrita = true;
  let i = 0;
  const velocidad = 30;

  (function paso() {
    if (i <= TEXTO_CARTA.length) {
      nodoTexto.textContent = TEXTO_CARTA.slice(0, i);
      const c = TEXTO_CARTA[i - 1];
      const pausa = c === '.' || c === ',' ? velocidad * 6 : c === '\n' ? velocidad * 7 : velocidad;
      i++;
      setTimeout(paso, pausa);
    } else {
      nodoTexto.classList.add('completo');
      firma.classList.add('visible');
      lanzarPetalos();
    }
  })();
}

function lanzarPetalos() {
  const cont = document.getElementById('petalos-carta');
  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'petalo';
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDuration = `${6 + Math.random() * 6}s`;
    p.style.animationDelay = `${(Math.random() * 6).toFixed(2)}s`;
    const s = 8 + Math.random() * 10;
    p.style.width = `${s}px`;
    p.style.height = `${s}px`;
    cont.appendChild(p);
  }
}

/* ---------- 7. CAPÍTULOS ---------- */
const capitulos = [
  {
    numero: 'I',
    titulo: 'De tu sonrisa',
    texto: 'Es lo primero que busco cada vez que apareces. Hay algo en tu forma de sonreír que me desarma por completo: se me olvida lo que iba a decir y solo pienso en cómo hacer para verla otra vez.',
  },
  {
    numero: 'II',
    titulo: 'De tus ojos',
    texto: 'Tus ojos tienen una forma de mirar que me deja sin palabras. Cuando me miras siento que el mundo se queda quieto un segundo, como si en ese instante solo existiéramos tú y yo.',
  },
  {
    numero: 'III',
    titulo: 'De todo lo demás',
    texto: 'Me gusta todo de ti, de verdad. No es solo lo bonita que eres, aunque lo eres: me atrae cómo hablas, cómo piensas, cómo eres. Todo tu conjunto es lo que me tiene aquí.',
  },
  {
    numero: 'IV',
    titulo: 'De tu tiempo',
    texto: 'Sé que no te sobra el tiempo, y lo entiendo. Pero para mí, cada ratito que me regalas, por pequeño que sea, vale muchísimo más de lo que imaginas. No lo doy por sentado.',
  },
  {
    numero: 'V',
    titulo: 'De lo que siento',
    texto: 'No voy a exagerar ni prometerte cosas que no puedo cumplir. Solo sé que cuando pienso en alguien, pienso en ti. Y eso, para mí, ya lo dice todo.',
  },
  {
    numero: 'VI',
    titulo: 'Y lo que viene',
    texto: 'Me gustas hoy, tal y como eres. Sin prisa, sin presión... pero con muchísimas ganas de que esto sea el principio de algo bonito. Y si me dejas, con ganas de ser tuyo.',
  },
];

let indiceCapitulo = 0;
const capaCapitulo = document.getElementById('capa-capitulo');
const numEl = document.getElementById('num-capitulo');
const titEl = document.getElementById('titulo-capitulo');
const txtEl = document.getElementById('texto-capitulo-texto');
const barra = document.getElementById('barra-relleno');

function pintarCapitulo() {
  const c = capitulos[indiceCapitulo];
  numEl.textContent = c.numero;
  titEl.textContent = c.titulo;
  txtEl.textContent = c.texto;
  capaCapitulo.style.animation = 'none';
  void capaCapitulo.offsetWidth;
  capaCapitulo.style.animation = 'aparecer .8s ease both';
  barra.style.width = `${((indiceCapitulo + 1) / capitulos.length) * 100}%`;
}

document.getElementById('btn-capitulo1').addEventListener('click', () => {
  indiceCapitulo = 0;
  pintarCapitulo();
  mostrarPantalla('pantalla-capitulos');
});

document.getElementById('btn-siguiente-capitulo').addEventListener('click', () => {
  indiceCapitulo++;
  if (indiceCapitulo < capitulos.length) {
    pintarCapitulo();
  } else {
    construirJardin();
    mostrarPantalla('pantalla-jardin');
  }
});

/* ---------- 8. EL JARDÍN DE FLORES ---------- */
const motivos = [
  'Por tu sonrisa: es mi lugar favorito en el mundo entero.',
  'Por tus ojos: cada vez que me miran me desordenan el corazón.',
  'Porque me gusta todo de ti, y cada día descubro un motivo nuevo.',
  'Porque hasta el poquito tiempo que me das, para mí vale oro.',
  'Porque simplemente me gustas, Celi, y ya no hay mucho más que explicar.',
];

const coloresJardin = ['#ff8fb1', '#c79cff', '#ffd98a', '#ff9ec4', '#8fd3ff'];

function construirJardin() {
  const jardin = document.getElementById('jardin');
  if (jardin.dataset.listo) return;
  jardin.dataset.listo = '1';

  document.querySelectorAll('.parcela').forEach((parcela, idx) => {
    const color = coloresJardin[idx % coloresJardin.length];
    let petalosHTML = '';
    const numPetalos = 6;
    for (let p = 0; p < numPetalos; p++) {
      const ang = (360 / numPetalos) * p;
      petalosHTML += `<div class="petaloflor" style="--color-flor:${color};
        transform: translate(-50%, -100%) rotate(${ang}deg);"></div>`;
    }
    parcela.innerHTML = `
      <div class="tierra"></div>
      <div class="talloverde"></div>
      <div class="flor">
        ${petalosHTML}
        <div class="centroflor"></div>
      </div>`;

    parcela.addEventListener('click', (e) => {
      parcela.classList.add('abierta');
      mostrarMensajeFlor(e.currentTarget, motivos[idx]);
    });
  });

  setTimeout(() => document.querySelectorAll('.parcela')[0]?.classList.add('abierta'), 800);
}

let mensajeActual = null;
function mostrarMensajeFlor(elemento, texto) {
  if (mensajeActual) mensajeActual.remove();
  const marca = document.createElement('div');
  marca.className = 'mensaje-flor';
  marca.textContent = texto;
  document.body.appendChild(marca);
  const rect = elemento.getBoundingClientRect();
  const ancho = 260;
  let left = rect.left + rect.width / 2 - ancho / 2;
  left = Math.max(12, Math.min(left, window.innerWidth - ancho - 12));
  marca.style.left = `${left}px`;
  marca.style.width = `${ancho}px`;
  marca.style.top = `${Math.max(12, rect.top - 90)}px`;
  mensajeActual = marca;

  clearTimeout(marca._timer);
  marca._timer = setTimeout(() => {
    marca.style.transition = 'opacity .5s';
    marca.style.opacity = '0';
    setTimeout(() => marca.remove(), 500);
    if (mensajeActual === marca) mensajeActual = null;
  }, 4400);
}

document.getElementById('btn-nombre').addEventListener('click', () => {
  mostrarPantalla('pantalla-nombre');
  trazarNombreEstelar();
});

/* ---------- 9. ESTRELLITA QUE RECORRE SU NOMBRE ---------- */
let nombreTrazado = false;
function trazarNombreEstelar() {
  if (nombreTrazado) return;
  nombreTrazado = true;
  const cont = document.getElementById('pantalla-nombre');
  const objetivo = document.getElementById('nombre-estelar').getBoundingClientRect();
  let x = objetivo.left + 20;
  let paso = 0;
  const total = 42;
  const intervalo = setInterval(() => {
    if (paso > total) { clearInterval(intervalo); return; }
    const estrella = document.createElement('span');
    estrella.className = 'destello';
    estrella.textContent = '✦';
    estrella.style.left = `${objetivo.left + (objetivo.width * paso) / total}px`;
    estrella.style.top = `${objetivo.top + objetivo.height / 2 + (Math.random() - 0.5) * 40}px`;
    estrella.style.color = Math.random() > 0.5 ? '#ffd98a' : '#ff8fb1';
    document.body.appendChild(estrella);
    setTimeout(() => estrella.remove(), 900);
    paso++;
  }, 60);
}

document.getElementById('btn-final').addEventListener('click', () => {
  mostrarPantalla('pantalla-final');
  iniciarLluviaCorazones();
});

/* ---------- 10. LLUVIA DE CORAZONES FINAL ---------- */
let lluviaActiva = false;
function iniciarLluviaCorazones() {
  if (lluviaActiva) return;
  lluviaActiva = true;
  const cont = document.getElementById('lluvia-corazones');
  const simbolos = ['♡', '♥', '✦', '❀', '✿'];
  setInterval(() => {
    const c = document.createElement('span');
    c.className = 'corazon-cae';
    c.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
    c.style.left = `${Math.random() * 100}%`;
    c.style.fontSize = `${14 + Math.random() * 24}px`;
    c.style.animationDuration = `${5 + Math.random() * 6}s`;
    c.style.color = Math.random() > 0.5 ? '#ff8fb1' : '#c79cff';
    cont.appendChild(c);
    setTimeout(() => c.remove(), 12000);
  }, 240);
}

/* ---------- 11. ÚLTIMO BOTÓN: CIERRA LA CARTA Y MUESTRA EL FINAL ---------- */
const contenedorFinal = document.getElementById('final-contenido');
const cartaFinal = document.getElementById('carta-final');

document.getElementById('btn-corazon').addEventListener('click', () => {
  if (cartaFinal.classList.contains('cerrando')) return;
  cartaFinal.classList.add('cerrando');

  // estallido de corazones al cerrar
  for (let i = 0; i < 24; i++) {
    const c = document.createElement('span');
    c.className = 'corazon-cae';
    c.textContent = '♡';
    c.style.left = `${50 + (Math.random() - 0.5) * 60}vw`;
    c.style.fontSize = `${16 + Math.random() * 24}px`;
    c.style.animationDuration = `${3 + Math.random() * 3}s`;
    document.getElementById('lluvia-corazones').appendChild(c);
    setTimeout(() => c.remove(), 6000);
  }

  // cuando termina de cerrarse la carta, aparece el mensaje final + Fin
  setTimeout(() => {
    cartaFinal.style.display = 'none';
    contenedorFinal.classList.add('mostrando');
    contenedorFinal.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 1150);
});

/* ---------- 11b. EL "FIN" EXPLOTA EN UN CORAZÓN GIGANTE ---------- */
const botonFin = document.getElementById('fin');

function explosionCorazones() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const simbolos = ['♡', '♥', '✦', '❀', '✿'];
  const colores = ['#ff8fb1', '#c79cff', '#ffd98a', '#ff9ec4', '#ffffff'];
  const maxDim = Math.max(window.innerWidth, window.innerHeight);

  for (let i = 0; i < 80; i++) {
    const p = document.createElement('span');
    p.className = 'particula-corazon';
    p.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];

    const ang = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * maxDim * 0.65;
    p.style.setProperty('--tx', `${Math.cos(ang) * dist}px`);
    p.style.setProperty('--ty', `${Math.sin(ang) * dist}px`);
    p.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
    p.style.color = colores[Math.floor(Math.random() * colores.length)];
    p.style.fontSize = `${14 + Math.random() * 28}px`;
    p.style.animationDuration = `${0.9 + Math.random() * 0.9}s`;

    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2200);
  }
}

botonFin.addEventListener('click', () => {
  if (botonFin.dataset.explotando) return;
  botonFin.dataset.explotando = '1';

  // corazón gigante que crece y estalla
  const grande = document.createElement('span');
  grande.className = 'corazon-gigante';
  grande.textContent = '♥';
  document.body.appendChild(grande);
  setTimeout(() => grande.remove(), 1300);

  // pequeña vibración de pantalla
  document.body.classList.add('temblor');
  setTimeout(() => document.body.classList.remove('temblor'), 520);

  // primera oleada de partículas
  explosionCorazones();
  // segunda oleada al "estallar"
  setTimeout(explosionCorazones, 650);

  setTimeout(() => { delete botonFin.dataset.explotando; }, 1600);
});

/* ---------- 12. DESTELLOS QUE SIGUEN EL CURSOR ---------- */
let ultimoDestello = 0;
document.addEventListener('pointermove', (e) => {
  const ahora = Date.now();
  if (ahora - ultimoDestello < 70) return;
  ultimoDestello = ahora;
  const d = document.createElement('span');
  d.className = 'destello';
  d.textContent = Math.random() > 0.5 ? '♡' : '✦';
  d.style.left = `${e.clientX}px`;
  d.style.top = `${e.clientY}px`;
  d.style.color = Math.random() > 0.5 ? '#ffd98a' : '#ff8fb1';
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 900);
});

/* ---------- 13. MÚSICA: la canción, con reproductor de YouTube ---------- */
const VIDEO_ID = 'SFE09MuKZk8';
const btnMusica = document.getElementById('btn-musica');
const textoMusica = document.getElementById('texto-musica');

let reproductor = null;
let playerListo = false;
let musicaSonando = false;
let quiereSonar = false;

function actualizarBoton() {
  if (musicaSonando) {
    btnMusica.classList.add('sonando');
    textoMusica.textContent = 'Pausar música';
  } else {
    btnMusica.classList.remove('sonando');
    textoMusica.textContent = 'Dale click a la música';
  }
}

function reproducir() {
  quiereSonar = true;
  if (playerListo && reproductor && reproductor.playVideo) reproductor.playVideo();
}

function pausar() {
  quiereSonar = false;
  if (playerListo && reproductor && reproductor.pauseVideo) reproductor.pauseVideo();
}

// La API de YouTube llama a esta función cuando está lista
window.onYouTubeIframeAPIReady = function () {
  reproductor = new YT.Player('yt-player', {
    videoId: VIDEO_ID,
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      loop: 1,
      playlist: VIDEO_ID,
      playsinline: 1,
      modestbranding: 1,
      rel: 0,
    },
    events: {
      onReady: () => {
        playerListo = true;
        actualizarBoton();
        if (quiereSonar) reproductor.playVideo();
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.PLAYING) {
          musicaSonando = true;
        } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
          musicaSonando = false;
        }
        actualizarBoton();
      },
    },
  });
};

btnMusica.addEventListener('click', () => {
  if (musicaSonando) pausar();
  else reproducir();
});

actualizarBoton();
