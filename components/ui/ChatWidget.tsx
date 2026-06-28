'use client'
import { useState, useRef, useEffect, FormEvent } from 'react'

type Message = { role: 'user' | 'assistant'; content: string }

const WELCOME: Message = {
  role: 'assistant',
  content: "Hi! I'm ThinkAI, powered by ThinkSuite. Ask me anything about our services, pricing, timelines, or how we can help grow your business!",
}

const SUGGESTIONS = [
  'What services do you offer?',
  'How much does a website cost?',
  'How long does a project take?',
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      inputRef.current?.focus()
    }
  }, [open, messages])

  const send = async (text: string) => {
    const msg = text.trim()
    if (!msg || loading) return

    setShowSuggestions(false)
    const history = [...messages, { role: 'user' as const, content: msg }]
    setMessages(history)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          conversationHistory: history.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: data.response || 'Sorry, I had trouble answering that. Please try again or email info@thinksuite.in',
        },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please email us at info@thinksuite.in' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(input)
  }

  return (
    <>
      <style>{`
        @keyframes ts-chat-up {
          from { opacity:0; transform:translateY(16px) scale(0.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes ts-pulse-ring {
          0%,100% { transform:scale(1); opacity:.6; }
          50%      { transform:scale(1.35); opacity:0; }
        }
        @keyframes ts-dot-bounce {
          0%,80%,100% { transform:translateY(0); }
          40%          { transform:translateY(-6px); }
        }
        .ts-cw-panel { animation: ts-chat-up .28s cubic-bezier(.34,1.56,.64,1) both; }
        .ts-cw-msgs::-webkit-scrollbar { width:4px; }
        .ts-cw-msgs::-webkit-scrollbar-thumb { background:rgba(26,35,126,.18); border-radius:4px; }
        .ts-cw-input:focus { border-color:#1a237e; outline:none; }
        .ts-cw-send:not(:disabled):hover { transform:scale(1.08); }
        .ts-cw-btn:hover { transform:scale(1.1); }
        .ts-cw-sug:hover { background:rgba(26,35,126,.1) !important; color:#1a237e !important; border-color:rgba(26,35,126,.35) !important; }
      `}</style>

      <div style={{ position:'fixed', bottom:16, right:16, zIndex:9999, fontFamily:"'Space Grotesk',sans-serif" }}>

        {/* Chat panel */}
        {open && (
          <div
            className="ts-cw-panel"
            style={{
              position:'fixed', bottom:80, right:16,
              width:'min(370px, calc(100vw - 32px))', maxHeight:'min(520px, calc(100dvh - 100px))',
              background:'#ffffff',
              border:'1px solid rgba(26,35,126,.13)',
              borderRadius:20,
              boxShadow:'0 24px 64px rgba(26,35,126,.14),0 4px 16px rgba(0,0,0,.07)',
              display:'flex', flexDirection:'column',
              overflow:'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              background:'linear-gradient(135deg,#1a237e 0%,#00bcd4 100%)',
              padding:'14px 18px',
              display:'flex', alignItems:'center', gap:12, flexShrink:0,
            }}>
              <div style={{
                width:38, height:38,
                background:'rgba(255,255,255,.15)',
                borderRadius:10,
                display:'flex', alignItems:'center', justifyContent:'center',
                flexShrink:0,
                overflow:'hidden',
                padding:4,
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/img/logo.png" alt="ThinkAI" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ color:'#fff', fontWeight:800, fontSize:15, fontFamily:"'Outfit',sans-serif", lineHeight:1.2 }}>
                  ThinkAI
                </div>
                <div style={{ color:'rgba(255,255,255,.7)', fontSize:11, fontFamily:"'JetBrains Mono',monospace", marginTop:2 }}>
                  Powered by ThinkSuite
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background:'none', border:'none', color:'rgba(255,255,255,.8)', cursor:'pointer', padding:4, fontSize:17, lineHeight:1, flexShrink:0 }}
                aria-label="Close chat"
              >
                <i className="fa-solid fa-xmark" />
              </button>
            </div>

            {/* Messages */}
            <div
              className="ts-cw-msgs"
              style={{ flex:1, overflowY:'auto', padding:'14px 14px 6px', display:'flex', flexDirection:'column', gap:10 }}
            >
              {messages.map((m, i) => (
                <div key={i} style={{ display:'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  {m.role === 'assistant' && (
                    <div style={{
                      width:24, height:24,
                      background:'#eef2ff',
                      borderRadius:6,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      flexShrink:0, marginRight:7, marginTop:2,
                      overflow:'hidden', padding:2,
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/assets/img/logo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                    </div>
                  )}
                  <div style={{
                    maxWidth:'78%',
                    padding:'9px 13px',
                    borderRadius: m.role === 'user' ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
                    background: m.role === 'user' ? 'linear-gradient(135deg,#1a237e,#00bcd4)' : '#f1f5f9',
                    color: m.role === 'user' ? '#fff' : '#1e293b',
                    fontSize:13,
                    lineHeight:1.65,
                    boxShadow:'0 1px 4px rgba(0,0,0,.05)',
                    whiteSpace:'pre-wrap',
                    wordBreak:'break-word',
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div style={{ display:'flex', alignItems:'flex-start', gap:7 }}>
                  <div style={{
                    width:24, height:24,
                    background:'#eef2ff',
                    borderRadius:6,
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2,
                    overflow:'hidden', padding:2,
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/img/logo.png" alt="" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
                  </div>
                  <div style={{
                    padding:'10px 14px',
                    borderRadius:'14px 14px 14px 3px',
                    background:'#f1f5f9',
                    display:'flex', gap:4, alignItems:'center',
                  }}>
                    {[0,1,2].map(n => (
                      <span key={n} style={{
                        width:6, height:6,
                        background:'#94a3b8',
                        borderRadius:'50%',
                        display:'inline-block',
                        animation:`ts-dot-bounce 1.2s ${n * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestion chips */}
              {showSuggestions && messages.length === 1 && !loading && (
                <div style={{ display:'flex', flexDirection:'column', gap:6, marginTop:4 }}>
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      className="ts-cw-sug"
                      onClick={() => send(s)}
                      style={{
                        background:'rgba(37,99,235,.06)',
                        border:'1px solid rgba(37,99,235,.18)',
                        borderRadius:8,
                        padding:'7px 12px',
                        fontSize:12.5,
                        color:'#334155',
                        cursor:'pointer',
                        textAlign:'left',
                        transition:'all .2s',
                        fontFamily:"'Space Grotesk',sans-serif",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              style={{
                padding:'10px 12px',
                borderTop:'1px solid rgba(37,99,235,.09)',
                display:'flex', gap:8,
                background:'#fafbff',
                flexShrink:0,
              }}
            >
              <input
                ref={inputRef}
                className="ts-cw-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about services, pricing..."
                disabled={loading}
                style={{
                  flex:1,
                  padding:'9px 13px',
                  border:'1.5px solid rgba(37,99,235,.18)',
                  borderRadius:10,
                  fontSize:13,
                  color:'#1e293b',
                  background:'#fff',
                  fontFamily:"'Space Grotesk',sans-serif",
                  transition:'border-color .2s',
                }}
              />
              <button
                type="submit"
                className="ts-cw-send"
                disabled={loading || !input.trim()}
                style={{
                  width:38, height:38,
                  background: input.trim() && !loading ? 'linear-gradient(135deg,#1a237e,#00bcd4)' : '#e2e8f0',
                  border:'none',
                  borderRadius:10,
                  cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  flexShrink:0,
                  transition:'all .2s',
                  alignSelf:'center',
                }}
                aria-label="Send"
              >
                <i className="fa-solid fa-paper-plane" style={{ color: input.trim() && !loading ? '#fff' : '#94a3b8', fontSize:13 }} />
              </button>
            </form>

            {/* Branding footer */}
            <div style={{
              padding:'6px 14px',
              background:'#f8faff',
              borderTop:'1px solid rgba(26,35,126,.06)',
              fontSize:10.5,
              color:'#94a3b8',
              textAlign:'center',
              flexShrink:0,
            }}>
              ThinkAI Â· Powered by ThinkSuite Â· <a href="mailto:info@thinksuite.in" style={{ color:'#1a237e' }}>info@thinksuite.in</a>
            </div>
          </div>
        )}

        {/* Toggle button */}
        <button
          className="ts-cw-btn"
          onClick={() => setOpen(o => !o)}
          style={{
            width:60, height:60,
            background:'linear-gradient(135deg,#1d4ed8,#3b82f6)',
            border:'none',
            borderRadius: open ? '50%' : '50% 50% 50% 8px',
            cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 4px 24px rgba(26,35,126,.5)',
            transition:'all .3s cubic-bezier(.34,1.56,.64,1)',
            position:'relative',
            padding:0,
          }}
          aria-label={open ? 'Close chat' : 'Open ThinkAI'}
        >
          {!open && (
            <span style={{
              position:'absolute', inset:-5,
              borderRadius:'50% 50% 50% 8px',
              border:'2px solid rgba(37,99,235,.4)',
              animation:'ts-pulse-ring 2.2s ease-in-out infinite',
              pointerEvents:'none',
            }} />
          )}
          {open ? (
            <i className="fa-solid fa-xmark" style={{ color:'#fff', fontSize:22 }} />
          ) : (
            <div style={{
              width:40, height:40,
              background:'#fff',
              borderRadius:'50%',
              display:'flex', alignItems:'center', justifyContent:'center',
              overflow:'hidden',
              padding:4,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/img/logo.png" alt="ThinkAI" style={{ width:'100%', height:'100%', objectFit:'contain' }} />
            </div>
          )}
        </button>
      </div>
    </>
  )
}

