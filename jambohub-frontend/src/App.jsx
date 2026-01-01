import React, { useState, useEffect } from 'react';
import { 
  Home, MessageSquare, Calendar, Info as InfoIcon, 
  Shield, Menu, X, Bell, BellOff, LogOut, User
} from 'lucide-react';
import * as api from './lib/api';
import Login from './components/Login';
import Info from './components/Info';
import MessageView from './components/MessageView';
import ChannelList from './components/ChannelList';
import Schedule from './components/Schedule';
import Admin from './components/Admin';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('info'); // Info is now default
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [channels, setChannels] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Fetch channels when user logs in
  useEffect(() => {
    if (currentUser) {
      fetchChannels();
      setEmailNotifications(currentUser.emailNotifications ?? true);
    }
  }, [currentUser]);

  const checkAuth = async () => {
    try {
      if (api.isAuthenticated()) {
        const user = await api.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      api.logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async () => {
    try {
      const data = await api.getChannels();
      setChannels(data);
    } catch (err) {
      console.error('Failed to fetch channels:', err);
    }
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setActiveView('info');
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setSelectedChannel(null);
    setActiveView('info');
  };

  const handleNavigate = (view, channelId = null) => {
    setActiveView(view);
    if (channelId) {
      const channel = channels.find(c => c.id === channelId);
      setSelectedChannel(channel);
    } else if (view === 'messages' && channels.length > 0) {
      // Default to first channel when navigating to messages
      setSelectedChannel(channels[0]);
    }
    setSidebarOpen(false);
  };

  const handleChannelSelect = (channel) => {
    setSelectedChannel(channel);
    setActiveView('messages');
    setSidebarOpen(false);
  };

  const toggleNotifications = async () => {
    try {
      const newValue = !emailNotifications;
      await api.updateNotificationSettings(newValue);
      setEmailNotifications(newValue);
    } catch (err) {
      console.error('Failed to update notifications:', err);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center', color: '#6b7280' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏕️</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  const navItems = [
    { id: 'info', icon: <Home size={22} />, label: 'Home' },
    { id: 'messages', icon: <MessageSquare size={22} />, label: 'Messages' },
    { id: 'schedule', icon: <Calendar size={22} />, label: 'Schedule' },
  ];

  // Add admin tab for admin users
  if (currentUser.role === 'admin') {
    navItems.push({ id: 'admin', icon: <Shield size={22} />, label: 'Admin' });
  }

  const renderContent = () => {
    switch (activeView) {
      case 'info':
        return <Info onNavigate={handleNavigate} channels={channels} currentUser={currentUser} />;
      case 'messages':
        if (selectedChannel) {
          return <MessageView channel={selectedChannel} currentUser={currentUser} />;
        }
        return (
          <ChannelList 
            channels={channels} 
            onSelectChannel={handleChannelSelect}
            currentUser={currentUser}
          />
        );
      case 'schedule':
        return <Schedule />;
      case 'admin':
        return <Admin currentUser={currentUser} />;
      default:
        return <Info onNavigate={handleNavigate} channels={channels} currentUser={currentUser} />;
    }
  };

  return (
    <div style={{ 
      height: '100vh',
      background: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Top Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6b7280'
            }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🏕️</span>
            <span style={{ fontWeight: '700', fontSize: '18px', color: '#1a1a1a' }}>JamboHub</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={toggleNotifications}
            title={emailNotifications ? 'Notifications On' : 'Notifications Off'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: emailNotifications ? '#7C3AED' : '#9ca3af'
            }}
          >
            {emailNotifications ? <Bell size={20} /> : <BellOff size={20} />}
          </button>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '14px'
          }}>
            {currentUser.firstName?.charAt(0) || currentUser.name?.charAt(0) || 'U'}
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 200
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        top: 0,
        left: sidebarOpen ? 0 : '-280px',
        width: '280px',
        height: '100vh',
        background: 'white',
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        transition: 'left 0.2s ease',
        zIndex: 300,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '18px'
          }}>
            {currentUser.firstName?.charAt(0) || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: '600', fontSize: '15px', color: '#1a1a1a' }}>
              {currentUser.firstName} {currentUser.lastName}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser.position || currentUser.role}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                background: activeView === item.id ? '#EDE9FE' : 'transparent',
                color: activeView === item.id ? '#7C3AED' : '#4b5563',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: activeView === item.id ? '600' : '500',
                marginBottom: '4px',
                transition: 'background 0.15s'
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          {/* Channel List in Sidebar */}
          {activeView === 'messages' && channels.length > 0 && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', padding: '0 16px 8px', textTransform: 'uppercase' }}>
                Channels
              </div>
              {channels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => handleChannelSelect(channel)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    background: selectedChannel?.id === channel.id ? '#F3F4F6' : 'transparent',
                    color: selectedChannel?.id === channel.id ? '#1a1a1a' : '#6b7280',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: selectedChannel?.id === channel.id ? '500' : '400',
                    textAlign: 'left'
                  }}
                >
                  <span>{channel.icon}</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{channel.name}</span>
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px', borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 16px',
              background: 'transparent',
              color: '#DC2626',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '500'
            }}
          >
            <LogOut size={22} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {renderContent()}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav style={{
        background: 'white',
        borderTop: '1px solid #e5e7eb',
        padding: '8px 0',
        display: 'flex',
        justifyContent: 'space-around',
        position: 'sticky',
        bottom: 0
      }}>
        {navItems.slice(0, 4).map(item => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeView === item.id ? '#7C3AED' : '#9ca3af',
              fontSize: '11px',
              fontWeight: activeView === item.id ? '600' : '500'
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <footer style={{
        background: '#1a1a1a',
        color: '#9ca3af',
        textAlign: 'center',
        padding: '12px 16px',
        fontSize: '12px'
      }}>
        Powered by <span style={{ color: '#A855F7', fontWeight: '600' }}>Platypus & Fox</span> — 2025 to 2026
      </footer>
    </div>
  );
}
