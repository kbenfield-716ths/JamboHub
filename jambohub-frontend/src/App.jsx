import { useState, useEffect } from 'react';
import { MessageSquare, Calendar, Info, Shield, LogOut, Bell, BellOff } from 'lucide-react';
import Login from './components/Login';
import ChannelList from './components/ChannelList';
import MessageView from './components/MessageView';
import CalendarView from './components/Calendar';
import InfoView from './components/Info';
import Admin from './components/Admin';
import * as api from './lib/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [activeTab, setActiveTab] = useState('messages');
  const [loading, setLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    async function checkAuth() {
      if (api.isAuthenticated()) {
        try {
          const user = await api.getCurrentUser();
          if (user) {
            setCurrentUser(user);
            setEmailNotifications(user.email_notifications);
          } else {
            api.logout();
          }
        } catch (err) {
          console.error('Auth check failed:', err);
          api.logout();
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  // Fetch channels when user logs in
  useEffect(() => {
    async function fetchChannels() {
      if (currentUser) {
        try {
          const channelList = await api.getChannels();
          setChannels(channelList);
          if (channelList.length > 0 && !selectedChannel) {
            setSelectedChannel(channelList[0]);
          }
        } catch (err) {
          console.error('Failed to fetch channels:', err);
        }
      }
    }
    fetchChannels();
  }, [currentUser]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setEmailNotifications(user.email_notifications ?? true);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setSelectedChannel(null);
    setChannels([]);
    setActiveTab('messages');
  };

  const handleToggleNotifications = async () => {
    try {
      const newValue = !emailNotifications;
      await api.updateNotificationSettings(newValue);
      setEmailNotifications(newValue);
    } catch (err) {
      console.error('Failed to update notifications:', err);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏕️</div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  // Show login if not authenticated
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      maxWidth: '100vw',
      overflow: 'hidden',
      background: '#fff'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
        color: 'white',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="https://www.scouting.org/wp-content/uploads/2024/02/Jambo2026_National-Jamboree-Logo_Full-Color.png"
            alt="2026 National Jamboree"
            style={{ height: '36px', width: 'auto' }}
          />
          <div>
            <div style={{ fontWeight: '700', fontSize: '16px', letterSpacing: '-0.3px' }}>JamboHub</div>
            <div style={{ fontSize: '11px', opacity: 0.9 }}>VAHC Contingent</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Notification toggle */}
          <button
            onClick={handleToggleNotifications}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={emailNotifications ? 'Notifications on' : 'Notifications off'}
          >
            {emailNotifications ? (
              <Bell size={18} color="white" />
            ) : (
              <BellOff size={18} color="rgba(255,255,255,0.6)" />
            )}
          </button>
          
          {/* User info */}
          <div style={{ textAlign: 'right', marginRight: '8px' }}>
            <div style={{ fontSize: '13px', fontWeight: '600' }}>{currentUser.name}</div>
            <div style={{ fontSize: '11px', opacity: 0.85 }}>{currentUser.unit}</div>
          </div>
          
          {/* Logout button */}
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LogOut size={18} color="white" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {activeTab === 'messages' && (
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Channel sidebar - hidden on mobile when viewing messages */}
            <div style={{
              width: '280px',
              borderRight: '1px solid #e5e7eb',
              overflow: 'auto',
              flexShrink: 0,
              display: selectedChannel ? 'none' : 'block'
            }} className="channel-sidebar">
              <ChannelList 
                channels={channels}
                selectedChannel={selectedChannel}
                onSelectChannel={setSelectedChannel}
                currentUser={currentUser}
              />
            </div>
            
            {/* Message view */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <MessageView 
                channel={selectedChannel}
                currentUser={currentUser}
                onBack={() => setSelectedChannel(null)}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'calendar' && (
          <div style={{ flex: 1, overflow: 'auto' }}>
            <CalendarView />
          </div>
        )}
        
        {activeTab === 'info' && (
          <div style={{ flex: 1, overflow: 'auto' }}>
            <InfoView />
          </div>
        )}

        {activeTab === 'admin' && isAdmin && (
          <div style={{ flex: 1, overflow: 'auto' }}>
            <Admin currentUser={currentUser} />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav style={{
        display: 'flex',
        borderTop: '1px solid #e5e7eb',
        background: '#fff',
        flexShrink: 0
      }}>
        <NavButton 
          icon={<MessageSquare size={22} />} 
          label="Messages" 
          active={activeTab === 'messages'}
          onClick={() => setActiveTab('messages')}
        />
        <NavButton 
          icon={<Calendar size={22} />} 
          label="Schedule" 
          active={activeTab === 'calendar'}
          onClick={() => setActiveTab('calendar')}
        />
        <NavButton 
          icon={<Info size={22} />} 
          label="Info" 
          active={activeTab === 'info'}
          onClick={() => setActiveTab('info')}
        />
        {isAdmin && (
          <NavButton 
            icon={<Shield size={22} />} 
            label="Admin" 
            active={activeTab === 'admin'}
            onClick={() => setActiveTab('admin')}
          />
        )}
      </nav>

      {/* Desktop channel sidebar visibility */}
      <style>{`
        @media (min-width: 768px) {
          .channel-sidebar {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 8px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: active ? '#7C3AED' : '#9ca3af',
        gap: '4px',
        transition: 'color 0.15s'
      }}
    >
      {icon}
      <span style={{ fontSize: '11px', fontWeight: active ? '600' : '500' }}>{label}</span>
    </button>
  );
}

export default App;
