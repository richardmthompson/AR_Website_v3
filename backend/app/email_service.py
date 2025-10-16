import os
import resend
from jinja2 import Template
from pathlib import Path
from typing import Dict, Optional

# Initialize Resend with API key
resend.api_key = os.getenv("RESEND_API_KEY")

# Get templates directory
TEMPLATES_DIR = Path(__file__).parent / "templates" / "emails"

def load_template(template_name: str) -> Template:
    """Load email template from file"""
    template_path = TEMPLATES_DIR / template_name
    with open(template_path, 'r', encoding='utf-8') as f:
        return Template(f.read())

async def send_internal_notification(lead_data: Dict) -> bool:
    """Send internal notification email to AR Automation team"""
    try:
        internal_email = os.getenv("INTERNAL_NOTIFICATION_EMAIL", "team@arautomation.com")

        # Load and render template
        template = load_template("internal_notification.html")
        html_content = template.render(
            name=lead_data.get('name', 'Unknown'),
            email=lead_data.get('email', 'Not provided'),
            phone=lead_data.get('phone', 'Not provided'),
            company=lead_data.get('company', 'Unknown Company'),
            role=lead_data.get('role', 'Not provided'),
            organization_type=lead_data.get('organization_type', 'Not provided'),
            operational_challenges=lead_data.get('operational_challenges', 'Not provided'),
            automation_goals=lead_data.get('automation_goals', 'Not provided'),
            additional_context=lead_data.get('additional_context', ''),
            timestamp=lead_data.get('timestamp', 'Just now')
        )

        # Send email via Resend
        params = {
            "from": "onboarding@resend.dev",  # TODO: Change to max@arautomation.com after domain verification
            "to": [internal_email],
            "subject": f"🚀 New Lead: {lead_data.get('name', 'Unknown')} from {lead_data.get('company', 'Unknown Company')}",
            "html": html_content,
        }

        email = resend.Emails.send(params)
        print(f"✅ Internal notification sent to {internal_email} (ID: {email['id']})")
        return True

    except Exception as e:
        print(f"❌ Error sending internal notification: {e}")
        return False

async def send_thank_you_email(lead_data: Dict) -> bool:
    """Send thank you email to prospect"""
    try:
        prospect_email = lead_data.get("email")
        if not prospect_email:
            print("⚠️  No prospect email provided, skipping thank you email")
            return False

        # Load and render template
        template = load_template("thank_you.html")
        html_content = template.render(
            name=lead_data.get('name', 'there'),
            company=lead_data.get('company', 'your organization')
        )

        # Send email via Resend
        params = {
            "from": "onboarding@resend.dev",  # TODO: Change to max@arautomation.com after domain verification
            "to": [prospect_email],
            "subject": "Thanks for reaching out to AR Automation!",
            "html": html_content,
        }

        email = resend.Emails.send(params)
        print(f"✅ Thank you email sent to {prospect_email} (ID: {email['id']})")
        return True

    except Exception as e:
        print(f"❌ Error sending thank you email: {e}")
        return False

async def send_context_update_email(lead_data: Dict) -> bool:
    """Send update email to sales team with additional context"""
    try:
        additional_context = lead_data.get("additional_context", "")
        if not additional_context:
            print("ℹ️  No additional context to send")
            return False

        internal_email = os.getenv("INTERNAL_NOTIFICATION_EMAIL", "team@arautomation.com")

        # Create simple HTML email for context update
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: #667eea; padding: 20px; border-radius: 8px 8px 0 0; color: white;">
                <h2 style="margin: 0;">📝 Lead Update: Additional Context</h2>
            </div>
            <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
                <h3 style="color: #667eea; margin-top: 0;">Lead Information</h3>
                <p><strong>Name:</strong> {lead_data.get('name', 'Unknown')}</p>
                <p><strong>Company:</strong> {lead_data.get('company', 'Not provided')}</p>
                <p><strong>Email:</strong> <a href="mailto:{lead_data.get('email', '')}">{lead_data.get('email', 'Not provided')}</a></p>

                <div style="background: #f0f7ff; padding: 20px; border-radius: 8px; margin-top: 20px; border-left: 4px solid #667eea;">
                    <h3 style="color: #667eea; margin-top: 0;">Additional Context</h3>
                    <p style="white-space: pre-wrap; margin: 0;">{additional_context}</p>
                </div>

                <div style="margin-top: 30px; text-align: center;">
                    <a href="mailto:{lead_data.get('email', '')}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                        Respond to Lead
                    </a>
                </div>
            </div>
        </body>
        </html>
        """

        # Send email via Resend
        params = {
            "from": "Max at AR Automation <max@arautomation.com>",
            "to": [internal_email],
            "subject": f"📝 Update on {lead_data.get('name', 'Lead')}: Additional Context",
            "html": html_content,
        }

        email = resend.Emails.send(params)
        print(f"✅ Context update sent to {internal_email} (ID: {email['id']})")
        return True

    except Exception as e:
        print(f"❌ Error sending context update: {e}")
        return False
