import React from 'react';
import { MapPin, Phone, AlertCircle, Users, Clock, Tent, Check, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { info } from '../data/mockData';

export default function Info() {
  const [expandedSection, setExpandedSection] = React.useState('emergency');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      background: '#F8F7FC'
    }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '64px',
          marginBottom: '16px'
        }}>
          🏕️
        </div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '800',
          margin: '0 0 8px 0',
          color: 'white',
          letterSpacing: '-0.5px'
        }}>
          VAHC Contingent
        </h1>
        <p style={{
          fontSize: '14px',
          margin: 0,
          fontWeight: '600',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.9)'
        }}>
          National Jamboree 2025
        </p>
      </div>

      <div style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Quick Stats - Colorful Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px',
          marginTop: '-40px'
        }}>
          <StatCard icon="👥" label="Units" value="3" color="#06B6D4" />
          <StatCard icon="⛺" label="Campsite" value="7B" color="#10B981" />
          <StatCard icon="📅" label="Days" value="10" color="#F59E0B" />
        </div>

        {/* Accordion Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Emergency Contacts */}
          <AccordionSection
            title="Emergency Contacts"
            icon={<Phone size={20} />}
            emoji="🚨"
            color="#DC2626"
            isOpen={expandedSection === 'emergency'}
            onToggle={() => toggleSection('emergency')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ContactRow label="Health Lodge" value={info.emergency.healthLodge} />
              <ContactRow label="Contingent Leader" value={info.emergency.contingentLeader} />
              <ContactRow label="Jamboree HQ" value={info.emergency.jamboreeHQ} />
              
              <div style={{
                marginTop: '12px',
                padding: '16px',
                background: 'linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%)',
                borderRadius: '14px',
                fontSize: '14px',
                color: '#991B1B',
                lineHeight: '1.6'
              }}>
                <strong>🆘 Emergency:</strong> Contact your unit leader first. For medical emergencies, go to Health Lodge or call 911.
              </div>
            </div>
          </AccordionSection>

          {/* Key Locations */}
          <AccordionSection
            title="Key Locations"
            icon={<MapPin size={20} />}
            emoji="📍"
            color="#2563EB"
            isOpen={expandedSection === 'locations'}
            onToggle={() => toggleSection('locations')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <LocationRow label="Our Campsite" value={info.locations.campsite} emoji="🏕️" />
              <LocationRow label="Dining Hall" value={info.locations.diningHall} emoji="🍽️" />
              <LocationRow label="Trading Post" value={info.locations.tradingPost} emoji="🛒" />
              <LocationRow label="Health Lodge" value={info.locations.healthLodge} emoji="🏥" />
            </div>
          </AccordionSection>

          {/* General Information */}
          <AccordionSection
            title="General Info"
            icon={<AlertCircle size={20} />}
            emoji="ℹ️"
            color="#7C3AED"
            isOpen={expandedSection === 'general'}
            onToggle={() => toggleSection('general')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <InfoRow label="Check-In" value="Sun, July 20 at 2:00 PM" emoji="📥" />
              <InfoRow label="Check-Out" value="Wed, July 30 at 10:00 AM" emoji="📤" />
              <InfoRow label="Meals" value="8am • 12pm • 6pm" emoji="🍽️" />
              <InfoRow label="Quiet Hours" value="10:00 PM – 6:00 AM" emoji="🌙" />
              <InfoRow label="WiFi" value="Jamboree2025" emoji="📶" />
            </div>
          </AccordionSection>

          {/* What to Bring */}
          <AccordionSection
            title="Packing List"
            icon={<Tent size={20} />}
            emoji="🎒"
            color="#059669"
            isOpen={expandedSection === 'packing'}
            onToggle={() => toggleSection('packing')}
          >
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px' 
            }}>
              <CheckItem text="Class A & B uniforms" />
              <CheckItem text="Rain gear" />
              <CheckItem text="Extra socks" />
              <CheckItem text="Sunscreen" />
              <CheckItem text="Bug spray" />
              <CheckItem text="Water bottle" />
              <CheckItem text="Medications" />
              <CheckItem text="Flashlight" />
              <CheckItem text="Handbook & pen" />
              <CheckItem text="Cash" />
            </div>
          </AccordionSection>

          {/* YPT Guidelines */}
          <AccordionSection
            title="YPT Guidelines"
            icon={<Shield size={20} />}
            emoji="🛡️"
            color="#DC2626"
            isOpen={expandedSection === 'guidelines'}
            onToggle={() => toggleSection('guidelines')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <GuidelineRow text="Two-deep leadership at all times" />
              <GuidelineRow text="Buddy system is mandatory" />
              <GuidelineRow text="Check in with unit before leaving camp" />
              <GuidelineRow text="Follow all health and safety protocols" />
              <GuidelineRow text="Report incidents to leadership immediately" />
              <GuidelineRow text="No one-on-one contact between adults and youth" />
            </div>
          </AccordionSection>

        </div>

        {/* Footer */}
        <div style={{
          marginTop: '32px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '13px',
            color: '#9CA3AF',
            fontWeight: '600'
          }}>
            JamboHub • Ready for Adventure
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      background: 'white',
      padding: '20px 12px',
      borderRadius: '20px',
      textAlign: 'center',
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
    }}>
      <div style={{ 
        fontSize: '28px',
        marginBottom: '8px'
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: '24px',
        fontWeight: '800',
        color: color,
        marginBottom: '4px'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '12px',
        color: '#6B7280',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {label}
      </div>
    </div>
  );
}

