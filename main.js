(() => {
  'use strict';
  document.getElementById('year').textContent = new Date().getFullYear();
  const projects = {
    orbit: {
      title: 'Orbit', subtitle: 'A calmer workspace for moving ideas forward.',
      scope: 'Illustrative product engineering brief', stack: 'TypeScript · React · Node.js · PostgreSQL',
      problem: 'Small teams often lose context between task lists, chat messages, and status meetings. This demo explores a single board where ownership, progress, and the next action are immediately clear.',
      approach: 'Start with a focused task model: title, owner, status, priority, and activity history. Give common actions a short path and keep the wider project context visible while editing.',
      decisions: ['Use optimistic task updates with a visible pending state, then reconcile with the server. Restore the previous state and show a retry action if a save fails.', 'Validate project membership on every server operation. Model tasks and activity events separately so the board stays fast while history remains traceable.', 'Use version checks on edits to avoid silently overwriting a teammate’s newer change. Provide keyboard-accessible status controls alongside any drag interaction.'],
      tradeoff: 'A simple board and explicit refresh would come before live collaboration. Real-time updates add synchronization and conflict-handling costs; introduce them only when the core workflow is reliable.',
      validation: ['Exercise create, edit, move, and undo flows with keyboard-only input.', 'Test failed saves, stale versions, and unauthorized project access.', 'Measure board interaction latency with a large sample project and a slow connection.'],
      outcome: 'Intended outcome: a team can identify ownership and the next step without opening several tools. This is a demo brief; no production adoption or performance results are claimed.',
      architecture: ['Board interface', 'Task API', 'PostgreSQL']
    },
    forma: {
      title: 'Forma', subtitle: 'A considered path from discovery to checkout.',
      scope: 'Illustrative commerce engineering brief', stack: 'TypeScript · React · Commerce API · PostgreSQL',
      problem: 'A shopping journey becomes frustrating when product choices are unclear, carts lose their state, or checkout errors appear too late. Forma explores a compact storefront with a predictable path to purchase.',
      approach: 'Keep product options, availability, and price close to the decision. Preserve the cart across visits, make totals easy to understand, and associate validation messages with the input that needs attention.',
      decisions: ['Treat the server as the authority for prices, inventory, and final totals. Revalidate the cart before payment rather than trust values supplied by a browser.', 'Persist item identifiers and quantities, then reconcile them with current availability when a session resumes.', 'Use idempotency keys for order creation so retrying a request does not create duplicate orders. Keep payment processing within a hosted provider flow.'],
      tradeoff: 'A hosted checkout reduces customization but narrows the security and maintenance burden. Invest custom interface work in product discovery and cart clarity first.',
      validation: ['Test stock changes, expired sessions, interrupted requests, and duplicate submissions.', 'Review form labels, error announcements, focus order, and touch target sizes.', 'Compare the complete purchase path on narrow screens and a throttled connection.'],
      outcome: 'Intended outcome: shoppers always understand what is in their cart and what happens next. Displayed products and prices are sample data; this is not a live shop.',
      architecture: ['Storefront', 'Cart & order API', 'Hosted checkout']
    },
    pulse: {
      title: 'Pulse', subtitle: 'Useful answers from complex information.',
      scope: 'Illustrative analytics engineering brief', stack: 'TypeScript · React · SQL · Aggregation API',
      problem: 'Dashboards can display a lot of numbers without answering a useful question. Pulse explores a product overview that makes activity, completion, and data freshness understandable at a glance.',
      approach: 'Define each metric before drawing its chart. Give the date range a clear timezone, explain missing data, and show the same series in an accessible table when charts are not enough.',
      decisions: ['Aggregate events on the server into bounded time buckets. Return metric definitions and timestamps with each response so the interface can explain what it shows.', 'Cache repeated queries by date range and filter, while showing when results were last updated. Distinguish stale data, zero activity, and failed requests.', 'Cancel superseded filter requests and keep the last valid result visible during loading. Avoid allowing an older response to overwrite a newer selection.'],
      tradeoff: 'Precomputed summaries make common queries fast but add storage and refresh complexity. Start with indexed queries and measure before adding an aggregation pipeline.',
      validation: ['Check timezone boundaries, empty ranges, missing buckets, and delayed events.', 'Verify keyboard access and text alternatives for every visualization.', 'Test rapid filter changes, error recovery, and large date ranges.'],
      outcome: 'Intended outcome: a product team can distinguish a meaningful trend from incomplete data. All figures in the preview are fictional sample data, not portfolio results.',
      architecture: ['Event store', 'Aggregation API', 'Chart & table views']
    }
  };
  const dialog = document.getElementById('project-dialog');
  let opener;
  const list = items => `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const p = projects[button.dataset.project];
    opener = button;
    document.getElementById('case-content').innerHTML = `<h2 class="case-title" id="dialog-title">${p.title}</h2><p class="case-subtitle">${p.subtitle}</p><div class="case-meta"><div><span>DEMO SCOPE</span><p>${p.scope}</p></div><div><span>PROPOSED STACK</span><p>${p.stack}</p></div></div><section class="case-section"><h3>01 / The problem</h3><p>${p.problem}</p></section><section class="case-section"><h3>02 / A considered approach</h3><p>${p.approach}</p><div class="architecture" aria-label="Proposed architecture">${p.architecture.map((item,i) => `${i ? '<b aria-hidden="true">/</b>' : ''}<span>${item}</span>`).join('')}</div></section><section class="case-section"><h3>03 / Engineering decisions</h3>${list(p.decisions)}</section><section class="case-section"><h3>04 / The trade-off</h3><p>${p.tradeoff}</p></section><section class="case-section"><h3>05 / How to validate it</h3>${list(p.validation)}</section><section class="case-section"><h3>06 / Intended outcome</h3><p>${p.outcome}</p></section>`;
    dialog.showModal();
    dialog.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }));
  document.querySelectorAll('.dialog-close,.dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; opener?.focus({ preventScroll: true }); });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });

  const canvas = document.getElementById('scroll-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const hero = document.querySelector('.hero');
  const stage = document.querySelector('.hero-stage');
  const header = document.querySelector('.site-header');
  const counter = document.getElementById('frame-count');
  const toggle = document.getElementById('motion-toggle');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 700px)').matches;
  const variant = mobile ? 'mobile' : 'desktop';
  // Trim the black opening frames so the first view contains the portrait.
  const FIRST = 47, LAST = 239, CACHE_LIMIT = mobile ? 28 : 40;
  const frames = new Map(), blobs = new Map(), pending = new Set(), failed = new Set();
  let paused = preference.matches, position = FIRST, target = FIRST;
  let raf = 0, lastTime = 0, lastPaint = '', visible = true, direction = 1;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const url = index => `assets/frames/${variant}/frame-${String(index + 1).padStart(3,'0')}.webp`;
  function schedule() { if (!raf && !document.hidden) raf = requestAnimationFrame(render); }
  function trim() {
    const keys = [...frames.keys()].sort((a,b) => Math.abs(b-position)-Math.abs(a-position));
    while (frames.size > CACHE_LIMIT) { const key = keys.shift(); frames.get(key).close?.(); frames.delete(key); }
  }
  async function load(index) {
    pending.add(index);
    try {
      let blob = blobs.get(index);
      if (!blob) {
        const response = await fetch(url(index));
        if (!response.ok) throw new Error(`Frame ${index+1} unavailable`);
        blob = await response.blob(); blobs.set(index, blob);
      }
      let bitmap;
      if (typeof createImageBitmap === 'function') bitmap = await createImageBitmap(blob);
      else {
        const objectURL = URL.createObjectURL(blob);
        try { bitmap = new Image(); bitmap.src = objectURL; await bitmap.decode(); }
        finally { URL.revokeObjectURL(objectURL); }
      }
      frames.set(index, bitmap); trim(); lastPaint = ''; schedule();
    } catch { failed.add(index); }
    finally { pending.delete(index); warm(); }
  }
  function warm() {
    if (!visible || document.hidden) return;
    const center = Math.floor(position);
    const desired = paused ? [Math.round(position)] : [center, Math.min(center+1,LAST), Math.round(target)];
    if (!paused) for (let i=1;i<=12;i++) {
      desired.push(clamp(center+i*direction,FIRST,LAST),clamp(center-i*direction,FIRST,LAST));
    }
    for (const index of desired) {
      if (pending.size >= 4) break;
      if (!frames.has(index) && !pending.has(index) && !failed.has(index)) void load(index);
    }
  }
  function paint() {
    const low = Math.floor(position), high = Math.min(low+1,LAST), fraction = position-low;
    let key = low;
    if (!frames.has(key)) key = [...frames.keys()].sort((a,b) => Math.abs(a-position)-Math.abs(b-position))[0];
    if (key === undefined) return;
    const first = frames.get(key), second = frames.get(high);
    const signature = `${position.toFixed(3)}:${key}:${!!second}`;
    if (signature === lastPaint) return;
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#100d0e';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    const draw = (image, alpha) => {
      const scale = Math.max(canvas.width/image.width,canvas.height/image.height);
      const offset = stage.clientWidth > 1000 ? canvas.width * .16 : 0;
      ctx.globalAlpha = alpha;
      ctx.drawImage(image,(canvas.width-image.width*scale)/2+offset,(canvas.height-image.height*scale)/2,image.width*scale,image.height*scale);
    };
    draw(first,1);
    if (second && second!==first && key===low) draw(second,fraction);
    ctx.globalAlpha = 1;
    canvas.classList.add('ready');
    counter.textContent = `${String(key+1).padStart(3,'0')} / 240`;
    lastPaint = signature;
  }
  function render(time) {
    raf = 0;
    header.classList.toggle('scrolled',window.scrollY>30);
    if (!visible) { lastTime = 0; return; }
    const distance = Math.max(1,hero.offsetHeight-stage.offsetHeight);
    const progress = clamp((window.scrollY-hero.offsetTop)/distance,0,1);
    if (!paused) target = FIRST + progress*(LAST-FIRST);
    const delta = lastTime ? Math.min(time-lastTime,50) : 16.67;
    lastTime = time;
    direction = target < position ? -1 : 1;
    if (!paused) position += (target-position)*(1-Math.exp(-delta/85));
    if (Math.abs(target-position)<.005) position=target;
    hero.style.setProperty('--progress',((position-FIRST)/(LAST-FIRST)).toFixed(4));
    warm(); paint();
    if (!paused && position!==target) schedule(); else lastTime=0;
  }
  function resize() {
    const dpr = Math.min(devicePixelRatio||1,1.5);
    canvas.width = Math.round(stage.clientWidth*dpr); canvas.height = Math.round(stage.clientHeight*dpr);
    lastPaint = ''; schedule();
  }
  function setMotion(value, preservePosition=false) {
    const oldHeight=hero.offsetHeight, wasBelow=window.scrollY >= hero.offsetTop+oldHeight;
    paused=value;
    if(paused) target=position;
    document.body.classList.toggle('motion-paused',paused);
    document.body.classList.toggle('motion-enabled',!paused);
    toggle.setAttribute('aria-pressed',String(paused));
    toggle.textContent=paused?'Enable animation':'Pause animation';
    if(preservePosition) {
      const top=wasBelow ? window.scrollY + hero.offsetHeight-oldHeight : hero.offsetTop;
      window.scrollTo({top,behavior:'instant'});
    }
    resize();
  }
  new IntersectionObserver(entries => {
    visible=entries[0].isIntersecting;
    if(visible) schedule();
  },{rootMargin:'100px'}).observe(hero);
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',() => { if(!document.hidden) schedule(); });
  preference.addEventListener('change',event => setMotion(event.matches,true));
  toggle.addEventListener('click',() => setMotion(!paused,true));
  setMotion(paused);
})();
