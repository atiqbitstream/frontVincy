# 🔧 REQUIRED: Add These Lines to Your .env File

## Location
File: `backvincy/.env`

## Instructions
Add these lines to the **END** of your existing `.env` file:

```env
# ========================================
# Email Configuration (Added 2025-12-25)
# ========================================

# Gmail SMTP Settings (recommended)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Your Gmail address that will send the emails
SMTP_USER=your-email@gmail.com

# Gmail App-Specific Password (NOT your regular password!)
# Create at: https://myaccount.google.com/apppasswords
SMTP_PASSWORD=xxxx xxxx xxxx xxxx

# Admin email addresses that will receive notifications
# (Already configured - DO NOT CHANGE unless needed)
ADMIN_EMAILS=Info@soulresidue.net,squarelizard@gmail.com
```

## ⚠️ Important Notes

1. **SMTP_USER**: Use a Gmail account you have access to
   - Could be a company Gmail account
   - Or create a new Gmail specifically for sending notifications
   - Example: noreply@yourcompany.com or notifications@yourcompany.com

2. **SMTP_PASSWORD**: MUST be an App-Specific Password
   - NOT your regular Gmail password
   - Follow steps below to create one

3. **ADMIN_EMAILS**: Already set correctly
   - Info@soulresidue.net
   - squarelizard@gmail.com
   - These will receive new user signup notifications

## 📱 How to Create Gmail App Password

### Step 1: Enable 2-Factor Authentication
1. Go to: https://myaccount.google.com/security
2. Find "2-Step Verification"
3. Click "Get Started" and follow instructions
4. Complete the 2FA setup

### Step 2: Create App Password
1. Go to: https://myaccount.google.com/apppasswords
2. You may need to sign in again
3. Select "Mail" for app type
4. Select "Windows Computer" (or other device)
5. Click "Generate"
6. You'll see a 16-character password like: `abcd efgh ijkl mnop`
7. Copy this password

### Step 3: Add to .env File
```env
SMTP_USER=your-actual-email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
```

⚠️ **Remove the spaces when copying** or keep them - both work!

## 🔄 After Adding the Configuration

1. **Save the .env file**
2. **Restart the backend server**:
   - Stop the current terminal (Ctrl+C)
   - Run again: `cd backvincy && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
   
   OR if the server auto-reloaded, you're good to go!

3. **Test the email notification**:
   - Go to signup page
   - Create a test user
   - Check admin emails for notification

## ✅ Example .env File (Complete)

Your `.env` file should look something like this:

```env
DATABASE_URL=postgresql://postgres:test@localhost:5432/vince
SECRET_KEY=your-existing-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_MINUTES=1440

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=notifications@yourcompany.com
SMTP_PASSWORD=abcd efgh ijkl mnop
ADMIN_EMAILS=Info@soulresidue.net,squarelizard@gmail.com
```

## 🆘 Troubleshooting

**Error: "Username and Password not accepted"**
- You're using your regular password instead of app password
- Create app-specific password as described above

**Error: "Authentication Required"**
- SMTP_USER or SMTP_PASSWORD is wrong
- Check for typos
- Make sure there are no extra spaces

**No error but no email received**
- Check spam folder in admin emails
- Verify SMTP_USER is a valid Gmail account
- Check backend server logs for errors

**Error: "Less secure app access"**
- Gmail has disabled this method
- You MUST use app-specific password
- Follow the 2FA + App Password steps above

## 🔐 Security Reminder

- ✅ Never commit the `.env` file to git
- ✅ Keep SMTP password secure
- ✅ Use a dedicated email account for sending
- ✅ Change app password if compromised
- ✅ Limit who has access to .env file

## ✨ That's It!

Once you add these 5 lines and restart, email notifications will work automatically! 🎉