function AccordionSection({ title, icon, emoji, color, isOpen, onToggle, children }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '18px 20px',
          background: isOpen ? `${color}10` : 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          transition: 'background 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '24px' }}>{emoji}</span>
          <span style={{
            fontSize: '17px',
            fontWeight: '700',
            color: '#1F2937'
          }}>
            {title}
          </span>
        </div>
        <div style={{ 
          color: color,
          background: `${color}15`,
          padding: '8px',
          borderRadius: '10px'
        }}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      
      {isOpen && (
        <div style={{
          padding: '0 20px 24px',
          animation: 'fadeIn 0.2s ease'
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

function ContactRow({ label, value }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 0',
      borderBottom: '2px solid #F3F4F6'
    }}>
      <span style={{ fontSize: '15px', color: '#6B7280', fontWeight: '600' }}>{label}</span>
      <a 
        href={`tel:${value}`}
        style={{
          fontSize: '16px',
          color: '#7C3AED',
          fontWeight: '700',
          textDecoration: 'none'
        }}
      >
        {value}
      </a>
    </div>
  );
}

function LocationRow({ label, value, emoji }) {
  return (
    <div style={{ 
      padding: '14px 16px', 
      background: '#F8F7FC',
      borderRadius: '12px'
    }}>
      <div style={{ 
        fontSize: '13px', 
        color: '#6B7280', 
        marginBottom: '6px',
        fontWeight: '600'
      }}>
        {emoji} {label}
      </div>
      <div style={{ 
        fontSize: '16px', 
        color: '#1F2937', 
        fontWeight: '700' 
      }}>
        {value}
      </div>
    </div>
  );
}

function InfoRow({ label, value, emoji }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 0',
      borderBottom: '2px solid #F3F4F6'
    }}>
      <span style={{ 
        fontSize: '15px', 
        color: '#6B7280',
        fontWeight: '600'
      }}>
        {emoji} {label}
      </span>
      <span style={{ 
        fontSize: '15px', 
        color: '#1F2937', 
        fontWeight: '700' 
      }}>
        {value}
      </span>
    </div>
  );
}

function CheckItem({ text }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px',
      padding: '10px 12px',
      background: '#ECFDF5',
      borderRadius: '10px'
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '6px',
        background: '#10B981',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Check size={12} color="white" strokeWidth={3} />
      </div>
      <span style={{ fontSize: '14px', color: '#065F46', fontWeight: '600' }}>{text}</span>
    </div>
  );
}

function GuidelineRow({ text }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '12px 14px',
      background: '#FEF2F2',
      borderRadius: '12px'
    }}>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        background: '#DC2626',
        marginTop: '6px',
        flexShrink: 0
      }} />
      <span style={{ fontSize: '15px', color: '#991B1B', lineHeight: '1.5', fontWeight: '600' }}>{text}</span>
    </div>
  );
}
