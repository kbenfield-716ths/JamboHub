# JamboHub V2 - Modern Update

## What's New in This Version

### 🎨 Modern UI/UX
- **Noto Sans font** throughout (BSA brand compliance)
- **Mobile-first design** that actually works on phones
- **Bottom navigation** for easy thumb access
- **Clean, modern aesthetic** (no more early 2000s look!)
- **Smooth animations** and transitions
- **Better touch targets** for mobile

### 📱 Simplified Navigation
- **3-tab bottom nav**: Messages, Calendar, Info
- **Slide-out channel list** on Messages tab
- **No more top bar clutter** 
- **Hamburger menu** for channel switching
- **Works great on phones!**

### ✨ New Features
1. **Calendar Page**
   - Daily schedule view with day selector
   - Google Calendar integration ready
   - "Add to Calendar" functionality
   - Toggle between list and calendar view

2. **Info Page**
   - General contingent information
   - Emergency contacts (tap-to-call)
   - Key locations
   - What to bring checklist
   - Important guidelines
   - **Platypus & Fox branding** 🦆🦊

3. **Improved Components**
   - Better message cards
   - Cleaner channel list
   - Modern login screen
   - Responsive to all screen sizes

### 🦆 Platypus & Fox Branding
- Logo in top app bar (🦆🦊)
- Branded footer on Info page
- Consistent throughout app

## What You Need to Do

### 1. Replace Your Current Code

```bash
# In your JamboHub directory
cd ~/Projects/JamboHub

# Backup current version (optional)
cp -r . ../JamboHub-backup

# Remove old files (keep .git!)
rm -rf src/ public/ *.json *.js *.md index.html

# Extract new version
tar -xzf ~/Downloads/jamboree-v2.tar.gz --strip-components=1
```

### 2. Update vite.config.js Base Path

Make sure `vite.config.js` has the right base:

```javascript
base: process.env.NODE_ENV === 'production' ? '/JamboHub/' : '/',
```

### 3. Install & Test Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 and test:
- ✅ Login works
- ✅ Bottom navigation works
- ✅ Messages tab with channel sidebar
- ✅ Calendar tab shows
- ✅ Info tab shows
- ✅ Mobile responsive (resize browser)

### 4. Push to GitHub

```bash
git add .
git commit -m "v2: Modern UI with mobile-first design, calendar, and info pages"
git push
```

Wait 2-3 minutes and check: https://kbenfield-716ths.github.io/JamboHub/

## Setting Up Google Calendar

### Create the Calendar

1. Go to https://calendar.google.com
2. Click **+** next to "Other calendars"
3. Select **Create new calendar**
4. Name it: "VAHC Jamboree 2025"
5. Description: "Virginia Headwaters Council contingent schedule"
6. Click **Create calendar**

### Make it Public (Optional)

1. Find your calendar in the list
2. Click **⋮** → **Settings and sharing**
3. Scroll to "Access permissions"
4. Check **"Make available to public"**
5. Save

### Get the Calendar ID

1. In calendar settings, scroll to "Integrate calendar"
2. Copy the **Calendar ID** (looks like: `abc123@group.calendar.google.com`)

### Update the App

In `src/components/Calendar.jsx`, line 7, replace:
```javascript
const GOOGLE_CALENDAR_ID = 'your-calendar-id@group.calendar.google.com';
```

With your actual calendar ID:
```javascript
const GOOGLE_CALENDAR_ID = 'abc123@group.calendar.google.com';
```

Then push:
```bash
git add src/components/Calendar.jsx
git commit -m "Add Google Calendar integration"
git push
```

### Add Events to Calendar

Add your Jamboree schedule directly in Google Calendar:
- Opens Arena Show (July 20, 10 AM)
- Daily flag ceremonies
- Meal times
- Merit badge sessions
- Evening programs
- etc.

Everyone using the app will see these events!

## Customization Options

### Change Colors

In components, search for:
- `#CE1126` (BSA red) - change to your unit color
- `#003F87` (BSA blue) - change to your secondary color

### Update Platypus & Fox Logo

Replace `🦆🦊` emojis with your actual logo:
1. Add logo file to `public/platypus-fox-logo.png`
2. In `App.jsx`, replace line 62:
```javascript
<img src="/platypus-fox-logo.png" alt="Platypus & Fox" style={{ height: '32px' }} />
```

### Update Info Page Content

Edit `src/components/Info.jsx`:
- Change emergency numbers
- Update locations
- Modify what-to-bring list
- Add your specific guidelines

## Testing on Mobile

### iOS (iPhone/iPad)
1. Open https://kbenfield-716ths.github.io/JamboHub/ in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. App installs like a native app!

### Android
1. Open URL in Chrome
2. Tap menu → "Add to Home screen"
3. App installs!

Test all three tabs thoroughly on actual devices.

## Known Improvements

### Before → After

| Old | New |
|-----|-----|
| Desktop-only layout | Mobile-first design |
| Top navigation bar | Bottom navigation |
| Confusing menu | Clear 3-tab structure |
| System fonts | Noto Sans (BSA brand) |
| No calendar | Integrated calendar |
| No info page | Comprehensive info |
| Plain styling | Modern gradients & shadows |
| Hard to tap | Large touch targets |

## Feedback Collection

When showing this to other Scouters, ask:
1. Can you easily navigate on your phone?
2. Is the bottom nav intuitive?
3. Does the calendar view help?
4. Is the Info page useful?
5. Any features missing?
6. Performance on your device?

## Next Steps

After deploying this version:
- [ ] Share updated URL with leadership
- [ ] Set up Google Calendar
- [ ] Gather feedback on new design
- [ ] Customize colors/branding if needed
- [ ] Add actual contingent information to Info page
- [ ] Upload Platypus & Fox logo

## Troubleshooting

**Calendar not loading:**
- Check you entered the correct Calendar ID
- Make sure calendar is public
- Wait a few minutes for changes to propagate

**Bottom nav not showing:**
- Clear browser cache
- Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

**Looks weird on desktop:**
- It's mobile-first! Works best on phones
- Desktop still works, just optimized for mobile

## Version Info

- Version: 2.0.0
- Updated: December 2024
- Font: Noto Sans (Google Fonts)
- Framework: React + Vite
- Styling: Inline styles (no framework)
- New Components: Calendar, Info
- Improved: Login, App, Navigation

---

**Built by Platypus & Fox for VAHC Jamboree 2025** 🦆🦊
