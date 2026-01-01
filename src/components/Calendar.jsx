import React from 'react';
import { Calendar as CalendarIcon, ExternalLink, Clock, MapPin } from 'lucide-react';
import { schedule } from '../data/mockData';

export default function Calendar() {
  // You'll replace this with your actual Google Calendar ID
  const GOOGLE_CALENDAR_ID = 'your-calendar-id@group.calendar.google.com';
  const GOOGLE_CALENDAR_EMBED = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(GOOGLE_CALENDAR_ID)}&ctz=America/New_York&mode=AGENDA`;
  
  const [showGoogleCalendar, setShowGoogleCalendar] = React.useState(false);

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#F9FAFB'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #003F87 0%, #CE1126 100%)',
        padding: '20px',
        color: 'white',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CalendarIcon size={28} />
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                margin: 0,
                letterSpacing: '-0.5px'
              }}>
                Calendar
              </h2>
              <p style={{
                fontSize: '14px',
                margin: '4px 0 0 0',
                opacity: 0.95
              }}>
                Jamboree 2025 Schedule
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setShowGoogleCalendar(!showGoogleCalendar)}
            style={{
              padding: '8px 16px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {showGoogleCalendar ? 'List View' : 'Calendar View'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {showGoogleCalendar ? (
          <div style={{ height: '100%', padding: '20px', background: 'white' }}>
            <div style={{
              height: '100%',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              <iframe
                src={GOOGLE_CALENDAR_EMBED}
                style={{
                  border: 'none',
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px'
                }}
                title="Google Calendar"
              />
              <div style={{
                marginTop: '12px',
                textAlign: 'center'
              }}>
                <a
                  href={`https://calendar.google.com/calendar/u/0?cid=${GOOGLE_CALENDAR_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#CE1126',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Add to your Google Calendar
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            height: '100%',
            overflowY: 'auto',
            padding: '20px'
          }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {/* Day Selector */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '20px',
                overflowX: 'auto',
                padding: '4px'
              }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(day => (
                  <DayButton key={day} day={day} active={day === 1} />
                ))}
              </div>

              {/* Schedule for Selected Day */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#111827',
                  margin: '0 0 16px 0'
                }}>
                  Sunday, July 20 - Day 1
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {schedule.map((item) => (
                    <EventCard key={item.id} event={item} />
                  ))}
                </div>
              </div>

              {/* Google Calendar CTA */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <CalendarIcon size={32} color="#CE1126" style={{ marginBottom: '12px' }} />
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#111827',
                  margin: '0 0 8px 0'
                }}>
                  Subscribe to Full Calendar
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6B7280',
                  margin: '0 0 16px 0',
                  lineHeight: '1.6'
                }}>
                  Add all Jamboree events to your personal calendar and get automatic updates
                </p>
                <button
                  onClick={() => setShowGoogleCalendar(true)}
                  style={{
                    padding: '12px 24px',
                    background: '#CE1126',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <CalendarIcon size={16} />
                  View Google Calendar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DayButton({ day, active }) {
  return (
    <button
      style={{
        minWidth: '60px',
        padding: '12px',
        background: active ? '#CE1126' : 'white',
        color: active ? 'white' : '#6B7280',
        border: active ? 'none' : '2px solid #E5E7EB',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s',
        flexShrink: 0
      }}
    >
      <div style={{ fontSize: '11px', opacity: 0.8 }}>Day</div>
      <div style={{ fontSize: '18px' }}>{day}</div>
    </button>
  );
}

function EventCard({ event }) {
  const getTypeColor = (type) => {
    switch(type) {
      case 'meal': return '#059669';
      case 'activity': return '#2563EB';
      case 'event': return '#CE1126';
      case 'leadership': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <div style={{
      padding: '16px',
      border: '1px solid #E5E7EB',
      borderLeft: `4px solid ${getTypeColor(event.type)}`,
      borderRadius: '8px',
      background: '#FAFAFA'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <Clock size={14} color={getTypeColor(event.type)} />
            <span style={{
              fontSize: '13px',
              fontWeight: '600',
              color: getTypeColor(event.type)
            }}>
              {event.time}
            </span>
          </div>
          
          <h4 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#111827',
            margin: '0 0 4px 0'
          }}>
            {event.title}
          </h4>
          
          {event.location && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: '#6B7280',
              marginBottom: '4px'
            }}>
              <MapPin size={12} />
              {event.location}
            </div>
          )}
          
          {event.description && (
            <p style={{
              fontSize: '13px',
              color: '#6B7280',
              margin: '8px 0 0 0',
              lineHeight: '1.5'
            }}>
              {event.description}
            </p>
          )}
        </div>
        
        <div style={{
          padding: '4px 8px',
          background: getTypeColor(event.type),
          color: 'white',
          fontSize: '10px',
          fontWeight: '700',
          borderRadius: '4px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          flexShrink: 0
        }}>
          {event.type}
        </div>
      </div>
    </div>
  );
}
