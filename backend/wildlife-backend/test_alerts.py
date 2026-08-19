import os
import unittest
from unittest.mock import patch, MagicMock

# Import the alert functions
from api.alerts import send_sms_alert, send_email_alert

class TestAlertRouting(unittest.TestCase):

    @patch('requests.post')
    def test_send_sms_telegram(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_post.return_value = mock_response

        # Set Telegram Bot environment variables
        with patch.dict(os.environ, {
            "TELEGRAM_BOT_TOKEN": "123456:ABC-DEF",
            "TELEGRAM_CHAT_ID": "987654321"
        }, clear=True):
            result = send_sms_alert("+12345", "Test Telegram")
            self.assertTrue(result)
            mock_post.assert_called_once()
            
            # Verify endpoint and body
            args, kwargs = mock_post.call_args
            self.assertIn("api.telegram.org/bot123456:ABC-DEF/sendMessage", args[0])
            self.assertEqual(kwargs['json']['chat_id'], "987654321")
            self.assertEqual(kwargs['json']['text'], "Test Telegram")

    @patch('requests.post')
    def test_send_sms_discord(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 204
        mock_post.return_value = mock_response

        # Set Discord environment variable
        with patch.dict(os.environ, {
            "DISCORD_WEBHOOK_URL": "https://discord.com/api/webhooks/123/abc"
        }, clear=True):
            result = send_sms_alert("+12345", "Test Discord")
            self.assertTrue(result)
            mock_post.assert_called_once()
            
            # Verify endpoint and content
            args, kwargs = mock_post.call_args
            self.assertEqual(args[0], "https://discord.com/api/webhooks/123/abc")
            self.assertEqual(kwargs['json']['content'], "Test Discord")

    @patch('requests.post')
    def test_send_email_mailjet_api(self, mock_post):
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_post.return_value = mock_response

        with patch.dict(os.environ, {
            "MAILJET_API_KEY": "mj_public_key",
            "MAILJET_SECRET_KEY": "mj_private_key",
            "FROM_EMAIL": "sender@wildvision.ai"
        }, clear=True):
            result = send_email_alert("recipient@domain.com", "Mailjet Message", "warning")
            self.assertTrue(result)
            mock_post.assert_called_once()
            
            # Verify endpoint, authentication, and payload
            args, kwargs = mock_post.call_args
            self.assertEqual(args[0], "https://api.mailjet.com/v3.1/send")
            self.assertEqual(kwargs['auth'], ("mj_public_key", "mj_private_key"))
            
            # Verify recipient and message body in payload
            messages = kwargs['json']['Messages']
            self.assertEqual(messages[0]['To'][0]['Email'], "recipient@domain.com")
            self.assertEqual(messages[0]['TextPart'], "Mailjet Message")

    @patch('smtplib.SMTP')
    def test_send_email_mailjet_smtp_fallback(self, mock_smtp_class):
        mock_smtp = MagicMock()
        mock_smtp_class.return_value = mock_smtp

        # Set SMTP Server details pointing to Mailjet SMTP host
        with patch.dict(os.environ, {
            "SMTP_SERVER": "in-v3.mailjet.com",
            "SMTP_USER": "mj_public_key",
            "SMTP_PASSWORD": "mj_private_key",
            "FROM_EMAIL": "sender@wildvision.ai"
        }, clear=True):
            result = send_email_alert("recipient@domain.com", "SMTP Message", "critical")
            self.assertTrue(result)
            mock_smtp_class.assert_called_once_with("in-v3.mailjet.com", 587)
            mock_smtp.login.assert_called_once_with("mj_public_key", "mj_private_key")
            mock_smtp.send_message.assert_called_once()

    def test_send_sms_mock_fallback(self):
        with patch.dict(os.environ, {}, clear=True):
            result = send_sms_alert("+987654321", "Test Message")
            self.assertTrue(result)

    def test_send_email_mock_fallback(self):
        with patch.dict(os.environ, {}, clear=True):
            result = send_email_alert("test@recipient.com", "Alert Message", "critical")
            self.assertTrue(result)

    def test_mailjet_webhook_updates_status(self):
        mock_db = MagicMock()
        mock_alert = MagicMock()
        mock_alert.id = 123
        mock_alert.status = "Pending"
        
        # Mock DB query
        mock_db.query.return_value.filter.return_value.first.return_value = mock_alert
        
        from api.alerts import mailjet_webhook
        payload = {
            "event": "open",
            "CustomID": "123"
        }
        
        response = mailjet_webhook(payload, db=mock_db)
        self.assertEqual(response, {"status": "success"})
        self.assertEqual(mock_alert.status, "Opened")
        mock_db.commit.assert_called_once()

if __name__ == '__main__':
    unittest.main()
