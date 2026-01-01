import React from 'react';
import { Calendar as CalendarIcon, ExternalLink, Clock, MapPin } from 'lucide-react';
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
      background: '#F8F7FC'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 16px',
        background: 'white',
        borderBottom: '2px solid #F3F4F6',
        flexShrink: 0
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#1F2937',
              margin: 0,
              letterSpacing: '-0.3px'
            }}>
              Jamboree 2025
            </h2>
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '4px 0 0 0',
              fontWeight: '500'
            }}>
              July 20 – 30
            </p>
          </div>
          
          <button
            onClick={() => setShowGoogleCalendar(!showGoogleCalendar)}
            style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#7C3AED',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CalendarIcon size={16} />
            {showGoogleCalendar ? 'List' : 'Calendar'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {showGoogleCalendar ? (
          <div style={{ height: '100%', padding: '16px', background: 'white' }}>
            <iframe
              src={GOOGLE_CALENDAR_EMBED}
              style={{
                border: 'none',
                width: '100%',
                height: 'calc(100% - 60px)',
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.1)'
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
                  gap: '8px',
                  color: '#7C3AED',
                  textDecoration: 'none',
                  fontSize: '15px',
                  fontWeight: '600'
                }}
              >
                Add to your calendar
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ) : (
          <div style={{ height: '100%', overflowY: 'auto' }}>
            <div style={{ padding: '16px' }}>
              
              {/* Day Selector - Scrollable Pills */}
              <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '20px',
                overflowX: 'auto',
                padding: '4px 0 8px',
                WebkitOverflowScrolling: 'touch'
              }}>
                {days.map(({ day, date }) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    style={{
                      minWidth: '64px',
                      padding: '14px 10px',
                      background: selectedDay === day 
                        ? 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)' 
                        : 'white',
                      color: selectedDay === day ? 'white' : '#6B7280',
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '14px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      flexShrink: 0,
                      boxShadow: selectedDay === day 
                        ? '0 8px 20px rgba(124, 58, 237, 0.3)' 
                        : '0 2px 8px rgba(0,0,0,0.06)'
                    }}
                  >
                    <div style={{ 
                      fontSize: '11px', 
                      opacity: selectedDay === day ? 0.9 : 0.7, 
                      marginBottom: '4px',
                      fontWeight: '600'
                    }}>
                      {date}
                    </div>
                    <div style={{ fontSize: '20px' }}>{day}</div>
                  </button>
                ))}
              </div>

              {/* Selected Day Header */}
              <div style={{
                marginBottom: '16px',
                padding: '18px 20px',
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1F2937',
                  margin: 0
                }}>
                  📅 {days[selectedDay - 1]?.fullDate} — Day {selectedDay}
                </h3>
              </div>

              {/* Events */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {schedule.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {/* Subscribe CTA */}
              <div style={{
                marginTop: '24px',
                padding: '28px 20px',
                background: 'white',
                borderRadius: '20px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <CalendarIcon size={28} color="#7C3AED" />
                </div>
                <h4 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1F2937',
                  margin: '0 0 8px 0'
                }}>
                  Stay Updated
                </h4>
                <p style={{
                  fontSize: '15px',
                  color: '#6B7280',
                  margin: '0 0 20px 0',
                  lineHeight: '1.5'
                }}>
                  Subscribe for automatic schedule updates
                </p>
                <button
                  onClick={() => setShowGoogleCalendar(true)}
                  style={{
                    padding: '14px 24px',
                    background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '14px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 8px 20px rgba(124, 58, 237, 0.3)'
                  }}
                >
                  <CalendarIcon size={18} />
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
        return { bg: '#ECFDF5', color: '#059669', accent: '#10B981' };
      case 'activity': 
        return { bg: '#EFF6FF', color: '#2563EB', accent: '#3B82F6' };
      case 'event': 
        return { bg: '#FEF2F2', color: '#DC2626', accent: '#EF4444' };
      case 'leadership': 
        return { bg: '#EDE9FE', color: '#7C3AED', accent: '#A855F7' };
      default: 
        return { bg: '#F3F4F6', color: '#525252', accent: '#737373' };
    }
  };

  const styles = getTypeStyles(event.type);

  return (
    <div style={{
      padding: '18px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex',
      gap: '16px',
      borderLeft: `4px solid ${styles.accent}`
    }}>
      {/* Time */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '60px'
      }}>
        <div style={{
          width: '10px',
          height: '10px',
          borderRadius: '50%',
          background: styles.accent,
          marginBottom: '8px',
          boxShadow: `0 2px 8px ${styles.accent}40`
        }} />
        <span style={{
          fontSize: '14px',
          fontWeight: '700',
          color: '#6B7280'
        }}>
          {event.time}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '8px'
        }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#1F2937',
            margin: 0,
            lineHeight: '1.3'
          }}>
            {event.title}
          </h4>
          <span style={{
            padding: '4px 10px',
            background: styles.bg,
            color: styles.color,
            fontSize: '11px',
            fontWeight: '700',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            flexShrink: 0
          }}>
            {event.type}
          </span>
        </div>
        
        {event.location && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            color: '#6B7280',
            marginBottom: '6px'
          }}>
            <MapPin size={14} />
            {event.location}
          </div>
        )}
        
        {event.description && (
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '10px 0 0 0',
            lineHeight: '1.5'
          }}>
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}
