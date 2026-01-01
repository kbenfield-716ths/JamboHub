import { Hash, Users, Crown, Heart, Shield } from 'lucide-react';

export default function ChannelList({ channels, selectedChannel, onSelectChannel, currentUser }) {
  // Group channels by type
  const groupedChannels = {
    public: channels.filter(c => c.type === 'public'),
    unit: channels.filter(c => c.type === 'unit'),
    leadership: channels.filter(c => c.type === 'leadership'),
    parent: channels.filter(c => c.type === 'parent')
  };

  const getGroupIcon = (type) => {
    switch(type) {
      case 'public': return <Hash size={14} />;
      case 'unit': return <Users size={14} />;
      case 'leadership': return <Crown size={14} />;
      case 'parent': return <Heart size={14} />;
      default: return <Hash size={14} />;
    }
  };

  const getGroupColor = (type) => {
    switch(type) {
      case 'public': return '#7C3AED';
      case 'unit': return '#06B6D4';
      case 'leadership': return '#F59E0B';
      case 'parent': return '#EC4899';
      default: return '#7C3AED';
    }
  };

  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin': return { label: 'Admin', color: '#DC2626', bg: '#FEF2F2' };
      case 'adult': return { label: 'Leader', color: '#7C3AED', bg: '#EDE9FE' };
      case 'youth': return { label: 'Scout', color: '#059669', bg: '#ECFDF5' };
      case 'parent': return { label: 'Parent', color: '#D97706', bg: '#FEF3C7' };
      default: return { label: 'Member', color: '#6B7280', bg: '#F3F4F6' };
    }
  };

  const ChannelItem = ({ channel }) => {
    const isActive = selectedChannel?.id === channel.id;

    return (
      <button
        onClick={() => onSelectChannel(channel)}
        style={{
          width: 'calc(100% - 24px)',
          padding: '14px 16px',
          background: isActive 
            ? 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)' 
            : 'transparent',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderRadius: '14px',
          margin: '4px 12px',
          transition: 'all 0.15s ease'
        }}
      >
        <span style={{ 
          fontSize: '22px',
          width: '32px',
          textAlign: 'center'
        }}>
          {channel.icon}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            fontWeight: isActive ? '700' : '600',
            color: isActive ? '#5B21B6' : '#374151',
            fontSize: '16px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {channel.name}
          </div>
          {channel.description && (
            <div style={{ 
              fontSize: '12px', 
              color: '#6B7280', 
              marginTop: '2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {channel.description}
            </div>
          )}
        </div>
        {isActive && (
          <div style={{
            width: '8px',
            height: '8px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(124, 58, 237, 0.4)'
          }} />
        )}
      </button>
    );
  };

  const ChannelGroup = ({ title, type, channels }) => {
    if (channels.length === 0) return null;

    const color = getGroupColor(type);

    return (
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ color }}>{getGroupIcon(type)}</span>
          <span style={{
            fontSize: '12px',
            fontWeight: '800',
            color: color,
            textTransform: 'uppercase',
            letterSpacing: '1px'
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

  const badge = getRoleBadge(currentUser?.role);

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* User Profile Card */}
      <div style={{
        padding: '24px 20px',
        background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
        margin: '16px',
        borderRadius: '20px',
        boxShadow: '0 8px 24px rgba(124, 58, 237, 0.25)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.25)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '22px'
          }}>
            {currentUser?.role === 'admin' ? <Shield size={24} /> : currentUser?.name?.charAt(0) || '?'}
          </div>
          <div>
            <div style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {currentUser?.name || 'User'}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '6px'
            }}>
              <span style={{
                padding: '3px 10px',
                background: 'rgba(255,255,255,0.25)',
                borderRadius: '6px',
                fontSize: '12px',
                color: 'white',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                {badge.label}
              </span>
              {currentUser?.unit && (
                <span style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: '500'
                }}>
                  {currentUser.unit}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Channels */}
      <div style={{ padding: '8px 0', flex: 1 }}>
        <ChannelGroup title="Announcements" type="public" channels={groupedChannels.public} />
        <ChannelGroup title="Units" type="unit" channels={groupedChannels.unit} />
        <ChannelGroup title="Leadership" type="leadership" channels={groupedChannels.leadership} />
        <ChannelGroup title="Family" type="parent" channels={groupedChannels.parent} />
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '2px solid #F3F4F6'
      }}>
        <div style={{
          padding: '14px',
          background: 'linear-gradient(135deg, #F8F7FC 0%, #EDE9FE 100%)',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '13px',
            color: '#7C3AED',
            fontWeight: '700'
          }}>
            🏕️ VAHC Contingent 2026
          </div>
        </div>
      </div>
    </div>
  );
}
