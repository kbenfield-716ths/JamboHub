import React from 'react';
import Login from './components/Login';
import ChannelList from './components/ChannelList';
import MessageView from './components/MessageView';
import Calendar from './components/Calendar';
import Info from './components/Info';
import { channels, messages } from './data/mockData';
import { MessageSquare, Calendar as CalendarIcon, Info as InfoIcon, Menu, X, LogOut } from 'lucide-react';

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

  const handleViewChange = (view) => {
    setActiveView(view);
    setShowChannelList(false);
  };

  const handleChannelSelect = (channel) => {
    setActiveChannel(channel);
    setShowChannelList(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveChannel(null);
    setActiveView('messages');
  };

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#FAFAFA',
      fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Minimal Top Bar */}
      <header style={{
        height: '56px',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0,
        borderBottom: '1px solid rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {activeView === 'messages' && (
            <button
              onClick={() => setShowChannelList(!showChannelList)}
              style={{
                width: '40px',
                height: '40px',
                background: showChannelList ? '#1a1a1a' : 'transparent',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: showChannelList ? 'white' : '#666',
                transition: 'all 0.2s ease'
              }}
            >
              {showChannelList ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
          
          <div>
            <h1 style={{
              fontSize: '15px',
              fontWeight: '600',
              margin: 0,
              color: '#1a1a1a',
              letterSpacing: '-0.2px'
            }}>
              {activeView === 'messages' && activeChannel ? activeChannel.name : 
               activeView === 'calendar' ? 'Schedule' :
               activeView === 'info' ? 'Information' : 'JamboHub'}
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontSize: '13px',
            color: '#888',
            fontWeight: '500'
          }}>
            {currentUser.name}
          </span>
          <button
            onClick={handleLogout}
            style={{
              width: '36px',
              height: '36px',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              transition: 'all 0.2s ease'
            }}
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {activeView === 'messages' ? (
          <>
            {/* Channel Sidebar - Slide in */}
            <aside style={{
              width: showChannelList ? '260px' : '0',
              flexShrink: 0,
              background: 'white',
              transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              borderRight: showChannelList ? '1px solid rgba(0,0,0,0.06)' : 'none',
              position: window.innerWidth < 768 ? 'absolute' : 'relative',
              height: '100%',
              zIndex: 20
            }}>
              {showChannelList && (
                <ChannelList
                  user={currentUser}
                  channels={channels}
                  activeChannel={activeChannel}
                  onChannelSelect={handleChannelSelect}
                />
              )}
            </aside>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <MessageView
                user={currentUser}
                channel={activeChannel}
                messages={messages}
              />
            </main>
          </>
        ) : activeView === 'calendar' ? (
          <main style={{ flex: 1, overflow: 'hidden' }}>
            <Calendar />
          </main>
        ) : (
          <main style={{ flex: 1, overflow: 'hidden' }}>
            <Info />
          </main>
        )}
      </div>

      {/* Bottom Navigation - Clean and subtle */}
      <nav style={{
        height: '64px',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexShrink: 0,
        paddingBottom: 'env(safe-area-inset-bottom)',
        borderTop: '1px solid rgba(0,0,0,0.06)'
      }}>
        <NavButton
          icon={<MessageSquare size={22} />}
          label="Messages"
          active={activeView === 'messages'}
          onClick={() => handleViewChange('messages')}
        />
        <NavButton
          icon={<CalendarIcon size={22} />}
          label="Schedule"
          active={activeView === 'calendar'}
          onClick={() => handleViewChange('calendar')}
        />
        <NavButton
          icon={<InfoIcon size={22} />}
          label="Info"
          active={activeView === 'info'}
          onClick={() => handleViewChange('info')}
        />
      </nav>

      {/* Mobile overlay */}
      {showChannelList && window.innerWidth < 768 && (
        <div
          onClick={() => setShowChannelList(false)}
          style={{
            position: 'fixed',
            top: '56px',
            left: 0,
            right: 0,
            bottom: '64px',
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            zIndex: 10
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
        maxWidth: '120px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        color: active ? '#1a1a1a' : '#aaa',
        position: 'relative',
        transition: 'color 0.2s ease'
      }}
    >
      {active && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '32px',
          height: '3px',
          background: '#1a1a1a',
          borderRadius: '0 0 3px 3px'
        }} />
      )}
      <div style={{
        opacity: active ? 1 : 0.6,
        transform: active ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.2s ease'
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: '11px',
        fontWeight: active ? '600' : '500',
        letterSpacing: '0.2px'
      }}>
        {label}
      </span>
    </button>
  );
}
