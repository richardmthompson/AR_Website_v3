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
    """Send internal notification email to AR Automation team (PLACEHOLDER FOR TESTING)"""
    try:
        # PLACEHOLDER: Just print to console instead of actually sending
        internal_email = os.getenv("INTERNAL_NOTIFICATION_EMAIL", "team@arautomation.com")

        print(f"\n{'='*60}")
        print(f"📧 [PLACEHOLDER] Internal notification email to: {internal_email}")
        print(f"{'='*60}")
        print(f"Subject: 🚀 New Lead: {lead_data.get('name', 'Unknown')} from {lead_data.get('company', 'Unknown Company')}")
        print(f"\nLead Details:")
        print(f"  Name: {lead_data.get('name', 'Unknown')}")
        print(f"  Email: {lead_data.get('email', 'Not provided')}")
        print(f"  Phone: {lead_data.get('phone', 'Not provided')}")
        print(f"  Company: {lead_data.get('company', 'Not provided')}")
        print(f"  Role: {lead_data.get('role', 'Not provided')}")
        print(f"  Organization Type: {lead_data.get('organization_type', 'Not provided')}")
        print(f"  Operational Challenges: {lead_data.get('operational_challenges', 'Not provided')}")
        print(f"  Automation Goals: {lead_data.get('automation_goals', 'Not provided')}")
        if lead_data.get('additional_context'):
            print(f"  Additional Context: {lead_data.get('additional_context')}")
        print(f"  Timestamp: {lead_data.get('timestamp', 'Just now')}")
        print(f"{'='*60}\n")

        return True

    except Exception as e:
        print(f"Error in placeholder email notification: {e}")
        return False

async def send_thank_you_email(lead_data: Dict) -> bool:
    """Send thank you email to prospect (PLACEHOLDER FOR TESTING)"""
    try:
        prospect_email = lead_data.get("email")
        if not prospect_email:
            print("No prospect email provided, skipping thank you email")
            return False

        # PLACEHOLDER: Just print to console instead of actually sending
        print(f"\n{'='*60}")
        print(f"📧 [PLACEHOLDER] Thank you email to: {prospect_email}")
        print(f"{'='*60}")
        print(f"From: Max at AR Automation <max@arautomation.com>")
        print(f"Subject: Thanks for reaching out to AR Automation!")
        print(f"\nMessage Preview:")
        print(f"  Hi {lead_data.get('name', 'there')}!")
        print(f"  Thanks for reaching out about {lead_data.get('company', 'your organization')}'s automation needs.")
        print(f"  We'll respond within 24 hours to discuss how we can help.")
        print(f"{'='*60}\n")

        return True

    except Exception as e:
        print(f"Error in placeholder thank you email: {e}")
        return False

async def send_context_update_email(lead_data: Dict) -> bool:
    """Send update email to sales team with additional context (PLACEHOLDER FOR TESTING)"""
    try:
        additional_context = lead_data.get("additional_context", "")
        if not additional_context:
            print("No additional context to send")
            return False

        # PLACEHOLDER: Just print to console instead of actually sending
        internal_email = os.getenv("INTERNAL_NOTIFICATION_EMAIL", "team@arautomation.com")

        print(f"\n{'='*60}")
        print(f"📧 [PLACEHOLDER] Context update email to: {internal_email}")
        print(f"{'='*60}")
        print(f"Subject: 📝 Update on {lead_data.get('name', 'Lead')}: Additional Context")
        print(f"\nLead Information:")
        print(f"  Name: {lead_data.get('name', 'Unknown')}")
        print(f"  Company: {lead_data.get('company', 'Not provided')}")
        print(f"  Email: {lead_data.get('email', 'Not provided')}")
        print(f"\nAdditional Context:")
        print(f"  {additional_context}")
        print(f"{'='*60}\n")

        return True

    except Exception as e:
        print(f"Error in placeholder context update email: {e}")
        return False
