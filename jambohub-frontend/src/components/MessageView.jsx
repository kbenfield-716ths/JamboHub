import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Pin, RefreshCw, Image, X, Loader2 } from 'lucide-react';
import * as api from '../lib/api';

export default function MessageView({ channel, currentUser, onBack }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a JPG, PNG, GIF, or WebP image');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedImage) || sending) return;

    setSending(true);
    setUploading(!!selectedImage);

    try {
      let imageUrl = null;

      // Upload image first if selected
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);
        
        const uploadResult = await api.uploadImage(formData);
        imageUrl = uploadResult.url;
      }

      // Post message with optional image
      const message = await api.postMessage(channel.id, newMessage.trim(), imageUrl);
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      clearImage();
      setError('');
    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
      setUploading(false);
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
      adult_leader: { label: 'Leader', color: '#7C3AED', bg: '#EDE9FE' },
      youth: { label: 'Scout', color: '#059669', bg: '#D1FAE5' },
      parent: { label: 'Parent', color: '#D97706', bg: '#FEF3C7' }
    };
    return badges[role] || badges.youth;
  };

  const canPost = channel?.canPost || currentUser?.role === 'admin';
  const canPin = currentUser?.role === 'admin' || currentUser?.role === 'adult_leader';
  // Allow photos in family-type channels or all channels for admins/leaders
  const canUploadPhotos = currentUser?.role === 'admin' || currentUser?.role === 'adult_leader' || currentUser?.role === 'parent';

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
                    padding: message.imageUrl ? '8px' : '12px 16px',
                    borderRadius: isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: isOwn 
                      ? 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' 
                      : 'white',
                    color: isOwn ? 'white' : '#1a1a1a',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                    position: 'relative'
                  }}
                >
                  {/* Image */}
                  {message.imageUrl && (
                    <img 
                      src={message.imageUrl} 
                      alt="Shared image"
                      onClick={() => setViewingImage(message.imageUrl)}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '300px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'block',
                        marginBottom: message.content ? '8px' : '0'
                      }}
                    />
                  )}
                  
                  {/* Text content */}
                  {message.content && (
                    <div style={{ 
                      fontSize: '15px', 
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      padding: message.imageUrl ? '4px 8px' : '0'
                    }}>
                      {message.content}
                    </div>
                  )}
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '6px',
                    gap: '8px',
                    padding: message.imageUrl ? '0 8px 4px' : '0'
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

      {/* Image preview */}
      {imagePreview && (
        <div style={{
          padding: '8px 16px',
          background: '#f3f4f6',
          borderTop: '1px solid #e5e7eb'
        }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ 
                maxHeight: '100px', 
                maxWidth: '150px', 
                borderRadius: '8px',
                border: '2px solid #7C3AED'
              }} 
            />
            <button
              onClick={clearImage}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#DC2626',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Message input */}
      {canPost ? (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid #e5e7eb',
          background: 'white',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end'
        }}>
          {/* Photo button */}
          {canUploadPhotos && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={sending}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: '2px solid #e5e7eb',
                  background: 'white',
                  color: '#6b7280',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
                title="Add photo"
              >
                <Image size={20} />
              </button>
            </>
          )}
          
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
            disabled={(!newMessage.trim() && !selectedImage) || sending}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              border: 'none',
              background: (newMessage.trim() || selectedImage) && !sending
                ? 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)'
                : '#e5e7eb',
              color: (newMessage.trim() || selectedImage) && !sending ? 'white' : '#9ca3af',
              cursor: (newMessage.trim() || selectedImage) && !sending ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.15s'
            }}
          >
            {uploading ? <Loader2 size={20} className="spin" /> : <Send size={20} />}
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

      {/* Image viewer modal */}
      {viewingImage && (
        <div 
          onClick={() => setViewingImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            cursor: 'pointer'
          }}
        >
          <img 
            src={viewingImage} 
            alt="Full size" 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%', 
              objectFit: 'contain',
              borderRadius: '8px'
            }} 
          />
          <button
            onClick={() => setViewingImage(null)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* Styles */}
      <style>{`
        @media (min-width: 768px) {
          .back-button {
            display: none !important;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
