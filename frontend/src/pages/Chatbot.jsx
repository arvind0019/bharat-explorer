import React, { useState, useRef, useEffect } from 'react';
import api from '../utils/api';

const SUGGESTIONS = [
  'Best places in Rajasthan',
  'October festivals in India',
  '3 day Jaipur itinerary',
  'Hill stations near Mumbai',
  'Beach destinations in Kerala',
  'Wildlife sanctuaries in India',
  'Budget travel tips India',
  'Best time to visit India',
];

function Message({ msg }) {
  const isBot = msg.role === 'bot';
  return (
    <div className={`flex gap-3 items-end ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 ${
        isBot ? 'bg-saffron text-white' : 'bg-india-green text-white'
      }`}>
        {isBot ? '🕌' : '👤'}
      </div>
      <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
        isBot
          ? 'bg-white border border-amber-100 text-stone-700 rounded-bl-sm'
          : 'bg-saffron text-white rounded-br-sm'
      }`}>
        {msg.text}
      </div>
    </div>
  );
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'bot', text: '🙏 Namaste! I\'m Aryan, your AI travel guide for Incredible India.\n\nAsk me anything:\n• Best places in any state\n• Festival recommendations by month\n• Day-wise itineraries for cities\n• Budget tips, best time to visit\n\nHow can I help you explore India today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const q = (text || input).trim();
    if (!q) return;

    setInput('');
    const userMsg = { id: Date.now(), role: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await api.post('/chatbot', { message: q });
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'bot',
        text: 'Sorry, I encountered an error. Please try again or check if the backend server is running.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-stone-950 to-stone-900 py-16 px-4 text-center">
        <div className="text-saffron text-xs font-semibold tracking-widest uppercase mb-2">AI Powered</div>
        <h1 className="font-display text-5xl font-bold text-white mb-3">Travel Guide Chatbot</h1>
        <p className="text-stone-400 text-lg max-w-xl mx-auto">
          Ask Aryan anything about Indian travel, culture, festivals, and destinations
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Chat window */}
        <div className="bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden">
          {/* Chat header */}
          <div className="bg-gradient-to-r from-stone-900 to-stone-800 px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-saffron flex items-center justify-center text-xl">🕌</div>
            <div>
              <h3 className="text-white font-semibold">Aryan – AI Travel Guide</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
                <span className="text-stone-400 text-xs">Online · Expert in Indian Travel</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[440px] overflow-y-auto px-5 py-5 space-y-4 bg-amber-50/40">
            {messages.map(m => <Message key={m.id} msg={m} />)}
            {loading && (
              <div className="flex gap-3 items-end">
                <div className="w-8 h-8 rounded-full bg-saffron text-white flex items-center justify-center text-base">🕌</div>
                <div className="bg-white border border-amber-100 rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center h-5">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-2 h-2 rounded-full bg-saffron inline-block animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="px-5 py-2 border-t border-amber-100 flex gap-2 overflow-x-auto">
            {SUGGESTIONS.slice(0, 5).map(s => (
              <button key={s} onClick={() => sendMessage(s)}
                className="flex-shrink-0 text-xs bg-saffron/10 text-saffron border border-saffron/20 px-3 py-1.5 rounded-full hover:bg-saffron hover:text-white transition-colors">
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-5 pb-5 pt-3 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
              placeholder="Ask about India travel…"
              disabled={loading}
              className="input flex-1 text-sm"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50"
            >
              Send ➤
            </button>
          </div>
        </div>

        {/* More suggestions */}
        <div className="mt-6">
          <p className="text-stone-500 text-sm text-center mb-3">Or try these popular questions:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => sendMessage(s)}
                className="text-sm bg-white text-stone-600 border border-amber-200 px-4 py-2 rounded-full hover:border-saffron hover:text-saffron transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
