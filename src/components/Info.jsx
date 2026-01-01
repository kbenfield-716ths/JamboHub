import React from 'react';
import { MapPin, Phone, Info as InfoIcon, Users, Calendar, Tent } from 'lucide-react';
import { info } from '../data/mockData';

export default function Info() {
  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: 'linear-gradient(180deg, #F9FAFB 0%, #FAFBFC 100%)'
    }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #CE1126 0%, #FF6B35 100%)',
        padding: '48px 20px',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 4px 20px rgba(206, 17, 38, 0.2)'
      }}>
        <div style={{ 
          fontSize: '72px',
          marginBottom: '20px',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))',
          animation: 'float 3s ease-in-out infinite'
        }}>
          🏕️
        </div>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '800',
          margin: '0 0 12px 0',
          letterSpacing: '-1px',
          textShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          VAHC Contingent
        </h1>
        <p style={{
          fontSize: '16px',
          margin: 0,
          fontWeight: '600',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          opacity: 0.95
        }}>
          National Jamboree 2025
        </p>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <StatCard icon={<Users size={24} />} label="Units" value="3" />
          <StatCard icon={<Tent size={24} />} label="Campsite" value="Area 7B" />
          <StatCard icon={<Calendar size={24} />} label="Duration" value="10 Days" />
        </div>

        {/* Emergency Contacts */}
        <InfoSection
          title="Emergency Contacts"
          icon={<Phone size={20} />}
          color="#DC2626"
        >
          <ContactItem label="Health Lodge" value={info.emergency.healthLodge} />
          <ContactItem label="Contingent Leader" value={info.emergency.contingentLeader} />
          <ContactItem label="Jamboree HQ" value={info.emergency.jamboreeHQ} />
          <div style={{
            marginTop: '12px',
            padding: '12px',
            background: '#FEF2F2',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#991B1B',
            lineHeight: '1.6'
          }}>
            <strong>In case of emergency:</strong> Contact your unit leader first. 
            For medical emergencies, go directly to the Health Lodge or call 911.
          </div>
        </InfoSection>

        {/* Key Locations */}
        <InfoSection
          title="Key Locations"
          icon={<MapPin size={20} />}
          color="#2563EB"
        >
          <LocationItem label="Our Campsite" value={info.locations.campsite} />
          <LocationItem label="Dining Hall" value={info.locations.diningHall} />
          <LocationItem label="Trading Post" value={info.locations.tradingPost} />
          <LocationItem label="Health Lodge" value={info.locations.healthLodge} />
        </InfoSection>

        {/* General Information */}
        <InfoSection
          title="General Information"
          icon={<InfoIcon size={20} />}
          color="#7C3AED"
        >
          <InfoItem
            label="Check-In Time"
            value="Sunday, July 20, 2025 - 2:00 PM"
          />
          <InfoItem
            label="Check-Out Time"
            value="Wednesday, July 30, 2025 - 10:00 AM"
          />
          <InfoItem
            label="Meal Times"
            value="Breakfast: 8:00 AM | Lunch: 12:00 PM | Dinner: 6:00 PM"
          />
          <InfoItem
            label="Quiet Hours"
            value="10:00 PM - 6:00 AM"
          />
          <InfoItem
            label="WiFi Network"
            value="Jamboree2025 (password will be provided at check-in)"
          />
        </InfoSection>

        {/* What to Bring */}
        <InfoSection
          title="What to Bring"
          icon={<Tent size={20} />}
          color="#059669"
        >
          <div style={{
            display: 'grid',
            gap: '8px',
            fontSize: '14px',
            color: '#374151'
          }}>
            <CheckItem text="Class A and Class B uniforms" />
            <CheckItem text="Rain gear and extra socks" />
            <CheckItem text="Sunscreen and bug spray" />
            <CheckItem text="Water bottle (refill stations available)" />
            <CheckItem text="Personal medications" />
            <CheckItem text="Flashlight or headlamp" />
            <CheckItem text="Scout handbook and pen" />
            <CheckItem text="Camera or smartphone" />
            <CheckItem text="Cash for trading post (no ATMs on site)" />
          </div>
        </InfoSection>

        {/* Rules & Guidelines */}
        <InfoSection
          title="Important Guidelines"
          icon={<InfoIcon size={20} />}
          color="#DC2626"
        >
          <GuidelineItem text="Youth Protection: Two-deep leadership at all times" />
          <GuidelineItem text="Buddy system is mandatory for all activities" />
          <GuidelineItem text="Check in with your unit before leaving camp" />
          <GuidelineItem text="Respect other units and Jamboree property" />
          <GuidelineItem text="Follow all health and safety protocols" />
          <GuidelineItem text="Report any incidents to leadership immediately" />
        </InfoSection>

        {/* Powered By with Logo */}
        <div style={{
          marginTop: '48px',
          padding: '40px 20px',
          textAlign: 'center',
          borderTop: '2px solid #E5E7EB',
          background: 'linear-gradient(135deg, #FAFBFC 0%, #F3F4F6 100%)'
        }}>
          <p style={{
            fontSize: '11px',
            color: '#9CA3AF',
            margin: '0 0 16px 0',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1.5px'
          }}>
            Powered by
          </p>
          <img 
            src="/platypus-fox-logo.png" 
            alt="Platypus & Fox" 
            style={{ 
              height: '48px',
              marginBottom: '12px',
              animation: 'float 3s ease-in-out infinite'
            }} 
          />
          <p style={{
            fontSize: '13px',
            color: '#6B7280',
            margin: 0,
            fontStyle: 'italic'
          }}>
            Building tools for Scouting excellence
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ icon, label, value }) {
  return (
    <div style={{
      background: 'white',
      padding: '24px',
      borderRadius: '16px',
      textAlign: 'center',
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      border: '1px solid #E5E7EB'
    }}>
      <div style={{ color: '#CE1126', marginBottom: '12px' }}>
        {icon}
      </div>
      <div style={{
        fontSize: '28px',
        fontWeight: '800',
        color: '#111827',
        marginBottom: '6px'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '12px',
        color: '#6B7280',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {label}
      </div>
    </div>
  );
}

function InfoSection({ title, icon, color, children }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      marginBottom: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
      border: '1px solid #E5E7EB'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '2px solid #F3F4F6'
      }}>
        <div style={{ color }}>{icon}</div>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '800',
          color: '#111827',
          margin: 0,
          letterSpacing: '-0.3px'
        }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function ContactItem({ label, value }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 0',
      borderBottom: '1px solid #F3F4F6'
    }}>
      <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '600' }}>
        {label}
      </span>
      <a 
        href={`tel:${value}`}
        style={{
          fontSize: '16px',
          color: '#CE1126',
          fontWeight: '700',
          textDecoration: 'none'
        }}
      >
        {value}
      </a>
    </div>
  );
}

function LocationItem({ label, value }) {
  return (
    <div style={{
      padding: '14px 0',
      borderBottom: '1px solid #F3F4F6'
    }}>
      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '6px', fontWeight: '600' }}>
        {label}
      </div>
      <div style={{ fontSize: '16px', color: '#111827', fontWeight: '700' }}>
        {value}
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div style={{
      padding: '14px 0',
      borderBottom: '1px solid #F3F4F6'
    }}>
      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '6px', fontWeight: '600' }}>
        {label}
      </div>
      <div style={{ fontSize: '14px', color: '#111827' }}>
        {value}
      </div>
    </div>
  );
}

function CheckItem({ text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
      <span style={{ color: '#10B981', fontSize: '18px' }}>✓</span>
      <span style={{ color: '#374151', fontSize: '14px' }}>{text}</span>
    </div>
  );
}

function GuidelineItem({ text }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '10px 0'
    }}>
      <span style={{ color: '#EF4444', fontSize: '16px' }}>•</span>
      <span style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
        {text}
      </span>
    </div>
  );
}
