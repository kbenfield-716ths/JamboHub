import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Pin, RefreshCw } from 'lucide-react';
import * as api from '../lib/api';

export default function MessageView({ channel, currentUser, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Fetch messages when channel changes
  useEffect(() => {
    if (channel) {
      fetchMessages();
      
      // Poll for new messages every 10 seconds
      pollIntervalRef.current = setInterval(fetchMessages, 10000);
      
      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [channel?.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!channel) return;
    
    try {
      const data = await api.getMessages(channel.id);
      setMessages(data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const message = await api.postMessage(channel.id, newMessage.trim());
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setError('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTogglePin = async (messageId) => {
    try {
      await api.togglePinMessage(messageId);
      // Refresh messages to get updated pin status
      fetchMessages();
    } catch (err) {
      console.error('Failed to toggle pin:', err);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: { label: 'Admin', color: '#DC2626', bg: '#FEE2E2' },
      adult: { label: 'Leader', color: '#7C3AED', bg: '#EDE9FE' },
      youth: { label: 'Scout', color: '#059669', bg: '#D1FAE5' },
      parent: { label: 'Parent', color: '#D97706', bg: '#FEF3C7' }
    };
    return badges[role] || badges.youth;
  };

  const canPost = channel?.canPost || currentUser?.role === 'admin';
  const canPin = currentUser?.role === 'admin' || currentUser?.role === 'adult';

  if (!channel) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#9ca3af',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
          <div style={{ fontSize: '16px', fontWeight: '500' }}>Select a channel to view messages</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#f8f7fc'
    }}>
      {/* Channel header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e5e7eb',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: '#6b7280',
            borderRadius: '8px'
          }}
          className="back-button"
        >
          <ChevronLeft size={24} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontWeight: '700', 
            fontSize: '16px',
            color: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>{channel.icon}</span>
            <span>{channel.name}</span>
          </div>
          {channel.description && (
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {channel.description}
            </div>
          )}
        </div>
        <button
          onClick={fetchMessages}
          style={{
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            color: '#6b7280',
            borderRadius: '8px'
          }}
          title="Refresh messages"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div style={{
          padding: '8px 16px',
          background: '#FEF2F2',
          color: '#DC2626',
          fontSize: '13px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {/* Messages list */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '16px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            color: '#9ca3af',
            padding: '40px 20px'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
            <div>No messages yet</div>
            {canPost && (
              <div style={{ fontSize: '13px', marginTop: '4px' }}>
                Be the first to post!
              </div>
            )}
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.author?.id === currentUser?.id;
            const badge = getRoleBadge(message.author?.role);
            
            return (
              <div
                key={message.id}
                style={{
                  marginBottom: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isOwn ? 'flex-end' : 'flex-start'
                }}
              >
                {/* Pinned indicator */}
                {message.pinned && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: '#7C3AED',
                    marginBottom: '4px',
                    fontWeight: '500'
                  }}>
                    <Pin size={12} />
                    Pinned
                  </div>
                )}
                
                {/* Author name (not for own messages) */}
                {!isOwn && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '4px',
                    marginLeft: '4px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#374151'
                    }}>
                      {message.author?.name || 'Unknown'}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      color: badge.color,
                      background: badge.bg,
                      padding: '2px 6px',
                      borderRadius: '10px'
                    }}>
                      {badge.label}
                    </span>
                  </div>
                )}
                
                {/* Message bubble */}
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: isOwn 
                      ? 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' 
                      : 'white',
                    color: isOwn ? 'white' : '#1a1a1a',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    position: 'relative'
                  }}
                >
                  <div style={{ 
                    fontSize: '15px', 
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {message.content}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '6px',
                    gap: '8px'
                  }}>
                    <span style={{
                      fontSize: '11px',
                      opacity: isOwn ? 0.8 : 0.6
                    }}>
                      {formatTime(message.createdAt)}
                    </span>
                    
                    {/* Pin button for leaders */}
                    {canPin && (
                      <button
                        onClick={() => handleTogglePin(message.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: '2px',
                          cursor: 'pointer',
                          opacity: message.pinned ? 1 : 0.5,
                          color: isOwn ? 'white' : '#7C3AED'
                        }}
                        title={message.pinned ? 'Unpin' : 'Pin'}
                      >
                        <Pin size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      {canPost ? (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #e5e7eb',
          background: 'white',
          display: 'flex',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '15px',
              border: '2px solid #e5e7eb',
              borderRadius: '24px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit',
              maxHeight: '120px',
              lineHeight: '1.4'
            }}
            onFocus={(e) => e.target.style.borderColor = '#7C3AED'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: 'none',
              background: newMessage.trim() && !sending
                ? 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)'
                : '#e5e7eb',
              color: newMessage.trim() && !sending ? 'white' : '#9ca3af',
              cursor: newMessage.trim() && !sending ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.15s'
            }}
          >
            <Send size={20} />
          </button>
        </div>
      ) : (
        <div style={{
          padding: '16px',
          textAlign: 'center',
          background: '#f3f4f6',
          color: '#6b7280',
          fontSize: '13px'
        }}>
          You can view messages in this channel but cannot post.
        </div>
      )}

      {/* Hide back button on desktop */}
      <style>{`
        @media (min-width: 768px) {
          .back-button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
