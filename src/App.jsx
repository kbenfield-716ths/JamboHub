import React from 'react';
import Login from './components/Login';
import ChannelList from './components/ChannelList';
import MessageView from './components/MessageView';
import Schedule from './components/Schedule';
import { channels, messages } from './data/mockData';
import { MessageSquare, Calendar, Settings, LogOut } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [activeChannel, setActiveChannel] = React.useState(null);
  const [activeView, setActiveView] = React.useState('messages'); // 'messages' or 'schedule'
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);

  React.useEffect(() => {
    // Auto-select first available channel when user logs in
    if (currentUser && !activeChannel && activeView === 'messages') {
      const firstChannel = channels.find(c => 
        c.allowedRoles.includes(currentUser.role)
      );
      if (firstChannel) {
        setActiveChannel(firstChannel);
      }
    }
  }, [currentUser, activeChannel, activeView]);

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      setCurrentUser(null);
      setActiveChannel(null);
      setActiveView('messages');
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    setShowMobileMenu(false);
  };

  const handleChannelSelect = (channel) => {
    setActiveChannel(channel);
    setShowMobileMenu(false);
  };

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#F3F4F6',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Top Navigation Bar */}
      <div style={{
        height: '60px',
        background: 'linear-gradient(135deg, #003F87 0%, #CE1126 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        flexShrink: 0
      }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: '700',
          margin: 0
        }}>
          VAHC Jamboree Hub
        </h1>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => handleViewChange('messages')}
            style={{
              padding: '8px 16px',
              background: activeView === 'messages' ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <MessageSquare size={16} />
            Messages
          </button>

          <button
            onClick={() => handleViewChange('schedule')}
            style={{
              padding: '8px 16px',
              background: activeView === 'schedule' ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Calendar size={16} />
            Schedule
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden'
      }}>
        {activeView === 'messages' ? (
          <>
            {/* Channel Sidebar */}
            <div style={{
              width: '280px',
              flexShrink: 0,
              borderRight: '1px solid #E5E7EB',
              background: 'white',
              display: window.innerWidth < 768 && !showMobileMenu ? 'none' : 'block'
            }}>
              <ChannelList
                user={currentUser}
                channels={channels}
                activeChannel={activeChannel}
                onChannelSelect={handleChannelSelect}
              />
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <MessageView
                user={currentUser}
                channel={activeChannel}
                messages={messages}
              />
            </div>
          </>
        ) : (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Schedule />
          </div>
        )}
      </div>

      {/* Mobile Menu Toggle - Only show on small screens */}
      {activeView === 'messages' && window.innerWidth < 768 && (
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#CE1126',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            zIndex: 1000
          }}
        >
          {showMobileMenu ? '✕' : '☰'}
        </button>
      )}
    </div>
  );
}
