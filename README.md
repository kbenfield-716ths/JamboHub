# VAHC Jamboree Hub - MVP Demo

A minimal viable product demonstrating a YPT-compliant communication and coordination hub for the Virginia Headwaters Council contingent at Jamboree 2025.

## What This Demo Shows

This MVP demonstrates:

1. **YPT-Compliant Communication**: Role-based access control ensuring Youth Protection Training compliance
   - Two-deep leadership monitoring on all youth-accessible channels
   - No private youth-adult direct messaging
   - Read-only access for parents to their Scout's unit channels
   - Age-gated leadership channels

2. **Multi-Channel Architecture**: Different communication spaces for different needs
   - Contingent-wide announcements
   - Unit-specific channels
   - Adult leadership coordination
   - Family updates

3. **Progressive Web App (PWA)**: Can be installed on any device
   - Works on phones, tablets, and computers
   - Installable like a native app
   - Designed for offline capability (not implemented in MVP)

4. **Daily Schedule & Information**: Centralized hub for activities
   - Daily schedule with categorized events
   - Weather information
   - Emergency contacts
   - Key locations

## Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The app will open at http://localhost:3000
```

### Testing Different User Roles

The MVP includes demo users representing different roles:

**Adult Leaders:**
- Kyle Haines (Crew 22) - Can access all channels, post anywhere
- Sarah Thompson (Troop 3125) - Can access most channels
- Mike Chen (Troop 114) - Adult leader access

**Youth:**
- Liam H. (Crew 22) - Can access public and Crew 22 channels
- Alex M. (Troop 3125) - Can access public and Troop 3125 channels

**Parents:**
- Parent of Liam (Crew 22) - Read-only access to contingent news and Crew 22

**Try logging in as different users to see how channel visibility and posting permissions change.**

## Architecture Notes

### Current MVP Implementation

The MVP uses **mock data** stored in `src/data/mockData.js`. Messages aren't actually sent - they're simulated with alerts. This allows you to demonstrate the concept without backend infrastructure.

**What's Included:**
- ✅ User authentication with role-based access
- ✅ Channel organization and visibility rules
- ✅ YPT compliance checking and warnings
- ✅ Message viewing with proper permissions
- ✅ Daily schedule with activities
- ✅ Weather and emergency contact information
- ✅ Responsive design for mobile and desktop
- ✅ PWA manifest for installability

**What's Deferred:**
- 🔄 Real backend (Zulip or custom)
- 🔄 Actual message persistence
- 🔄 Real-time updates
- 🔄 Photo sharing
- 🔄 Merit badge tracking
- 🔄 Offline caching
- 🔄 Push notifications

### Next Steps for Production

When you're ready to build the production version, the architecture would be:

```
┌─────────────────────────────────────────┐
│  PWA (React/Vite) - This Frontend       │
├─────────────────────────────────────────┤
│  API Layer (FastAPI)                    │
│  - Authentication                       │
│  - YPT validation                       │
│  - Custom services                      │
├─────────────────────────────────────────┤
│  Zulip (on Fly.io)                      │
│  - Core messaging                       │
│  - Stream management                    │
│  - User management                      │
├─────────────────────────────────────────┤
│  PostgreSQL (Fly.io)                    │
│  - User data                            │
│  - Schedule data                        │
│  - Emergency contacts                   │
└─────────────────────────────────────────┘
```

## Sharing with Other Leaders

### Option 1: Share the Code
1. Zip this directory
2. Send to other leaders with Node.js installed
3. They run `npm install && npm run dev`

### Option 2: Deploy to a Test Server
Deploy to Netlify, Vercel, or Fly.io for easy access:

```bash
# Build for production
npm run build

# Deploy the 'dist' folder to your hosting service
```

### Option 3: Screen Recording
Record a walkthrough video showing:
- Login as different user types
- Channel access differences
- Message viewing/posting permissions
- Schedule functionality
- YPT compliance features

## Feedback Questions for Other Leaders

When sharing with other adult leaders, ask:

1. **User Experience**
   - Is the interface intuitive?
   - Would Scouts be able to use this easily?
   - What's confusing or unclear?

2. **YPT Compliance**
   - Does the two-deep leadership model feel sufficient?
   - Are there any YPT concerns we're missing?
   - Should parents have more/less access?

3. **Features**
   - What's missing that would be essential?
   - What features would be nice-to-have?
   - Is the schedule view useful?

4. **Logistics**
   - How should we handle onboarding 100+ users?
   - Who should manage channel moderation?
   - How do we handle emergency communications?

5. **Technical**
   - Are they comfortable with a PWA vs native app?
   - Any concerns about WiFi reliability?
   - Thoughts on using Zulip vs building custom?

## Project Structure

```
jamboree-hub/
├── public/
│   └── manifest.json          # PWA manifest
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Authentication
│   │   ├── ChannelList.jsx    # Channel sidebar
│   │   ├── MessageView.jsx    # Message display
│   │   └── Schedule.jsx       # Daily schedule
│   ├── data/
│   │   └── mockData.js        # Demo data
│   ├── lib/
│   │   └── auth.js            # YPT rules & permissions
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Technology Stack

- **React 18**: UI framework
- **Vite**: Fast build tool and dev server
- **Lucide React**: Icon library
- **Vanilla CSS**: No framework, just inline styles for simplicity

## License & Notes

This is a demonstration project for VAHC Jamboree 2025 planning. Not for production use without proper backend implementation and security review.

## Contact

Built by Kyle Haines for VAHC Jamboree 2025 planning.
