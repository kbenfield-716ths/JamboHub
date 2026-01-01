import React, { useState, useEffect } from 'react';
import { MessageSquare, ChevronRight, Tent, MapPin, Clock, Users, Plus, Edit2, Trash2, X, ExternalLink } from 'lucide-react';
import * as api from '../lib/api';

export default function Info({ onNavigate, channels, currentUser }) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [stats, setStats] = useState({ youth: 0, youthCapacity: 36, youthRemaining: 36 });
  const [infoCards, setInfoCards] = useState([]);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardForm, setCardForm] = useState({ title: '', content: '', icon: '📌', color: '#7C3AED', linkUrl: '', linkText: '' });

  const jamboDate = new Date('2026-07-22T00:00:00');
  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = jamboDate - now;
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchStats();
    fetchInfoCards();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchInfoCards = async () => {
    try {
      const data = await api.getInfoCards();
      setInfoCards(data);
    } catch (err) {
      console.error('Failed to fetch info cards:', err);
    }
  };

  const handleOpenCardModal = (card = null) => {
    if (card) {
      setEditingCard(card);
      setCardForm({
        title: card.title,
        content: card.content,
        icon: card.icon || '📌',
        color: card.color || '#7C3AED',
        linkUrl: card.linkUrl || '',
        linkText: card.linkText || ''
      });
    } else {
      setEditingCard(null);
      setCardForm({ title: '', content: '', icon: '📌', color: '#7C3AED', linkUrl: '', linkText: '' });
    }
    setShowCardModal(true);
  };

  const handleSaveCard = async () => {
    if (!cardForm.title || !cardForm.content) return;
    try {
      if (editingCard) {
        await api.updateInfoCard(editingCard.id, cardForm);
      } else {
        await api.createInfoCard(cardForm);
      }
      await fetchInfoCards();
      setShowCardModal(false);
      setEditingCard(null);
    } catch (err) {
      console.error('Failed to save card:', err);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!confirm('Delete this card?')) return;
    try {
      await api.deleteInfoCard(cardId);
      await fetchInfoCards();
    } catch (err) {
      console.error('Failed to delete card:', err);
    }
  };

  const iconOptions = ['📌', '📢', '⭐', '🎯', '📅', '🏆', '🎪', '🔥', '💡', '📋', '🎒', '⛺', '🥾', '🧭', '🌲', '🦅'];
  const colorOptions = ['#7C3AED', '#DC2626', '#059669', '#D97706', '#2563EB', '#DB2777', '#0891B2', '#4F46E5'];

  const statCards = [
    { icon: <Tent size={28} />, label: 'Unit Number', value: 'TBD', color: '#7C3AED', bg: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' },
    { icon: <MapPin size={28} />, label: 'Campsite', value: 'TBD', color: '#059669', bg: 'linear-gradient(135deg, #059669 0%, #10B981 100%)' },
    { icon: <Clock size={28} />, label: 'Days to Jamboree', value: countdown.days, subtext: `${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`, color: '#DC2626', bg: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)' },
    { icon: <Users size={28} />, label: 'Registered Youth', value: stats.youth, subtext: `Space remaining: ${stats.youthRemaining}`, color: '#2563EB', bg: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)' }
  ];

  return (
    <div style={{ padding: '20px 20px 100px 20px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 8px 0' }}>
          Welcome to JamboHub
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
          VAHC Contingent • 2026 National Jamboree
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {statCards.map((card, idx) => (
          <div key={idx} style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '12px' }}>
              {card.icon}
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: card.color, lineHeight: 1 }}>{card.value}</div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', fontWeight: '500' }}>{card.label}</div>
            {card.subtext && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', fontFamily: 'monospace' }}>{card.subtext}</div>}
          </div>
        ))}
      </div>

      {/* Messages Bar */}
      <div onClick={() => onNavigate && onNavigate('messages')} style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)', transition: 'transform 0.15s', marginBottom: '24px' }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={24} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'white' }}>Messages</div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{channels?.length || 0} channels available</div>
          </div>
        </div>
        <ChevronRight size={24} color="white" />
      </div>

      {/* Add Card Button (Admin Only) */}
      {isAdmin && (
        <button onClick={() => handleOpenCardModal()} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', marginBottom: '16px' }}>
          <Plus size={18} />Add Info Card
        </button>
      )}

      {/* Dynamic Info Cards */}
      {infoCards.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {infoCards.map(card => (
            <div key={card.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: `4px solid ${card.color}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ fontSize: '32px', flexShrink: 0 }}>{card.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>{card.title}</h3>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleOpenCardModal(card)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#EDE9FE', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDeleteCard(card.id)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#FEE2E2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}><Trash2 size={14} /></button>
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '15px', color: '#4b5563', margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{card.content}</p>
                  {card.linkUrl && (
                    <a href={card.linkUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '12px', padding: '8px 16px', background: card.color, color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                      {card.linkText || 'Learn More'}<ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {infoCards.length === 0 && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '40px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center', color: '#9ca3af', border: '2px dashed #e5e7eb' }}>
          <p style={{ fontSize: '16px', margin: 0 }}>
            {isAdmin ? 'Click "Add Info Card" to add content here' : 'More content coming soon...'}
          </p>
        </div>
      )}

      {/* Card Modal */}
      {showCardModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 24, width: '100%', maxWidth: 500, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{editingCard ? 'Edit Card' : 'Add Card'}</h2>
              <button onClick={() => setShowCardModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Title *</label>
              <input type="text" value={cardForm.title} onChange={e => setCardForm(p => ({ ...p, title: e.target.value }))} style={{ width: '100%', padding: 12, fontSize: 14, border: '2px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Content *</label>
              <textarea value={cardForm.content} onChange={e => setCardForm(p => ({ ...p, content: e.target.value }))} rows={4} style={{ width: '100%', padding: 12, fontSize: 14, border: '2px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box', resize: 'vertical' }} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Icon</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {iconOptions.map(icon => (
                  <button key={icon} onClick={() => setCardForm(p => ({ ...p, icon }))} style={{ width: 40, height: 40, fontSize: 20, border: cardForm.icon === icon ? '2px solid #7C3AED' : '2px solid #e5e7eb', borderRadius: 8, background: cardForm.icon === icon ? '#EDE9FE' : 'white', cursor: 'pointer' }}>{icon}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Color</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {colorOptions.map(color => (
                  <button key={color} onClick={() => setCardForm(p => ({ ...p, color }))} style={{ width: 36, height: 36, background: color, border: cardForm.color === color ? '3px solid #1a1a1a' : '2px solid transparent', borderRadius: 8, cursor: 'pointer' }} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Link URL (optional)</label>
              <input type="url" value={cardForm.linkUrl} onChange={e => setCardForm(p => ({ ...p, linkUrl: e.target.value }))} placeholder="https://..." style={{ width: '100%', padding: 12, fontSize: 14, border: '2px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Link Text (optional)</label>
              <input type="text" value={cardForm.linkText} onChange={e => setCardForm(p => ({ ...p, linkText: e.target.value }))} placeholder="Learn More" style={{ width: '100%', padding: 12, fontSize: 14, border: '2px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box' }} />
            </div>

            <button onClick={handleSaveCard} disabled={!cardForm.title || !cardForm.content} style={{ width: '100%', padding: 14, fontSize: 15, fontWeight: 600, color: 'white', background: cardForm.title && cardForm.content ? 'linear-gradient(135deg, #7C3AED, #A855F7)' : '#9CA3AF', border: 'none', borderRadius: 10, cursor: cardForm.title && cardForm.content ? 'pointer' : 'not-allowed' }}>
              {editingCard ? 'Save Changes' : 'Add Card'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
