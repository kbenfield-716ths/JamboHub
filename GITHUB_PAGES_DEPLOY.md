# Deploy to GitHub Pages - Step by Step

## Why GitHub Pages?

Perfect for this MVP because:
- ✅ **Free** and fast
- ✅ **No signup required** for viewers
- ✅ **Automatic HTTPS** 
- ✅ **Easy to update** - just push code
- ✅ **Perfect for React PWAs**

Your live demo will be at: `https://YOUR_USERNAME.github.io/jamboree-hub/`

---

## Step 1: Create GitHub Repository

### Option A: Using GitHub Website (Easiest)
1. Go to https://github.com
2. Click the **+** in top right → **New repository**
3. Name it: `jamboree-hub`
4. Keep it **Public** (required for free GitHub Pages)
5. **Don't** initialize with README (we have our own)
6. Click **Create repository**

### Option B: Using GitHub CLI
```bash
gh repo create jamboree-hub --public --source=. --remote=origin --push
```

---

## Step 2: Push Your Code

Open Terminal in your `jamboree-hub` folder:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - VAHC Jamboree Hub MVP"

# Add your GitHub repo as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/jamboree-hub.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top right)
3. Click **Pages** (left sidebar)
4. Under **Source**, select:
   - **Deploy from a branch** 
   - Wait, scratch that - we're using GitHub Actions!
   
Actually, do this:
1. Click **Settings** → **Pages**
2. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions**
3. Done! The workflow file we included will handle the rest

---

## Step 4: Wait for Deployment

1. Go to the **Actions** tab in your repo
2. You'll see a workflow running called "Deploy to GitHub Pages"
3. Wait 2-3 minutes for it to complete (green checkmark)
4. Your site will be live at: `https://YOUR_USERNAME.github.io/jamboree-hub/`

---

## Step 5: Share with Scouters

Once deployed, share this URL with other leaders:
```
https://YOUR_USERNAME.github.io/jamboree-hub/
```

They can:
- Open it on any device (phone, tablet, computer)
- Install it as a PWA (Add to Home Screen)
- Try different user roles
- Give feedback

---

## Updating the Demo

Whenever you make changes:

```bash
git add .
git commit -m "Updated feature X"
git push
```

GitHub Actions automatically rebuilds and redeploys in 2-3 minutes!

---

## Troubleshooting

### "Page not loading" or "404"
**Problem:** Base path mismatch
**Fix:** Check that `vite.config.js` has `base: '/jamboree-hub/'` matching your repo name

### "Action failed"
**Problem:** Build error
**Fix:** 
1. Check the Actions tab for error details
2. Most common: Missing dependencies
3. Run `npm install && npm run build` locally first

### "Blank page"
**Problem:** JavaScript not loading
**Fix:** Check browser console - usually a path issue

### "Not updating"
**Problem:** GitHub Actions not enabled
**Fix:** Settings → Pages → Source → Select "GitHub Actions"

---

## Custom Domain (Optional)

Want something like `jamboree.yourtroop.org` instead?

1. Buy a domain (or use an existing one)
2. Settings → Pages → Custom domain
3. Add DNS records:
   ```
   CNAME: jamboree → YOUR_USERNAME.github.io
   ```
4. Wait for DNS propagation (~10 minutes)

---

## Alternative: Deploy to Netlify (Even Easier!)

If GitHub seems complicated, Netlify is simpler:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build your app
npm run build

# Deploy
netlify deploy --prod

# Follow the prompts, drag the 'dist' folder when asked
```

You'll get a URL like: `https://jamboree-hub-abc123.netlify.app`

Netlify also auto-deploys from GitHub if you connect it!

---

## What About Fly.io?

**Use Fly.io when you're ready for production** with:
- Real Zulip backend
- PostgreSQL database
- FastAPI custom services
- Real authentication

For this demo MVP showing the UI? GitHub Pages is perfect.

---

## Security Note

This demo uses mock data and simulated authentication. **Do not collect real Scout information** until you have:
- ✅ Proper authentication
- ✅ Secure backend
- ✅ Parental consent system
- ✅ BSA data handling compliance

---

## Cost Comparison

| Platform | MVP Demo | Production | Cost |
|----------|----------|------------|------|
| GitHub Pages | ✅ Perfect | ❌ Frontend only | Free |
| Netlify | ✅ Perfect | ⚠️ Backend extra | Free tier OK |
| Vercel | ✅ Perfect | ⚠️ Backend extra | Free tier OK |
| Fly.io | ⚠️ Overkill | ✅ Best choice | $1-30/mo |

**For sharing this MVP: Use GitHub Pages**
**For production with Zulip: Use Fly.io**

---

## Quick Reference Commands

```bash
# Deploy to GitHub
git add .
git commit -m "Update"
git push

# Deploy to Netlify
npm run build
netlify deploy --prod

# Run locally
npm run dev
```

---

## Your URL Will Be:
```
https://YOUR_GITHUB_USERNAME.github.io/jamboree-hub/
```

**Example:** If your username is `khaines`, it'll be:
```
https://khaines.github.io/jamboree-hub/
```

Share that with your Scouters and they can try it immediately!
