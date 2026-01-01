import React, { useState, useEffect } from 'react';
import { MessageSquare, ChevronRight, Tent, MapPin, Clock } from 'lucide-react';

export default function Info({ onNavigate, channels }) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Jamboree start date
  const jamboDate = new Date('2026-07-22T00:00:00');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = jamboDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      icon: <Tent size={28} />,
      label: 'Unit Number',
      value: 'TBD',
      color: '#7C3AED',
      bg: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)'
    },
    {
      icon: <MapPin size={28} />,
      label: 'Campsite',
      value: 'TBD',
      color: '#059669',
      bg: 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
    },
    {
      icon: <Clock size={28} />,
      label: 'Days to Jamboree',
      value: countdown.days,
      subtext: `${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`,
      color: '#DC2626',
      bg: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)'
    }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '800', 
          color: '#1a1a1a',
          margin: '0 0 8px 0'
        }}>
          Welcome to JamboHub
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#6b7280',
          margin: 0
        }}>
          VAHC Contingent • 2026 National Jamboree
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {statCards.map((card, idx) => (
          <div
            key={idx}
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: card.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              marginBottom: '12px'
            }}>
              {card.icon}
            </div>
            <div style={{
              fontSize: '32px',
              fontWeight: '800',
              color: card.color,
              lineHeight: 1
            }}>
              {card.value}
            </div>
            <div style={{
              fontSize: '14px',
              color: '#6b7280',
              marginTop: '4px',
              fontWeight: '500'
            }}>
              {card.label}
            </div>
            {card.subtext && (
              <div style={{
                fontSize: '12px',
                color: '#9ca3af',
                marginTop: '4px',
                fontFamily: 'monospace'
              }}>
                {card.subtext}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Messages Bar */}
      <div
        onClick={() => onNavigate && onNavigate('messages')}
        style={{
          background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
          transition: 'transform 0.15s, box-shadow 0.15s',
          marginBottom: '24px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(124, 58, 237, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.3)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MessageSquare size={24} color="white" />
          </div>
          <div>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'white'
            }}>
              Messages
            </div>
            <div style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.8)'
            }}>
              {channels?.length || 0} channels available
            </div>
          </div>
        </div>
        <ChevronRight size={24} color="white" />
      </div>

      {/* Placeholder Section - Future Content */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        textAlign: 'center',
        color: '#9ca3af',
        border: '2px dashed #e5e7eb'
      }}>
        <p style={{ fontSize: '16px', margin: 0 }}>
          More content coming soon...
        </p>
      </div>
    </div>
  );
}
