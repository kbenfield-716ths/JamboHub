import React from 'react';
import { canPostInChannel, getVisibleMessages } from '../lib/auth';
import { users } from '../data/mockData';
import { Send, Pin, Shield } from 'lucide-react';

export default function MessageView({ user, channel, messages }) {
  const [newMessage, setNewMessage] = React.useState('');
  const messagesEndRef = React.useRef(null);
  const visibleMessages = getVisibleMessages(user, messages, channel);
  const canPost = canPostInChannel(user, channel);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && canPost) {
      alert('Message sending is simulated in this MVP. In production, this would post to the channel.');
      setNewMessage('');
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Group messages by date
  const groupedMessages = visibleMessages.reduce((groups, message) => {
    const dateKey = formatDate(message.timestamp);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
    return groups;
  }, {});

  // Avatar colors - vibrant Scout palette
  const avatarColors = [
    'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
    'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)',
    'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
    'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)'
  ];

  const getAvatarColor = (userId) => {
    const index = userId ? userId.charCodeAt(0) % avatarColors.length : 0;
    return avatarColors[index];
  };

  const Message = ({ message }) => {
    const sender = users.find(u => u.id === message.userId);
    const isOwnMessage = sender?.id === user.id;

    return (
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px 16px',
        marginBottom: '4px'
      }}>
        {/* Avatar */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: getAvatarColor(message.userId),
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          fontSize: '16px',
          flexShrink: 0,
          boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)'
        }}>
          {sender?.name.charAt(0)}
        </div>

        {/* Message content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px',
            marginBottom: '6px',
            flexWrap: 'wrap'
          }}>
            <span style={{ 
              fontWeight: '700', 
              color: '#1F2937',
              fontSize: '15px'
            }}>
              {sender?.name}
            </span>
            <span style={{ 
              fontSize: '13px', 
              color: '#9CA3AF',
              fontWeight: '500'
            }}>
              {formatTime(message.timestamp)}
            </span>
            {message.pinned && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                borderRadius: '6px'
              }}>
                <Pin size={12} color="#D97706" />
                <span style={{ fontSize: '11px', color: '#B45309', fontWeight: '700' }}>Pinned</span>
              </div>
            )}
          </div>
          
          <div style={{
            background: message.pinned ? '#FFFBEB' : '#F3F4F6',
            padding: '12px 16px',
            borderRadius: '4px 20px 20px 20px',
            display: 'inline-block',
            maxWidth: '100%'
          }}>
            <p style={{ 
              margin: 0, 
              color: '#374151',
              fontSize: '16px',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {message.content}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (!channel) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
        background: 'white'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <MessageSquare size={36} color="#7C3AED" />
        </div>
        <p style={{ 
          margin: '0 0 8px 0', 
          fontWeight: '700',
          fontSize: '18px',
          color: '#1F2937'
        }}>
          Select a channel
        </p>
        <p style={{ 
          margin: 0, 
          fontSize: '15px', 
          color: '#9CA3AF',
          maxWidth: '260px',
          lineHeight: '1.5'
        }}>
          Tap the menu icon to browse available channels
        </p>
      </div>
    );
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'white'
    }}>
      {/* YPT Compliance Banner */}
      <div style={{
        padding: '12px 16px',
        background: 'linear-gradient(90deg, #EDE9FE 0%, #E0E7FF 100%)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <Shield size={18} color="#7C3AED" />
        <span style={{
          fontSize: '14px',
          color: '#5B21B6',
          fontWeight: '600'
        }}>
          YPT Compliant • All messages visible to leadership
        </span>
      </div>

      {/* Channel Info */}
      <div style={{
        padding: '16px',
        borderBottom: '2px solid #F3F4F6',
        background: '#FAFAFA'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>{channel.icon}</span>
          <div>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: 0,
              lineHeight: '1.5'
            }}>
              {channel.description}
            </p>
          </div>
        </div>
        {!canPost && (
          <div style={{
            marginTop: '12px',
            padding: '10px 14px',
            background: '#FEF2F2',
            borderRadius: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '14px', color: '#991B1B', fontWeight: '600' }}>
              📖 Read-only channel
            </span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px 0'
      }}>
        {Object.keys(groupedMessages).length === 0 ? (
          <div style={{
            padding: '60px 24px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#F3F4F6',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <span style={{ fontSize: '28px' }}>💬</span>
            </div>
            <p style={{ fontSize: '16px', margin: '0 0 6px 0', fontWeight: '600', color: '#374151' }}>
              No messages yet
            </p>
            <p style={{ fontSize: '14px', margin: 0, color: '#9CA3AF' }}>
              Be the first to say something!
            </p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              {/* Date divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 16px 12px'
              }}>
                <div style={{
                  padding: '6px 14px',
                  background: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
                  borderRadius: '20px'
                }}>
                  <span style={{
                    fontSize: '12px',
                    color: '#6B7280',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {date}
                  </span>
                </div>
              </div>
              
              {msgs.map((message) => (
                <Message key={message.id} message={message} />
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      {canPost && (
        <form 
          onSubmit={handleSendMessage}
          style={{
            padding: '12px 16px 16px',
            borderTop: '2px solid #F3F4F6',
            background: 'white'
          }}
        >
          <div style={{ 
            display: 'flex', 
            gap: '12px',
            background: '#F3F4F6',
            borderRadius: '28px',
            padding: '6px 6px 6px 20px',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${channel.name}...`}
              style={{
                flex: 1,
                padding: '12px 0',
                border: 'none',
                background: 'transparent',
                fontSize: '16px',
                outline: 'none',
                color: '#1F2937'
              }}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              style={{
                width: '48px',
                height: '48px',
                background: newMessage.trim() 
                  ? 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' 
                  : '#D1D5DB',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: newMessage.trim() ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function MessageSquare({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
    </svg>
  );
}
