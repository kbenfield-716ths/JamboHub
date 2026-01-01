import React from 'react';
import { Calendar as CalendarIcon, ExternalLink, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { schedule } from '../data/mockData';

export default function Calendar() {
  const GOOGLE_CALENDAR_ID = 'your-calendar-id@group.calendar.google.com';
  const GOOGLE_CALENDAR_EMBED = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(GOOGLE_CALENDAR_ID)}&ctz=America/New_York&mode=AGENDA`;
  
  const [showGoogleCalendar, setShowGoogleCalendar] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState(1);

  const days = Array.from({ length: 10 }, (_, i) => ({
    day: i + 1,
    date: new Date(2025, 6, 20 + i).toLocaleDateString('en-US', { weekday: 'short' }),
    fullDate: new Date(2025, 6, 20 + i).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#FAFAFA'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        background: 'white',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
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
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1a1a1a',
              margin: 0,
              letterSpacing: '-0.3px'
            }}>
              Jamboree 2025
            </h2>
            <p style={{
              fontSize: '13px',
              color: '#888',
              margin: '4px 0 0 0'
            }}>
              July 20 – 30, 2025
            </p>
          </div>
          
          <button
            onClick={() => setShowGoogleCalendar(!showGoogleCalendar)}
            style={{
              padding: '8px 14px',
              background: '#F5F5F5',
              border: 'none',
              borderRadius: '8px',
              color: '#555',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <CalendarIcon size={14} />
            {showGoogleCalendar ? 'List' : 'Calendar'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {showGoogleCalendar ? (
          <div style={{ height: '100%', padding: '20px', background: 'white' }}>
            <div style={{ height: '100%', maxWidth: '1000px', margin: '0 auto' }}>
              <iframe
                src={GOOGLE_CALENDAR_EMBED}
                style={{
                  border: 'none',
                  width: '100%',
                  height: 'calc(100% - 50px)',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
                title="Google Calendar"
              />
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <a
                  href={`https://calendar.google.com/calendar/u/0?cid=${GOOGLE_CALENDAR_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#666',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                >
                  Add to your calendar
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '16px' }}>
              
              {/* Day Selector */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '20px',
                overflowX: 'auto',
                padding: '4px 0',
                WebkitOverflowScrolling: 'touch'
              }}>
                {days.map(({ day, date }) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    style={{
                      minWidth: '56px',
                      padding: '12px 8px',
                      background: selectedDay === day ? '#1a1a1a' : 'white',
                      color: selectedDay === day ? 'white' : '#666',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                      boxShadow: selectedDay === day ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.08)'
                    }}
                  >
                    <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '4px' }}>{date}</div>
                    <div style={{ fontSize: '16px' }}>{day}</div>
                  </button>
                ))}
              </div>

              {/* Selected Day Info */}
              <div style={{
                marginBottom: '16px',
                padding: '16px 20px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: 0
                }}>
                  {days[selectedDay - 1]?.fullDate} — Day {selectedDay}
                </h3>
              </div>

              {/* Events */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {schedule.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {/* Subscribe CTA */}
              <div style={{
                marginTop: '24px',
                padding: '24px',
                background: 'white',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#F5F5F5',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <CalendarIcon size={22} color="#666" />
                </div>
                <h4 style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  margin: '0 0 6px 0'
                }}>
                  Stay Updated
                </h4>
                <p style={{
                  fontSize: '13px',
                  color: '#888',
                  margin: '0 0 16px 0',
                  lineHeight: '1.5'
                }}>
                  Subscribe to get automatic updates when the schedule changes
                </p>
                <button
                  onClick={() => setShowGoogleCalendar(true)}
                  style={{
                    padding: '10px 20px',
                    background: '#1a1a1a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <CalendarIcon size={14} />
                  View Full Calendar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event }) {
  const getTypeStyles = (type) => {
    switch(type) {
      case 'meal': 
        return { bg: '#ECFDF5', color: '#059669', dot: '#10B981' };
      case 'activity': 
        return { bg: '#EFF6FF', color: '#2563EB', dot: '#3B82F6' };
      case 'event': 
        return { bg: '#FEF2F2', color: '#DC2626', dot: '#EF4444' };
      case 'leadership': 
        return { bg: '#F5F5F5', color: '#525252', dot: '#737373' };
      default: 
        return { bg: '#F5F5F5', color: '#525252', dot: '#737373' };
    }
  };

  const styles = getTypeStyles(event.type);

  return (
    <div style={{
      padding: '16px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      display: 'flex',
      gap: '14px'
    }}>
      {/* Time indicator */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '50px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: styles.dot,
          marginBottom: '6px'
        }} />
        <span style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#888'
        }}>
          {event.time}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '6px'
        }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#1a1a1a',
            margin: 0
          }}>
            {event.title}
          </h4>
          <span style={{
            padding: '3px 8px',
            background: styles.bg,
            color: styles.color,
            fontSize: '10px',
            fontWeight: '600',
            borderRadius: '4px',
            textTransform: 'uppercase',
            letterSpacing: '0.3px',
            flexShrink: 0
          }}>
            {event.type}
          </span>
        </div>
        
        {event.location && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '12px',
            color: '#888',
            marginBottom: '4px'
          }}>
            <MapPin size={11} />
            {event.location}
          </div>
        )}
        
        {event.description && (
          <p style={{
            fontSize: '13px',
            color: '#666',
            margin: '8px 0 0 0',
            lineHeight: '1.5'
          }}>
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}
