import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import {
  Bot,
  Sparkles,
  X,
  Send,
  Flame,
  Target,
  Cpu,
  Smile,
  RefreshCw,
  MessageSquare
} from 'lucide-react';

const MOODS = [
  { id: 'Professional', label: 'Professional', icon: Target, color: '#0066FF', desc: 'Formal ATS & recruiter insights' },
  { id: 'Motivational', label: 'Motivational', icon: Flame, color: '#EC4899', desc: 'High energy confidence booster' },
  { id: 'Tech Analyst', label: 'Tech Analyst', icon: Cpu, color: '#8B5CF6', desc: 'Technical & LPA salary data' },
  { id: 'Friendly', label: 'Friendly Advisor', icon: Smile, color: '#10B981', desc: 'Easygoing career mentor' }
];

const AiAssistantWidget = () => {
  const { user, token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMood, setCurrentMood] = useState('Professional');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `Hello ${user ? user.name.split(' ')[0] : 'there'}! I am your AI Career Assistant for Pan India jobs. Select my Mood personality above and ask me anything about resumes, interview prep, or career advice!`,
      mood: 'Professional'
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeMoodObj = MOODS.find(m => m.id === currentMood) || MOODS[0];

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setLoading(true);

    try {
      if (token) {
        const res = await apiFetch('/ai/chat', {
          method: 'POST',
          token,
          body: JSON.stringify({ message: textToSend, mood: currentMood })
        });
        setMessages(prev => [...prev, { sender: 'ai', text: res.reply, mood: currentMood }]);
      } else {
        // Fallback response if not logged in
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              sender: 'ai',
              text: `[${currentMood} Mood] Sign in to unlock full personalized AI Career guidance for your profile! You can ask about resume tips, interview questions, or LPA negotiations.`,
              mood: currentMood
            }
          ]);
          setLoading(false);
        }, 600);
        return;
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: `[${currentMood}] Keep applying consistently! Highlight your top skills on your resume for recruiters.`, mood: currentMood }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 999 }}>
      {/* Expanded Floating Chat Box */}
      {isOpen ? (
        <div style={{
          width: '380px',
          height: '520px',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Top Header */}
          <div style={{
            backgroundColor: activeMoodObj.color,
            color: '#FFFFFF',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'background-color var(--transition-normal)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: '#fff' }}>
                  AI Career Coach
                </h3>
                <div style={{ fontSize: '0.75rem', opacity: 0.95, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Sparkles size={11} /> Mood: <strong>{currentMood}</strong>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                color: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                padding: '0.35rem',
                border: 'none',
                display: 'flex'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Mood Selector Pill Bar */}
          <div style={{
            display: 'flex',
            gap: '0.35rem',
            padding: '0.6rem 0.75rem',
            backgroundColor: 'var(--bg-main)',
            borderBottom: '1px solid var(--border-color)',
            overflowX: 'auto'
          }}>
            {MOODS.map(m => {
              const IconComp = m.icon;
              const isSelected = currentMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setCurrentMood(m.id)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: isSelected ? m.color : 'var(--bg-card)',
                    color: isSelected ? '#FFFFFF' : 'var(--text-muted)',
                    border: `1px solid ${isSelected ? m.color : 'var(--border-color)'}`,
                    transition: 'all var(--transition-fast)'
                  }}
                  title={m.desc}
                >
                  <IconComp size={13} /> {m.label}
                </button>
              );
            })}
          </div>

          {/* Messages Trajectory */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <div style={{
                  padding: '0.65rem 0.95rem',
                  borderRadius: '14px',
                  fontSize: '0.875rem',
                  lineHeight: 1.45,
                  backgroundColor: msg.sender === 'user' ? 'var(--primary)' : 'var(--bg-main)',
                  color: msg.sender === 'user' ? '#FFFFFF' : 'var(--text-main)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
                  borderTopLeftRadius: msg.sender === 'ai' ? '2px' : '14px',
                  borderTopRightRadius: msg.sender === 'user' ? '2px' : '14px'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ alignSelf: 'flex-start', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <RefreshCw size={12} className="spin" /> AI ({currentMood}) is generating advice...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Action Prompt Chips */}
          <div style={{
            padding: '0.4rem 0.75rem',
            display: 'flex',
            gap: '0.4rem',
            overflowX: 'auto',
            borderTop: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-main)'
          }}>
            <button
              type="button"
              onClick={() => handleSendMessage("How to optimize my resume for ATS?")}
              style={{ fontSize: '0.725rem', whiteSpace: 'nowrap', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}
            >
              📄 ATS Resume Tips
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage("Give me a motivation booster!")}
              style={{ fontSize: '0.725rem', whiteSpace: 'nowrap', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}
            >
              🔥 Motivation Booster
            </button>
            <button
              type="button"
              onClick={() => handleSendMessage("What is standard LPA salary for React in India?")}
              style={{ fontSize: '0.725rem', whiteSpace: 'nowrap', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}
            >
              💰 React Pay LPA
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            style={{
              display: 'flex',
              padding: '0.65rem 0.75rem',
              borderTop: '1px solid var(--border-color)',
              gap: '0.5rem',
              backgroundColor: 'var(--bg-card)'
            }}
          >
            <input
              type="text"
              placeholder={`Ask AI (${currentMood} Mode)...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{
                flex: 1,
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                outline: 'none',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-main)'
              }}
            />
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              className="btn btn-primary btn-sm"
              style={{ borderRadius: 'var(--radius-md)', padding: '0.5rem 0.85rem' }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      ) : (
        /* Floating Button Trigger */
        <button
          onClick={() => setIsOpen(true)}
          style={{
            backgroundColor: activeMoodObj.color,
            color: '#FFFFFF',
            borderRadius: 'var(--radius-full)',
            padding: '0.85rem 1.35rem',
            boxShadow: '0 8px 24px rgba(0, 102, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 800,
            fontSize: '0.95rem',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          className="card-hover"
        >
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={22} />
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981'
            }} />
          </div>
          <span>AI Assistant</span>
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            padding: '0.15rem 0.5rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.725rem'
          }}>
            {currentMood}
          </span>
        </button>
      )}
    </div>
  );
};

export default AiAssistantWidget;
