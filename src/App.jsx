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
      background: 'linear-gradient(135deg, #FAFBFC 0%, #F0F4F8 100%)',
      fontFamily: "'Noto Sans', sans-serif"
    }}>
      {/* Top App Bar - Clean white with subtle shadow */}
      <div style={{
        height: '64px',
        background: 'white',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {activeView === 'messages' && (
            <button
              onClick={() => setShowChannelList(!showChannelList)}
              style={{
                width: '44px',
                height: '44px',
                background: showChannelList 
                  ? 'linear-gradient(135deg, #CE1126 0%, #FF6B35 100%)' 
                  : '#F3F4F6',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: showChannelList ? 'white' : '#374151',
                boxShadow: showChannelList ? '0 4px 12px rgba(206, 17, 38, 0.25)' : 'none'
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
        <img 
          src="/platypus-fox-logo.png" 
          alt="Platypus & Fox" 
          style={{ 
            height: '40px',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))'
          }} 
        />
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
            {/* Channel Sidebar */}
            <div style={{
              width: showChannelList ? '280px' : '0',
              flexShrink: 0,
              background: 'white',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              borderRight: showChannelList ? '1px solid #E5E7EB' : 'none',
              position: window.innerWidth < 768 ? 'absolute' : 'relative',
              height: '100%',
              zIndex: 10,
              boxShadow: showChannelList && window.innerWidth < 768 ? '2px 0 12px rgba(0,0,0,0.08)' : 'none'
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

      {/* Bottom Navigation - Modern elevated style */}
      <div style={{
        height: '72px',
        background: 'white',
        borderTop: '1px solid #E5E7EB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexShrink: 0,
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -2px 12px rgba(0, 0, 0, 0.04)'
      }}>
        <NavButton
          icon={<MessageSquare size={26} strokeWidth={2.5} />}
          label="Messages"
          active={activeView === 'messages'}
          onClick={() => handleViewChange('messages')}
        />
        <NavButton
          icon={<CalendarIcon size={26} strokeWidth={2.5} />}
          label="Calendar"
          active={activeView === 'calendar'}
          onClick={() => handleViewChange('calendar')}
        />
        <NavButton
          icon={<InfoIcon size={26} strokeWidth={2.5} />}
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
            top: '64px',
            left: 0,
            right: 0,
            bottom: '72px',
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(2px)',
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
        gap: '6px',
        color: active ? '#CE1126' : '#9CA3AF',
        position: 'relative',
        fontWeight: active ? '700' : '500'
      }}
    >
      {active && (
        <>
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '4px',
            background: 'linear-gradient(90deg, #CE1126 0%, #FF6B35 100%)',
            borderRadius: '0 0 4px 4px',
            boxShadow: '0 2px 8px rgba(206, 17, 38, 0.3)'
          }} />
          <div style={{
            position: 'absolute',
            inset: '8px',
            background: 'linear-gradient(135deg, rgba(206, 17, 38, 0.05) 0%, rgba(255, 107, 53, 0.05) 100%)',
            borderRadius: '12px',
            zIndex: -1
          }} />
        </>
      )}
      <div style={{
        filter: active ? 'drop-shadow(0 2px 4px rgba(206, 17, 38, 0.2))' : 'none',
        transform: active ? 'scale(1.05)' : 'scale(1)'
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: '11px',
        letterSpacing: '0.3px'
      }}>
        {label}
      </span>
    </button>
  );
}


