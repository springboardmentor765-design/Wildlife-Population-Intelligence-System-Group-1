from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os

from database.database import get_db
from database.models import Alert
from schemas.alert import AlertCreate, AlertResponse
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# ----------------------------------------------------
# Mock / Real Sender Functions
# ----------------------------------------------------

def send_sms_alert(recipient: str, message: str) -> bool:
    """Attempt to send SMS/Message via Telegram Bot, Discord Webhook, fallback to legacy providers or Mock"""
    telegram_token = os.getenv("TELEGRAM_BOT_TOKEN")
    
    # Check if recipient overrides default Telegram Chat ID (numeric or starts with @)
    recipient_is_chat_id = recipient and (recipient.lstrip('-').isdigit() or recipient.startswith('@'))
    telegram_chat = recipient if recipient_is_chat_id else os.getenv("TELEGRAM_CHAT_ID")

    # Check if recipient overrides default Discord Webhook URL (starts with http)
    recipient_is_webhook = recipient and recipient.startswith("http")
    discord_webhook = recipient if recipient_is_webhook else os.getenv("DISCORD_WEBHOOK_URL")

    # 1. Try Telegram Bot
    if telegram_token and telegram_chat:
        try:
            import requests
            url = f"https://api.telegram.org/bot{telegram_token}/sendMessage"
            payload = {
                "chat_id": telegram_chat,
                "text": message
            }
            response = requests.post(url, json=payload, timeout=10)
            if response.status_code == 200:
                print(f"✅ Real Telegram Alert Sent to Chat {telegram_chat}.")
                return True
            else:
                print(f"❌ Telegram Bot Failed: {response.text}")
        except Exception as e:
            print(f"❌ Telegram Bot Exception: {e}")

    # 2. Try Discord Webhook
    if discord_webhook:
        try:
            import requests
            payload = {
                "content": message
            }
            response = requests.post(discord_webhook, json=payload, timeout=10)
            if response.status_code in [200, 204]:
                print(f"✅ Real Discord Alert Sent via Webhook.")
                return True
            else:
                print(f"❌ Discord Webhook Failed: Status {response.status_code}, Response: {response.text}")
        except Exception as e:
            print(f"❌ Discord Webhook Exception: {e}")

    # Legacy Vonage fallback
    vonage_key = os.getenv("VONAGE_API_KEY")
    vonage_secret = os.getenv("VONAGE_API_SECRET")
    vonage_from = os.getenv("VONAGE_PHONE_NUMBER")

    if vonage_key and vonage_secret and vonage_from and recipient:
        try:
            import requests
            url = "https://rest.nexmo.com/sms/json"
            payload = {
                "api_key": vonage_key,
                "api_secret": vonage_secret,
                "to": recipient,
                "from": vonage_from,
                "text": message
            }
            response = requests.post(url, json=payload, timeout=10)
            res_data = response.json()
            messages = res_data.get("messages", [])
            if messages and messages[0].get("status") == "0":
                print(f"✅ Real SMS Sent to {recipient} via Vonage.")
                return True
            else:
                error_text = messages[0].get("error-text") if messages else "Unknown error"
                print(f"❌ Vonage SMS Failed: {error_text}")
                return False
        except Exception as e:
            print(f"❌ Vonage SMS Exception: {e}")
            return False

    # Legacy Twilio fallback
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_number = os.getenv("TWILIO_PHONE_NUMBER")

    if account_sid and auth_token and from_number and recipient:
        try:
            from twilio.rest import Client
            client = Client(account_sid, auth_token)
            client.messages.create(
                body=message,
                from_=from_number,
                to=recipient
            )
            print(f"✅ Real SMS Sent to {recipient} via Twilio.")
            return True
        except Exception as e:
            print(f"❌ Twilio SMS Failed: {e}")
            return False

    # Mock Mode
    print("=" * 60)
    print(f"📲 MOCK MESSAGE ALERT DISPATCHED")
    print(f"To: {recipient}")
    print(f"Message: {message}")
    print("=" * 60)
    return True

