(() => {
  'use strict';
  document.documentElement.classList.add('js');
  document.body.classList.add('motion-on');
  document.getElementById('year').textContent = new Date().getFullYear();
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), {threshold:.08});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  document.querySelectorAll('.project-grid,.process-grid,.services').forEach(group => {
    Array.from(group.children).forEach((child,index) => child.style.setProperty('--reveal-delay', `${index*90}ms`));
  });
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.project').forEach(project => {
    const art = project.querySelector('.art');
    project.addEventListener('pointermove',event => {
      if (!finePointer.matches || !document.body.classList.contains('motion-on')) return;
      const rect = project.getBoundingClientRect();
      art.style.setProperty('--tilt-x', `${-(event.clientY-rect.top-rect.height/2)/rect.height*7}deg`);
      art.style.setProperty('--tilt-y', `${(event.clientX-rect.left-rect.width/2)/rect.width*7}deg`);
      art.style.setProperty('--light-x', `${(event.clientX-rect.left)/rect.width*100}%`);
      art.style.setProperty('--light-y', `${(event.clientY-rect.top)/rect.height*100}%`);
    });
    project.addEventListener('pointerleave',() => {art.style.setProperty('--tilt-x','0deg');art.style.setProperty('--tilt-y','0deg');});
  });
  document.querySelectorAll('.pill').forEach(button => {
    button.addEventListener('pointermove',event => {
      if (!finePointer.matches || !document.body.classList.contains('motion-on')) return;
      const rect = button.getBoundingClientRect();
      button.style.setProperty('--mag-x',`${(event.clientX-rect.left-rect.width/2)*.12}px`);
      button.style.setProperty('--mag-y',`${(event.clientY-rect.top-rect.height/2)*.12}px`);
    });
    button.addEventListener('pointerleave',() => {button.style.setProperty('--mag-x','0px');button.style.setProperty('--mag-y','0px');});
  });
  const projects = [
    {title:'Forma', description:'An illustrative commerce experience for a design-led objects brand. An editorial approach lets materials, proportions, and products lead the experience.', direction:'Warm blush, sculptural forms, oversized type, and a quiet product discovery flow.'},
    {title:'Pulse', description:'An illustrative music discovery platform. A vibrant visual rhythm translates the energy of sound into an expressive interface.', direction:'Coral and crimson, rhythmic shapes, bold headlines, and responsive interaction design.'},
    {title:'Orbit', description:'An illustrative digital workspace for connecting ideas. A focused interface creates room to explore, organize, and discover.', direction:'Deep burgundy, luminous pink, orbital geometry, and a clear content hierarchy.'}
  ];
  const dialog = document.getElementById('project-dialog');
  document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
    const project = projects[Number(button.dataset.project)];
    document.getElementById('dialog-title').textContent = project.title;
    document.getElementById('dialog-description').textContent = project.description;
    document.getElementById('dialog-direction').textContent = project.direction;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }));
  document.querySelectorAll('.dialog-close,.dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  const TOTAL_FRAMES = 240;
  const canvas = document.getElementById('scroll-canvas');
  const ctx = canvas.getContext('2d',{alpha:false});
  const hero = document.querySelector('.hero');
  const stage = document.querySelector('.hero-stage');
  const counter = document.querySelector('.frame-count');
  const header = document.querySelector('header');
  // The hero is an explicitly requested scroll experience. Its visible control
  // lets visitors pause it independently of decorative reduced-motion styles.
  let paused = false;
  const motionToggle = document.querySelector('.motion-toggle');
  const panels = Array.from(document.querySelectorAll('.hero-panel'));
  const chapterButtons = Array.from(document.querySelectorAll('[data-chapter]'));
  const sceneCenters = [0,.32,.64,.94];
  function updateStory(progress) {
    const storyProgress = paused ? 0 : progress;
    let active = 0;
    sceneCenters.forEach((center,index) => {
      if (Math.abs(storyProgress-center) < Math.abs(storyProgress-sceneCenters[active])) active=index;
    });
    panels.forEach((panel,index) => {
      const distance = storyProgress-sceneCenters[index];
      // Keep the outgoing and incoming headlines from competing at mid-transition.
      const opacity = Math.max(0,Math.min(1,(.165-Math.abs(distance))/.045));
      panel.style.setProperty('--scene-opacity',opacity.toFixed(3));
      panel.style.setProperty('--scene-y',`${(-distance*180).toFixed(1)}px`);
      panel.style.setProperty('--scene-blur',`${((1-opacity)*6).toFixed(1)}px`);
      panel.classList.toggle('active',index===active);
      panel.setAttribute('aria-hidden',String(index!==active));
      panel.inert=index!==active;
    });
    chapterButtons.forEach((button,index) => {
      if(index===active) button.setAttribute('aria-current','step');
      else button.removeAttribute('aria-current');
    });
    hero.dataset.chapter=String(active+1);
  }
  chapterButtons.forEach((button,index) => button.addEventListener('click',() => {
    if(paused) motionToggle.click();
    const distance=Math.max(1,hero.offsetHeight-stage.offsetHeight);
    window.scrollTo({top:hero.offsetTop+sceneCenters[index]*distance,behavior:'smooth'});
  }));
  const parallaxImages = Array.from(document.querySelectorAll('.portrait img'));
  function updatePageMotion() {
    const height=window.innerHeight;
    parallaxImages.forEach(img => {
      const rect=img.parentElement.getBoundingClientRect();
      if(rect.bottom>0&&rect.top<height) img.style.setProperty('--portrait-y',paused?'0px':`${((height/2-rect.top-rect.height/2)*.045).toFixed(1)}px`);
    });
    const maxScroll=document.documentElement.scrollHeight-height;
    header.style.setProperty('--page-progress',maxScroll>0?`${window.scrollY/maxScroll*100}%`:'0%');
  }
  const frames = new Array(TOTAL_FRAMES);
  const pending = new Map();
  let current=0,target=0,drawn=-1,raf=0;
  const path = index => `ezgif-8fcc76cbd7cc975c-jpg/ezgif-frame-${String(index+1).padStart(3,'0')}.jpg`;
  function nearest(index) {
    if(frames[index]) return index;
    for(let d=1;d<TOTAL_FRAMES;d++) {
      if(frames[index-d]) return index-d;
      if(frames[index+d]) return index+d;
    }
    return -1;
  }
  function draw(index) {
    const actual=nearest(index);
    if(actual<0||actual===drawn) return;
    const img=frames[actual];
    const scale=Math.max(canvas.width/img.width,canvas.height/img.height);
    ctx.drawImage(img,(canvas.width-img.width*scale)/2,(canvas.height-img.height*scale)/2,img.width*scale,img.height*scale);
    drawn=actual;
    counter.textContent=`${String(actual+1).padStart(3,'0')} / 240`;
  }
  function load(index) {
    if(frames[index]) return Promise.resolve();
    if(pending.has(index)) return pending.get(index);
    const promise=new Promise(resolve => {
      const img=new Image();
      img.onload=() => {
        // Retain smaller frames instead of keeping 240 decoded 4K images in memory.
        const small=document.createElement('canvas');
        small.width=1280;
        small.height=Math.round(img.naturalHeight*1280/img.naturalWidth);
        small.getContext('2d').drawImage(img,0,0,small.width,small.height);
        frames[index]=small;
        // Keep sparse anchors and nearby detail frames; cap the decoded cache.
        const loaded = frames.map((frame,i) => frame ? i : -1).filter(i => i >= 0);
        const evictable = loaded.filter(i => i % 12 !== 0 && i !== TOTAL_FRAMES-1 && i !== index)
          .sort((a,b) => Math.abs(b-target)-Math.abs(a-target));
        while (loaded.length > 48 && evictable.length) {
          frames[evictable.shift()] = undefined;
          loaded.pop();
        }
        pending.delete(index);
        draw(Math.round(current));
        resolve();
      };
      img.onerror=() => {pending.delete(index);resolve();};
      img.src=path(index);
    });
    pending.set(index,promise);
    return promise;
  }
  function animate() {
    current+=(target-current)*.12;
    if(Math.abs(target-current)<.05) current=target;
    draw(Math.round(current));
    raf=current===target?0:requestAnimationFrame(animate);
  }
  function update() {
    const distance=Math.max(1,hero.offsetHeight-stage.offsetHeight);
    const progress=Math.max(0,Math.min(1,(window.scrollY-hero.offsetTop)/distance));
    hero.style.setProperty('--progress',progress.toFixed(4));
    updateStory(progress);
    updatePageMotion();
    header.classList.toggle('scrolled',window.scrollY>40);
    target=paused?119:progress*(TOTAL_FRAMES-1);
    const requested = Math.round(target);
    load(requested).then(() => {
      if (Math.abs(requested-target) > 2 || paused) return;
      const nearby = [requested+1,requested+2,requested-1].filter(i => i >= 0 && i < TOTAL_FRAMES);
      nearby.forEach(load);
    });
    if(!raf) raf=requestAnimationFrame(animate);
  }
  function resize() {
    const dpr=Math.min(window.devicePixelRatio||1,1.5);
    canvas.width=Math.round(stage.clientWidth*dpr);
    canvas.height=Math.round(stage.clientHeight*dpr);
    drawn=-1;
    draw(Math.round(current));
    update();
  }
  async function preload() {
    await load(paused?119:0);
    if(paused) return;
    const order=[];
    for(let i=0;i<TOTAL_FRAMES;i+=12) order.push(i);
    order.push(TOTAL_FRAMES-1);
    let next=0;
    await Promise.all(Array.from({length:4},async () => {
      while(next<order.length&&!paused) await load(order[next++]);
    }));
  }
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',resize,{passive:true});
  motionToggle.addEventListener('click', () => {
    paused = !paused;
    hero.classList.toggle('motion-paused', paused);
    document.body.classList.toggle('motion-on',!paused);
    document.body.classList.toggle('motion-off',paused);
    motionToggle.textContent = paused ? 'Enable motion' : 'Pause motion';
    motionToggle.setAttribute('aria-pressed', String(paused));
    current = paused ? 119 : current;
    resize();
    preload();
  });
  resize();preload();
})();
