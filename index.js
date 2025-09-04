function setupCarousel(root) {
  const frame = root.querySelector("[data-frame]");
  const slides = Array.from(frame.querySelectorAll("img"));
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  const thumbs = Array.from(root.querySelectorAll("[data-thumb]"));

  let index = 0;

  function render() {
    slides.forEach((img, i) => (img.hidden = i !== index));
    thumbs.forEach((t, i) => {
      t.classList.toggle("is-active", i === index);
      t.setAttribute("aria-current", i === index ? "true" : "false");
      t.tabIndex = i === index ? 0 : -1;
    });
    root.dispatchEvent(
      new CustomEvent("carouselchange", { detail: { index } })
    );
  }

  function show(i) {
    index = (i + slides.length) % slides.length;
    render();
  }

  prev?.addEventListener("click", () => show(index - 1));
  next?.addEventListener("click", () => show(index + 1));

  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      show(index - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      show(index + 1);
    }
    if (e.key === "Home") {
      e.preventDefault();
      show(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      show(slides.length - 1);
    }
  });

  thumbs.forEach((t, i) => {
    t.addEventListener("click", () => show(i));
    t.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        show(i);
      }
    });
  });

  render();

  return {
    getIndex: () => index,
    setIndex: (i) => show(i),
    next: () => show(index + 1),
    prev: () => show(index - 1),
  };
}

const mainRoot = document.getElementById("carousel");
const main = setupCarousel(mainRoot);

const modalEl = document.getElementById("product-modal");
const modalCarouselRoot = modalEl.querySelector(".product-carousel--modal");
const modal = setupCarousel(modalCarouselRoot);

document
  .getElementById("product-carousel-frame")
  .addEventListener("click", () => {
    modal.setIndex(main.getIndex());
    modalEl.showModal();
    modalEl.querySelector("[data-close]").focus();
  });

modalEl
  .querySelector("[data-close]")
  .addEventListener("click", () => modalEl.close());
modalEl.addEventListener("click", (e) => {
  if (e.target === modalEl) modalEl.close();
});

modalCarouselRoot.addEventListener("carouselchange", (e) => {
  main.setIndex(e.detail.index);
});

mainRoot.addEventListener("carouselchange", (e) => {
  if (modalEl.open) modal.setIndex(e.detail.index);
});