def send_email_alert(recipient: str, message: str, severity: str, alert_id: int = None) -> bool:
    """Attempt to send Email via Mailjet API, fallback to SMTP/SendGrid/Resend, fallback to Mock"""
    mailjet_key = os.getenv("MAILJET_API_KEY")
    mailjet_secret = os.getenv("MAILJET_SECRET_KEY")
    from_email = os.getenv("FROM_EMAIL") or os.getenv("SMTP_USER")

    # 1. Mailjet REST API v3.1
    if mailjet_key and mailjet_secret and from_email:
        try:
            import requests
            url = "https://api.mailjet.com/v3.1/send"
            headers = {
                "Content-Type": "application/json"
            }
            msg_payload = {
                "From": {
                    "Email": from_email,
                    "Name": "WildVision AI Alert"
                },
                "To": [
                    {
                        "Email": recipient,
                        "Name": recipient
                    }
                ],
                "Subject": f"[{severity.upper()}] WildVision AI Alert",
                "TextPart": message,
                "HTMLPart": f"<h3>[{severity.upper()}] WildVision AI Alert</h3><p>{message}</p>"
            }
            if alert_id is not None:
                msg_payload["CustomID"] = str(alert_id)

            payload = {
                "Messages": [msg_payload]
            }
            response = requests.post(
                url, 
                json=payload, 
                headers=headers, 
                auth=(mailjet_key, mailjet_secret), 
                timeout=10
            )
            if response.status_code in [200, 201, 202]:
                print(f"✅ Real Email Sent to {recipient} via Mailjet API.")
                return True
            else:
                print(f"❌ Mailjet Email Failed: Status {response.status_code}, Response: {response.text}")
        except Exception as e:
            print(f"❌ Mailjet Email Exception: {e}")

    # Legacy SendGrid, Resend, or SMTP fallbacks
    sendgrid_key = os.getenv("SENDGRID_API_KEY")
    resend_key = os.getenv("RESEND_API_KEY")

    # SendGrid API fallback
    if sendgrid_key and from_email:
        try:
            import requests
            url = "https://api.sendgrid.com/v3/mail/send"
            headers = {
                "Authorization": f"Bearer {sendgrid_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "personalizations": [
                    {
                        "to": [{"email": recipient}],
                        "subject": f"[{severity.upper()}] WildVision AI Alert"
                    }
                ],
                "from": {"email": from_email},
                "content": [
                    {
                        "type": "text/plain",
                        "value": message
                    }
                ]
            }
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            if response.status_code in [200, 201, 202]:
                print(f"✅ Real Email Sent to {recipient} via SendGrid API.")
                return True
        except Exception as e:
            print(f"❌ SendGrid Email Exception: {e}")

    # Resend API fallback
    if resend_key and from_email:
        try:
            import requests
            url = "https://api.resend.com/emails"
            headers = {
                "Authorization": f"Bearer {resend_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "from": from_email,
                "to": recipient,
                "subject": f"[{severity.upper()}] WildVision AI Alert",
                "text": message
            }
            response = requests.post(url, json=payload, headers=headers, timeout=10)
            if response.status_code in [200, 201, 202]:
                print(f"✅ Real Email Sent to {recipient} via Resend API.")
                return True
        except Exception as e:
            print(f"❌ Resend Email Exception: {e}")

    # Legacy SMTP
    smtp_server = os.getenv("SMTP_SERVER") or (os.getenv("MAILJET_API_KEY") and "in-v3.mailjet.com")
    smtp_port = os.getenv("SMTP_PORT", 587)
    smtp_user = os.getenv("SMTP_USER") or os.getenv("MAILJET_API_KEY")
    smtp_pass = os.getenv("SMTP_PASSWORD") or os.getenv("MAILJET_SECRET_KEY")

    if smtp_server and smtp_user and smtp_pass:
        import smtplib
        from email.message import EmailMessage
        try:
            msg = EmailMessage()
            msg.set_content(message)
            msg['Subject'] = f"[{severity.upper()}] WildVision AI Alert"
            msg['From'] = from_email or smtp_user
            msg['To'] = recipient
            if alert_id is not None:
                msg['X-MJ-CustomID'] = str(alert_id)

            server = smtplib.SMTP(smtp_server, int(smtp_port))
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
            server.quit()
            print(f"✅ Real Email Sent to {recipient} via SMTP ({smtp_server}).")
            return True
        except Exception as e:
            print(f"❌ SMTP Email Failed: {e}")

    # Mock Mode
    print("=" * 60)
    print(f"📧 MOCK EMAIL ALERT DISPATCHED")
    print(f"To: {recipient}")
    print(f"Subject: [{severity.upper()}] WildVision AI Alert")
    print(f"Message: {message}")
    print("=" * 60)
    return True



# ----------------------------------------------------
# Routes
# ----------------------------------------------------

@router.post("/send", response_model=AlertResponse)
def dispatch_alert(alert_in: AlertCreate, db: Session = Depends(get_db)):
    # Create DB Record
    db_alert = Alert(
        alert_type=alert_in.alert_type,
        recipient=alert_in.recipient,
        message=alert_in.message,
        severity=alert_in.severity,
        status="Pending"
    )
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)

    # Dispatch logic
    success = False
    alert_type_upper = alert_in.alert_type.upper()
    if alert_type_upper == "SMS":
        success = send_sms_alert(alert_in.recipient, alert_in.message)
    elif alert_type_upper == "EMAIL":
        success = send_email_alert(alert_in.recipient, alert_in.message, alert_in.severity, alert_id=db_alert.id)
    elif alert_type_upper == "TELEGRAM":
        success = send_sms_alert(alert_in.recipient, alert_in.message)
    elif alert_type_upper == "DISCORD":
        success = send_sms_alert(alert_in.recipient, alert_in.message)
    else:
        raise HTTPException(status_code=400, detail="Invalid alert_type. Must be SMS, Email, Telegram, or Discord.")

    # Update Status
    db_alert.status = "Sent" if success else "Failed"
    db.commit()
    db.refresh(db_alert)

    return db_alert

@router.post("/webhooks/mailjet")
def mailjet_webhook(payload: list | dict, db: Session = Depends(get_db)):
    """Handle Mailjet Event API Webhooks to update alert status in database"""
    events = payload if isinstance(payload, list) else [payload]
    
    for event_data in events:
        custom_id = event_data.get("CustomID")
        event_type = event_data.get("event")
        
        if custom_id and event_type:
            try:
                alert_id = int(custom_id)
                alert = db.query(Alert).filter(Alert.id == alert_id).first()
                if alert:
                    status_map = {
                        "sent": "Sent",
                        "delivered": "Delivered",
                        "open": "Opened",
                        "click": "Clicked",
                        "bounce": "Bounced",
                        "spam": "Spam Reported",
                        "blocked": "Blocked"
                    }
                    new_status = status_map.get(event_type.lower(), event_type.capitalize())
                    alert.status = new_status
                    db.commit()
                    print(f"🔄 Updated Alert {alert_id} status to '{new_status}' via Mailjet Webhook.")
            except ValueError:
                print(f"⚠️ Invalid CustomID '{custom_id}' received in webhook.")
            except Exception as e:
                print(f"❌ Failed to process webhook event: {e}")
                db.rollback()
                
    return {"status": "success"}

@router.get("/", response_model=List[AlertResponse])
def get_alerts(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    alerts = db.query(Alert).order_by(Alert.timestamp.desc()).offset(skip).limit(limit).all()
    return alerts
