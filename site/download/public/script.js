document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 8);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const revealTargets = document.querySelectorAll(".section, .opensource");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    observer.observe(target);
  });
}

const copyButton = document.querySelector("[data-copy]");

copyButton?.addEventListener("click", async () => {
  const value = copyButton.getAttribute("data-copy") ?? "";
  const original = copyButton.textContent;

  try {
    await navigator.clipboard.writeText(value);
    copyButton.textContent = "已复制";
    copyButton.classList.add("is-copied");
  } catch {
    copyButton.textContent = "请手动复制上方命令";
  }

  window.setTimeout(() => {
    copyButton.textContent = original;
    copyButton.classList.remove("is-copied");
  }, 1800);
});
