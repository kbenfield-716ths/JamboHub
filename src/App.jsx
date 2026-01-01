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
      background: '#F8F7FC',
      fontFamily: "'Nunito Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Top Bar - Vibrant Purple */}
      <header style={{
        minHeight: '60px',
        background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {activeView === 'messages' && (
            <button
              onClick={() => setShowChannelList(!showChannelList)}
              style={{
                width: '44px',
                height: '44px',
                background: showChannelList ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              {showChannelList ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
          
          <div>
            <h1 style={{
              fontSize: '18px',
              fontWeight: '700',
              margin: 0,
              color: 'white',
              letterSpacing: '-0.3px'
            }}>
              {activeView === 'messages' && activeChannel ? activeChannel.name : 
               activeView === 'calendar' ? 'Schedule' :
               activeView === 'info' ? 'Information' : 'JamboHub'}
            </h1>
            <p style={{
              fontSize: '13px',
              margin: '2px 0 0 0',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: '500'
            }}>
              {currentUser.name}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '40px',
            height: '40px',
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}
          title="Sign out"
        >
          <LogOut size={18} />
        </button>
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
            {/* Channel Sidebar */}
            <aside style={{
              width: showChannelList ? '280px' : '0',
              flexShrink: 0,
              background: 'white',
              transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              position: 'absolute',
              height: '100%',
              zIndex: 20,
              boxShadow: showChannelList ? '4px 0 20px rgba(124, 58, 237, 0.1)' : 'none'
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

      {/* Bottom Navigation - Modern Tab Bar */}
      <nav style={{
        height: '70px',
        background: 'white',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'space-around',
        flexShrink: 0,
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)'
      }}>
        <NavButton
          icon={<MessageSquare size={24} />}
          label="Messages"
          active={activeView === 'messages'}
          onClick={() => handleViewChange('messages')}
        />
        <NavButton
          icon={<CalendarIcon size={24} />}
          label="Schedule"
          active={activeView === 'calendar'}
          onClick={() => handleViewChange('calendar')}
        />
        <NavButton
          icon={<InfoIcon size={24} />}
          label="Info"
          active={activeView === 'info'}
          onClick={() => handleViewChange('info')}
        />
      </nav>

      {/* Mobile overlay */}
      {showChannelList && (
        <div
          onClick={() => setShowChannelList(false)}
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            bottom: '70px',
            background: 'rgba(124, 58, 237, 0.2)',
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
        maxWidth: '100px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        color: active ? '#7C3AED' : '#9CA3AF',
        position: 'relative',
        padding: '8px 0'
      }}
    >
      {active && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '4px',
          background: 'linear-gradient(90deg, #7C3AED, #A855F7)',
          borderRadius: '0 0 4px 4px'
        }} />
      )}
      <div style={{
        padding: '8px',
        borderRadius: '12px',
        background: active ? 'rgba(124, 58, 237, 0.1)' : 'transparent',
        transition: 'all 0.2s ease'
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: '12px',
        fontWeight: active ? '700' : '600',
        letterSpacing: '0.2px'
      }}>
        {label}
      </span>
    </button>
  );
}
