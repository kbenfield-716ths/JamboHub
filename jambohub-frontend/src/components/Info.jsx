import React, { useState, useEffect } from 'react';
import { MessageSquare, ChevronRight, Tent, MapPin, Clock, Users, Plus, Edit2, Trash2, X, ExternalLink, Phone, DollarSign, FileText } from 'lucide-react';
import * as api from '../lib/api';

export default function Info({ onNavigate, channels, currentUser }) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [stats, setStats] = useState({ youth: 0, youthCapacity: 36, youthRemaining: 36 });
  const [infoCards, setInfoCards] = useState([]);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardForm, setCardForm] = useState({ 
    title: '', content: '', icon: '📌', color: '#7C3AED', 
    linkUrl: '', linkText: '', category: 'general' 
  });

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
        linkText: card.linkText || '',
        category: card.category || 'general'
      });
    } else {
      setEditingCard(null);
      setCardForm({ title: '', content: '', icon: '📌', color: '#7C3AED', linkUrl: '', linkText: '', category: 'general' });
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

  const iconOptions = ['📌', '📢', '⭐', '🎯', '📅', '🏆', '🎪', '🔥', '💡', '📋', '🎒', '⛺', '🥾', '🧭', '🌲', '🦅', '💰', '📞', '📧', '🚗', '🍽️', '🏥', '📝', '❓'];
  const colorOptions = ['#7C3AED', '#DC2626', '#059669', '#D97706', '#2563EB', '#DB2777', '#0891B2', '#4F46E5'];
  const categoryOptions = [
    { value: 'general', label: 'General Info' },
    { value: 'budget', label: 'Budget & Costs' },
    { value: 'contacts', label: 'Important Contacts' },
    { value: 'fundraising', label: 'Fundraising' },
    { value: 'packing', label: 'Packing & Prep' },
    { value: 'schedule', label: 'Schedule & Dates' }
  ];

  return (
    <div style={{ padding: '16px 16px 100px 16px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Compact Header */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#1a1a1a', margin: '0 0 4px 0' }}>
          JamboHub
        </h1>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
          VAHC Contingent • 2026 National Jamboree
        </p>
      </div>

      {/* Stats 2x2 Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
        gap: '10px', 
        marginBottom: '16px'
      }}>
        {/* Countdown */}
        <div style={{ 
          background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)', 
          borderRadius: '12px', 
          padding: '14px', 
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: '800', lineHeight: 1 }}>{countdown.days}</div>
          <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>Days to Jambo</div>
          <div style={{ fontSize: '10px', opacity: 0.7, fontFamily: 'monospace' }}>
            {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
          </div>
        </div>

        {/* Youth Count */}
        <div style={{ 
          background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)', 
          borderRadius: '12px', 
          padding: '14px', 
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '28px', fontWeight: '800', lineHeight: 1 }}>{stats.youth}</div>
          <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>Youth Registered</div>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>{stats.youthRemaining} spots left</div>
        </div>

        {/* Unit Number */}
        <div style={{ 
          background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)', 
          borderRadius: '12px', 
          padding: '14px', 
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '800', lineHeight: 1.2 }}>TBD</div>
          <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '4px' }}>Unit Number</div>
        </div>

        {/* Campsite */}
        <div style={{ 
          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', 
          borderRadius: '12px', 
          padding: '14px', 
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '800', lineHeight: 1.2 }}>TBD</div>
          <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '4px' }}>Campsite</div>
        </div>
      </div>

      {/* Messages Button - Compact */}
      <div 
        onClick={() => onNavigate && onNavigate('messages')} 
        style={{ 
          background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)', 
          borderRadius: '12px', 
          padding: '14px 18px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          cursor: 'pointer', 
          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)', 
          marginBottom: '16px' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MessageSquare size={22} color="white" />
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: 'white' }}>Messages</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{channels?.length || 0} channels</div>
          </div>
        </div>
        <ChevronRight size={20} color="white" />
      </div>

      {/* Add Card Button (Admin Only) */}
      {isAdmin && (
        <button onClick={() => handleOpenCardModal()} style={{ 
          display: 'flex', alignItems: 'center', gap: '8px', 
          padding: '10px 16px', 
          background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', 
          color: 'white', border: 'none', borderRadius: '10px', 
          fontWeight: '600', cursor: 'pointer', marginBottom: '12px',
          fontSize: '14px'
        }}>
          <Plus size={16} />Add Info Card
        </button>
      )}

      {/* Info Cards - Compact */}
      {infoCards.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {infoCards.map(card => (
            <div key={card.id} style={{ 
              background: 'white', 
              borderRadius: '12px', 
              padding: '14px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)', 
              borderLeft: `4px solid ${card.color}` 
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ fontSize: '24px', flexShrink: 0 }}>{card.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>{card.title}</h3>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleOpenCardModal(card)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: '#EDE9FE', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}><Edit2 size={12} /></button>
                        <button onClick={() => handleDeleteCard(card.id)} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: '#FEE2E2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}><Trash2 size={12} /></button>
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: '13px', color: '#4b5563', margin: 0, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{card.content}</p>
                  {card.linkUrl && (
                    <a href={card.linkUrl} target="_blank" rel="noopener noreferrer" style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '4px', 
                      marginTop: '10px', padding: '6px 12px', 
                      background: card.color, color: 'white', 
                      borderRadius: '6px', textDecoration: 'none', 
                      fontSize: '12px', fontWeight: '600' 
                    }}>
                      {card.linkText || 'Learn More'}<ExternalLink size={12} />
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
        <div style={{ background: 'white', borderRadius: '12px', padding: '32px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', textAlign: 'center', color: '#9ca3af', border: '2px dashed #e5e7eb' }}>
          <p style={{ fontSize: '14px', margin: 0 }}>
            {isAdmin ? 'Click "Add Info Card" to add content' : 'More content coming soon...'}
          </p>
        </div>
      )}

      {/* Card Modal */}
      {showCardModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 20, width: '100%', maxWidth: 500, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{editingCard ? 'Edit Card' : 'Add Card'}</h2>
              <button onClick={() => setShowCardModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Category</label>
              <select 
                value={cardForm.category} 
                onChange={e => setCardForm(p => ({ ...p, category: e.target.value }))} 
                style={{ width: '100%', padding: 10, fontSize: 14, border: '2px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box' }}
              >
                {categoryOptions.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Title *</label>
              <input type="text" value={cardForm.title} onChange={e => setCardForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g., Jamboree Budget Breakdown" style={{ width: '100%', padding: 10, fontSize: 14, border: '2px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Content *</label>
              <textarea 
                value={cardForm.content} 
                onChange={e => setCardForm(p => ({ ...p, content: e.target.value }))} 
                rows={6} 
                placeholder="Enter your content here. You can use multiple lines for lists or formatted text."
                style={{ width: '100%', padding: 10, fontSize: 14, border: '2px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box', resize: 'vertical' }} 
              />
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Tip: Use line breaks for lists. Content will preserve formatting.</p>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Icon</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {iconOptions.map(icon => (
                  <button key={icon} onClick={() => setCardForm(p => ({ ...p, icon }))} style={{ width: 36, height: 36, fontSize: 18, border: cardForm.icon === icon ? '2px solid #7C3AED' : '2px solid #e5e7eb', borderRadius: 8, background: cardForm.icon === icon ? '#EDE9FE' : 'white', cursor: 'pointer' }}>{icon}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Color</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {colorOptions.map(color => (
                  <button key={color} onClick={() => setCardForm(p => ({ ...p, color }))} style={{ width: 32, height: 32, background: color, border: cardForm.color === color ? '3px solid #1a1a1a' : '2px solid transparent', borderRadius: 8, cursor: 'pointer' }} />
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Link URL (optional)</label>
              <input type="url" value={cardForm.linkUrl} onChange={e => setCardForm(p => ({ ...p, linkUrl: e.target.value }))} placeholder="https://..." style={{ width: '100%', padding: 10, fontSize: 14, border: '2px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Link Text (optional)</label>
              <input type="text" value={cardForm.linkText} onChange={e => setCardForm(p => ({ ...p, linkText: e.target.value }))} placeholder="View Details" style={{ width: '100%', padding: 10, fontSize: 14, border: '2px solid #e5e7eb', borderRadius: 8, boxSizing: 'border-box' }} />
            </div>

            <button onClick={handleSaveCard} disabled={!cardForm.title || !cardForm.content} style={{ width: '100%', padding: 12, fontSize: 14, fontWeight: 600, color: 'white', background: cardForm.title && cardForm.content ? 'linear-gradient(135deg, #7C3AED, #A855F7)' : '#9CA3AF', border: 'none', borderRadius: 10, cursor: cardForm.title && cardForm.content ? 'pointer' : 'not-allowed' }}>
              {editingCard ? 'Save Changes' : 'Add Card'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
