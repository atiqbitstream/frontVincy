# Quick Start Guide for Admins

## 🚀 New Features Available Now!

### 1. Email Notifications (Automatic)
You'll now receive an email notification whenever a new user signs up!

**What you'll get:**
- ✉️ Email sent to: Info@soulresidue.net and squarelizard@gmail.com
- 📧 Subject: "New User Registration - Dr. Vince Platform"
- 📝 Contains: User's name, email, and status
- 🔗 Includes link to admin dashboard for activation

**Example Email:**
```
Subject: New User Registration - Dr. Vince Platform

A new user has registered on the platform:

Full Name: John Doe
Email: john.doe@example.com
Status: Pending Activation

[Go to Admin Dashboard] (button with link)
```

### 2. Export Users to CSV (For Bulk Email)

**How to Export:**
1. Log in to Admin Dashboard (http://localhost:8080/admin-login)
2. Click "User Management" in the navigation
3. Look for the **"Export to CSV"** button at the top right
4. Click the button
5. CSV file downloads automatically to your computer

**File name format:** `users_export_2025-12-25.csv`

**What's in the CSV:**
- All user emails (for bulk email campaigns)
- Names, phone numbers, locations
- Health information (exercise, sleep, etc.)
- Account details (status, created date, etc.)

### 3. Using the CSV for Bulk Email

**Option A: Import to Email Marketing Platform**
1. Open the CSV in Excel or Google Sheets
2. Copy the email column
3. Import to MailChimp, SendGrid, Constant Contact, etc.
4. Create your email campaign
5. Send!

**Option B: Direct Email (Gmail/Outlook)**
1. Open the CSV
2. Copy emails from the "Email" column
3. Paste into BCC field in Gmail/Outlook
4. Compose your message
5. Send to all users at once

**Option C: Analyze User Data**
1. Open CSV in Excel/Google Sheets
2. Filter by location, occupation, status, etc.
3. Create targeted email lists
4. Export specific segments

## ⚙️ Setup (One-Time Only)

To enable email notifications, your developer needs to:

1. Add email configuration to `.env` file:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAILS=Info@soulresidue.net,squarelizard@gmail.com
```

2. If using Gmail, create an "App Password":
   - Go to Google Account → Security
   - Enable 2-Factor Authentication
   - Create App Password at: https://myaccount.google.com/apppasswords
   - Use that password in the configuration

3. Restart the backend server

## 📱 Testing the Features

**Test Email Notification:**
1. Create a test user account through signup page
2. Check your email inbox (Info@soulresidue.net or squarelizard@gmail.com)
3. Should receive notification within seconds

**Test CSV Export:**
1. Log in as admin
2. Go to User Management
3. Click "Export to CSV"
4. Verify file downloads
5. Open in Excel to check data

## 🎯 Best Practices

**Email Notifications:**
- ✅ Check your spam folder if you don't see the email
- ✅ Add the sender email to your contacts
- ✅ Set up email filters to organize these notifications
- ✅ Review and activate new users promptly

**CSV Exports:**
- ✅ Export regularly for backups
- ✅ Delete old CSV files securely (contains sensitive data)
- ✅ Don't share CSV files with unauthorized people
- ✅ Use for authorized marketing purposes only
- ✅ Comply with email marketing laws (CAN-SPAM, GDPR)

## 🆘 Troubleshooting

**Problem: Not receiving email notifications**
- Check spam/junk folder
- Verify SMTP settings are configured
- Contact developer to check server logs

**Problem: CSV download not working**
- Check you're logged in as admin
- Try refreshing the page
- Clear browser cache
- Try a different browser

**Problem: CSV file won't open**
- Make sure you have Excel, Google Sheets, or similar
- Right-click file → Open with → Choose program
- File may be blocked - check file properties and "Unblock"

## 📞 Support

For technical issues, contact your system administrator with:
- What you were trying to do
- What happened instead
- Any error messages you saw
- Screenshots if possible

## 🎉 You're All Set!

Once the SMTP configuration is complete, you'll start receiving email notifications automatically. The CSV export feature is ready to use right now!

**Access the Admin Dashboard:**
- URL: http://localhost:8080/admin-login
- Or: https://wellnessoptimalmindbody.com/admin-login (production)

Happy administrating! 🚀
