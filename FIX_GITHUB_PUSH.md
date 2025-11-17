# 🔧 Fix GitHub Push Permission Error

## ❌ Error
```
Permission to ayushman-ops/nowledgenest-kiroVision-IDE.git denied to Aayushman117
```

## 🎯 Solutions

### Solution 1: Update Git Credentials (Recommended)

Run these commands:

```bash
# Clear cached credentials
git credential-cache exit

# Or on Windows, clear credential manager
git config --global credential.helper manager-core

# Then try pushing again
git push -u origin main
```

When prompted, enter your GitHub username and password (or Personal Access Token).

---

### Solution 2: Use Personal Access Token (Most Secure)

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Give it a name: "KnowledgeNest Deploy"
   - Select scopes: ✅ repo (all)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Push using the token:**
   ```bash
   git push -u origin main
   ```
   - Username: `ayushman-ops`
   - Password: `paste_your_token_here`

---

### Solution 3: Use SSH Instead of HTTPS

1. **Generate SSH key (if you don't have one):**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   Press Enter for all prompts.

2. **Add SSH key to GitHub:**
   ```bash
   # Copy your public key
   cat ~/.ssh/id_ed25519.pub
   ```
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste your key
   - Click "Add SSH key"

3. **Change remote to SSH:**
   ```bash
   git remote set-url origin git@github.com:ayushman-ops/nowledgenest-kiroVision-IDE.git
   git push -u origin main
   ```

---

### Solution 4: Check Repository Ownership

Make sure the repository exists at:
```
https://github.com/ayushman-ops/nowledgenest-kiroVision-IDE
```

If it doesn't exist, create it:
1. Go to: https://github.com/new
2. Name: `nowledgenest-kiroVision-IDE`
3. Don't initialize with anything
4. Create repository

---

## ⚡ Quick Fix (Try This First)

```bash
# Update your Git config
git config --global user.name "ayushman-ops"
git config --global user.email "your_email@example.com"

# Try pushing again
git push -u origin main
```

---

## 🔍 Check Your Setup

```bash
# Check current user
git config user.name
git config user.email

# Check remote URL
git remote -v
```

---

## 💡 Still Having Issues?

Try pushing with explicit credentials:
```bash
git push https://ayushman-ops:YOUR_TOKEN@github.com/ayushman-ops/nowledgenest-kiroVision-IDE.git main
```

Replace `YOUR_TOKEN` with your Personal Access Token from GitHub.

---

## ✅ After Successful Push

Once pushed, you can deploy:
1. **Vercel:** https://vercel.com/new
2. **Render:** https://render.com

See `DEPLOY_NOW.md` for deployment instructions.
