'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  'What is the difference between GPT-4o and Claude 3.5 Sonnet?',
  'Which AI companies received the most funding in 2025?',
  'What startup opportunities exist around AI Agents?',
  'How does Gemini 1.5 Pro compare to GPT-4o?',
  'What are the top AI trends for the next 90 days?',
  'Which open-source AI models are best for production?',
];

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `👋 Hello! I'm ThinkSuite's AI Intelligence Assistant.\n\nI can help you understand:\n• AI company strategies & competitive dynamics\n• Model comparisons & technical capabilities\n• Funding, acquisitions & market trends\n• Startup opportunities from AI developments\n• Research papers & technical breakthroughs\n\nWhat would you like to know about the AI industry?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMessage: Message = { role: 'user', content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-8).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/intelligence/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, conversationHistory: history }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response || 'Sorry, I could not process that request.',
        timestamp: new Date(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function formatContent(content: string) {
    return content
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('• ') || line.startsWith('- ')) {
          return <li key={i} style={{ marginLeft: 16, marginBottom: 4 }}>{line.slice(2)}</li>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <strong key={i} style={{ display: 'block', marginTop: 8 }}>{line.slice(2, -2)}</strong>;
        }
        if (!line.trim()) return <br key={i} />;
        return <span key={i} style={{ display: 'block' }}>{line}</span>;
      });
  }

  function timeStr(d: Date) {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Header */}
      <div className="chat-header">
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 14, height: '100%' }}>
          <div className="chat-avatar">🤖</div>
          <div>
            <h1 className="chat-title">ThinkSuite AI Intelligence</h1>
            <div className="chat-status"><span className="live-dot" />Live AI industry knowledge, refreshed continuously</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <a href="/intelligence" className="chat-back-btn">← Dashboard</a>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        <div className="container" style={{ maxWidth: 800 }}>
          {messages.map((msg, i) => (
            <div key={i} className={`chat-bubble-wrap ${msg.role}`}>
              {msg.role === 'assistant' && <div className="chat-bot-icon">🤖</div>}
              <div className={`chat-bubble ${msg.role}`}>
                <div className="chat-bubble-content">
                  {formatContent(msg.content)}
                </div>
                <div className="chat-bubble-time">{timeStr(msg.timestamp)}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-bubble-wrap assistant">
              <div className="chat-bot-icon">🤖</div>
              <div className="chat-bubble assistant">
                <div className="chat-typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggestions (only shown at start) */}
      {messages.length <= 1 && (
        <div className="chat-suggestions">
          <div className="container" style={{ maxWidth: 800 }}>
            <div className="chat-suggestions-grid">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button key={i} className="chat-suggestion-btn" onClick={() => sendMessage(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="chat-input-wrap">
        <div className="container" style={{ maxWidth: 800 }}>
          <div className="chat-input-box">
            <textarea
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about the AI industry..."
              rows={1}
              style={{ resize: 'none' }}
            />
            <button
              className={`chat-send-btn ${loading || !input.trim() ? 'disabled' : ''}`}
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              {loading ? '⏳' : '→'}
            </button>
          </div>
          <p className="chat-disclaimer">Powered by GPT-4o · Responses may not reflect very recent events</p>
        </div>
      </div>
    </main>
  );
}
