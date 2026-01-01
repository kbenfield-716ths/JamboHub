# JamboHub 🏕️

Communication platform for Scout Jamboree contingents. YPT-compliant messaging with role-based access control and email notifications.

## Quick Start - Deploy to Fly.io

### Prerequisites

1. Install Fly CLI: `brew install flyctl`
2. Login: `fly auth login`
3. Install Node.js 18+

### First-Time Setup

```bash
# 1. Create the Fly app
cd jambohub-backend
fly apps create jambohub

# 2. Create persistent volume for database
fly volumes create jambohub_data --region iad --size 1

# 3. Set secrets (REQUIRED)
fly secrets set JWT_SECRET="$(openssl rand -hex 32)"
fly secrets set GMAIL_USER="your-gmail@gmail.com"
fly secrets set GMAIL_APP_PASSWORD="your-app-password"
```

### Deploy

```bash
# Build frontend and deploy
cd jambohub-frontend
npm install
npm run build
cp -r dist/* ../jambohub-backend/static/

cd ../jambohub-backend
fly deploy
```

Or use the deploy script:
```bash
chmod +x deploy.sh
./deploy.sh
```

### Access

- **URL**: https://jambohub.fly.dev
- **Default login**: admin@jambohub.org / Jambo2026!

---

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  React Frontend │────▶│  Flask Backend   │────▶│   SQLite    │
│  (Vite + React) │     │  (REST API)      │     │  (Fly Vol)  │
└─────────────────┘     └────────┬─────────┘     └─────────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │   Gmail SMTP     │
                        │  (Notifications) │
                        └──────────────────┘
```

## Project Structure

```
jambohub/
├── jambohub-frontend/       # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── lib/api.js       # API client
│   │   ├── App.jsx          # Main app
│   │   └── index.css        # Styles
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── jambohub-backend/        # Flask backend
│   ├── backend/
│   │   ├── app.py           # Flask routes
│   │   ├── models.py        # SQLAlchemy models
│   │   ├── auth.py          # JWT + bcrypt
│   │   └── email_service.py # Gmail notifications
│   ├── static/              # Built frontend (after npm build)
│   ├── Dockerfile
│   ├── fly.toml
│   └── requirements.txt
│
└── deploy.sh                # Deploy script
```

## Features

### Messaging
- Real-time message polling (10s intervals)
- Channel-based communication
- Message pinning for important announcements
- Role-based posting permissions

### User Management
- Email/password authentication with JWT
- Role-based access control (Admin, Adult, Youth, Parent)
- Unit-based channel filtering
- Admin panel for user CRUD

### Notifications
- Email notifications when messages are posted
- Per-user notification preferences
- Bell icon toggle in header

### YPT Compliance
- All messages visible to leadership
- Role-based channel access
- Unit-based communication isolation
- No private DMs between adults and youth

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/change-password` | Change password |
| GET | `/api/channels` | List accessible channels |
| GET | `/api/channels/:id/messages` | Get channel messages |
| POST | `/api/channels/:id/messages` | Post new message |
| POST | `/api/messages/:id/pin` | Toggle pin status |
| GET | `/api/admin/users` | List all users (admin) |
| POST | `/api/admin/users` | Create user (admin) |
| PUT | `/api/admin/users/:id` | Update user (admin) |
| DELETE | `/api/admin/users/:id` | Delete user (admin) |
| POST | `/api/admin/users/:id/reset-password` | Reset password (admin) |
| PUT | `/api/settings/notifications` | Update notification prefs |

## Gmail Setup for Notifications

1. Create a Gmail account for JamboHub
2. Enable 2-Factor Authentication
3. Go to Google Account → Security → App Passwords
4. Generate a new App Password for "Mail"
5. Set the secret in Fly.io:
   ```bash
   fly secrets set GMAIL_USER="yourjambohub@gmail.com"
   fly secrets set GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
   ```

## Local Development

### Backend
```bash
cd jambohub-backend
pip install -r requirements.txt
python -m backend.app
# Runs on http://localhost:8080
```

### Frontend
```bash
cd jambohub-frontend
npm install
npm run dev
# Runs on http://localhost:5173 with API proxy
```

## Default Users (Seeded)

| Email | Role | Unit |
|-------|------|------|
| admin@jambohub.org | Admin | VAHC Leadership |
| kyle.haines@vahc.org | Adult | Crew 22 |
| sarah.thompson@vahc.org | Adult | Troop 3125 |
| mike.chen@vahc.org | Adult | Troop 114 |
| liam.h@vahc.org | Youth | Crew 22 |
| alex.m@vahc.org | Youth | Troop 3125 |
| parent.liam@vahc.org | Parent | Crew 22 |

**All passwords**: `Jambo2026!`

## Customization

### Change Contingent Name
Edit these files:
- `jambohub-frontend/src/App.jsx` - Header subtitle
- `jambohub-frontend/src/components/ChannelList.jsx` - Footer
- `jambohub-backend/backend/email_service.py` - Email footer

### Add Channels
Edit `jambohub-backend/backend/models.py` in `seed_default_data()`:
```python
Channel(
    id="newchannel",
    name="New Channel",
    description="Description",
    icon="🎯",
    type="public",  # public, unit, leadership, parent
    allowed_roles="admin,adult,youth,parent",
    can_post_roles="admin,adult"
)
```

## Troubleshooting

### Database Reset
```bash
fly ssh console
rm /data/jambohub.db
exit
fly apps restart jambohub
```

### View Logs
```bash
fly logs
```

### Check Status
```bash
fly status
```

---

Built for the **2026 National Jamboree** 🏕️
