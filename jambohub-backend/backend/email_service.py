# backend/email_service.py
"""
Email notification service for JamboHub
Sends notifications when new messages are posted to channels
Uses Gmail SMTP
"""

import os
import smtplib
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
import logging

logger = logging.getLogger(__name__)

# Email configuration
SENDER_EMAIL = os.getenv("GMAIL_USER", "jambohub@gmail.com")
SENDER_NAME = "JamboHub"

# Gmail SMTP configuration
GMAIL_PASSWORD = os.getenv("GMAIL_APP_PASSWORD")
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465


def send_email(to_email: str, to_name: str, subject: str, html_content: str) -> bool:
    """
    Send email via Gmail SMTP
    
    Args:
        to_email: Recipient email address
        to_name: Recipient name
        subject: Email subject line
        html_content: HTML body of email
    
    Returns:
        bool: True if successful, False otherwise
    """
    if not GMAIL_PASSWORD:
        logger.warning("GMAIL_APP_PASSWORD not set - skipping email")
        return False
    
    try:
        msg = MIMEMultipart('alternative')
        msg['From'] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
        msg['To'] = to_email
        msg['Subject'] = subject
        
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            server.login(SENDER_EMAIL, GMAIL_PASSWORD)
            server.send_message(msg)
        
        logger.info(f"Email sent to {to_email}: {subject}")
        return True
            
    except Exception as e:
        logger.error(f"Error sending email to {to_email}: {str(e)}")
        return False


def send_new_message_notification(
    recipient_email: str,
    recipient_name: str,
    channel_name: str,
    sender_name: str,
    message_preview: str
) -> bool:
    """
    Send notification about a new message in a channel
    """
    # Truncate message preview
    if len(message_preview) > 200:
        message_preview = message_preview[:200] + "..."
    
    subject = f"New message in {channel_name} - JamboHub"
    
    html_content = f"""
    <html>
    <head>
        <style>
            body {{
                font-family: 'Nunito Sans', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 500px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
                color: white;
                padding: 24px;
                text-align: center;
                border-radius: 12px 12px 0 0;
            }}
            .header h2 {{
                margin: 0;
                font-size: 20px;
            }}
            .content {{
                background-color: #f8f7fc;
                padding: 24px;
                border: 1px solid #e5e7eb;
                border-radius: 0 0 12px 12px;
            }}
            .message-box {{
                background-color: white;
                padding: 16px;
                margin: 16px 0;
                border-left: 4px solid #7C3AED;
                border-radius: 8px;
            }}
            .sender {{
                font-weight: 700;
                color: #7C3AED;
                margin-bottom: 8px;
            }}
            .channel-badge {{
                display: inline-block;
                background: #EDE9FE;
                color: #7C3AED;
                padding: 4px 12px;
                border-radius: 16px;
                font-size: 14px;
                font-weight: 600;
            }}
            .cta {{
                display: inline-block;
                background: linear-gradient(135deg, #7C3AED 0%, #A855F7 100%);
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 700;
                margin-top: 16px;
            }}
            .footer {{
                margin-top: 24px;
                padding-top: 16px;
                border-top: 1px solid #e5e7eb;
                font-size: 12px;
                color: #6b7280;
                text-align: center;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h2>🏕️ New Message in JamboHub</h2>
        </div>
        <div class="content">
            <p>Hi {recipient_name},</p>
            
            <p>There's a new message in <span class="channel-badge">{channel_name}</span></p>
            
            <div class="message-box">
                <div class="sender">{sender_name}</div>
                <div>{message_preview}</div>
            </div>
            
            <p>
                <a href="https://jambohub.fly.dev" class="cta">Open JamboHub</a>
            </p>
        </div>
        <div class="footer">
            <p>VAHC Contingent • National Jamboree 2026</p>
            <p>To stop receiving these emails, update your notification settings in JamboHub.</p>
        </div>
    </body>
    </html>
    """
    
    return send_email(recipient_email, recipient_name, subject, html_content)


def send_bulk_channel_notification(
    recipients: List[dict],
    channel_name: str,
    sender_name: str,
    message_preview: str
) -> int:
    """
    Send notification to multiple recipients
    
    Args:
        recipients: List of dicts with 'email' and 'name' keys
        channel_name: Name of the channel
        sender_name: Name of message sender
        message_preview: Preview of the message content
    
    Returns:
        int: Number of successfully sent emails
    """
    sent_count = 0
    
    for recipient in recipients:
        if send_new_message_notification(
            recipient['email'],
            recipient['name'],
            channel_name,
            sender_name,
            message_preview
        ):
            sent_count += 1
    
    return sent_count
