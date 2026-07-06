const AMAZON_URL = "https://www.amazon.co.jp/%E3%80%90%E3%83%93%E3%83%A5%E3%83%BC%E3%82%B1%E3%83%B3%E3%80%91%E9%85%B5%E5%96%84-%E6%A4%8D%E7%89%A9%E6%80%A7%E4%B9%B3%E9%85%B8%E8%8F%8C-%E3%83%8A%E3%83%8E%E5%9E%8B%E4%B9%B3%E9%85%B8%E8%8F%8C-%E3%81%8A%E6%BC%AC%E7%89%A9%E7%94%B1%E6%9D%A5-%E9%81%BA%E4%BC%9D%E5%AD%90%E7%B5%84%E3%81%BF%E6%8F%9B%E3%81%88%E3%81%AA%E3%81%97/dp/B0FTLPTY11";

/* ---- Amazon links ---- */
const amazonLinks = document.querySelectorAll("[data-amazon-link]");
const toast = document.querySelector(".toast");
let toastTimer;

function showToast() {
  if (!toast) return;

  toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2800);
}

amazonLinks.forEach((link) => {
  if (AMAZON_URL) {
    link.href = AMAZON_URL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return;
  }

  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast();
  });
});

/* ---- hero entrance: wait for the brand serif, then play ---- */
const fontsReady = "fonts" in document
  ? Promise.race([document.fonts.ready, new Promise((resolve) => setTimeout(resolve, 700))])
  : Promise.resolve();

fontsReady.then(() => {
  requestAnimationFrame(() => document.body.classList.add("is-loaded"));
});

/* split 酵善 into per-character spans for the staggered title reveal */
const heroTitleJa = document.querySelector(".hero-title-ja");
if (heroTitleJa) {
  const chars = Array.from(heroTitleJa.textContent.trim());
  heroTitleJa.textContent = "";
  chars.forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "char";
    span.style.setProperty("--i", i);
    span.textContent = ch;
    heroTitleJa.appendChild(span);
  });
}

/* ---- scroll-linked UI: header, progress bar, purchase dock ---- */
const header = document.querySelector(".site-header");
const progressBar = document.querySelector(".scroll-progress");
const dock = document.querySelector(".purchase-dock");
const dockTrigger = document.querySelector("#routine");

let scrollScheduled = false;

function onScrollFrame() {
  scrollScheduled = false;
  const y = window.scrollY;

  if (header) header.classList.toggle("is-scrolled", y > 10);

  if (progressBar) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
  }

  if (dock) {
    const triggerY = dockTrigger
      ? dockTrigger.offsetTop - window.innerHeight * 0.45
      : window.innerHeight * 1.4;
    dock.classList.toggle("is-visible", y > triggerY);
  }
}

function requestScrollFrame() {
  if (!scrollScheduled) {
    scrollScheduled = true;
    requestAnimationFrame(onScrollFrame);
  }
}

onScrollFrame();
window.addEventListener("scroll", requestScrollFrame, { passive: true });
window.addEventListener("resize", requestScrollFrame, { passive: true });
