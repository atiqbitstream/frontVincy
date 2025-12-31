import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from typing import List
import logging

logger = logging.getLogger(__name__)


def send_email(
    to_emails: List[str],
    subject: str,
    html_content: str,
    text_content: str = None
):
    """
    Send email using SMTP
    
    Args:
        to_emails: List of recipient email addresses
        subject: Email subject
        html_content: HTML content of the email
        text_content: Plain text content (optional)
    """
    # Check if email is configured
    if not settings.email_enabled:
        logger.warning("Email not configured. Skipping email send.")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = settings.SMTP_USER
        msg['To'] = ', '.join(to_emails)
        msg['Subject'] = subject
        
        # Add text and HTML parts
        if text_content:
            part1 = MIMEText(text_content, 'plain')
            msg.attach(part1)
        
        part2 = MIMEText(html_content, 'html')
        msg.attach(part2)
        
        # Connect to SMTP server and send
        if settings.SMTP_PORT == 465:
            # Use SMTP_SSL for port 465
            with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
        else:
            # Use SMTP with STARTTLS for port 587
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(msg)
        
        logger.info(f"Email sent successfully to {to_emails}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        # Don't raise exception - we don't want email failures to break signup
        return False


def send_new_user_notification(user_email: str, user_name: str, admin_emails: List[str]):
    """
    Send notification to admins when a new user signs up
    
    Args:
        user_email: Email of the new user
        user_name: Full name of the new user
        admin_emails: List of admin email addresses
    """
    subject = "New User Registration - Dr. Vince Platform"
    
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: #4A90E2; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">New User Registration</h1>
                </div>
                <div style="background-color: white; padding: 30px; margin-top: 20px; border-radius: 5px;">
                    <h2 style="color: #4A90E2;">User Details</h2>
                    <p><strong>Full Name:</strong> {user_name}</p>
                    <p><strong>Email:</strong> {user_email}</p>
                    <p><strong>Status:</strong> Pending Activation</p>
                    
                    <div style="margin-top: 30px; padding: 15px; background-color: #f0f8ff; border-left: 4px solid #4A90E2;">
                        <p style="margin: 0;"><strong>Action Required:</strong></p>
                        <p style="margin: 5px 0 0 0;">Please log in to the admin dashboard to review and activate this user account.</p>
                    </div>
                    
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="https://wellnessoptimalmindbody.com/admin-login" 
                           style="display: inline-block; padding: 12px 30px; background-color: #4A90E2; color: white; text-decoration: none; border-radius: 5px;">
                            Go to Admin Dashboard
                        </a>
                    </div>
                </div>
                <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
                    <p>This is an automated notification from the Dr. Vince Platform.</p>
                </div>
            </div>
        </body>
    </html>
    """
    
    text_content = f"""
    New User Registration - Dr. Vince Platform
    
    A new user has registered on the platform:
    
    Full Name: {user_name}
    Email: {user_email}
    Status: Pending Activation
    
    Please log in to the admin dashboard to review and activate this user account.
    
    Admin Dashboard: https://wellnessoptimalmindbody.com/admin-login
    
    This is an automated notification from the Dr. Vince Platform.
    """
    
    return send_email(admin_emails, subject, html_content, text_content)


def send_user_approved_email(user_email: str, user_name: str):
    """
    Send notification to user when their account is approved
    
    Args:
        user_email: Email of the user
        user_name: Full name of the user
    """
    subject = "Account Approved - Welcome to Dr. Vince Platform"
    
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">✓ Account Approved!</h1>
                </div>
                <div style="background-color: white; padding: 30px; margin-top: 20px; border-radius: 5px;">
                    <h2 style="color: #4CAF50;">Welcome to Dr. Vince Platform!</h2>
                    <p>Hi {user_name},</p>
                    <p>Great news! Your account has been <strong>approved</strong> by our administrator.</p>
                    <p>You can now log in and access all features of the Dr. Vince Platform.</p>
                    
                    <div style="margin: 30px 0; padding: 20px; background-color: #f0f8f0; border-left: 4px solid #4CAF50;">
                        <p style="margin: 0;"><strong>Your Account Details:</strong></p>
                        <p style="margin: 10px 0 0 0;">Email: {user_email}</p>
                        <p style="margin: 5px 0 0 0;">Status: Active</p>
                    </div>
                    
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="https://wellnessoptimalmindbody.com/login" 
                           style="display: inline-block; padding: 12px 30px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                            Login Now
                        </a>
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                        <h3 style="color: #333;">Getting Started:</h3>
                        <ul style="color: #666;">
                            <li>Complete your profile information</li>
                            <li>Explore health monitoring features</li>
                            <li>Join live sessions</li>
                            <li>Access wellness resources</li>
                        </ul>
                    </div>
                </div>
                <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
                    <p>This is an automated notification from the Dr. Vince Platform.</p>
                    <p>If you have any questions, please contact support.</p>
                </div>
            </div>
        </body>
    </html>
    """
    
    text_content = f"""
    Account Approved - Welcome to Dr. Vince Platform
    
    Hi {user_name},
    
    Great news! Your account has been approved by our administrator.
    
    You can now log in and access all features of the Dr. Vince Platform.
    
    Your Account Details:
    Email: {user_email}
    Status: Active
    
    Login here: https://wellnessoptimalmindbody.com/login
    
    Getting Started:
    - Complete your profile information
    - Explore health monitoring features
    - Join live sessions
    - Access wellness resources
    
    This is an automated notification from the Dr. Vince Platform.
    If you have any questions, please contact support.
    """
    
    return send_email([user_email], subject, html_content, text_content)


def send_user_rejected_email(user_email: str, user_name: str, reason: str = None):
    """
    Send notification to user when their account is rejected/deactivated
    
    Args:
        user_email: Email of the user
        user_name: Full name of the user
        reason: Optional reason for rejection
    """
    subject = "Account Status Update - Dr. Vince Platform"
    
    reason_text = f"<p><strong>Reason:</strong> {reason}</p>" if reason else ""
    reason_plain = f"\nReason: {reason}\n" if reason else ""
    
    html_content = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                <div style="background-color: #f44336; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">Account Status Update</h1>
                </div>
                <div style="background-color: white; padding: 30px; margin-top: 20px; border-radius: 5px;">
                    <h2 style="color: #f44336;">Account Not Approved</h2>
                    <p>Hi {user_name},</p>
                    <p>We regret to inform you that your account registration could not be approved at this time.</p>
                    {reason_text}
                    
                    <div style="margin: 30px 0; padding: 20px; background-color: #fff3f3; border-left: 4px solid #f44336;">
                        <p style="margin: 0;"><strong>What does this mean?</strong></p>
                        <p style="margin: 10px 0 0 0;">You will not be able to access the Dr. Vince Platform with this account.</p>
                    </div>
                    
                    <div style="margin-top: 30px; padding: 20px; background-color: #f0f8ff; border-left: 4px solid #2196F3;">
                        <p style="margin: 0;"><strong>Need Help?</strong></p>
                        <p style="margin: 10px 0 0 0;">If you believe this is an error or would like to discuss your application, please contact our support team.</p>
                        <p style="margin: 10px 0 0 0;">Email: Info@soulresidue.net</p>
                    </div>
                </div>
                <div style="margin-top: 20px; text-align: center; color: #666; font-size: 12px;">
                    <p>This is an automated notification from the Dr. Vince Platform.</p>
                </div>
            </div>
        </body>
    </html>
    """
    
    text_content = f"""
    Account Status Update - Dr. Vince Platform
    
    Hi {user_name},
    
    We regret to inform you that your account registration could not be approved at this time.
    {reason_plain}
    What does this mean?
    You will not be able to access the Dr. Vince Platform with this account.
    
    Need Help?
    If you believe this is an error or would like to discuss your application, please contact our support team.
    Email: Info@soulresidue.net
    
    This is an automated notification from the Dr. Vince Platform.
    """
    
    return send_email([user_email], subject, html_content, text_content)
