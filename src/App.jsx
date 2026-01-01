import React from 'react';
import Login from './components/Login';
import ChannelList from './components/ChannelList';
import MessageView from './components/MessageView';
import Calendar from './components/Calendar';
import Info from './components/Info';
import { channels, messages } from './data/mockData';
import { MessageSquare, Calendar as CalendarIcon, Info as InfoIcon, Menu, X } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [activeChannel, setActiveChannel] = React.useState(null);
  const [activeView, setActiveView] = React.useState('messages');
  const [showChannelList, setShowChannelList] = React.useState(false);

  React.useEffect(() => {
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
    setShowChannelList(false);
  };

  const handleChannelSelect = (channel) => {
    setActiveChannel(channel);
    setShowChannelList(false);
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
      fontFamily: "'Noto Sans', sans-serif"
    }}>
      {/* Top App Bar */}
      <div style={{
        height: '56px',
        background: 'white',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {activeView === 'messages' && (
            <button
              onClick={() => setShowChannelList(!showChannelList)}
              style={{
                width: '40px',
                height: '40px',
                background: showChannelList ? '#F3F4F6' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#111827'
              }}
            >
              {showChannelList ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
          
          <div>
            <h1 style={{
              fontSize: '18px',
              fontWeight: '700',
              margin: 0,
              color: '#111827',
              letterSpacing: '-0.3px'
            }}>
              {activeView === 'messages' && activeChannel ? activeChannel.name : 
               activeView === 'calendar' ? 'Calendar' :
               activeView === 'info' ? 'Info' : 'VAHC Hub'}
            </h1>
            <p style={{
              fontSize: '12px',
              color: '#6B7280',
              margin: '2px 0 0 0',
              fontWeight: '500'
            }}>
              {currentUser.name}
            </p>
          </div>
        </div>

        {/* Platypus & Fox Logo */}
        <div style={{
          fontSize: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          🦆🦊
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {activeView === 'messages' ? (
          <>
            {/* Channel Sidebar - Slide in on mobile */}
            <div style={{
              width: showChannelList ? '280px' : '0',
              flexShrink: 0,
              background: 'white',
              transition: 'width 0.3s ease',
              overflow: 'hidden',
              borderRight: showChannelList ? '1px solid #E5E7EB' : 'none',
              position: window.innerWidth < 768 ? 'absolute' : 'relative',
              height: '100%',
              zIndex: 10,
              boxShadow: showChannelList && window.innerWidth < 768 ? '2px 0 8px rgba(0,0,0,0.1)' : 'none'
            }}>
              {showChannelList && (
                <ChannelList
                  user={currentUser}
                  channels={channels}
                  activeChannel={activeChannel}
                  onChannelSelect={handleChannelSelect}
                />
              )}
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
        ) : activeView === 'calendar' ? (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Calendar />
          </div>
        ) : (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Info />
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        height: '60px',
        background: 'white',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexShrink: 0,
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -1px 3px rgba(0,0,0,0.05)'
      }}>
        <NavButton
          icon={<MessageSquare size={22} />}
          label="Messages"
          active={activeView === 'messages'}
          onClick={() => handleViewChange('messages')}
        />
        <NavButton
          icon={<CalendarIcon size={22} />}
          label="Calendar"
          active={activeView === 'calendar'}
          onClick={() => handleViewChange('calendar')}
        />
        <NavButton
          icon={<InfoIcon size={22} />}
          label="Info"
          active={activeView === 'info'}
          onClick={() => handleViewChange('info')}
        />
      </div>

      {/* Overlay for mobile channel list */}
      {showChannelList && window.innerWidth < 768 && (
        <div
          onClick={() => setShowChannelList(false)}
          style={{
            position: 'absolute',
            top: '56px',
            left: 0,
            right: 0,
            bottom: '60px',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 9
          }}
        />
      )}
    </div>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        height: '100%',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        color: active ? '#CE1126' : '#6B7280',
        transition: 'color 0.2s',
        position: 'relative'
      }}
    >
      {active && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '3px',
          background: '#CE1126',
          borderRadius: '0 0 3px 3px'
        }} />
      )}
      {icon}
      <span style={{
        fontSize: '11px',
        fontWeight: active ? '700' : '500',
        letterSpacing: '0.3px'
      }}>
        {label}
      </span>
    </button>
  );
}
