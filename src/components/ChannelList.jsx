import React from 'react';
import { getUserChannels, getYPTWarnings } from '../lib/auth';

export default function ChannelList({ user, channels, activeChannel, onChannelSelect }) {
  const userChannels = getUserChannels(user, channels);

  const groupedChannels = {
    public: userChannels.filter(c => c.type === 'public'),
    unit: userChannels.filter(c => c.type === 'unit'),
    leadership: userChannels.filter(c => c.type === 'leadership'),
    parent: userChannels.filter(c => c.type === 'parent')
  };

  const ChannelItem = ({ channel }) => {
    const warnings = getYPTWarnings(channel);
    const isActive = activeChannel?.id === channel.id;

    return (
      <button
        onClick={() => onChannelSelect(channel)}
        style={{
          width: '100%',
          padding: '12px 16px',
          background: isActive ? '#EEF2FF' : 'transparent',
          border: 'none',
          borderLeft: isActive ? '3px solid #CE1126' : '3px solid transparent',
          textAlign: 'left',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.background = '#F9FAFB';
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.background = 'transparent';
        }}
      >
        <span style={{ fontSize: '18px' }}>{channel.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontWeight: isActive ? '600' : '500',
            color: isActive ? '#111827' : '#374151',
            fontSize: '14px'
          }}>
            {channel.name}
          </div>
          {warnings.length > 0 && (
            <div style={{ fontSize: '11px', color: '#DC2626', marginTop: '2px' }}>
              ⚠️ {warnings[0]}
            </div>
          )}
        </div>
      </button>
    );
  };

  const ChannelGroup = ({ title, channels }) => {
    if (channels.length === 0) return null;

    return (
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          padding: '8px 16px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#6B7280',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {title}
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
      background: 'white',
      borderRight: '1px solid #E5E7EB'
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #E5E7EB',
        background: '#F9FAFB'
      }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#111827',
          margin: 0
        }}>
          Channels
        </h2>
        <p style={{
          fontSize: '12px',
          color: '#6B7280',
          margin: '4px 0 0 0'
        }}>
          {user.name} • {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </p>
      </div>

      <div style={{ padding: '12px 0' }}>
        <ChannelGroup title="Announcements" channels={groupedChannels.public} />
        <ChannelGroup title="Your Unit" channels={groupedChannels.unit} />
        <ChannelGroup title="Leadership" channels={groupedChannels.leadership} />
        <ChannelGroup title="Family" channels={groupedChannels.parent} />
      </div>
    </div>
  );
}
