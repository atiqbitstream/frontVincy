# Email Notification and CSV Export Setup

## Features Added

### 1. Admin Email Notifications on User Signup
When a new user signs up, an automated email notification is sent to the configured admin email addresses:
- **Info@soulresidue.net**
- **squarelizard@gmail.com**

The email includes:
- User's full name
- User's email address
- Account status (Pending Activation)
- Link to admin dashboard for account activation

### 2. CSV Export for Bulk Email
Admin users can now export all user data to CSV format for:
- Bulk email campaigns
- User analysis
- Data backup

The CSV includes all user fields:
- Contact information (email, phone)
- Personal details (name, DOB, nationality)
- Location (city, country)
- Health information (sleep hours, exercise frequency, etc.)
- Account status and timestamps

## Email Configuration

### Step 1: Configure SMTP Settings

Add the following variables to your `.env` file in the `backvincy` folder:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
ADMIN_EMAILS=Info@soulresidue.net,squarelizard@gmail.com
```

### Step 2: Gmail Setup (Recommended)

If using Gmail as your SMTP provider:

1. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

2. **Create App-Specific Password**
   - Visit [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer" (or other device)
   - Click "Generate"
   - Copy the 16-character password
   - Use this password in `SMTP_PASSWORD` (NOT your regular Gmail password)

3. **Update .env file**
   ```env
   SMTP_USER=your-gmail@gmail.com
   SMTP_PASSWORD=abcd efgh ijkl mnop  # 16-character app password
   ```

### Step 3: Alternative SMTP Providers

You can also use other SMTP providers:

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

#### Office 365 / Outlook
```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
```

#### Custom SMTP Server
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-password
```

## How It Works

### Email Notification Flow

1. User fills out signup form on the website
2. Backend creates user account with "Pending" status
3. Email notification is automatically sent to admin emails
4. Admins receive email with user details
5. Admins can click link to access admin dashboard
6. Admins activate the user account

### CSV Export Flow

1. Admin logs into admin dashboard
2. Navigate to "User Management" section
3. Click "Export to CSV" button
4. CSV file downloads automatically with filename: `users_export_YYYYMMDD_HHMMSS.csv`
5. Open CSV in Excel or Google Sheets for analysis
6. Use email addresses for bulk email campaigns

## Testing Email Notifications

### Test Signup Email

1. Ensure your `.env` file has correct SMTP settings
2. Restart the backend server
3. Create a test user account through the signup page
4. Check admin email inboxes for notification

### Troubleshooting

**Email not sending:**
- Check SMTP credentials in `.env`
- Verify app-specific password if using Gmail
- Check firewall/antivirus settings
- Look at backend logs for error messages
- Ensure SMTP_PORT is correct (587 for TLS, 465 for SSL)

**Email goes to spam:**
- Add sender email to contacts
- Check spam folder
- Consider using a dedicated email service (SendGrid, Mailgun)
- Set up SPF/DKIM records for your domain

## API Endpoints

### Export Users to CSV
```
GET /users/export/csv
```

**Authorization:** Bearer token (Admin only)

**Response:** CSV file download

**Example Usage:**
```javascript
const response = await fetch(`${API_URL}/users/export/csv`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const blob = await response.blob();
// Download file
```

## Security Notes

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use app-specific passwords** - Don't use your main email password
3. **Rotate passwords regularly** - Change SMTP passwords periodically
4. **Limit admin access** - Only authorized users should export CSV
5. **Secure CSV files** - User data is sensitive, handle appropriately

## CSV Export Fields

The exported CSV includes the following columns:

- ID
- Email
- Full Name
- Role
- Gender
- Date of Birth
- Nationality
- Phone
- City
- Country
- Occupation
- Marital Status
- Sleep Hours
- Exercise Frequency
- Smoking Status
- Alcohol Consumption
- User Status
- Created At
- Updated At
- Created By
- Updated By

## Future Enhancements

Potential improvements for consideration:

1. **Email Templates** - Customizable email templates
2. **Bulk Email Integration** - Direct integration with email marketing platforms
3. **Email Queue** - Asynchronous email processing with queue
4. **Email Logs** - Track sent emails and delivery status
5. **User Segments** - Export specific user segments
6. **Scheduled Reports** - Automatic daily/weekly user reports

## Support

For issues or questions:
- Check backend logs: Look for email-related errors
- Verify SMTP settings: Test credentials with email client
- Contact system administrator for access issues
