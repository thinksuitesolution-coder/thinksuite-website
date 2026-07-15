'use client'
import { useState, useEffect } from 'react'

const CSS = `
@keyframes dFI{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
@keyframes dP{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes dS{0%,100%{opacity:.45}50%{opacity:1}}
@keyframes dW{0%,100%{transform:scaleY(.18)}50%{transform:scaleY(1)}}
`

function useInjectStyles() {
  useEffect(() => {
    const id = '__tool-demo-kf__'
    if (!document.getElementById(id)) {
      const s = document.createElement('style')
      s.id = id
      s.textContent = CSS
      document.head.appendChild(s)
    }
  }, [])
}

function Dot({ c }: { c: string }) {
  return <span style={{ width:6, height:6, borderRadius:'50%', background:c, display:'inline-block', flexShrink:0, animation:'dP 1.1s ease-in-out infinite' }} />
}
function Chip({ children, c, solid }: { children: React.ReactNode; c: string; solid?: boolean }) {
  return (
    <span style={{ padding:'2px 7px', borderRadius:100, fontSize:9, fontWeight:700, whiteSpace:'nowrap',
      background: solid ? c : `${c}1a`, color: solid ? '#fff' : c, border:`1px solid ${c}38` }}>
      {children}
    </span>
  )
}
function Sh({ w = '100%', h = 8, d = 0 }: { w?: string; h?: number; d?: number }) {
  return <div style={{ width:w, height:h, borderRadius:4, background:'rgba(255,255,255,0.06)', animation:`dS 1.3s ${d}s ease-in-out infinite` }} />
}
function Frame({ children }: { children: React.ReactNode }) {
  useInjectStyles()
  return (
    <div style={{ width:'100%', aspectRatio:'16/9', background:'#040b14', overflow:'hidden',
      position:'relative', fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <div style={{ position:'absolute', inset:0, padding:'11px 13px', boxSizing:'border-box',
        display:'flex', flexDirection:'column' }}>
        {children}
      </div>
    </div>
  )
}

const LG = [
  { key:'gmb', icon:'📍', label:'GMB Leads', badge:'Domestic', bc:'#22c55e',
    rows:[
      ['Raj Electronics Pvt Ltd','Mumbai, MH','+91 98200 •••••','4.5★ · 230 reviews'],
      ['Delhi Steel Corporation','New Delhi','+91 99110 •••••','4.2★ · 89 reviews'],
      ['Sunrise Traders & Co.','Surat, GJ','+91 98760 •••••','4.7★ · 410 reviews'],
      ['BestBuy Hardware Store','Chennai, TN','+91 90000 •••••','4.3★ · 155 reviews'],
    ]},
  { key:'web', icon:'🌐', label:'Website Leads', badge:'Domestic', bc:'#3b82f6',
    rows:[
      ['TechVision Solutions Pvt','Bangalore, KA','techvision.in','CEO: Amit Shah'],
      ['GreenLeaf Exports Ltd','Ahmedabad, GJ','greenleaf.co.in','Founded: 2018'],
      ['Mehra Pharma Pvt Ltd','Hyderabad, TS','mehrapharma.in','ISO 9001 Certified'],
    ]},
  { key:'linkedin', icon:'💼', label:'LinkedIn Leads', badge:'Professional', bc:'#0ea5e9',
    rows:[
      ['Anita Sharma – CMO','FinTech Startup, Mumbai','CMO · 500+ connects','Looking for AI tools'],
      ['Rahul Verma – CEO','SaaS Company, Bangalore','CEO · 1k+ connects','Raised Series A'],
    ]},
]

function LeadGenDemo({ color }: { color: string }) {
  const [si, setSi] = useState(0)
  const [shown, setShown] = useState(0)
  const [cnt, setCnt] = useState(0)
  const src = LG[si]

  useEffect(() => {
    setShown(0); setCnt(0)
    let i = 0
    const iv = setInterval(() => {
      i++; setShown(i)
      setCnt(c => c + Math.floor(12 + Math.random() * 22))
      if (i >= src.rows.length) { clearInterval(iv); setTimeout(() => setSi(s => (s+1) % LG.length), 2400) }
    }, 720)
    return () => clearInterval(iv)
  }, [si])

  return (
    <Frame>
      <div style={{ display:'flex', gap:4, marginBottom:8, flexWrap:'wrap' }}>
        {LG.map((s,i) => (
          <div key={s.key} style={{ padding:'3px 8px', borderRadius:5, fontSize:9, fontWeight:700, transition:'all 0.3s',
            background: i===si ? `${color}22` : 'rgba(255,255,255,0.04)',
            border:`1px solid ${i===si ? color+'45' : 'rgba(255,255,255,0.07)'}`,
            color: i===si ? color : 'rgba(255,255,255,0.28)' }}>
            {s.icon} {s.label}
          </div>
        ))}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:7 }}>
        <Dot c={color} />
        <span style={{ fontSize:9, color:'rgba(255,255,255,0.38)', fontWeight:600 }}>Scanning {src.label}…</span>
        <div style={{ marginLeft:'auto', display:'flex', gap:4 }}>
          <Chip c={src.bc}>{src.badge}</Chip><Chip c={color}>{cnt} leads</Chip>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 0.85fr 0.95fr 0.95fr', gap:5, padding:'3px 8px', marginBottom:4 }}>
        {['Business Name','Location','Contact','Details'].map(h => (
          <span key={h} style={{ fontSize:7.5, fontWeight:700, color:'rgba(255,255,255,0.2)', textTransform:'uppercase', letterSpacing:0.5 }}>{h}</span>
        ))}
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:4, overflow:'hidden' }}>
        {src.rows.slice(0,shown).map((r,i) => (
          <div key={`${si}-${i}`} style={{ display:'grid', gridTemplateColumns:'1.6fr 0.85fr 0.95fr 0.95fr', gap:5,
            padding:'5px 8px', borderRadius:7, animation:'dFI 0.3s ease both',
            background: i===shown-1 ? `${color}09` : 'rgba(255,255,255,0.025)',
            border:`1px solid ${i===shown-1 ? color+'30' : 'rgba(255,255,255,0.05)'}` }}>
            <span style={{ fontSize:9, fontWeight:700, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r[0]}</span>
            <span style={{ fontSize:8.5, color:'rgba(255,255,255,0.42)' }}>{r[1]}</span>
            <span style={{ fontSize:8, color:'rgba(255,255,255,0.32)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r[2]}</span>
            <span style={{ fontSize:8.5, color:src.bc, fontWeight:700 }}>{r[3]}</span>
          </div>
        ))}
        {shown < src.rows.length && (
          <div style={{ padding:'6px 8px', borderRadius:7, background:'rgba(255,255,255,0.01)', border:'1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display:'flex', gap:6 }}><Sh w="50%" /><Sh w="25%" d={0.2} /><Sh w="20%" d={0.4} /></div>
          </div>
        )}
      </div>
      <div style={{ marginTop:7, padding:'5px 10px', background:`${color}08`, border:`1px solid ${color}15`, borderRadius:7,
        display:'flex', alignItems:'center', gap:10 }}>
        {['⬇ Export CSV','📱 WhatsApp Bulk','📧 Email Campaign'].map(a => (
          <span key={a} style={{ fontSize:8.5, color:'rgba(255,255,255,0.38)', fontWeight:600 }}>{a}</span>
        ))}
        <span style={{ marginLeft:'auto', fontSize:7.5, color:'rgba(255,255,255,0.15)' }}>ThinkSuite AI</span>
      </div>
    </Frame>
  )
}

const VLANG = ['🇮🇳 Hindi','🇺🇸 English','🇪🇸 Spanish','🇸🇦 Arabic','🇫🇷 French','🇩🇪 German']
const VSTEPS = [
  { lang:'🇮🇳 Hindi', voice:'Priya (Female)', text:'Welcome! Today we\'ll show you how to grow your business faster with the power of AI. With ThinkSuite AI Tools…' },
  { lang:'🇺🇸 English', voice:'James (Male)', text:'Welcome to ThinkSuite. Today we\'ll show you how to grow your business faster using AI-powered voice technology that works in 28+ languages…' },
  { lang:'🇪🇸 Spanish', voice:'Sofia (Female)', text:'¡Bienvenido a ThinkSuite! Hoy le mostraremos cómo hacer crecer su negocio más rápido con tecnología de voz impulsada por inteligencia artificial…' },
]

function VoiceDemo({ color }: { color: string }) {
  const [step, setStep] = useState(0)
  const [chars, setChars] = useState(0)
  const [phase, setPhase] = useState<'type'|'wave'|'done'>('type')
  const s = VSTEPS[step]

  useEffect(() => {
    setChars(0); setPhase('type')
    let c = 0
    const iv = setInterval(() => {
      c += 2; setChars(Math.min(c, s.text.length))
      if (c >= s.text.length) {
        clearInterval(iv); setPhase('wave')
        setTimeout(() => {
          setPhase('done')
          setTimeout(() => setStep(st => (st+1) % VSTEPS.length), 2000)
        }, 2200)
      }
    }, 28)
    return () => clearInterval(iv)
  }, [step])

  return (
    <Frame>
      <div style={{ display:'flex', gap:4, marginBottom:9, flexWrap:'wrap' }}>
        {VLANG.map(l => (
          <div key={l} style={{ padding:'3px 8px', borderRadius:5, fontSize:8.5, fontWeight:700,
            background: l===s.lang ? `${color}20` : 'rgba(255,255,255,0.04)',
            border:`1px solid ${l===s.lang ? color+'40' : 'rgba(255,255,255,0.07)'}`,
            color: l===s.lang ? color : 'rgba(255,255,255,0.3)' }}>{l}</div>
        ))}
        <div style={{ padding:'3px 8px', borderRadius:5, fontSize:8.5, color:'rgba(255,255,255,0.2)',
          background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>+22 more</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:9, padding:'7px 10px',
        background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:9 }}>
        <div style={{ width:26, height:26, borderRadius:8, background:`${color}18`, border:`1px solid ${color}30`,
          display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>🎤</div>
        <div>
          <div style={{ fontSize:9.5, fontWeight:700, color:'#fff' }}>{s.voice}</div>
          <div style={{ fontSize:8, color:'rgba(255,255,255,0.3)' }}>Natural pitch · Speed 1.0x · HD 192kbps</div>
        </div>
        <div style={{ marginLeft:'auto' }}><Chip c={color}>Active</Chip></div>
      </div>
      <div style={{ flex:1, padding:'8px 10px', background:'rgba(255,255,255,0.025)',
        border:'1px solid rgba(255,255,255,0.08)', borderRadius:9, marginBottom:9, overflow:'hidden' }}>
        <div style={{ fontSize:7.5, fontWeight:700, color:'rgba(255,255,255,0.2)', textTransform:'uppercase', letterSpacing:0.8, marginBottom:5 }}>Script</div>
        <div style={{ fontSize:9, color:'rgba(255,255,255,0.65)', lineHeight:1.7, wordBreak:'break-word' }}>
          {s.text.slice(0,chars)}
          {phase==='type' && <span style={{ borderRight:`2px solid ${color}`, display:'inline-block', marginLeft:1, height:11, verticalAlign:'middle', animation:'dP 0.8s ease-in-out infinite' }} />}
        </div>
      </div>
      {phase==='wave' && (
        <div style={{ padding:'9px 12px', background:`${color}08`, border:`1px solid ${color}20`, borderRadius:9,
          display:'flex', alignItems:'center', gap:8 }}>
          <Dot c={color} />
          <span style={{ fontSize:9, color:color, fontWeight:700 }}>Generating voice…</span>
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:2, marginLeft:4 }}>
            {Array.from({length:28}).map((_,i) => (
              <div key={i} style={{ width:3, borderRadius:2, background:color, opacity:0.65,
                animation:`dW ${0.35+i*0.07}s ${i*0.045}s ease-in-out infinite`,
                transformOrigin:'center', height:`${6+Math.abs(Math.sin(i*0.8))*12}px` }} />
            ))}
          </div>
        </div>
      )}
      {phase==='done' && (
        <div style={{ padding:'8px 12px', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.25)',
          borderRadius:9, display:'flex', alignItems:'center', gap:8, animation:'dFI 0.4s ease both' }}>
          <span style={{ fontSize:14 }}>✅</span>
          <div>
            <div style={{ fontSize:9.5, fontWeight:700, color:'#22c55e' }}>voice_output.mp3 – Ready!</div>
            <div style={{ fontSize:8, color:'rgba(255,255,255,0.3)' }}>HD Quality · 192kbps · ~0:08 sec</div>
          </div>
          <div style={{ marginLeft:'auto', padding:'3px 10px', background:'rgba(34,197,94,0.15)',
            border:'1px solid rgba(34,197,94,0.3)', borderRadius:100, fontSize:9, color:'#22c55e', fontWeight:700 }}>
            ⬇ Download
          </div>
        </div>
      )}
    </Frame>
  )
}

const IMG_P = [
  { prompt:'Luxury real estate poster, Mumbai skyline, deep blue gradient, modern bold typography', model:'DALL-E 3', cols:['#1e3a5f','#2563eb','#7c3aed','#0f172a'] },
  { prompt:'Diwali sale ad, golden diyas, festive lights, bright orange & gold, Indian festival style', model:'GPT Image 1', cols:['#92400e','#d97706','#b45309','#7c2d12'] },
  { prompt:'Tech startup product ad, minimalist clean design, purple gradient, futuristic feel', model:'Gemini Imagen', cols:['#4c1d95','#7c3aed','#2563eb','#1e1b4b'] },
]

function ImageStudioDemo({ color }: { color: string }) {
  const [pi, setPi] = useState(0)
  const [rev, setRev] = useState(0)
  const [gen, setGen] = useState(true)
  const p = IMG_P[pi]

  useEffect(() => {
    setRev(0); setGen(true)
    const t = setTimeout(() => {
      setGen(false)
      let i = 0
      const iv = setInterval(() => {
        i++; setRev(i)
        if (i >= 4) { clearInterval(iv); setTimeout(() => setPi(x => (x+1) % IMG_P.length), 2800) }
      }, 480)
      return () => clearInterval(iv)
    }, 1100)
    return () => clearTimeout(t)
  }, [pi])

  return (
    <Frame>
      <div style={{ padding:'6px 10px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:9, marginBottom:7 }}>
        <div style={{ fontSize:7.5, fontWeight:700, color:'rgba(255,255,255,0.2)', textTransform:'uppercase', letterSpacing:0.8, marginBottom:3 }}>Prompt</div>
        <div style={{ fontSize:9, color:'rgba(255,255,255,0.65)', lineHeight:1.45 }}>{p.prompt}</div>
      </div>
      <div style={{ display:'flex', gap:5, marginBottom:8 }}>
        {['DALL-E 3','GPT Image 1','Gemini Imagen'].map(m => (
          <div key={m} style={{ padding:'3px 9px', borderRadius:6, fontSize:8.5, fontWeight:700,
            background: m===p.model ? `${color}20` : 'rgba(255,255,255,0.04)',
            border:`1px solid ${m===p.model ? color+'40' : 'rgba(255,255,255,0.07)'}`,
            color: m===p.model ? color : 'rgba(255,255,255,0.28)' }}>{m}</div>
        ))}
        <Chip c={color}>4× Upscale</Chip>
        <Chip c="#22c55e">BG Remove</Chip>
      </div>
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr', gap:7 }}>
        {Array.from({length:4}).map((_,i) => (
          <div key={i} style={{ borderRadius:9, overflow:'hidden', position:'relative',
            background: rev>i ? `linear-gradient(135deg,${p.cols[i%4]},${p.cols[(i+2)%4]})` : 'rgba(255,255,255,0.04)',
            border:`1px solid ${rev>i ? color+'30' : 'rgba(255,255,255,0.06)'}`, transition:'all 0.5s',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            {(gen || rev<=i) && (
              <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,0.04)', animation:'dS 1.3s ease-in-out infinite' }} />
            )}
            {rev>i && (
              <div style={{ position:'absolute', bottom:5, right:5 }}><Chip c={color}>HD</Chip></div>
            )}
          </div>
        ))}
      </div>
      <div style={{ marginTop:7, display:'flex', alignItems:'center', gap:6 }}>
        {gen ? (
          <><Dot c={color} /><span style={{ fontSize:9, color:color, fontWeight:600 }}>Generating 4 variations with {p.model}…</span></>
        ) : rev>=4 ? (
          <><Chip c="#22c55e">✓ 4 Images Ready</Chip><Chip c={color}>⬆ 4× Upscale</Chip><Chip c="#7c3aed">✂ Remove BG</Chip></>
        ) : (
          <><Dot c={color} /><span style={{ fontSize:9, color:color, fontWeight:600 }}>{rev}/4 generated…</span></>
        )}
        <span style={{ marginLeft:'auto', fontSize:8, color:'rgba(255,255,255,0.18)' }}>ThinkSuite AI</span>
      </div>
    </Frame>
  )
}

const CT = [
  { type:'📝 Blog Post', c:'#3b82f6', title:'AI Tools Every Indian Startup Needs in 2025',
    lines:['India\'s startup ecosystem is booming, and AI tools are the secret weapon that top founders are using to grow 10x faster than their competitors…','1. ThinkSuite AI – The all-in-one platform combining content, SEO, voice, video, and lead generation in a single subscription.','2. AI-powered lead generation finds 100+ targeted B2B leads in seconds complete with contact details, company insights, and pain points.','Conclusion: The future belongs to startups that leverage AI intelligently. Get started today.'],
    meta:'2,400 words · SEO optimized · H1/H2 structure included' },
  { type:'📢 Ad Copy', c:'#f59e0b', title:'Facebook Ad – AI Lead Gen Tool',
    lines:['🔥 HEADLINE: "Stop Paying ₹50,000/month for 10 Tools – Get All AI Tools in One!"','BODY: Tired of juggling multiple platforms? ThinkSuite gives you AI tools – voice, image, content, video, lead gen – all in one place.','CTA 1: "Get Started Free" | CTA 2: "No Credit Card Required"','Social Proof: 5,000+ businesses worldwide are already growing faster with ThinkSuite AI Tools.'],
    meta:'3 A/B variants · Platform-optimized · Psychological triggers' },
  { type:'📱 Social Caption', c:'#7c3aed', title:'Instagram Caption + 30 Hashtags',
    lines:['✨ From raw idea to viral content in under 30 seconds. This is what AI-powered marketing looks like in 2025. 🚀','💡 Whether you\'re a startup founder, freelancer, or digital marketer – you need tools that work as fast as your ideas.','#AIMarketing #ThinkSuite #DigitalMarketing #IndianStartup #ContentCreation #BusinessGrowth','#AITools #MarketingAutomation #StartupIndia #LeadGeneration #ContentMarketing #SocialMediaTips'],
    meta:'30 hashtags · Hook included · Viral elements · Platform tone' },
]

function ContentDemo({ color }: { color: string }) {
  const [ci, setCi] = useState(0)
  const [shown, setShown] = useState(0)
  const ct = CT[ci]

  useEffect(() => {
    setShown(0)
    let i = 0
    const iv = setInterval(() => {
      i++; setShown(i)
      if (i >= ct.lines.length) { clearInterval(iv); setTimeout(() => setCi(c => (c+1) % CT.length), 2200) }
    }, 820)
    return () => clearInterval(iv)
  }, [ci])

  return (
    <Frame>
      <div style={{ display:'flex', gap:5, marginBottom:8 }}>
        {CT.map((c,i) => (
          <div key={c.type} style={{ padding:'3px 9px', borderRadius:6, fontSize:9, fontWeight:700,
            background: i===ci ? `${c.c}20` : 'rgba(255,255,255,0.04)',
            border:`1px solid ${i===ci ? c.c+'40' : 'rgba(255,255,255,0.07)'}`,
            color: i===ci ? c.c : 'rgba(255,255,255,0.28)' }}>{c.type}</div>
        ))}
      </div>
      <div style={{ marginBottom:7, padding:'6px 10px', background:`${ct.c}08`, border:`1px solid ${ct.c}15`, borderRadius:8 }}>
        <div style={{ fontSize:7.5, fontWeight:700, color:'rgba(255,255,255,0.2)', textTransform:'uppercase', marginBottom:3 }}>Generated Title</div>
        <div style={{ fontSize:9.5, fontWeight:800, color:'#fff', animation:'dFI 0.3s ease both' }}>{ct.title}</div>
      </div>
      <div style={{ flex:1, display:'flex', flexDirection:'column', gap:5, overflow:'hidden' }}>
        {ct.lines.slice(0,shown).map((line,i) => (
          <div key={`${ci}-${i}`} style={{ padding:'5px 9px', borderRadius:7, animation:'dFI 0.4s ease both',
            background: i===shown-1 ? `${ct.c}07` : 'rgba(255,255,255,0.02)',
            border:`1px solid ${i===shown-1 ? ct.c+'20' : 'rgba(255,255,255,0.05)'}` }}>
            <div style={{ fontSize:9, color:'rgba(255,255,255,0.65)', lineHeight:1.5 }}>{line}</div>
          </div>
        ))}
        {shown < ct.lines.length && (
          <div style={{ padding:'7px 9px', borderRadius:7, background:'rgba(255,255,255,0.01)', border:'1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
              <div style={{ display:'flex', gap:6 }}><Sh w="65%" /><Sh w="30%" d={0.3} /></div>
              <Sh w="45%" d={0.1} />
            </div>
          </div>
        )}
      </div>
      <div style={{ marginTop:7, display:'flex', alignItems:'center', gap:7 }}>
        <Dot c={ct.c} />
        <span style={{ fontSize:8.5, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>{ct.meta}</span>
        <div style={{ marginLeft:'auto', display:'flex', gap:4 }}><Chip c={ct.c}>Copy</Chip><Chip c="#22c55e">Export</Chip></div>
      </div>
    </Frame>
  )
}

const VS_SCRIPTS = [
  'Introducing ThinkSuite AI Tools – the only platform where businesses worldwide can create professional marketing content, generate leads, and automate outreach all in one place.',
  'Are you still paying for 10 different tools? ThinkSuite gives you Voice AI, Image Studio, Content Generator, Video Studio and Lead Gen all in one place.',
]

function VideoStudioDemo({ color }: { color: string }) {
  const [phase, setPhase] = useState<'script'|'gen'|'done'>('script')
  const [prog, setProg] = useState(0)
  const [sIdx, setSIdx] = useState(0)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    let alive = true
    setPhase('script'); setProg(0)
    const t1 = setTimeout(() => {
      if(!alive) return; setPhase('gen')
      let p = 0
      const iv = setInterval(() => { p+=2; if(alive) setProg(Math.min(p,100)); if(p>=100){ clearInterval(iv); if(alive) setPhase('done'); setTimeout(()=>{ if(alive){ setSIdx(s=>(s+1)%VS_SCRIPTS.length); setCycle(c=>c+1) } },2500) } }, 55)
      return () => clearInterval(iv)
    }, 1800)
    return () => { alive=false; clearTimeout(t1) }
  }, [cycle])

  return (
    <Frame>
      <div style={{ display:'flex', gap:5, marginBottom:8 }}>
        {['✍ Script','🎬 Text→Video','🧑 AI Avatar','🎵 Lip Sync'].map((t,i) => (
          <div key={t} style={{ padding:'3px 9px', borderRadius:6, fontSize:9, fontWeight:700,
            background: i===0 ? `${color}20` : 'rgba(255,255,255,0.04)',
            border:`1px solid ${i===0 ? color+'40' : 'rgba(255,255,255,0.07)'}`,
            color: i===0 ? color : 'rgba(255,255,255,0.28)' }}>{t}</div>
        ))}
      </div>
      <div style={{ padding:'7px 10px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
        borderRadius:9, marginBottom:8, flex: phase==='done' ? 0 : 1 }}>
        <div style={{ fontSize:7.5, fontWeight:700, color:'rgba(255,255,255,0.2)', textTransform:'uppercase', letterSpacing:0.8, marginBottom:5 }}>Script</div>
        <div style={{ fontSize:9, color:'rgba(255,255,255,0.65)', lineHeight:1.65 }}>{VS_SCRIPTS[sIdx]}</div>
        <div style={{ marginTop:8, display:'flex', gap:5 }}>
          <Chip c={color}>Veo 2</Chip><Chip c="#22c55e">AI Avatar</Chip><Chip c="#f59e0b">Hindi Dub</Chip>
        </div>
      </div>
      {phase==='gen' && (
        <div style={{ padding:'12px 14px', background:`${color}08`, border:`1px solid ${color}18`, borderRadius:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
            <Dot c={color} /><span style={{ fontSize:9.5, color:color, fontWeight:700 }}>Veo 2 generating video… {prog}%</span>
          </div>
          <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:3, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${prog}%`, background:`linear-gradient(90deg,${color},${color}aa)`, borderRadius:3, transition:'width 0.1s' }} />
          </div>
          <div style={{ display:'flex', gap:5, marginTop:8 }}>
            {['Scene Analysis','AI Rendering','Audio Sync','Final Export'].map((s,i) => (
              <span key={s} style={{ fontSize:8, color: prog>i*25?'rgba(255,255,255,0.5)':'rgba(255,255,255,0.18)', fontWeight:600 }}>{prog>i*25?'✓':''} {s}</span>
            ))}
          </div>
        </div>
      )}
      {phase==='done' && (
        <div style={{ flex:1, display:'flex', gap:10, animation:'dFI 0.4s ease both' }}>
          <div style={{ flex:1, background:`linear-gradient(135deg,${color}20,${color}08)`,
            border:`1px solid ${color}25`, borderRadius:12, display:'flex', alignItems:'center',
            justifyContent:'center', flexDirection:'column', gap:6 }}>
            <div style={{ fontSize:22 }}>▶</div>
            <div style={{ fontSize:8.5, color:'rgba(255,255,255,0.5)', fontWeight:600 }}>video_output.mp4 · 0:30</div>
            <Chip c="#22c55e">Ready to Download</Chip>
          </div>
          <div style={{ width:80, background:`linear-gradient(135deg,#1a0a2e,${color}15)`,
            border:`1px solid ${color}20`, borderRadius:12, display:'flex', alignItems:'center',
            justifyContent:'center', flexDirection:'column', gap:4 }}>
            <div style={{ fontSize:18 }}>🧑</div>
            <div style={{ fontSize:7.5, color:'rgba(255,255,255,0.4)', fontWeight:600, textAlign:'center' }}>AI Avatar<br/>Active</div>
          </div>
        </div>
      )}
    </Frame>
  )
}

const DEMOS: Record<string, React.ComponentType<{ color: string }>> = {
  'lead-generation': LeadGenDemo,
  voice: VoiceDemo,
  imagestudio: ImageStudioDemo,
  content: ContentDemo,
  video: VideoStudioDemo,
}

export default function ToolDemoAnimation({ slug, color }: { slug: string; color: string }) {
  const Demo = DEMOS[slug]
  if (!Demo) return null
  return <Demo color={color} />
}
