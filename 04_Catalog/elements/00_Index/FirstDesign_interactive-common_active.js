(function () {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const commands = ["Foundation controls", "Navigation", "Overlay", "Forms", "Pointer hover", "Scroll story", "Spatial canvas"];
  const slides = ["Slide 1 / Color study", "Slide 2 / Layout rhythm", "Slide 3 / Interaction states"];
  let carouselIndex = 0;
  let sortAsc = true;
  let streamTimer = null;
  let particleState = null;

  function toast(message) {
    let stack = $(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    const item = document.createElement("div");
    item.className = "toast";
    item.textContent = message;
    stack.appendChild(item);
    setTimeout(() => item.remove(), 2200);
  }

  function setLive(selector, message) {
    const node = $(selector);
    if (node) node.textContent = message;
  }

  function initFoundation() {
    const panel = $("[data-status-panel]");
    let mode = "Build";
    let compact = false;
    const render = () => {
      if (panel) panel.textContent = `Mode: ${mode} / Compact: ${compact ? "on" : "off"}`;
    };
    $$("[data-demo-action='set-mode']").forEach((button) => {
      button.addEventListener("click", () => {
        mode = button.dataset.mode || "Build";
        $$("[data-demo-action='set-mode']").forEach((item) => item.classList.toggle("is-active", item === button));
        render();
      });
    });
    const compactToggle = $("[data-demo-action='toggle-compact']");
    if (compactToggle) compactToggle.addEventListener("change", (event) => {
      compact = event.target.checked;
      render();
    });
    const copyButton = $("[data-demo-action='copy-token']");
    if (copyButton) copyButton.addEventListener("click", async () => {
      const value = copyButton.dataset.copyValue || "FirstDesign";
      try {
        if (navigator.clipboard) await navigator.clipboard.writeText(value);
        setLive("[data-live-line]", "Copied to clipboard.");
        toast("Copied");
      } catch {
        setLive("[data-live-line]", "Copy fallback selected.");
        toast("Copy fallback");
      }
    });
    render();
  }

  function initNavigation() {
    $$("[data-demo-action='tab']").forEach((button) => {
      button.addEventListener("click", () => {
        $$("[data-demo-action='tab']").forEach((item) => item.setAttribute("aria-selected", String(item === button)));
        const panel = $("[data-nav-panel]");
        if (panel) panel.textContent = `${button.dataset.panel} panel is active.`;
      });
    });
    const commandPanel = $("[data-command-panel]");
    const input = $("[data-command-input]");
    const results = $("[data-command-results]");
    const render = (query = "") => {
      if (!results) return;
      results.innerHTML = "";
      commands.filter((item) => item.toLowerCase().includes(query.toLowerCase())).forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = item;
        button.addEventListener("click", () => toast(`Navigate: ${item}`));
        results.appendChild(button);
      });
    };
    const opener = $("[data-demo-action='open-command']");
    if (opener && commandPanel) opener.addEventListener("click", () => {
      commandPanel.hidden = !commandPanel.hidden;
      if (!commandPanel.hidden) {
        render();
        input?.focus();
      }
    });
    input?.addEventListener("input", () => render(input.value));
  }

  function initDisclosure() {
    $$("[data-demo-action='accordion']").forEach((button) => {
      button.addEventListener("click", () => {
        const panel = button.nextElementSibling;
        const expanded = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!expanded));
        if (panel) panel.hidden = expanded;
      });
    });
    const popover = $("[data-popover]");
    const popoverButton = $("[data-demo-action='toggle-popover']");
    popoverButton?.addEventListener("click", () => {
      const next = !popover?.hidden;
      if (popover) popover.hidden = next;
      popoverButton.setAttribute("aria-expanded", String(!next));
    });
    $("[data-demo-action='open-modal']")?.addEventListener("click", () => openModal());
  }

  function openModal() {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.innerHTML = '<div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">Overlay pattern</h2><p>Focus starts inside the dialog and Escape closes it.</p><button class="primary-action" data-close-modal>Close</button></div>';
    document.body.appendChild(backdrop);
    const close = () => backdrop.remove();
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) close();
    });
    $("[data-close-modal]", backdrop)?.addEventListener("click", close);
    const keyHandler = (event) => {
      if (event.key === "Escape") {
        close();
        document.removeEventListener("keydown", keyHandler);
      }
    };
    document.addEventListener("keydown", keyHandler);
    $("[data-close-modal]", backdrop)?.focus();
  }

  function initForms() {
    const prompt = $("[data-form-prompt]");
    const meter = $("[data-form-meter]");
    const status = $("[data-form-status]");
    const update = () => {
      if (!prompt || !meter || !status) return;
      const score = Math.min(100, Math.round((prompt.value.length / 64) * 100));
      meter.style.width = `${score}%`;
      status.textContent = prompt.value.length >= 12 ? "Prompt is valid." : "Prompt needs at least 12 characters.";
    };
    prompt?.addEventListener("input", update);
    $$("[data-demo-action='tag']").forEach((button) => button.addEventListener("click", () => button.classList.toggle("is-active")));
    const file = $("[data-demo-action='file-preview']");
    file?.addEventListener("change", () => {
      const label = $("[data-file-label]");
      if (label) label.textContent = file.files?.[0]?.name || "No file selected";
    });
    update();
  }

  function initPointer() {
    const stage = $("[data-pointer-stage]");
    const tilt = $("[data-tilt-card]");
    const magnetic = $("[data-magnetic]");
    stage?.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      stage.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
      stage.style.setProperty("--my", `${(y / rect.height) * 100}%`);
      if (tilt) {
        tilt.style.setProperty("--ry", `${((x / rect.width) - 0.5) * 16}deg`);
        tilt.style.setProperty("--rx", `${((0.5 - y / rect.height)) * 16}deg`);
      }
      if (magnetic) {
        magnetic.style.transform = `translate(${((x / rect.width) - 0.5) * 12}px, ${((y / rect.height) - 0.5) * 12}px)`;
      }
    });
    stage?.addEventListener("pointerleave", () => {
      tilt?.style.setProperty("--rx", "0deg");
      tilt?.style.setProperty("--ry", "0deg");
      if (magnetic) magnetic.style.transform = "translate(0, 0)";
    });
  }

  function initDrag() {
    const list = $("[data-sortable-list]");
    let dragging = null;
    $$("li", list || document).forEach((item) => {
      item.addEventListener("dragstart", () => {
        dragging = item;
        item.classList.add("dragging");
      });
      item.addEventListener("dragend", () => {
        item.classList.remove("dragging");
        dragging = null;
      });
    });
    list?.addEventListener("dragover", (event) => {
      event.preventDefault();
      const after = $$("li:not(.dragging)", list).find((item) => event.clientY < item.getBoundingClientRect().top + item.offsetHeight / 2);
      if (dragging) list.insertBefore(dragging, after || null);
    });
    const pane = $("[data-split-pane]");
    const handle = $("[data-split-handle]");
    handle?.addEventListener("pointerdown", (event) => {
      handle.setPointerCapture(event.pointerId);
      const move = (moveEvent) => {
        const rect = pane.getBoundingClientRect();
        const percent = Math.min(78, Math.max(24, ((moveEvent.clientX - rect.left) / rect.width) * 100));
        pane.style.setProperty("--left-size", `${percent}%`);
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", () => handle.removeEventListener("pointermove", move), { once: true });
    });
  }

  function initScroll() {
    const scroller = $("[data-local-scroll]");
    const progress = $("[data-scroll-progress]");
    const blocks = $$(".reveal-block", scroller || document);
    const update = () => {
      if (!scroller || !progress) return;
      const total = scroller.scrollHeight - scroller.clientHeight;
      progress.style.width = `${total > 0 ? (scroller.scrollTop / total) * 100 : 0}%`;
      blocks.forEach((block) => {
        const rect = block.getBoundingClientRect();
        const host = scroller.getBoundingClientRect();
        block.classList.toggle("is-visible", rect.top < host.bottom - 60 && rect.bottom > host.top + 60);
      });
    };
    scroller?.addEventListener("scroll", update, { passive: true });
    update();
  }

  function initStory() {
    $$("[data-demo-action='story-step']").forEach((button, index) => {
      button.addEventListener("click", () => {
        $$("[data-demo-action='story-step']").forEach((item) => item.classList.toggle("is-active", item === button));
        const number = $("[data-story-number]");
        const title = $("[data-story-title]");
        if (number) number.textContent = String(index + 1).padStart(2, "0");
        if (title) title.textContent = button.dataset.title || button.textContent;
      });
    });
  }

  function initTransition() {
    const detail = $("[data-transition-detail]");
    $$("[data-demo-action='transition']").forEach((button) => {
      button.addEventListener("click", () => {
        const update = () => {
          $$("[data-demo-action='transition']").forEach((item) => item.classList.toggle("is-active", item === button));
          if (detail) detail.textContent = `${button.dataset.view} detail view`;
        };
        if (document.startViewTransition) document.startViewTransition(update);
        else update();
      });
    });
    $("[data-demo-action='skeleton']")?.addEventListener("click", () => detail?.classList.toggle("loading"));
  }

  function initMicro() {
    const like = $("[data-demo-action='like']");
    like?.addEventListener("click", () => {
      const pressed = like.getAttribute("aria-pressed") === "true";
      like.setAttribute("aria-pressed", String(!pressed));
      const count = $("[data-like-count]");
      if (count) count.textContent = String(Number(count.textContent || "0") + (pressed ? -1 : 1));
      setLive("[data-micro-live]", pressed ? "Removed from saved items." : "Saved.");
    });
    $("[data-demo-action='progress']")?.addEventListener("click", () => {
      const ring = $("[data-progress-ring]");
      let value = 0;
      const timer = setInterval(() => {
        value += 10;
        if (ring) {
          ring.style.setProperty("--progress", String(value));
          ring.textContent = `${value}%`;
        }
        setLive("[data-micro-live]", `Progress ${value}%`);
        if (value >= 100) {
          clearInterval(timer);
          toast("Progress complete");
        }
      }, 120);
    });
  }

  function initType() {
    const title = $("[data-kinetic-title]");
    const play = () => {
      if (!title) return;
      const words = title.textContent.trim().split(/\s+/);
      title.innerHTML = words.map((word) => `<span>${word}&nbsp;</span>`).join("");
      $$("span", title).forEach((span, index) => setTimeout(() => span.classList.add("visible"), index * 90));
    };
    const counter = $("[data-counter]");
    if (counter) {
      const target = Number(counter.dataset.target || "0");
      let value = 0;
      const timer = setInterval(() => {
        value = Math.min(target, value + Math.ceil(target / 28));
        counter.textContent = String(value);
        if (value >= target) clearInterval(timer);
      }, 40);
    }
    $("[data-demo-action='replay-type']")?.addEventListener("click", play);
    play();
  }

  function initMedia() {
    const frame = $("[data-media-frame]");
    const render = () => {
      if (frame) frame.textContent = slides[carouselIndex];
    };
    $("[data-demo-action='carousel-prev']")?.addEventListener("click", () => {
      carouselIndex = (carouselIndex - 1 + slides.length) % slides.length;
      render();
    });
    $("[data-demo-action='carousel-next']")?.addEventListener("click", () => {
      carouselIndex = (carouselIndex + 1) % slides.length;
      render();
    });
    const range = $("[data-compare-range]");
    range?.addEventListener("input", () => $("[data-comparison-box]")?.style.setProperty("--split", `${range.value}%`));
    render();
  }

  function initData() {
    const renderChart = () => {
      const chart = $("[data-bar-chart]");
      if (!chart) return;
      chart.innerHTML = "";
      $$("[data-data-table] tbody tr").filter((row) => row.style.display !== "none").forEach((row) => {
        const score = Number(row.children[2].textContent || "0");
        const bar = document.createElement("div");
        bar.style.width = `${score}%`;
        bar.textContent = `${row.children[0].textContent} ${score}`;
        chart.appendChild(bar);
      });
    };
    $$("[data-demo-action='data-filter']").forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter || "all";
        $$("[data-demo-action='data-filter']").forEach((item) => item.classList.toggle("is-active", item === button));
        $$("[data-data-table] tbody tr").forEach((row) => {
          row.style.display = filter === "all" || row.dataset.type === filter ? "" : "none";
        });
        renderChart();
      });
    });
    $("[data-demo-action='sort-table']")?.addEventListener("click", () => {
      const tbody = $("[data-data-table] tbody");
      const rows = $$("tr", tbody).sort((a, b) => sortAsc ? a.children[0].textContent.localeCompare(b.children[0].textContent) : b.children[0].textContent.localeCompare(a.children[0].textContent));
      rows.forEach((row) => tbody.appendChild(row));
      sortAsc = !sortAsc;
      renderChart();
    });
    renderChart();
  }

  function initSpatial() {
    const canvas = $("[data-particle-canvas]");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const create = () => Array.from({ length: 72 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9
    }));
    particleState = { points: create(), pointer: { x: -999, y: -999 } };
    canvas.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      particleState.pointer.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
      particleState.pointer.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
    });
    $("[data-demo-action='particle-reset']")?.addEventListener("click", () => {
      particleState.points = create();
    });
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#0b0b0b";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particleState.points.forEach((point) => {
        const dx = point.x - particleState.pointer.x;
        const dy = point.y - particleState.pointer.y;
        const distance = Math.max(32, Math.hypot(dx, dy));
        if (distance < 120) {
          point.x += (dx / distance) * 1.8;
          point.y += (dy / distance) * 1.8;
        }
        point.x = (point.x + point.vx + canvas.width) % canvas.width;
        point.y = (point.y + point.vy + canvas.height) % canvas.height;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = "#50e3c2";
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }

  function initRealtime() {
    const streamBox = $("[data-stream-box]");
    const feed = $("[data-live-feed]");
    const lines = ["Analyzing FirstDesign tokens...", "Selecting interaction module...", "Generating reusable UI state...", "Done."];
    $("[data-demo-action='stream-text']")?.addEventListener("click", () => {
      clearInterval(streamTimer);
      if (streamBox) streamBox.textContent = "";
      let i = 0;
      streamTimer = setInterval(() => {
        if (streamBox) streamBox.textContent += `${lines[i]}\n`;
        if (feed) {
          const item = document.createElement("p");
          item.textContent = `${new Date().toLocaleTimeString()} ${lines[i]}`;
          feed.prepend(item);
        }
        i += 1;
        if (i >= lines.length) clearInterval(streamTimer);
      }, 500);
    });
    const zone = $("[data-presence-zone]");
    zone?.addEventListener("pointermove", (event) => {
      const rect = zone.getBoundingClientRect();
      zone.style.setProperty("--px", `${event.clientX - rect.left}px`);
      zone.style.setProperty("--py", `${event.clientY - rect.top}px`);
    });
  }

  function initA11y() {
    const target = $("[data-a11y-target]");
    $("[data-demo-action='a11y-focus']")?.addEventListener("click", () => {
      target?.focus();
      if (target) target.textContent = "Focus moved to target panel.";
      setLive("[data-a11y-live]", "Focus moved.");
    });
    $("[data-demo-action='a11y-motion']")?.addEventListener("click", () => {
      document.body.classList.toggle("reduced-motion");
      setLive("[data-a11y-live]", "Reduced motion preference toggled.");
    });
    $("[data-demo-action='a11y-contrast']")?.addEventListener("click", () => {
      document.body.classList.toggle("high-contrast");
      setLive("[data-a11y-live]", "High contrast preference toggled.");
    });
  }

  const initializers = {
    "foundation-controls": initFoundation,
    "navigation-wayfinding": initNavigation,
    "disclosure-overlay": initDisclosure,
    "forms-input": initForms,
    "pointer-hover": initPointer,
    "drag-drop-manipulation": initDrag,
    "scroll-interaction": initScroll,
    "scroll-storytelling": initStory,
    "page-state-transition": initTransition,
    "microinteraction": initMicro,
    "motion-kinetic-type": initType,
    "media-interaction": initMedia,
    "data-interaction": initData,
    "spatial-2d-3d": initSpatial,
    "realtime-generative": initRealtime,
    "accessibility-preference": initA11y
  };

  window.FirstDesignInteractive = {
    init(categoryId) {
      const initializer = initializers[categoryId];
      if (initializer) initializer();
    }
  };
})();