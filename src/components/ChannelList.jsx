import React from 'react';
import { getUserChannels, getYPTWarnings } from '../lib/auth';
import { Hash, Users, Crown, Heart } from 'lucide-react';

export default function ChannelList({ user, channels, activeChannel, onChannelSelect }) {
  const userChannels = getUserChannels(user, channels);

  const groupedChannels = {
    public: userChannels.filter(c => c.type === 'public'),
    unit: userChannels.filter(c => c.type === 'unit'),
    leadership: userChannels.filter(c => c.type === 'leadership'),
    parent: userChannels.filter(c => c.type === 'parent')
  };

  const getGroupIcon = (type) => {
    switch(type) {
      case 'public': return <Hash size={12} />;
      case 'unit': return <Users size={12} />;
      case 'leadership': return <Crown size={12} />;
      case 'parent': return <Heart size={12} />;
      default: return <Hash size={12} />;
    }
  };

  const ChannelItem = ({ channel }) => {
    const warnings = getYPTWarnings(channel);
    const isActive = activeChannel?.id === channel.id;

    return (
      <button
        onClick={() => onChannelSelect(channel)}
        style={{
          width: '100%',
          padding: '10px 16px',
          background: isActive ? '#F5F5F5' : 'transparent',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderRadius: '8px',
          margin: '2px 8px',
          maxWidth: 'calc(100% - 16px)',
          transition: 'background 0.15s ease'
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.background = '#FAFAFA';
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.background = 'transparent';
        }}
      >
        <span style={{ 
          fontSize: '18px',
          width: '24px',
          textAlign: 'center'
        }}>
          {channel.icon}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            fontWeight: isActive ? '600' : '500',
            color: isActive ? '#1a1a1a' : '#555',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {channel.name}
          </div>
          {warnings.length > 0 && (
            <div style={{ 
              fontSize: '11px', 
              color: '#DC2626', 
              marginTop: '2px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span style={{ fontSize: '10px' }}>⚠</span>
              {warnings[0]}
            </div>
          )}
        </div>
        {isActive && (
          <div style={{
            width: '6px',
            height: '6px',
            background: '#1a1a1a',
            borderRadius: '50%'
          }} />
        )}
      </button>
    );
  };

  const ChannelGroup = ({ title, type, channels }) => {
    if (channels.length === 0) return null;

    return (
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ color: '#aaa' }}>{getGroupIcon(type)}</span>
          <span style={{
            fontSize: '11px',
            fontWeight: '600',
            color: '#999',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {title}
          </span>
        </div>
        {channels.map(channel => (
          <ChannelItem key={channel.id} channel={channel} />
        ))}
      </div>
    );
  };

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: 'white'
    }}>
      {/* User info header */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid rgba(0,0,0,0.04)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '16px'
          }}>
            {user.name.charAt(0)}
          </div>
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1a1a1a'
            }}>
              {user.name}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#888',
              marginTop: '2px',
              textTransform: 'capitalize'
            }}>
              {user.role}
            </div>
          </div>
        </div>
      </div>

      {/* Channels */}
      <div style={{ padding: '12px 0' }}>
        <ChannelGroup title="Announcements" type="public" channels={groupedChannels.public} />
        <ChannelGroup title="Your Unit" type="unit" channels={groupedChannels.unit} />
        <ChannelGroup title="Leadership" type="leadership" channels={groupedChannels.leadership} />
        <ChannelGroup title="Family" type="parent" channels={groupedChannels.parent} />
      </div>

      {/* Footer */}
      <div style={{
        padding: '20px 24px',
        borderTop: '1px solid rgba(0,0,0,0.04)',
        marginTop: 'auto'
      }}>
        <div style={{
          padding: '12px',
          background: '#F9FAFB',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '11px',
            color: '#888',
            fontWeight: '500'
          }}>
            VAHC Contingent 2025
          </div>
        </div>
      </div>
    </div>
  );
}
