# AR Automation Placeholder Page - Deployment Instructions

## Quick Start

This folder contains everything needed to deploy the AR Automation placeholder page.

**Files:**
- `index.html` - Main page file (5.2KB)
- `assets/images/hero-image.png` - Hero section image (1.0 MB)

## Deployment Options

### ⚡ OPTION 1: DigitalOcean App Platform (RECOMMENDED - EASIEST)

**Why this is recommended:**
- ✅ **FREE** for static sites (3 apps free)
- ✅ **5-10 minutes** to deploy
- ✅ **No server management** - fully managed
- ✅ **Automatic HTTPS** - SSL included
- ✅ **Auto-deploy from GitHub** - push to deploy
- ✅ **1GB bandwidth/month** per app (sufficient for placeholder)

**Quick Steps:**
1. Push placeholder folder to GitHub repo
2. Log into DigitalOcean → Apps → "Launch Your App"
3. Connect GitHub, select repo
4. Choose "Static Site" and FREE starter plan
5. Deploy! (5 minutes)

**See detailed instructions below** ⬇️

---

### 🔧 OPTION 2: DigitalOcean Droplet with Nginx

**For learning or full control:**
- **$4-5/month** (not free)
- **90 minutes** setup time
- **500GB bandwidth** included
- **Full server control** - can host multiple sites

**Detailed guide:** [docs/digitalocean-static-html-deployment-guide.md](../docs/digitalocean-static-html-deployment-guide.md)

---

## ⚡ Detailed Steps for App Platform (Recommended)

### Prerequisites
- [ ] GitHub account (free at github.com)
- [ ] DigitalOcean account (free at digitalocean.com)
- [ ] 10 minutes of time

### Step 1: Push to GitHub (5 minutes)

**Create a new GitHub repository:**

```bash
# In your project root (ar3_website/)
cd placeholder/

# Initialize git repo
git init

# Create .gitignore (optional)
echo ".DS_Store" > .gitignore

# Add files
git add .
git commit -m "Initial commit: AR Automation placeholder page"

# Create repo on GitHub (via web interface), then:
git remote add origin https://github.com/YOUR-USERNAME/ar-automation-placeholder.git
git branch -M main
git push -u origin main
```

**Alternative:** Use GitHub Desktop app or create repo directly on github.com and upload files.

### Step 2: Deploy to DigitalOcean App Platform (5 minutes)

1. **Log into DigitalOcean**
   - Visit: https://cloud.digitalocean.com
   - Sign in or create free account

2. **Create New App**
   - Click "Apps" in left sidebar
   - Click "Create App" or "Launch Your App" button

3. **Connect GitHub**
   - Select "GitHub" as source
   - Click "Manage Access" → authorize DigitalOcean
   - Select your placeholder repository
   - Choose branch: `main`
   - Check "Autodeploy code changes" (optional)

4. **Configure App**
   - **Name your app:** `ar-automation-placeholder`
   - **Region:** Choose closest to your audience (e.g., New York, San Francisco, London)
   - **Resource Type:** Should auto-detect as "Static Site"
   - **Build Command:** Leave empty (not needed for plain HTML)
   - **Output Directory:** Leave as `/` (root)

5. **Choose Plan**
   - Select **"Starter"** plan (FREE)
   - Review: 1GB bandwidth/month, automatic HTTPS, CDN
   - Click "Next"

6. **Configure Domain (Optional)**
   - Use provided URL: `your-app-name.ondigitalocean.app`
   - Or add custom domain (see Step 3 below)

7. **Launch App**
   - Review settings
   - Click "Create Resources"
   - Wait 2-5 minutes for deployment

8. **Access Your Site**
   - Click the app URL when deployment completes
   - Example: `https://ar-automation-placeholder.ondigitalocean.app`
   - Test the site: verify links, responsive design, etc.

### Step 3: Add Custom Domain (Optional, 10 minutes)

1. **In DigitalOcean App Platform:**
   - Go to your app → "Settings" tab
   - Scroll to "Domains" section
   - Click "Add Domain"
   - Enter: `yourdomain.com`
   - Click "Add Domain"

2. **Configure DNS:**
   - DigitalOcean will show DNS records needed
   - Add CNAME record at your domain registrar:
     - **Type:** CNAME
     - **Name:** `@` or `www`
     - **Value:** (provided by DigitalOcean)
     - **TTL:** 3600

3. **Wait for DNS propagation** (5 minutes to 24 hours)

4. **Automatic HTTPS:**
   - DigitalOcean automatically provisions SSL certificate
   - Your site will be live at `https://yourdomain.com`

### Step 4: Update Your Site

**Future updates are automatic:**

```bash
# Make changes to index.html locally
# Commit and push to GitHub
git add .
git commit -m "Update placeholder page"
git push origin main

# DigitalOcean automatically redeploys (if autodeploy enabled)
# Wait 1-2 minutes, refresh browser
```

---

## 🔧 Quick Upload for Droplet (Option 2)

## Quick Upload (If server already configured)

If you already have a Digital Ocean droplet with Nginx installed:

```bash
# Upload all files to your server
scp -r placeholder/* username@your-server-ip:/var/www/html/

# Verify files uploaded correctly
ssh username@your-server-ip "ls -lh /var/www/html/"
```

## Testing the Page

**Before deployment:**
1. Open `index.html` in a web browser (double-click the file)
2. Verify the page displays correctly
3. Click both email links to test (should open mail client with hello@arlabs.tech)

**After deployment:**
1. Visit http://your-server-ip/ in a browser
2. Verify page loads correctly
3. Test on mobile device (responsive design)
4. Configure DNS to point your domain to the server IP
5. Install SSL certificate (HTTPS)
6. Visit https://your-domain.com/ to confirm

## Features

✅ Single HTML file (no external dependencies except Google Fonts)
✅ Fully responsive (mobile, tablet, desktop)
✅ Professional AR Automation branding
✅ "Coming Soon" placeholder navigation
✅ Email contact links (hello@arlabs.tech)
✅ Fast loading (< 6KB HTML + 1MB image)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Questions?

**Email:** hello@arlabs.tech

**Need help with deployment?** See the full guide in `docs/digitalocean-static-html-deployment-guide.md` or contact the development team.

---

**Last updated:** October 17, 2025
