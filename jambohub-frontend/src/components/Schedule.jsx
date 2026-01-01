import React from 'react';
import { schedule, info } from '../data/mockData';
import { Clock, MapPin, Phone } from 'lucide-react';

export default function Schedule() {
  const getTypeColor = (type) => {
    switch(type) {
      case 'meal': return '#10B981';
      case 'activity': return '#3B82F6';
      case 'event': return '#CE1126';
      case 'leadership': return '#6B7280';
      default: return '#374151';
    }
  };

  const getTypeLabel = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: 'white'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px',
        borderBottom: '2px solid #E5E7EB',
        background: 'linear-gradient(135deg, #003F87 0%, #CE1126 100%)',
        color: 'white'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: '700',
          margin: '0 0 8px 0'
        }}>
          Daily Schedule
        </h2>
        <p style={{
          fontSize: '14px',
          margin: 0,
          opacity: 0.9
        }}>
          Day 1 - Sunday, July 20, 2025
        </p>
      </div>

      {/* Weather Widget */}
      <div style={{
        padding: '16px 24px',
        background: '#EFF6FF',
        borderBottom: '1px solid #DBEAFE'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '32px' }}>{info.weather.current.icon}</span>
          <div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#1E40AF' }}>
              {info.weather.current.temp}°F
            </div>
            <div style={{ fontSize: '14px', color: '#3B82F6' }}>
              {info.weather.current.condition}
            </div>
          </div>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '16px', 
          marginTop: '12px',
          fontSize: '12px',
          color: '#1E40AF'
        }}>
          {info.weather.forecast.map((day, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: '600' }}>{day.day}</div>
              <div style={{ fontSize: '18px', margin: '4px 0' }}>{day.icon}</div>
              <div>{day.high}°/{day.low}°</div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div style={{
        padding: '16px 24px',
        background: '#FEF3C7',
        borderBottom: '1px solid #FDE68A'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '8px',
          color: '#92400E',
          fontWeight: '600',
          fontSize: '14px'
        }}>
          <Phone size={16} />
          Emergency Contacts
        </div>
        <div style={{ fontSize: '13px', color: '#78350F', lineHeight: '1.8' }}>
          <div>Health Lodge: {info.emergency.healthLodge}</div>
          <div>Contingent Leader: {info.emergency.contingentLeader}</div>
          <div>Jamboree HQ: {info.emergency.jamboreeHQ}</div>
        </div>
      </div>

      {/* Schedule Items */}
      <div style={{ padding: '16px 24px' }}>
        {schedule.map((item, index) => (
          <div 
            key={item.id}
            style={{
              marginBottom: '16px',
              padding: '16px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              background: 'white',
              position: 'relative'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              padding: '4px 8px',
              background: getTypeColor(item.type),
              color: 'white',
              fontSize: '10px',
              fontWeight: '600',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {getTypeLabel(item.type)}
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '8px',
              color: '#6B7280',
              fontSize: '13px',
              fontWeight: '600'
            }}>
              <Clock size={16} />
              {item.time}
            </div>

            <h3 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#111827',
              margin: '0 0 4px 0'
            }}>
              {item.title}
            </h3>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              color: '#6B7280',
              fontSize: '13px',
              marginBottom: item.description ? '8px' : 0
            }}>
              <MapPin size={14} />
              {item.location}
            </div>

            {item.description && (
              <p style={{
                margin: 0,
                fontSize: '13px',
                color: '#4B5563',
                lineHeight: '1.5'
              }}>
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Key Locations */}
      <div style={{
        padding: '24px',
        background: '#F9FAFB',
        borderTop: '1px solid #E5E7EB'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#111827',
          margin: '0 0 12px 0'
        }}>
          Key Locations
        </h3>
        <div style={{ fontSize: '13px', color: '#4B5563', lineHeight: '1.8' }}>
          <div><strong>Campsite:</strong> {info.locations.campsite}</div>
          <div><strong>Dining Hall:</strong> {info.locations.diningHall}</div>
          <div><strong>Trading Post:</strong> {info.locations.tradingPost}</div>
          <div><strong>Health Lodge:</strong> {info.locations.healthLodge}</div>
        </div>
      </div>
    </div>
  );
}
