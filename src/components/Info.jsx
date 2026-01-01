import React from 'react';
import { MapPin, Phone, Info as InfoIcon, Users, Calendar, Tent } from 'lucide-react';
import { info } from '../data/mockData';

export default function Info() {
  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: '#F9FAFB'
    }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #003F87 0%, #CE1126 100%)',
        padding: '32px 20px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '48px',
          marginBottom: '16px'
        }}>
          🏕️
        </div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          margin: '0 0 8px 0',
          letterSpacing: '-0.5px'
        }}>
          VAHC Contingent
        </h1>
        <p style={{
          fontSize: '16px',
          margin: 0,
          opacity: 0.95,
          fontWeight: '500'
        }}>
          National Jamboree 2025
        </p>
      </div>

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        
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

        {/* Powered By */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          textAlign: 'center',
          borderTop: '1px solid #E5E7EB'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#6B7280',
            margin: '0 0 8px 0',
            fontWeight: '500'
          }}>
            Powered by
          </p>
          <div style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#111827',
            letterSpacing: '-0.5px'
          }}>
            🦆 Platypus & Fox
          </div>
          <p style={{
            fontSize: '11px',
            color: '#9CA3AF',
            margin: '4px 0 0 0'
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
      padding: '16px',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ color: '#CE1126', marginBottom: '8px' }}>
        {icon}
      </div>
      <div style={{
        fontSize: '20px',
        fontWeight: '700',
        color: '#111827',
        marginBottom: '4px'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '12px',
        color: '#6B7280',
        fontWeight: '500'
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
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '2px solid #F3F4F6'
      }}>
        <div style={{ color }}>{icon}</div>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#111827',
          margin: 0
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
      padding: '12px 0',
      borderBottom: '1px solid #F3F4F6'
    }}>
      <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>
        {label}
      </span>
      <a 
        href={`tel:${value}`}
        style={{
          fontSize: '16px',
          color: '#CE1126',
          fontWeight: '600',
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
      padding: '12px 0',
      borderBottom: '1px solid #F3F4F6'
    }}>
      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px', fontWeight: '500' }}>
        {label}
      </div>
      <div style={{ fontSize: '15px', color: '#111827', fontWeight: '600' }}>
        {value}
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div style={{
      padding: '12px 0',
      borderBottom: '1px solid #F3F4F6'
    }}>
      <div style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px', fontWeight: '500' }}>
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
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
      <span style={{ color: '#059669', fontSize: '16px' }}>✓</span>
      <span>{text}</span>
    </div>
  );
}

function GuidelineItem({ text }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      padding: '8px 0'
    }}>
      <span style={{ color: '#DC2626', fontSize: '16px' }}>•</span>
      <span style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
        {text}
      </span>
    </div>
  );
}
