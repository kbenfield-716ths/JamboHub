import React from 'react';
import { canPostInChannel, getVisibleMessages } from '../lib/auth';
import { users } from '../data/mockData';
import { Send, Pin } from 'lucide-react';

export default function MessageView({ user, channel, messages }) {
  const [newMessage, setNewMessage] = React.useState('');
  const visibleMessages = getVisibleMessages(user, messages, channel);
  const canPost = canPostInChannel(user, channel);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && canPost) {
      // In MVP, just show alert - no actual sending
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
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const Message = ({ message }) => {
    const sender = users.find(u => u.id === message.userId);
    const isOwnMessage = sender?.id === user.id;

    return (
      <div style={{
        padding: '16px',
        borderBottom: '1px solid #F3F4F6',
        background: message.pinned ? '#FFFBEB' : 'transparent'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: isOwnMessage ? '#CE1126' : '#003F87',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '14px',
            flexShrink: 0
          }}>
            {sender?.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '4px'
            }}>
              <span style={{ 
                fontWeight: '600', 
                color: '#111827',
                fontSize: '14px'
              }}>
                {sender?.name}
              </span>
              <span style={{ 
                fontSize: '12px', 
                color: '#6B7280' 
              }}>
                {formatTime(message.timestamp)}
              </span>
              {message.pinned && (
                <Pin size={14} color="#F59E0B" fill="#F59E0B" />
              )}
            </div>
            <p style={{ 
              margin: 0, 
              color: '#374151',
              fontSize: '14px',
              lineHeight: '1.5',
              whiteSpace: 'pre-wrap'
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
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6B7280',
        fontSize: '16px'
      }}>
        Select a channel to view messages
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
      {/* Channel Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '2px solid #E5E7EB',
        background: '#F9FAFB'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '20px' }}>{channel.icon}</span>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#111827',
            margin: 0
          }}>
            {channel.name}
          </h2>
        </div>
        <p style={{
          fontSize: '13px',
          color: '#6B7280',
          margin: 0
        }}>
          {channel.description}
        </p>
        {!canPost && (
          <p style={{
            fontSize: '12px',
            color: '#DC2626',
            margin: '8px 0 0 0',
            background: '#FEE2E2',
            padding: '6px 10px',
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            Read-only: You can view but not post in this channel
          </p>
        )}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0'
      }}>
        {visibleMessages.length === 0 ? (
          <div style={{
            padding: '40px 24px',
            textAlign: 'center',
            color: '#6B7280'
          }}>
            No messages yet in this channel
          </div>
        ) : (
          visibleMessages.map(message => (
            <Message key={message.id} message={message} />
          ))
        )}
      </div>

      {/* Message Input */}
      {canPost && (
        <form 
          onSubmit={handleSendMessage}
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #E5E7EB',
            background: 'white'
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={`Message ${channel.name}...`}
              style={{
                flex: 1,
                padding: '12px 16px',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#CE1126'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              style={{
                padding: '12px 20px',
                background: newMessage.trim() ? '#CE1126' : '#D1D5DB',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              <Send size={16} />
              Send
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
