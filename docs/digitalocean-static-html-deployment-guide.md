# Digital Ocean Static HTML Deployment Guide

**Complete beginner-friendly guide for deploying a single HTML file to Digital Ocean**

---

## Table of Contents
1. [Recommended Approach](#recommended-approach)
2. [Prerequisites](#prerequisites)
3. [Cost Breakdown](#cost-breakdown)
4. [Step-by-Step Instructions](#step-by-step-instructions)
5. [Configuration Files](#configuration-files)
6. [Domain & DNS Setup](#domain--dns-setup)
7. [SSL Certificate Setup](#ssl-certificate-setup)
8. [Updating Your Site](#updating-your-site)
9. [Troubleshooting](#troubleshooting)

---

## Recommended Approach

### Method: Nginx on Ubuntu 24.04 Droplet

**Why this approach?**

1. **Full control**: You own the server environment
2. **Better value**: $4/month for 500GB bandwidth vs App Platform's 1GB free tier limitation
3. **Learning opportunity**: Understand how web servers work
4. **Flexibility**: Can easily expand to host multiple sites or add dynamic features
5. **Industry standard**: Nginx is used by 30%+ of all websites worldwide

**Alternative considered**: DigitalOcean App Platform offers 3 free static sites, but bandwidth is limited to 1GB/month per app. For $3/month additional apps, you get similar limitations. The Droplet approach gives you 500GB bandwidth and unlimited sites for $4/month.

---

## Prerequisites

Before starting, ensure you have:

- [ ] A DigitalOcean account ([Sign up here](https://www.digitalocean.com))
- [ ] A domain name (optional, but recommended - $10-15/year from any registrar)
- [ ] Your HTML file ready to deploy
- [ ] Basic comfort with terminal/command line
- [ ] SSH key pair (we'll create this if you don't have one)
- [ ] 60-90 minutes of uninterrupted time

**What you'll learn:**
- How to create and access a cloud server
- Basic Linux server administration
- Web server (Nginx) configuration
- SSL certificate management
- DNS configuration

---

## Cost Breakdown

### Monthly Costs

| Item | Cost | Notes |
|------|------|-------|
| **Basic Droplet** | $4.00/month | 1GB RAM, 1 CPU, 25GB SSD, 500GB transfer |
| **Domain name** | ~$1/month | ($10-15/year, one-time registration) |
| **SSL Certificate** | $0 | Free via Let's Encrypt |
| **DNS hosting** | $0 | Free with DigitalOcean |
| **Backups (optional)** | +$0.80/month | 20% of Droplet cost, highly recommended |
| **TOTAL** | **$4.80-5.00/month** | With backups |

### Bandwidth Limits
- **Included**: 500GB outbound transfer per month
- **Overage**: $0.01 per GB (extremely rare for static sites)
- **Inbound**: Unlimited and free
- **Typical usage**: Static HTML page ~10-50KB = 10-50 million pageviews/month

### One-Time Costs
- Domain registration: $10-15 (annual renewal)

### Cost Comparison
- **App Platform**: $0-3/month (but 1GB bandwidth limit)
- **Droplet**: $4/month (500GB bandwidth, unlimited sites)
- **AWS S3 + CloudFront**: ~$1-5/month (more complex setup)
- **Netlify/Vercel**: Free tier available (100GB bandwidth)

**Verdict**: For a beginner wanting full control and learning experience, the $4 Droplet is excellent value.

---

## Step-by-Step Instructions

### Part 1: Create SSH Key (5 minutes)

SSH keys allow secure, password-free access to your server.

**On Mac/Linux:**

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "your_email@example.com"

# When prompted:
# - Save location: Press ENTER (uses default ~/.ssh/id_ed25519)
# - Passphrase: Press ENTER twice (no passphrase) or create one for extra security

# Display your public key (you'll need this for DigitalOcean)
cat ~/.ssh/id_ed25519.pub
```

**On Windows:**

```powershell
# Open PowerShell and run:
ssh-keygen -t ed25519 -C "your_email@example.com"

# Follow same prompts as Mac/Linux

# Display your public key
type $env:USERPROFILE\.ssh\id_ed25519.pub
```

**Copy the entire output** (starts with `ssh-ed25519` and ends with your email).

---

### Part 2: Create a DigitalOcean Droplet (10 minutes)

1. **Log in to DigitalOcean** and click the green **Create** button (top right)

2. **Select "Droplets"**

3. **Choose Region**: Select closest to your target audience
   - Example: New York (for US East), San Francisco (US West), London, Frankfurt, etc.

4. **Choose Image**:
   - Click **OS** tab
   - Select **Ubuntu 24.04 LTS x64**

5. **Choose Size**:
   - Select **Basic** plan
   - Click **Regular** CPU option
   - Select **$4/month** tier (1GB RAM, 1 CPU, 25GB SSD, 500GB transfer)

6. **Authentication**:
   - Select **SSH Key** (not Password - more secure)
   - Click **New SSH Key**
   - Paste your public key from Part 1
   - Name it (e.g., "My Laptop")
   - Click **Add SSH Key**

7. **Finalize Details**:
   - Hostname: Choose descriptive name (e.g., `static-web-server`)
   - Backups: Enable if desired (+$0.80/month, recommended)
   - Monitoring: Enable (free)

8. **Click "Create Droplet"**

**Wait 60 seconds** for the Droplet to be created. You'll see its IP address appear.

**Copy the IP address** (looks like `123.456.789.012`) - you'll need this constantly.

---

### Part 3: Connect to Your Droplet (5 minutes)

**Open your terminal** and connect:

```bash
# Replace YOUR_DROPLET_IP with the actual IP address
ssh root@YOUR_DROPLET_IP
```

**First connection warning:**
```
The authenticity of host '123.456.789.012 (123.456.789.012)' can't be established.
Are you sure you want to continue connecting (yes/no)?
```

Type `yes` and press ENTER.

**You should see a welcome message** and a prompt like:
```
root@static-web-server:~#
```

You're now inside your server!

**Test basic commands:**
```bash
# Check Ubuntu version
lsb_release -a

# Check available disk space
df -h

# Check system uptime
uptime
```

---

### Part 4: Initial Server Setup (10 minutes)

**Security first!** Let's configure the firewall and update the system.

```bash
# Update package list and upgrade installed packages
apt update && apt upgrade -y

# Install firewall (UFW - Uncomplicated Firewall)
apt install ufw -y

# Allow SSH (CRITICAL - don't lock yourself out!)
ufw allow OpenSSH

# Allow HTTP and HTTPS
ufw allow 'Nginx Full'

# Enable firewall
ufw enable

# Confirm with 'y' when prompted

# Verify firewall status
ufw status

# Should show:
# Status: active
# To                         Action      From
# --                         ------      ----
# OpenSSH                    ALLOW       Anywhere
# Nginx Full                 ALLOW       Anywhere
```

**Install essential packages:**
```bash
# Install Nginx, Certbot (for SSL), and git (for file management)
apt install nginx certbot python3-certbot-nginx git curl -y

# Verify Nginx is running
systemctl status nginx

# Should show "active (running)" in green
# Press 'q' to exit the status view
```

**Test Nginx:**
Visit `http://YOUR_DROPLET_IP` in your browser. You should see the **Nginx welcome page**.

---

### Part 5: Upload Your HTML File (10 minutes)

**Two methods**: Choose the one you're comfortable with.

#### Method A: Using SCP (Secure Copy) - From Your Local Machine

**On your local machine** (not the Droplet):

```bash
# Navigate to where your HTML file is
cd /path/to/your/html/file

# Copy file to Droplet
scp index.html root@YOUR_DROPLET_IP:/var/www/html/

# If your file has a different name:
scp myfile.html root@YOUR_DROPLET_IP:/var/www/html/index.html
```

#### Method B: Using Nano Editor - Direct Edit on Droplet

**On your Droplet** (via SSH):

```bash
# Create/edit the HTML file
nano /var/www/html/index.html

# Paste your HTML content
# Press Ctrl + X to exit
# Press Y to save
# Press ENTER to confirm filename
```

**Set proper permissions:**
```bash
# Ensure Nginx can read the file
chown -R www-data:www-data /var/www/html/
chmod -R 755 /var/www/html/
```

**Test your site:**
Visit `http://YOUR_DROPLET_IP` - you should see your HTML page!

**If you see Nginx welcome page instead:**
```bash
# Remove default Nginx page
rm /var/www/html/index.nginx-debian.html

# Restart Nginx
systemctl restart nginx

# Try again in browser
```

---

### Part 6: Configure Nginx for Your Domain (10 minutes)

**Skip this section if you don't have a domain yet** - your site works via IP address!

**Create Nginx server block:**

```bash
# Create configuration file (replace yourdomain.com with your actual domain)
nano /etc/nginx/sites-available/yourdomain.com
```

**Paste this configuration** (replace `yourdomain.com` with your actual domain):

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name yourdomain.com www.yourdomain.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

**Save and exit**: Ctrl + X, then Y, then ENTER

**Enable the site:**
```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Should show "syntax is ok" and "test is successful"

# Reload Nginx
systemctl reload nginx
```

---

## Domain & DNS Setup

### Step 1: Add Domain to DigitalOcean (5 minutes)

**In DigitalOcean control panel:**

1. Click **Create** → **Domains/DNS**
2. Enter your domain name (e.g., `yourdomain.com`)
3. Click **Add Domain**

### Step 2: Create DNS Records (5 minutes)

**Create A record for apex domain:**
- Type: `A`
- Hostname: `@`
- Value: `YOUR_DROPLET_IP`
- TTL: `3600` (1 hour)

**Create A record for www subdomain:**
- Type: `A`
- Hostname: `www`
- Value: `YOUR_DROPLET_IP`
- TTL: `3600`

### Step 3: Update Nameservers at Your Registrar (10 minutes)

**DigitalOcean nameservers:**
```
ns1.digitalocean.com
ns2.digitalocean.com
ns3.digitalocean.com
```

**Update at your registrar** (examples below):

#### GoDaddy:
1. Log in to GoDaddy
2. Go to **My Products** → **Domains**
3. Click **DNS** next to your domain
4. Scroll to **Nameservers** → Click **Change**
5. Select **Custom nameservers**
6. Enter DigitalOcean nameservers
7. Save

#### Namecheap:
1. Log in to Namecheap
2. Go to **Domain List** → Select domain
3. Find **Nameservers** section
4. Select **Custom DNS**
5. Enter DigitalOcean nameservers
6. Save

#### Google Domains:
1. Log in to Google Domains
2. Select your domain
3. Click **DNS** in left sidebar
4. Scroll to **Name servers**
5. Select **Use custom name servers**
6. Enter DigitalOcean nameservers
7. Save

**Propagation time**: 30 minutes to 48 hours (typically 1-2 hours)

**Check DNS propagation:**
```bash
# On your local machine
nslookup yourdomain.com

# Or use online tools:
# https://www.whatsmydns.net/
```

**Once propagated**, visit `http://yourdomain.com` - you should see your site!

---

## SSL Certificate Setup

**IMPORTANT**: Wait until DNS has fully propagated before proceeding!

### Step 1: Install SSL Certificate (5 minutes)

```bash
# On your Droplet, run Certbot
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# You'll be prompted for:
# 1. Email address (for renewal notifications)
# 2. Agree to Terms of Service (Y)
# 3. Share email with EFF (optional - Y or N)

# Certbot will:
# - Verify domain ownership
# - Generate SSL certificate
# - Automatically configure Nginx
# - Set up HTTPS redirect
```

**Success message:**
```
Congratulations! You have successfully enabled HTTPS on https://yourdomain.com
```

### Step 2: Test SSL Certificate (2 minutes)

**Visit your site:**
- `https://yourdomain.com` - should show secure padlock
- `http://yourdomain.com` - should redirect to HTTPS

**Test SSL configuration:**
- Visit: https://www.ssllabs.com/ssltest/
- Enter your domain
- Wait for analysis
- **Goal**: A or A+ rating

### Step 3: Verify Auto-Renewal (2 minutes)

Let's Encrypt certificates expire every 90 days but renew automatically.

```bash
# Test renewal process (doesn't actually renew)
certbot renew --dry-run

# Should show "Congratulations, all simulated renewals succeeded"

# Check renewal timer
systemctl status certbot.timer

# Should show "active (running)"
```

**Renewal happens automatically** - no action needed!

**Monitor renewals:**
```bash
# Check Certbot logs
tail -f /var/log/letsencrypt/letsencrypt.log
```

---

## Configuration Files

### Complete Nginx Configuration

**Location**: `/etc/nginx/sites-available/yourdomain.com`

**After Certbot configures SSL**, your file should look like this:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificate (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Document root
    root /var/www/html;
    index index.html;

    # Serve files
    location / {
        try_files $uri $uri/ =404;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### Enhanced Security Configuration (Optional)

**Create security config file:**

```bash
nano /etc/nginx/snippets/security.conf
```

**Paste:**

```nginx
# Security Headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;

# Prevent access to hidden files
location ~ /\. {
    deny all;
    access_log off;
    log_not_found off;
}
```

**Include in your site config:**

```nginx
server {
    # ... other config ...

    include snippets/security.conf;
}
```

---

## Updating Your Site

### Method 1: SCP from Local Machine (Recommended)

**On your local machine:**

```bash
# Upload updated HTML file
scp index.html root@YOUR_DROPLET_IP:/var/www/html/

# If you have multiple files:
scp -r ./my-website/* root@YOUR_DROPLET_IP:/var/www/html/
```

**No server restart needed** - changes are live immediately!

### Method 2: Edit Directly on Server

```bash
# SSH into Droplet
ssh root@YOUR_DROPLET_IP

# Edit file
nano /var/www/html/index.html

# Make changes, save (Ctrl + X, Y, ENTER)
```

### Method 3: Git-Based Workflow (Advanced)

**Set up Git repository:**

```bash
# On Droplet
cd /var/www/html
git init
git remote add origin https://github.com/yourusername/yourrepo.git

# Create deployment script
nano /root/deploy.sh
```

**Paste:**

```bash
#!/bin/bash
cd /var/www/html
git pull origin main
chown -R www-data:www-data /var/www/html
echo "Deployment complete: $(date)"
```

**Make executable:**

```bash
chmod +x /root/deploy.sh
```

**Deploy updates:**

```bash
# After pushing to GitHub
ssh root@YOUR_DROPLET_IP '/root/deploy.sh'
```

### Verify Changes

```bash
# Clear browser cache and reload
# Or use incognito/private browsing

# Check file timestamp on server
ls -lh /var/www/html/index.html
```

---

## Troubleshooting

### Issue 1: Can't connect via SSH

**Symptoms**: `Connection refused` or `Connection timed out`

**Solutions:**

```bash
# Check if Droplet is running (in DigitalOcean control panel)
# Restart Droplet if needed

# Verify SSH key is correct
cat ~/.ssh/id_ed25519.pub

# Try password authentication (if enabled)
ssh -o PreferredAuthentications=password root@YOUR_DROPLET_IP
```

### Issue 2: Site shows Nginx welcome page

**Solution:**

```bash
# SSH into Droplet
ssh root@YOUR_DROPLET_IP

# Remove default page
rm /var/www/html/index.nginx-debian.html

# Verify your HTML file exists
ls -lh /var/www/html/

# Restart Nginx
systemctl restart nginx
```

### Issue 3: Domain doesn't resolve to Droplet

**Check DNS propagation:**

```bash
# On your local machine
nslookup yourdomain.com

# Should return your Droplet IP
# If not, DNS hasn't propagated yet (wait 1-24 hours)
```

**Verify DNS records in DigitalOcean:**
- A record for `@` points to Droplet IP
- A record for `www` points to Droplet IP
- Nameservers updated at registrar

### Issue 4: SSL certificate not installing

**Common causes:**

1. **DNS not propagated**: Wait 1-2 hours and try again
2. **Firewall blocking port 80**: Let's Encrypt needs port 80

**Solutions:**

```bash
# Check DNS resolves to your server
curl -I http://yourdomain.com

# Ensure port 80 is open
ufw status | grep 80

# Try Certbot again with verbose output
certbot --nginx -d yourdomain.com -d www.yourdomain.com --verbose
```

### Issue 5: "502 Bad Gateway" error

**Solution:**

```bash
# Check Nginx status
systemctl status nginx

# If not running, start it
systemctl start nginx

# Check Nginx error logs
tail -50 /var/log/nginx/error.log

# Test Nginx configuration
nginx -t

# If errors, fix them and reload
systemctl reload nginx
```

### Issue 6: Can't upload file via SCP

**Symptoms**: `Permission denied` or `Connection refused`

**Solutions:**

```bash
# Verify SSH connection works
ssh root@YOUR_DROPLET_IP

# Check file permissions on server
ls -ld /var/www/html/

# Fix permissions if needed
chown -R root:root /var/www/html/
chmod -R 755 /var/www/html/

# Try uploading again
scp index.html root@YOUR_DROPLET_IP:/var/www/html/
```

### Issue 7: Site not showing after DNS change

**Browser cache issue!**

**Solutions:**

1. **Clear browser cache**: Ctrl + Shift + Delete (Chrome/Firefox)
2. **Use incognito/private mode**: Ctrl + Shift + N (Chrome) / Ctrl + Shift + P (Firefox)
3. **Flush DNS cache**:
   ```bash
   # Mac
   sudo dscacheutil -flushcache

   # Windows (PowerShell as Admin)
   ipconfig /flushdns

   # Linux
   sudo systemd-resolve --flush-caches
   ```

### Issue 8: SSL certificate expired

**Shouldn't happen** (auto-renewal), but if it does:

```bash
# SSH into Droplet
ssh root@YOUR_DROPLET_IP

# Check renewal timer
systemctl status certbot.timer

# If inactive, enable it
systemctl enable certbot.timer
systemctl start certbot.timer

# Force renewal now
certbot renew --force-renewal

# Reload Nginx
systemctl reload nginx
```

### Getting More Help

**Check Nginx logs:**

```bash
# Error logs
tail -50 /var/log/nginx/error.log

# Access logs
tail -50 /var/log/nginx/access.log

# Follow logs in real-time
tail -f /var/log/nginx/error.log
```

**Check system logs:**

```bash
# Recent system logs
journalctl -xe

# Nginx-specific logs
journalctl -u nginx -n 50
```

**DigitalOcean Community:**
- Forum: https://www.digitalocean.com/community
- Tutorials: https://www.digitalocean.com/community/tutorials

---

## Post-Deployment Checklist

**After completing all steps, verify:**

- [ ] Site loads via HTTPS (secure padlock visible)
- [ ] HTTP redirects to HTTPS automatically
- [ ] www and non-www versions both work
- [ ] SSL certificate is valid (check https://www.ssllabs.com/ssltest/)
- [ ] Certbot auto-renewal is enabled (`systemctl status certbot.timer`)
- [ ] Firewall is active and configured (`ufw status`)
- [ ] Backups are enabled (optional but recommended)
- [ ] You can upload files via SCP

**Security best practices:**

- [ ] Disable root login via password (SSH key only)
- [ ] Set up automated backups
- [ ] Enable DigitalOcean monitoring
- [ ] Keep system updated (`apt update && apt upgrade` monthly)

---

## Next Steps

**Enhance your setup:**

1. **Add more pages**: Upload additional HTML files to `/var/www/html/`
2. **Custom 404 page**: Create `/var/www/html/404.html` and configure Nginx
3. **Add analytics**: Include Google Analytics or similar in your HTML
4. **Monitoring**: Set up UptimeRobot (free) for downtime alerts
5. **CDN**: Add Cloudflare (free tier) for better performance globally
6. **Automated deployments**: Set up GitHub Actions to deploy on git push

**Learning resources:**

- **Nginx docs**: https://nginx.org/en/docs/
- **DigitalOcean tutorials**: https://www.digitalocean.com/community/tutorials
- **Let's Encrypt docs**: https://letsencrypt.org/docs/
- **Linux command line**: https://linuxcommand.org/

---

## Quick Reference Commands

**Connect to server:**
```bash
ssh root@YOUR_DROPLET_IP
```

**Upload file:**
```bash
scp index.html root@YOUR_DROPLET_IP:/var/www/html/
```

**Edit file on server:**
```bash
nano /var/www/html/index.html
```

**Restart Nginx:**
```bash
systemctl restart nginx
```

**Check Nginx status:**
```bash
systemctl status nginx
```

**Test Nginx config:**
```bash
nginx -t
```

**Renew SSL:**
```bash
certbot renew
```

**Check firewall:**
```bash
ufw status
```

**View error logs:**
```bash
tail -50 /var/log/nginx/error.log
```

**Update system:**
```bash
apt update && apt upgrade -y
```

---

## Estimated Time to Complete

| Stage | Time | Difficulty |
|-------|------|------------|
| SSH key creation | 5 min | Easy |
| Create Droplet | 10 min | Easy |
| Connect via SSH | 5 min | Easy |
| Server setup | 10 min | Medium |
| Upload HTML | 10 min | Easy |
| Configure Nginx | 10 min | Medium |
| DNS setup | 20 min | Medium |
| SSL certificate | 10 min | Easy |
| Testing & verification | 10 min | Easy |
| **TOTAL** | **90 min** | **Beginner-friendly** |

**Note**: DNS propagation adds 30 minutes to 24 hours of waiting time (not hands-on).

---

## Support & Resources

**DigitalOcean Resources:**
- Control Panel: https://cloud.digitalocean.com/
- Documentation: https://docs.digitalocean.com/
- Community: https://www.digitalocean.com/community
- Status Page: https://status.digitalocean.com/

**Getting Help:**
1. Check this guide's troubleshooting section
2. Search DigitalOcean Community forums
3. Ask questions on Stack Overflow (tag: digitalocean, nginx)
4. Contact DigitalOcean support (available for all accounts)

---

**Last Updated**: October 2025
**Guide Version**: 1.0

**Feedback**: If you found this guide helpful or have suggestions for improvement, please share your feedback!
