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

  const Message = ({ message, isFirst }) => {
    const sender = users.find(u => u.id === message.userId);
    const isOwnMessage = sender?.id === user.id;

    return (
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '6px 20px',
        animation: 'fadeIn 0.2s ease'
      }}>
        {/* Avatar */}
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: isOwnMessage 
            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600',
          fontSize: '13px',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {sender?.name.charAt(0)}
        </div>

        {/* Message content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '4px'
          }}>
            <span style={{ 
              fontWeight: '600', 
              color: '#1a1a1a',
              fontSize: '13px'
            }}>
              {sender?.name}
            </span>
            <span style={{ 
              fontSize: '11px', 
              color: '#999',
              fontWeight: '500'
            }}>
              {formatTime(message.timestamp)}
            </span>
            {message.pinned && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                padding: '2px 6px',
                background: '#FEF3C7',
                borderRadius: '4px'
              }}>
                <Pin size={10} color="#D97706" />
                <span style={{ fontSize: '10px', color: '#D97706', fontWeight: '600' }}>Pinned</span>
              </div>
            )}
          </div>
          
          <div style={{
            background: message.pinned ? '#FFFBEB' : '#F5F5F5',
            padding: '10px 14px',
            borderRadius: '4px 16px 16px 16px',
            display: 'inline-block',
            maxWidth: '85%'
          }}>
            <p style={{ 
              margin: 0, 
              color: '#333',
              fontSize: '14px',
              lineHeight: '1.5',
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
        color: '#999',
        fontSize: '15px',
        gap: '12px',
        padding: '40px'
      }}>
        <MessageSquareIcon />
        <p style={{ margin: 0, fontWeight: '500' }}>Select a channel to view messages</p>
        <p style={{ margin: 0, fontSize: '13px', color: '#bbb' }}>
          Tap the menu icon to browse channels
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
        padding: '10px 20px',
        background: 'linear-gradient(90deg, #EEF2FF 0%, #F0F9FF 100%)',
        borderBottom: '1px solid rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <Shield size={14} color="#6366F1" />
        <span style={{
          fontSize: '12px',
          color: '#4F46E5',
          fontWeight: '500'
        }}>
          YPT Compliant • All messages are visible to leadership
        </span>
      </div>

      {/* Channel description */}
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid rgba(0,0,0,0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>{channel.icon}</span>
          <div>
            <p style={{
              fontSize: '12px',
              color: '#888',
              margin: 0,
              lineHeight: '1.4'
            }}>
              {channel.description}
            </p>
          </div>
        </div>
        {!canPost && (
          <div style={{
            marginTop: '8px',
            padding: '8px 12px',
            background: '#FEF2F2',
            borderRadius: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ fontSize: '12px', color: '#991B1B', fontWeight: '500' }}>
              Read-only channel
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
            textAlign: 'center',
            color: '#999'
          }}>
            <p style={{ fontSize: '14px', margin: '0 0 4px 0' }}>No messages yet</p>
            <p style={{ fontSize: '13px', margin: 0, color: '#bbb' }}>
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
                padding: '16px 20px 8px'
              }}>
                <span style={{
                  fontSize: '11px',
                  color: '#999',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  background: 'white',
                  padding: '0 12px'
                }}>
                  {date}
                </span>
              </div>
              
              {msgs.map((message, idx) => (
                <Message key={message.id} message={message} isFirst={idx === 0} />
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
            padding: '12px 16px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            background: 'white'
          }}
        >
          <div style={{ 
            display: 'flex', 
            gap: '10px',
            background: '#F5F5F5',
            borderRadius: '24px',
            padding: '4px 4px 4px 16px',
            alignItems: 'center'
          }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${channel.name}...`}
              style={{
                flex: 1,
                padding: '10px 0',
                border: 'none',
                background: 'transparent',
                fontSize: '14px',
                outline: 'none',
                color: '#1a1a1a'
              }}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              style={{
                width: '40px',
                height: '40px',
                background: newMessage.trim() ? '#1a1a1a' : '#ddd',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function MessageSquareIcon() {
  return (
    <div style={{
      width: '64px',
      height: '64px',
      background: '#F5F5F5',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2">
        <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
      </svg>
    </div>
  );
}
