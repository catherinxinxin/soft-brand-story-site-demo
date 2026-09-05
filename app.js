(() => {
  const content = window.__SITE_CONTENT__ || {};
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const path = (value = "") => value || "";
  const text = (value, fallback = "") => esc(value || fallback);
  const data = (value = "") => esc(value).replace(/`/g, "&#96;");

  const brand = content.brand || {};
  const nav = content.nav || [
    { label: "产品家族", target: "#products" },
    { label: "安心旅程", target: "#journey" },
    { label: "用户实证", target: "#proof" },
    { label: "光巢一家", target: "#family" },
    { label: "光巢社群", target: "#membership" }
  ];
  const products = content.products || [];
  const journey = content.journey || {};
  const proof = content.proof || {};
  const ip = content.ipScene || {};
  const membership = content.membership || {};

  const header = document.querySelector("[data-header]");
  const brandVisual = brand.logo
    ? `<img class="brand-logo" src="${path(brand.logo)}" alt="${text(brand.name, "品牌")}" />`
    : `<span class="brand-fallback">${text(brand.name, "品牌")}</span>`;
  const taglineVisual = brand.taglineImage
    ? `<img class="brand-tagline-image" src="${path(brand.taglineImage)}" alt="${text(brand.tagline, "")}" />`
    : `<span class="brand-tagline-text">${text(brand.tagline, "")}</span>`;
  if (header) {
    header.innerHTML = `
      <a class="brand-lockup" href="#top" aria-label="返回顶部">
        ${brandVisual}
        <span class="brand-sub">${taglineVisual}${brand.sinceYear ? `<span class="brand-since">SINCE ${text(brand.sinceYear)}</span>` : ""}</span>
      </a>
      <nav class="main-nav" aria-label="主导航">${nav.map((item) => `<a href="${data(item.target || "#top")}">${text(item.label)}</a>`).join("")}</nav>
      ${brand.ctaLabel ? `<a class="header-cta" href="${data(brand.ctaTarget || "#membership")}">${text(brand.ctaLabel)} <span>↗</span></a>` : ""}
    `;
  }

  const productSection = document.querySelector("[data-products-section]");
  if (productSection) {
    const first = products[0] || {};
    const heroTitle = content.hero || {};
    productSection.innerHTML = `
      <div class="product-hero-head reveal">
        <div>
          ${heroTitle.eyebrow ? `<p class="eyebrow">${text(heroTitle.eyebrow)}</p>` : ""}
          <h1><span class="title-line">${text(heroTitle.titleLine, "从日常出发，")}</span><span class="title-line title-line-accent">${text(heroTitle.titleAccent, "到每一次安心选择")}</span></h1>
          <p class="product-hero-note">${text(heroTitle.subtitle, "围绕每一个成长阶段，持续探索更轻松、更安心的陪伴方式。")}</p>
        </div>
      </div>
      <div class="hero-stage product-hero-stage product-video-stage reveal reveal-delay-1" data-hero-stage>
        <div class="product-stage-grid" aria-hidden="true"></div>
        <div class="hero-video-shell" data-hero-video-shell>
          <video class="hero-product-video" data-hero-video autoplay muted loop playsinline preload="metadata" poster="${path(first.image)}"></video>
          <img class="hero-product-fallback" data-hero-fallback src="${path(first.image)}" alt="${text(first.name, "产品展示")}" />
          <div class="hero-video-wash"></div>
          <span class="hero-video-watermark-note">PRODUCT LOOP / 05 SEC</span>
        </div>
        <div class="hero-current-row">
          <div class="hero-current-name"><div class="product-stage-label" data-hero-label></div><h2 data-hero-name></h2></div>
          <div class="hero-points" data-hero-points></div>
        </div>
        <div class="hero-product-rail" data-hero-product-rail role="tablist" aria-label="选择产品"></div>
      </div>
    `;
    const stage = productSection.querySelector("[data-hero-stage]");
    const video = productSection.querySelector("[data-hero-video]");
    const fallback = productSection.querySelector("[data-hero-fallback]");
    const label = productSection.querySelector("[data-hero-label]");
    const name = productSection.querySelector("[data-hero-name]");
    const points = productSection.querySelector("[data-hero-points]");
    const rail = productSection.querySelector("[data-hero-product-rail]");
    let currentProduct = 0;

    const setProduct = (index) => {
      const product = products[index] || products[0] || {};
      currentProduct = index;
      productSection.querySelectorAll(".hero-product-card").forEach((button, buttonIndex) => {
        const active = buttonIndex === index;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", String(active));
      });
      if (label) label.textContent = product.label || product.category || "DAILY ROUTINE";
      if (name) name.textContent = product.name || "产品名称";
      if (fallback) { fallback.src = path(product.image); fallback.alt = product.name || "产品展示"; }
      if (points) points.innerHTML = (product.points || []).slice(0, 3).map((item, pointIndex) => `<span><strong>${text(item.label || item)}</strong>${item.detail ? `<small>${text(item.detail)}</small>` : ""}</span>`).join("");
      if (video) {
        video.pause();
        video.innerHTML = product.video ? `<source src="${path(product.video)}" type="video/mp4" />` : "";
        video.poster = path(product.image);
        video.load();
        if (product.video) { video.style.display = "block"; fallback.style.display = "none"; video.play().catch(() => {}); }
        else { video.style.display = "none"; fallback.style.display = "block"; }
      }
      if (stage) { stage.classList.remove("is-switching"); void stage.offsetWidth; stage.classList.add("is-switching"); }
    };

    if (rail) {
      rail.innerHTML = products.slice(0, 4).map((product, index) => `<button class="hero-product-card${index === 0 ? " is-active" : ""}" type="button" role="tab" aria-selected="${index === 0}" data-product-index="${index}" style="--card-accent:${text(product.accent || "#2165cc")}"><span class="hero-product-preview"><img src="${path(product.image)}" alt="" /></span><span class="hero-product-card-copy"><small>${String(index + 1).padStart(2, "0")} / ${text(product.railLabel || "ROUTINE")}</small><strong>${text(product.name, "产品名称")}</strong><em>${text(product.selectorLabel || product.category, "日常陪伴")}</em></span><span class="hero-card-arrow">↗</span></button>`).join("");
      rail.querySelectorAll("[data-product-index]").forEach((button) => {
        button.addEventListener("click", () => setProduct(Number(button.dataset.productIndex)));
        button.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") setProduct(Number(button.dataset.productIndex)); });
      });
    }
    setProduct(currentProduct);
  }

  const journeySection = document.querySelector("[data-journey-section]");
  if (journeySection) {
    const cards = journey.cards || [];
    journeySection.innerHTML = `<div class="proof-section-head"><div>${journey.eyebrow ? `<div class="section-kicker">${text(journey.eyebrow)}</div>` : ""}<h2><span class="title-line">${text(journey.titleLine, "好的选择，")}</span><span class="title-line title-line-accent">${text(journey.titleAccent, "从看得见开始")}</span></h2><p>${text(journey.subtitle, "从一份安心的准备，到每一次认真回应，照料被看见，也被记住。")}</p></div></div><div class="proof-grid">${cards.slice(0, 4).map((card, index) => `<article class="proof-card${index === 0 ? " proof-card-source" : ""}"><img src="${path(card.image)}" alt="${text(card.alt || card.title, "品牌故事图片")}" /><div class="proof-card-overlay"></div><div class="proof-card-copy"><small>${String(index + 1).padStart(2, "0")} / ${text(card.eyebrow || "STORY")}</small><h3>${text(card.title, "故事片段")}</h3><span>${text(card.detail, "把安心留在每一个日常里")}</span></div></article>`).join("")}</div>`;
  }

  const proofSection = document.querySelector("[data-proof-section]");
  if (proofSection) {
    const stories = proof.stories || [];
    proofSection.innerHTML = `<div class="consumer-heading reveal">${proof.eyebrow ? `<div class="section-kicker">${text(proof.eyebrow)}</div>` : ""}<h2><span class="title-line">${text(proof.titleLine, "安心，落在每一天，")}</span><span class="title-line title-line-accent">${text(proof.titleAccent, "也陪伴每一个宝宝成长")}</span></h2><p>${text(proof.subtitle, "正式发布前，请替换为已获授权的真实消费者故事与图片。")}</p></div><div class="consumer-gallery reveal reveal-delay-1" data-consumer-gallery><div class="consumer-gallery-head"><span>MOVE TO BROWSE / FOLLOW THE CURSOR</span><strong data-gallery-index>01 / ${String(stories.length).padStart(2, "0")}</strong></div><div class="consumer-gallery-window"><div class="consumer-gallery-track" data-consumer-track>${stories.map((story, index) => `<article class="consumer-card" data-consumer-card><div class="consumer-card-media"><img src="${path(story.image)}" alt="${text(story.alt || story.title, "消费者故事示例")}" /></div><div><strong>${text(story.title, "日常记录")}</strong><small>${text(story.caption, "示例故事 · 仅用于演示")}</small></div></article>`).join("")}</div></div><div class="consumer-gallery-foot"><span>MOVE OR CLICK TO CENTER</span><span>↔</span></div></div>`;
    const gallery = proofSection.querySelector("[data-consumer-gallery]");
    const viewport = gallery?.querySelector(".consumer-gallery-window");
    const track = gallery?.querySelector("[data-consumer-track]");
    const cards = gallery ? [...gallery.querySelectorAll("[data-consumer-card]")] : [];
    const indexLabel = gallery?.querySelector("[data-gallery-index]");
    let targetX = 0;
    let currentX = 0;
    let frame = null;
    let activeIndex = -1;
    const minX = () => Math.min(0, viewport ? viewport.clientWidth - track.scrollWidth : 0);
    const wake = () => { if (!frame) frame = requestAnimationFrame(animate); };
    const animate = () => {
      currentX += (targetX - currentX) * .18;
      track.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
      if (Math.abs(targetX - currentX) > .1) frame = requestAnimationFrame(animate); else frame = null;
    };
    const setActive = (index) => {
      if (index === activeIndex) return;
      activeIndex = index;
      cards.forEach((card, cardIndex) => card.classList.toggle("is-active", cardIndex === index));
      if (indexLabel) indexLabel.textContent = `${String(index + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    };
    const center = (card) => {
      const desired = viewport.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
      targetX = Math.max(minX(), Math.min(0, desired));
      wake();
    };
    const closestTo = (x) => {
      let closest = 0; let distance = Infinity;
      cards.forEach((card, index) => { const rect = card.getBoundingClientRect(); const next = Math.abs(rect.left + rect.width / 2 - x); if (next < distance) { distance = next; closest = index; } });
      setActive(closest);
    };
    if (gallery && viewport && track && cards.length) {
      if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
        gallery.addEventListener("pointermove", (event) => {
          if (event.pointerType !== "mouse" && event.pointerType !== "pen") return;
          const bounds = viewport.getBoundingClientRect();
          const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
          targetX = minX() * ratio;
          closestTo(event.clientX);
          wake();
        });
        gallery.addEventListener("pointerleave", () => { targetX = currentX; wake(); });
      }
      cards.forEach((card, index) => {
        card.addEventListener("pointerenter", () => { setActive(index); if (window.matchMedia("(pointer: fine)").matches) center(card); });
        card.addEventListener("click", () => { setActive(index); center(card); });
      });
      setActive(0);
    }
  }

  const familySection = document.querySelector("[data-family-section]");
  if (familySection) {
    const gallery = ip.gallery || [];
    const firstIp = gallery[0] || {};
    familySection.innerHTML = `<div class="ip-heading reveal"><div class="section-kicker">${text(ip.eyebrow, "THE IP ASSET")}</div><h2 class="ip-title"><span class="ip-title-line">${text(ip.titleLine, "光巢一家，")}</span><span class="ip-title-line ip-title-line-accent">${text(ip.titleAccent, "陪你一起长大")}</span></h2><p>${text(ip.subtitle, "把每一次探索、陪伴和好奇，都变成孩子愿意亲近的品牌角色。")}</p></div><div class="ip-experience reveal reveal-delay-1" data-ip-stage><div class="ip-experience-sky" aria-hidden="true"><span></span><i></i><b></b></div><div class="ip-sticker ip-sticker-a" aria-hidden="true">LET'S PLAY</div><div class="ip-sticker ip-sticker-b" aria-hidden="true">${text(ip.sticker, "A LITTLE WORLD")}</div><div class="ip-feature-wrap"><figure class="ip-feature-visual"><div class="ip-feature-image-wrap"><img data-ip-feature-image src="${path(firstIp.image || ip.image)}" alt="${text(firstIp.alt || ip.titleLine, "原创 IP 场景")}" /><span class="ip-feature-index" data-ip-feature-index>01 / ${String(gallery.length || 1).padStart(2, "0")}</span></div><figcaption><span data-ip-feature-kicker>${text(firstIp.eyebrow, "FAMILY MOMENTS")}</span><strong data-ip-feature-title>${text(firstIp.title, "一家人在一起")}</strong><p data-ip-feature-copy>${text(firstIp.copy, "从日常出发，把陪伴变成可以被看见的快乐。")}</p></figcaption></figure><div class="ip-feature-shadow" aria-hidden="true"></div></div><div class="ip-stage-note"><span>${text(ip.stageTitle, "成长游乐场")}</span><small>${text(ip.stageSubtitle, "MOVE THROUGH THE STORY")}</small></div><div class="ip-gallery" data-ip-gallery><div class="ip-gallery-head"><span>IP REEL / ${String(gallery.length || 1).padStart(2, "0")} MOMENTS</span><strong data-ip-gallery-index>01 / ${String(gallery.length || 1).padStart(2, "0")}</strong><button class="ip-reel-toggle" type="button" data-ip-reel-toggle aria-pressed="false">暂停播放</button></div><div class="ip-gallery-grid">${gallery.map((item, index) => `<button class="ip-gallery-item${index === 0 ? " is-active" : ""}" type="button" data-ip-item data-ip-src="${data(item.image)}" data-ip-alt="${data(item.alt || item.title)}" data-ip-kicker="${data(item.eyebrow || "IP MOMENT")}" data-ip-title="${data(item.title || "成长片段")}" data-ip-copy="${data(item.copy || "陪伴每一次好奇和成长。")}"><img src="${path(item.image)}" alt="${text(item.alt || item.title, "IP 场景缩略图")}" /><span>${text(item.cardTitle || item.title, "成长片段")}</span></button>`).join("")}</div></div></div>`;
    const stage = familySection.querySelector("[data-ip-stage]");
    const featureImage = stage?.querySelector("[data-ip-feature-image]");
    const featureIndex = stage?.querySelector("[data-ip-feature-index]");
    const featureKicker = stage?.querySelector("[data-ip-feature-kicker]");
    const featureTitle = stage?.querySelector("[data-ip-feature-title]");
    const featureCopy = stage?.querySelector("[data-ip-feature-copy]");
    const galleryIndex = stage?.querySelector("[data-ip-gallery-index]");
    const items = stage ? [...stage.querySelectorAll("[data-ip-item]")] : [];
    const toggle = stage?.querySelector("[data-ip-reel-toggle]");
    const reel = stage?.querySelector("[data-ip-gallery]");
    const reelViewport = reel;
    const reelTrack = reel?.querySelector(".ip-gallery-grid");
    let active = 0; let timer; let reelTargetX = 0; let reelCurrentX = 0; let reelFrame = null;
    const reelMinX = () => Math.min(0, reelViewport ? reelViewport.clientWidth - reelTrack.scrollWidth : 0);
    const wakeReel = () => { if (!reelFrame) reelFrame = requestAnimationFrame(animateReel); };
    const animateReel = () => { reelCurrentX += (reelTargetX - reelCurrentX) * .16; if (reelTrack) reelTrack.style.transform = `translate3d(${reelCurrentX.toFixed(2)}px, 0, 0)`; if (Math.abs(reelTargetX - reelCurrentX) > .1) reelFrame = requestAnimationFrame(animateReel); else reelFrame = null; };
    const centerReelItem = (item) => { if (!reelViewport || !reelTrack) return; const desired = reelViewport.clientWidth / 2 - (item.offsetLeft + item.offsetWidth / 2); reelTargetX = Math.max(reelMinX(), Math.min(0, desired)); wakeReel(); };
    const closestReelItem = (x) => { let closest = 0; let distance = Infinity; items.forEach((item, index) => { const rect = item.getBoundingClientRect(); const next = Math.abs(rect.left + rect.width / 2 - x); if (next < distance) { distance = next; closest = index; } }); return closest; };
    const select = (item, index, shouldCenter = true) => { active = index; items.forEach((entry, entryIndex) => { entry.classList.toggle("is-active", entryIndex === index); }); if (featureImage) { featureImage.src = item.dataset.ipSrc; featureImage.alt = item.dataset.ipAlt; } if (featureIndex) featureIndex.textContent = `${String(index + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`; if (galleryIndex) galleryIndex.textContent = featureIndex.textContent; if (featureKicker) featureKicker.textContent = item.dataset.ipKicker; if (featureTitle) featureTitle.textContent = item.dataset.ipTitle; if (featureCopy) featureCopy.textContent = item.dataset.ipCopy; if (shouldCenter) centerReelItem(item); };
    const stop = () => { if (timer) clearInterval(timer); timer = null; if (toggle) { toggle.textContent = "继续播放"; toggle.setAttribute("aria-pressed", "true"); } };
    const start = () => { if (reduceMotion || timer || items.length < 2) return; timer = setInterval(() => select(items[(active + 1) % items.length], (active + 1) % items.length), 2800); if (toggle) { toggle.textContent = "暂停播放"; toggle.setAttribute("aria-pressed", "false"); } };
    if (reel && reelViewport && reelTrack && items.length && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
      reel.addEventListener("pointermove", (event) => { if (event.pointerType !== "mouse" && event.pointerType !== "pen") return; const bounds = reelViewport.getBoundingClientRect(); const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)); reelTargetX = reelMinX() * ratio; const nearest = closestReelItem(event.clientX); if (nearest !== active) select(items[nearest], nearest, false); wakeReel(); });
      reel.addEventListener("pointerleave", () => { reelTargetX = reelCurrentX; wakeReel(); });
    }
    items.forEach((item, index) => { item.addEventListener("click", () => { select(item, index); stop(); }); item.addEventListener("pointerenter", (event) => { if (event.pointerType === "mouse") { select(item, index); stop(); } }); });
    toggle?.addEventListener("click", () => timer ? stop() : start());
    if (items[0]) select(items[0], 0); start();
  }

  const membershipSection = document.querySelector("[data-membership-section]");
  if (membershipSection) {
    const levels = membership.levels || [];
    const groups = membership.benefitGroups || [];
    const logoFallback = `<div class="membership-logo-art" role="img" aria-label="示例品牌标志"><svg viewBox="0 0 240 160" aria-hidden="true"><defs><linearGradient id="membership-logo-gradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f5cca"/><stop offset="1" stop-color="#67cbb2"/></linearGradient></defs><path class="membership-logo-orbit membership-logo-orbit-one" d="M32 80C32 38 78 20 120 80s88 42 88 0-46-60-88 0-88 42-88 0Z" fill="none" stroke="url(#membership-logo-gradient)" stroke-width="7" stroke-linecap="round"/><path class="membership-logo-orbit membership-logo-orbit-two" d="M44 52c37-28 75-8 76 28s39 56 76 28" fill="none" stroke="#e74454" stroke-width="3" stroke-linecap="round" opacity=".72"/><path class="membership-logo-star" d="m120 42 9 25 26 2-20 16 6 26-21-14-21 14 6-26-20-16 26-2 9-25Z" fill="#f6c96b" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><circle class="membership-logo-dot" cx="120" cy="80" r="7" fill="#fff"/></svg></div>`;
    const logo = membership.logoVideo ? `<video class="membership-logo-video" autoplay muted loop playsinline preload="metadata"><source src="${path(membership.logoVideo)}" type="video/mp4" /></video>` : logoFallback;
    const journeyVisual = membership.journeyVideo ? `<video class="membership-journey-video" muted playsinline preload="auto"><source src="${path(membership.journeyVideo)}" type="video/mp4" /></video>` : membership.journeyImage ? `<img class="membership-journey-video membership-journey-image" src="${path(membership.journeyImage)}" alt="会员等级路径示例" />` : `<div class="membership-journey-placeholder"><span>此处可以配置品牌等级视频或展示图片</span></div>`;
    membershipSection.innerHTML = `<div class="membership-head"><div class="membership-qr" aria-label="加入社群">${membership.qrImage ? `<img src="${path(membership.qrImage)}" alt="扫码加入社群" />` : `<div class="qr-placeholder">QR</div>`}<span>${text(membership.qrLabel, "扫码加入")}</span><small>SCAN TO JOIN</small></div><div class="membership-head-copy"><div class="section-kicker">${text(membership.eyebrow, "COMMUNITY CIRCLE")}</div><h2><span class="title-line">${text(membership.titleLine, "加入社群，")}</span><span class="title-line title-line-accent">${text(membership.titleAccent, "让每一次成长都有回应")}</span></h2><div class="membership-lede"><p>${text(membership.subtitle, "从一次加入开始，把每一个值得被记住的时刻接住并延续下去。")}</p></div></div></div><div class="membership-experience" data-membership><div class="membership-orbit-intro"><div class="membership-orbit-copy membership-orbit-copy-left"><span class="membership-board-label">${text(membership.pointsEyebrow, "MEMBERSHIP IN MOTION")}</span><strong>${text(membership.pointsTitle, "收集的每一个积分，")}<br />${text(membership.pointsAccent, "都在回应成长")}</strong><p>${text(membership.pointsSubtitle, "从一次加入开始，把陪伴变成看得见的日常。")}</p></div><div class="membership-logo-window" aria-label="社群视觉"><span class="membership-logo-ring membership-logo-ring-one" aria-hidden="true"></span><span class="membership-logo-ring membership-logo-ring-two" aria-hidden="true"></span>${logo}<span class="membership-video-caption">COMMUNITY STORY / 05 SEC</span></div><div class="membership-orbit-copy membership-orbit-copy-right"><span class="membership-board-label">NOW EXPLORING</span><strong data-membership-active-label>${text(levels[0]?.name, "初见会员")}</strong><p data-membership-active-copy>${text(levels[0]?.copy, "从加入开始，解锁属于每个家庭的成长陪伴。")}</p></div></div><div class="membership-levels"><div class="membership-levels-head"><span class="membership-board-label">MEMBER JOURNEY</span><span>FOLLOW THE STAR</span></div><div class="membership-journey-video-shell">${journeyVisual}<div class="membership-journey-hotspots" role="tablist" aria-label="选择会员等级">${levels.map((level, index) => `<button class="membership-journey-hotspot${index === 0 ? " is-active" : ""}" type="button" role="tab" aria-selected="${index === 0}" aria-label="选择${text(level.name, "会员等级")}" data-membership-level data-membership-index="${index}" data-membership-name="${data(level.name || "会员等级")}" data-membership-copy="${data(level.copy || "从加入开始，解锁属于每个家庭的成长陪伴。")}" data-membership-time="${Number(level.time || index).toFixed(2)}"></button>`).join("")}</div><span class="membership-journey-video-note">STAR PATH / ${String(levels.length || 0).padStart(2, "0")} LEVELS</span></div></div><div class="membership-benefits" id="membership-benefits"><div class="membership-benefits-head"><div><span class="membership-board-label">MEMBER BENEFITS</span><h3>${text(membership.benefitsTitle, "加入社群，享受专属权益")}</h3></div><span class="membership-benefits-type">${text(membership.benefitsCount, `${groups.reduce((total, group) => total + (group.items || []).length, 0)} 种陪伴方式`)}</span></div><div class="membership-benefits-list">${groups.slice(0, 2).map((group, groupIndex) => `<div class="membership-benefit-group"><div class="membership-benefit-group-head"><span class="membership-benefit-group-label">${String(groupIndex * 5 + 1).padStart(2, "0")} — ${String(groupIndex * 5 + (group.items || []).length).padStart(2, "0")} / ${text(group.eyebrow || "TOGETHER")}</span><strong>${text(group.title, "陪伴礼遇")}</strong><p>${text(group.subtitle, "把日常照顾变得更安心。")}</p></div><ul>${(group.items || []).slice(0, 5).map((item, itemIndex) => `<li><span class="membership-benefit-index">${String(groupIndex * 5 + itemIndex + 1).padStart(2, "0")}</span><div><strong>${text(item.title, "权益标题")}</strong><p>${text(item.detail, "权益说明")}</p></div><span class="membership-benefit-arrow" aria-hidden="true">↗</span></li>`).join("")}</ul></div>`).join("")}</div></div></div>`;
    const root = membershipSection.querySelector("[data-membership]");
    const levelButtons = root ? [...root.querySelectorAll("[data-membership-level]")] : [];
    const activeLabel = root?.querySelector("[data-membership-active-label]");
    const activeCopy = root?.querySelector("[data-membership-active-copy]");
    const journeyVideo = root?.querySelector(".membership-journey-video");
    levelButtons.forEach((button) => button.addEventListener("click", () => { const index = Number(button.dataset.membershipIndex); levelButtons.forEach((entry) => { entry.classList.toggle("is-active", entry === button); entry.setAttribute("aria-selected", String(entry === button)); }); if (activeLabel) activeLabel.textContent = button.dataset.membershipName; if (activeCopy) activeCopy.textContent = button.dataset.membershipCopy; if (journeyVideo && journeyVideo.readyState >= 1) { journeyVideo.currentTime = Math.min(Number(button.dataset.membershipTime), Math.max(0, (journeyVideo.duration || 0) - .04)); } }));
  }

  const footer = document.querySelector("[data-footer]");
  if (footer) footer.innerHTML = `<div class="footer-brand-lockup">${brand.logo ? `<img src="${path(brand.logo)}" alt="${text(brand.name, "品牌")}" />` : `<strong>${text(brand.name, "品牌")}</strong>`}<small>${text(brand.latinName, "BRAND STORY")}</small></div><p>${text(content.footer?.descriptor, "一个关于日常照料、温柔成长与彼此回应的品牌故事。")}</p><span>${text(content.footer?.copyright, "FICTIONAL DEMO · REPLACE BEFORE PUBLISHING")}</span>`;

  const revealItems = [...document.querySelectorAll(".reveal")];
  if ("IntersectionObserver" in window) { const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .12 }); revealItems.forEach((item) => observer.observe(item)); } else revealItems.forEach((item) => item.classList.add("is-visible"));

  const progress = document.querySelector(".scroll-progress span");
  window.addEventListener("scroll", () => { const max = document.documentElement.scrollHeight - window.innerHeight; if (progress) progress.style.transform = `scaleY(${max ? window.scrollY / max : 0})`; }, { passive: true });
  const glow = document.querySelector(".cursor-glow");
  if (glow && !reduceMotion && window.matchMedia("(pointer: fine)").matches) window.addEventListener("pointermove", (event) => { glow.style.transform = `translate3d(${event.clientX - 140}px, ${event.clientY - 140}px, 0)`; }, { passive: true });
})();
