/* ThinkSuite Premium JS */
(function(){
'use strict';

/* ── Cursor ── */
function cursor(){
  const d=document.createElement('div'),r=document.createElement('div');
  d.className='ts-dot';r.className='ts-ring';
  document.body.append(d,r);
  let mx=-200,my=-200,rx=-200,ry=-200;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;d.style.cssText=`left:${mx}px;top:${my}px`});
  (function raf(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;r.style.cssText=`left:${rx}px;top:${ry}px`;requestAnimationFrame(raf)})();
  document.querySelectorAll('a,button,.btn,.service-card,.testi-card,.team-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>{d.classList.add('hov');r.classList.add('hov')});
    el.addEventListener('mouseleave',()=>{d.classList.remove('hov');r.classList.remove('hov')});
  });
}

/* ── Particles ── */
function particles(){
  const hero=document.querySelector('.hero');
  if(!hero)return;
  const c=document.createElement('canvas');c.id='hero-canvas';hero.appendChild(c);
  const ctx=c.getContext('2d');let W,H,pts=[];
  function resize(){W=c.width=hero.offsetWidth;H=c.height=hero.offsetHeight}
  resize();window.addEventListener('resize',resize);
  const n=Math.min(55,Math.floor(W/22));
  for(let i=0;i<n;i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.4+.4});
  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0});
    for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
      const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<110){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle=`rgba(0,212,255,${.14*(1-dist/110)})`;ctx.lineWidth=.5;ctx.stroke()}
    }
    pts.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(0,212,255,.45)';ctx.fill()});
    requestAnimationFrame(draw);
  }
  draw();
}

/* ── Navbar ── */
function navbar(){
  const nb=document.querySelector('.navbar');
  if(!nb)return;
  window.addEventListener('scroll',()=>{nb.classList.toggle('scrolled',window.scrollY>60)},{passive:true});
  // Mobile menu
  const ham=document.querySelector('.hamburger'),menu=document.querySelector('.mobile-menu'),close=document.querySelector('.mobile-close');
  function openMenu(){menu.classList.add('open');document.body.style.overflow='hidden'}
  function closeMenu(){menu.classList.remove('open');document.body.style.overflow=''}
  if(ham&&menu){
    ham.addEventListener('click',openMenu);
    if(close)close.addEventListener('click',closeMenu);
    // Close when clicking a non-toggle link inside menu
    menu.querySelectorAll('a.mobile-nav-link, a.mobile-sub-link').forEach(a=>{
      a.addEventListener('click',closeMenu);
    });
  }
  // Mobile toggles
  document.querySelectorAll('.mobile-toggle').forEach(t=>{
    t.addEventListener('click',()=>{
      t.classList.toggle('open');
      const sub=t.nextElementSibling;
      if(sub)sub.classList.toggle('open');
    });
  });
}

/* ── Scroll reveal ── */
function reveal(){
  const els=document.querySelectorAll('.reveal');
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}});
  },{threshold:.12});
  els.forEach(el=>io.observe(el));
}

/* ── Magnetic cards ── */
function magnetic(){
  document.querySelectorAll('.service-card,.process-step').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)/(r.width/2);
      const y=(e.clientY-r.top-r.height/2)/(r.height/2);
      card.style.transform=`perspective(900px) rotateX(${-y*4}deg) rotateY(${x*5}deg) translateY(-14px)`;
    });
    card.addEventListener('mouseleave',()=>card.style.transform='');
  });
}

/* ── Counter ── */
function counters(){
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const el=e.target,raw=el.textContent.trim(),num=parseFloat(raw),suffix=raw.replace(/[\d.]/g,'');
      if(isNaN(num))return;
      let start=0;
      const step=ts=>{if(!start)start=ts;const p=Math.min((ts-start)/1800,1),ease=1-Math.pow(1-p,3);el.textContent=(Math.round(num*ease*10)/10)+suffix;if(p<1)requestAnimationFrame(step)};
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  },{threshold:.5});
  document.querySelectorAll('.stat-num,.hero-stat-num').forEach(el=>io.observe(el));
}

/* ── FAQ ── */
function faq(){
  document.querySelectorAll('.faq-q').forEach(q=>{
    q.addEventListener('click',()=>{
      const item=q.closest('.faq-item');
      const wasOpen=item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));
      if(!wasOpen)item.classList.add('open');
    });
  });
}

/* ── Typed ── */
function typed(){
  const el=document.querySelector('.hero-eyebrow .label');
  if(!el)return;
  const txt=el.textContent.trim();el.textContent='';
  let i=0;
  const type=()=>{if(i<txt.length){el.textContent+=txt[i++];setTimeout(type,35)}};
  setTimeout(type,600);
}

/* ── Active nav ── */
function activeNav(){
  const path=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-link').forEach(a=>{
    if(a.getAttribute('href')===path)a.classList.add('active-page');
  });
}

/* ── Init ── */
function init(){
  if(matchMedia('(pointer:fine)').matches)cursor();
  particles();navbar();reveal();counters();faq();typed();activeNav();
  setTimeout(magnetic,400);
}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init):init();
})();
