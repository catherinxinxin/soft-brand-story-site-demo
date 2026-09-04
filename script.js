const products = [
  ["轻盈好入口", "日常营养更从容", "陪伴每个成长阶段"],
  ["均衡配方思路", "温和融入日常", "每一餐都安心"],
  ["细致照料每一天", "轻松衔接成长节奏", "把安心留在身边"],
  ["简单而可靠", "适合全家日常", "把陪伴变成习惯"]
];

const points = document.querySelector("#points");
const productTabs = document.querySelectorAll(".product-tab");

function renderPoints(index) {
  points.innerHTML = products[index]
    .map((point, pointIndex) => `<div class="point"><b>0${pointIndex + 1}</b><span>${point}</span></div>`)
    .join("");
}

productTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    productTabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
    renderPoints(index);
  });
});

document.querySelectorAll(".reel-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".reel-card").forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-selected", "false");
    });
    card.classList.add("is-active");
    card.setAttribute("aria-selected", "true");
  });
});

renderPoints(0);
