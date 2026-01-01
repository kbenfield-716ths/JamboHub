import React from 'react';
import { MessageSquare, ChevronRight, Users, Lock } from 'lucide-react';

export default function ChannelList({ channels, onSelectChannel, currentUser }) {
  // Group channels by type
  const groupedChannels = {
    public: channels.filter(c => c.type === 'public'),
    unit: channels.filter(c => c.type === 'unit'),
    leadership: channels.filter(c => c.type === 'leadership'),
    parent: channels.filter(c => c.type === 'parent')
  };

  const groupLabels = {
    public: 'Announcements',
    unit: 'My Unit',
    leadership: 'Leadership',
    parent: 'Family'
  };

  const groupIcons = {
    public: '📢',
    unit: '🏕️',
    leadership: '👥',
    parent: '👨‍👩‍👧‍👦'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <MessageSquare size={24} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0 }}>Messages</h1>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{channels.length} channels</p>
        </div>
      </div>

      {/* Channel Groups */}
      {Object.entries(groupedChannels).map(([type, typeChannels]) => {
        if (typeChannels.length === 0) return null;
        
        return (
          <div key={type} style={{ marginBottom: '24px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '12px',
              paddingLeft: '4px'
            }}>
              <span style={{ fontSize: '16px' }}>{groupIcons[type]}</span>
              <span style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#6b7280',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {groupLabels[type]}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {typeChannels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '16px',
                    background: 'white',
                    border: 'none',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    transition: 'transform 0.1s, box-shadow 0.1s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                  }}
                >
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0
                  }}>
                    {channel.icon}
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: '600',
                      fontSize: '15px',
                      color: '#1a1a1a',
                      marginBottom: '2px'
                    }}>
                      {channel.name}
                    </div>
                    {channel.description && (
                      <div style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {channel.description}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!channel.canPost && (
                      <Lock size={14} color="#9ca3af" />
                    )}
                    <ChevronRight size={20} color="#9ca3af" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {channels.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px 20px',
          color: '#9ca3af'
        }}>
          <MessageSquare size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <p style={{ fontSize: '16px', fontWeight: '500' }}>No channels available</p>
        </div>
      )}
    </div>
  );
}
