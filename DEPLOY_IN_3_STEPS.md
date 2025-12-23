# 3 STEPS TO SHARE YOUR JAMBOREE HUB DEMO

## Step 1: Create GitHub Repo (2 minutes)
1. Go to https://github.com/new
2. Name: `jamboree-hub`
3. Make it **Public**
4. Click **Create repository**

## Step 2: Push Your Code (2 minutes)
Open Terminal in your `jamboree-hub` folder:

```bash
git init
git add .
git commit -m "Jamboree Hub MVP"
git remote add origin https://github.com/YOUR_USERNAME/jamboree-hub.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username!

## Step 3: Enable GitHub Pages (1 minute)
1. Go to your repo on GitHub
2. **Settings** → **Pages**
3. Under "Build and deployment":
   - **Source**: Select **GitHub Actions**
4. Done!

## Your Demo URL
After 2-3 minutes, your demo will be live at:
```
https://YOUR_USERNAME.github.io/jamboree-hub/
```

## Share with Scouters
Just send them that URL! They can:
- Open on any device
- Try different user logins
- Give you feedback
- No installation needed

---

## Don't Have Git Installed?
Download from: https://git-scm.com/downloads

## First Time Using GitHub?
1. Create account: https://github.com/join
2. That's it!

## Need Help?
Run this to check if git is installed:
```bash
git --version
```

---

**That's it! Your Jamboree Hub will be live in 5 minutes total.**

Questions? The full guide is in `GITHUB_PAGES_DEPLOY.md`
