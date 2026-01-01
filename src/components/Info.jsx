import React from 'react';
import { MapPin, Phone, AlertCircle, Users, Clock, Tent, Check, ChevronDown, ChevronUp } from 'lucide-react';
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
      background: '#FAFAFA'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '32px 20px',
        textAlign: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.04)'
      }}>
        <div style={{ 
          fontSize: '48px',
          marginBottom: '16px'
        }}>
          🏕️
        </div>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '700',
          margin: '0 0 8px 0',
          color: '#1a1a1a',
          letterSpacing: '-0.5px'
        }}>
          VAHC Contingent
        </h1>
        <p style={{
          fontSize: '13px',
          margin: 0,
          fontWeight: '500',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#888'
        }}>
          National Jamboree 2025
        </p>
      </div>

      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        
        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px'
        }}>
          <StatCard icon={<Users size={20} />} label="Units" value="3" />
          <StatCard icon={<Tent size={20} />} label="Campsite" value="7B" />
          <StatCard icon={<Clock size={20} />} label="Days" value="10" />
        </div>

        {/* Accordion Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          
          {/* Emergency Contacts */}
          <AccordionSection
            title="Emergency Contacts"
            icon={<Phone size={18} />}
            color="#DC2626"
            isOpen={expandedSection === 'emergency'}
            onToggle={() => toggleSection('emergency')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ContactRow label="Health Lodge" value={info.emergency.healthLodge} />
              <ContactRow label="Contingent Leader" value={info.emergency.contingentLeader} />
              <ContactRow label="Jamboree HQ" value={info.emergency.jamboreeHQ} />
              
              <div style={{
                marginTop: '8px',
                padding: '12px',
                background: '#FEF2F2',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#991B1B',
                lineHeight: '1.5'
              }}>
                <strong>Emergency:</strong> Contact your unit leader first. For medical emergencies, go to Health Lodge or call 911.
              </div>
            </div>
          </AccordionSection>

          {/* Key Locations */}
          <AccordionSection
            title="Key Locations"
            icon={<MapPin size={18} />}
            color="#2563EB"
            isOpen={expandedSection === 'locations'}
            onToggle={() => toggleSection('locations')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <LocationRow label="Our Campsite" value={info.locations.campsite} />
              <LocationRow label="Dining Hall" value={info.locations.diningHall} />
              <LocationRow label="Trading Post" value={info.locations.tradingPost} />
              <LocationRow label="Health Lodge" value={info.locations.healthLodge} />
            </div>
          </AccordionSection>

          {/* General Information */}
          <AccordionSection
            title="General Info"
            icon={<AlertCircle size={18} />}
            color="#7C3AED"
            isOpen={expandedSection === 'general'}
            onToggle={() => toggleSection('general')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <InfoRow label="Check-In" value="Sun, July 20 at 2:00 PM" />
              <InfoRow label="Check-Out" value="Wed, July 30 at 10:00 AM" />
              <InfoRow label="Meals" value="8am / 12pm / 6pm" />
              <InfoRow label="Quiet Hours" value="10:00 PM – 6:00 AM" />
              <InfoRow label="WiFi" value="Jamboree2025 (password at check-in)" />
            </div>
          </AccordionSection>

          {/* What to Bring */}
          <AccordionSection
            title="Packing List"
            icon={<Tent size={18} />}
            color="#059669"
            isOpen={expandedSection === 'packing'}
            onToggle={() => toggleSection('packing')}
          >
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px' 
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

          {/* Guidelines */}
          <AccordionSection
            title="YPT Guidelines"
            icon={<AlertCircle size={18} />}
            color="#DC2626"
            isOpen={expandedSection === 'guidelines'}
            onToggle={() => toggleSection('guidelines')}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <GuidelineRow text="Two-deep leadership at all times" />
              <GuidelineRow text="Buddy system is mandatory" />
              <GuidelineRow text="Check in with unit before leaving camp" />
              <GuidelineRow text="Follow all health and safety protocols" />
              <GuidelineRow text="Report incidents to leadership immediately" />
            </div>
          </AccordionSection>

        </div>

        {/* Footer */}
        <div style={{
          marginTop: '32px',
          padding: '24px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '11px',
            color: '#aaa',
            margin: 0,
            fontWeight: '500'
          }}>
            JamboHub • Built for Scouting
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div style={{
      background: 'white',
      padding: '16px',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
    }}>
      <div style={{ color: '#888', marginBottom: '8px' }}>
        {icon}
      </div>
      <div style={{
        fontSize: '20px',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '4px'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '11px',
        color: '#888',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.3px'
      }}>
        {label}
      </div>
    </div>
  );
}

function AccordionSection({ title, icon, color, isOpen, onToggle, children }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          padding: '16px 20px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color }}>{icon}</div>
          <span style={{
            fontSize: '15px',
            fontWeight: '600',
            color: '#1a1a1a'
          }}>
            {title}
          </span>
        </div>
        <div style={{ color: '#ccc' }}>
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      
      {isOpen && (
        <div style={{
          padding: '0 20px 20px',
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
      padding: '10px 0',
      borderBottom: '1px solid #F5F5F5'
    }}>
      <span style={{ fontSize: '13px', color: '#666' }}>{label}</span>
      <a 
        href={`tel:${value}`}
        style={{
          fontSize: '14px',
          color: '#1a1a1a',
          fontWeight: '600',
          textDecoration: 'none'
        }}
      >
        {value}
      </a>
    </div>
  );
}

function LocationRow({ label, value }) {
  return (
    <div style={{ padding: '8px 0', borderBottom: '1px solid #F5F5F5' }}>
      <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '500' }}>{value}</div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: '1px solid #F5F5F5'
    }}>
      <span style={{ fontSize: '13px', color: '#666' }}>{label}</span>
      <span style={{ fontSize: '13px', color: '#1a1a1a', fontWeight: '500' }}>{value}</span>
    </div>
  );
}

function CheckItem({ text }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      padding: '6px 0'
    }}>
      <div style={{
        width: '16px',
        height: '16px',
        borderRadius: '4px',
        background: '#ECFDF5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Check size={10} color="#059669" />
      </div>
      <span style={{ fontSize: '13px', color: '#555' }}>{text}</span>
    </div>
  );
}

function GuidelineRow({ text }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '6px 0'
    }}>
      <div style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#DC2626',
        marginTop: '6px',
        flexShrink: 0
      }} />
      <span style={{ fontSize: '13px', color: '#555', lineHeight: '1.5' }}>{text}</span>
    </div>
  );
}
