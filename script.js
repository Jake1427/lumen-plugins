const progress = document.querySelector(".progress");
const reveals = document.querySelectorAll(".reveal");
const toast = document.querySelector("#toast");

function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${Math.min(100, (scrollY / max) * 100)}%`;
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      if (entry.target.classList.contains("mini-demo")) entry.target.classList.add("active");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

reveals.forEach(el => observer.observe(el));

document.querySelectorAll(".spotlight").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - r.left}px`);
    card.style.setProperty("--y", `${e.clientY - r.top}px`);
  });
});

document.querySelectorAll(".magnetic").forEach(button => {
  button.addEventListener("pointermove", e => {
    const r = button.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * .18;
    const y = (e.clientY - r.top - r.height / 2) * .28;
    button.style.transform = `translate(${x}px, ${y}px)`;
  });
  button.addEventListener("pointerleave", () => {
    button.style.transform = "";
  });
});

const code = {
  glow: `<h1 class="glow">Lumen</h1>

<style>
.glow {
  color: white;
  text-shadow:
    0 0 18px rgba(255,255,255,.28),
    0 0 55px rgba(150,120,255,.35);
}
</style>`,
  reveal: `<div class="reveal">Hello.</div>

<style>
.reveal {
  opacity: 0;
  transform: translateY(35px);
  transition: 1.2s cubic-bezier(.16,1,.3,1);
}
.reveal.show {
  opacity: 1;
  transform: none;
}
</style>

<script>
new IntersectionObserver(([e]) =>
  e.target.classList.toggle("show", e.isIntersecting)
).observe(document.querySelector(".reveal"));
</script>`,
  magnetic: `<button class="magnetic">Move your cursor →</button>

<script>
const button = document.querySelector(".magnetic");

button.onpointermove = (e) => {
  const r = button.getBoundingClientRect();
  const x = (e.clientX-r.left-r.width/2)*.18;
  const y = (e.clientY-r.top-r.height/2)*.28;
  button.style.transform = \`translate(\${x}px,\${y}px)\`;
};

button.onpointerleave = () => button.style.transform = "";
</script>`,
  glass: `<div class="glass">Designed to float.</div>

<style>
.glass {
  padding: 28px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 24px;
  background: rgba(255,255,255,.07);
  backdrop-filter: blur(25px);
  box-shadow: 0 30px 90px rgba(0,0,0,.45);
}
</style>`,
  gradient: `<div class="gradient">Fluid gradients.</div>

<style>
.gradient {
  background: linear-gradient(110deg,#14101f,#08131e,#171008);
  background-size: 300% 300%;
  animation: shift 5s ease infinite;
}
@keyframes shift {
  50% { background-position: 100% 60%; }
}
</style>`,
  spotlight: `const card = document.querySelector(".card");

card.addEventListener("pointermove", (e) => {
  const r = card.getBoundingClientRect();
  card.style.setProperty("--x", \`\${e.clientX-r.left}px\`);
  card.style.setProperty("--y", \`\${e.clientY-r.top}px\`);
});`,
  marquee: `<div class="marquee">
  <span>MAKE IT FEEL GOOD</span>
</div>

<style>
.marquee {
  overflow: hidden;
  white-space: nowrap;
}
.marquee span {
  display: inline-block;
  animation: move 18s linear infinite;
}
@keyframes move {
  to { transform: translateX(-100%); }
}
</style>`
};

const horizontalSection = document.querySelector(".side-scroll-wrap");
const horizontalTrack = document.querySelector(".side-scroll");

function updateHorizontalScroll() {
  if (!horizontalSection || !horizontalTrack) return;

  const sectionTop = horizontalSection.getBoundingClientRect().top + window.scrollY;
  const totalHorizontalDistance = Math.max(horizontalTrack.scrollWidth - window.innerWidth, 0);
  const distanceScrolled = Math.max(window.scrollY - sectionTop, 0);
  const progress = totalHorizontalDistance > 0 ? Math.min(distanceScrolled / totalHorizontalDistance, 1) : 1;

  const maxTranslateX = totalHorizontalDistance;
  horizontalTrack.style.transform = `translateX(${-progress * maxTranslateX}px)`;

  if (progress < 1) {
    horizontalTrack.style.position = 'sticky';
    horizontalTrack.style.top = '0';
  } else {
    horizontalTrack.style.position = 'relative';
    horizontalTrack.style.top = '';
  }
}


window.addEventListener("scroll", updateHorizontalScroll, {
  passive: true
});

window.addEventListener("resize", updateHorizontalScroll);

updateHorizontalScroll();

document.querySelectorAll(".copy-btn").forEach(btn => {
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(code[btn.dataset.copy] || "");
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 1800);
    } catch {
      toast.textContent = "Copy failed — select the code manually";
      toast.classList.add("show");
      setTimeout(() => {
        toast.textContent = "Copied to clipboard ✓";
        toast.classList.remove("show");
      }, 2200);
    }
  });
});
