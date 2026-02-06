const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const hint = document.getElementById("hint");
const success = document.getElementById("success");
const restartBtn = document.getElementById("restartBtn");
const shareBtn = document.getElementById("shareBtn");

const successMsg = document.getElementById("successMsg");

let noCount = 0;

const noMessages = [
  "Are you sureee? 🥺",
  "Wait… think again 😭",
  "This is hurting my feelings (gently) 💔",
  "Ok but… imagine how cute we’d be 😌",
  "Not you pressing NO again 😤",
  "Fine… I’ll keep asking 💅",
  "Okay… I’m still here 🫶",
  "You’re really testing me 😭",
];

const cuteYesMessages = [
  "Okay so we’re officially a cute moment now. Screenshot this & send it to me 😤💗",
  "YAY! You + me = cutest Valentine duo 🧸💞",
  "Stoppp I’m blushing. We’re locked in 💘",
  "We just became the main characters 😌❤️",
  "Best. Answer. Ever. Now pick a date idea 😉🌹",
];

// -------------------- Utils --------------------
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// -------------------- Floating hearts (background) --------------------
const heartsLayer = document.getElementById("hearts");
const heartChars = ["💗","💖","💕","💘","💞","❤️","🤍"];

function spawnHeart(intensity = 1) {
  if (!heartsLayer) return;

  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];

  const size = 12 + Math.random() * (22 * intensity); // 12–~40px
  const left = Math.random() * 100;
  const duration = 6 + Math.random() * 8; // float slower

  const drift = `${(Math.random() * 110 - 55).toFixed(0)}px`;
  const rot = `${(Math.random() * 140 - 70).toFixed(0)}deg`;
  const scale = (0.65 + Math.random() * 0.95).toFixed(2);

  heart.style.left = `${left}vw`;
  heart.style.fontSize = `${size}px`;
  heart.style.animationDuration = `${duration}s`;
  heart.style.setProperty("--drift", drift);
  heart.style.setProperty("--rot", rot);
  heart.style.setProperty("--scale", scale);

  heartsLayer.appendChild(heart);
  setTimeout(() => heart.remove(), duration * 1000);
}

let heartInterval;
function startHearts() {
  clearInterval(heartInterval);
  const isSmall = window.innerWidth < 420;
  heartInterval = setInterval(() => spawnHeart(1), isSmall ? 180 : 120);

  // initial sprinkle
  for (let i = 0; i < 22; i++) setTimeout(() => spawnHeart(1), i * 90);
}
window.addEventListener("resize", startHearts);
startHearts();

// -------------------- Better celebration: heart confetti + sparkles --------------------
const canvas = document.getElementById("celebrate");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let particles = [];
let animating = false;

function heartPath(x, y, size) {
  ctx.beginPath();
  const topCurveHeight = size * 0.3;
  ctx.moveTo(x, y + topCurveHeight);
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
  ctx.bezierCurveTo(
    x - size / 2,
    y + (size + topCurveHeight) / 2,
    x,
    y + (size + topCurveHeight) / 2,
    x,
    y + size
  );
  ctx.bezierCurveTo(
    x,
    y + (size + topCurveHeight) / 2,
    x + size / 2,
    y + (size + topCurveHeight) / 2,
    x + size / 2,
    y + topCurveHeight
  );
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
  ctx.closePath();
}

function burstHearts() {
  const W = window.innerWidth;
  const H = window.innerHeight;

  const colors = ["#ff2d70", "#ff4d8d", "#ff6b6b", "#ffffff", "#ffd1e0"];
  const count = 190;

  for (let i = 0; i < count; i++) {
    particles.push({
      x: W * 0.5 + (Math.random() - 0.5) * 180,
      y: H * 0.45 + (Math.random() - 0.5) * 90,
      vx: (Math.random() - 0.5) * 7.2,
      vy: -Math.random() * 9.4 - 3,
      g: 0.20 + Math.random() * 0.08,
      size: 6 + Math.random() * 10,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.25,
      a: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      kind: Math.random() < 0.18 ? "sparkle" : "heart",
    });
  }

  animating = true;
}

function animate() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (!animating && particles.length === 0) {
    requestAnimationFrame(animate);
    return;
  }

  particles = particles.filter((p) => p.a > 0.02 && p.y < window.innerHeight + 80);

  for (const p of particles) {
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.a *= 0.985;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = p.a;

    if (p.kind === "sparkle") {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color;
      heartPath(0, 0, p.size);
      ctx.fill();
    }

    ctx.restore();
  }

  if (particles.length === 0) animating = false;
  requestAnimationFrame(animate);
}
animate();

// -------------------- Button Logic --------------------
noBtn.addEventListener("click", () => {
  noCount++;

  hint.textContent = noMessages[Math.min(noCount - 1, noMessages.length - 1)];

  // YES grows each time NO is clicked (mobile-friendly)
  const scale = clamp(1 + noCount * 0.14, 1, 2.4);
  yesBtn.style.transform = `scale(${scale})`;

  // shake NO a bit (cute + obvious feedback)
  noBtn.animate(
    [
      { transform: "translateX(0px)" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(-4px)" },
      { transform: "translateX(0px)" },
    ],
    { duration: 220, iterations: 1 }
  );

  // sprinkle extra hearts
  for (let i = 0; i < 10; i++) setTimeout(() => spawnHeart(1), i * 70);

  // after enough NOs, change the No text 😭
  if (noCount >= 5) noBtn.textContent = "Stop 😭";
  if (noCount >= 8) noBtn.textContent = "Okay fine 😤";
});

yesBtn.addEventListener("click", () => {
  burstHearts();

  // extra hearts on YES
  for (let i = 0; i < 45; i++) setTimeout(() => spawnHeart(1.3), i * 35);

  successMsg.textContent =
    cuteYesMessages[Math.floor(Math.random() * cuteYesMessages.length)];

  hint.textContent = "";
  success.classList.remove("hidden");
});

restartBtn.addEventListener("click", () => {
  success.classList.add("hidden");
  noCount = 0;
  hint.textContent = "";
  yesBtn.style.transform = "scale(1)";
  noBtn.textContent = "No 😭";
});

shareBtn.addEventListener("click", async () => {
  const text = "Will you be my Valentine? 💌";
  const url = window.location.href;

  try {
    if (navigator.share) {
      await navigator.share({ title: "Valentine?", text, url });
    } else {
      await navigator.clipboard.writeText(url);
      hint.textContent = "Link copied! Paste & send 💖";
    }
  } catch {
    // user cancelled share
  }
});
