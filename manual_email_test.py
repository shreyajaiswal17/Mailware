import smtplib
from email.mime.text import MIMEText
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_email_configuration():
    """Test email configuration and send a test email"""
    
    # Get configuration from environment
    sender_email = os.getenv("SENDER_EMAIL")
    receiver_email = os.getenv("RECEIVER_EMAIL")
    email_password = os.getenv("EMAIL_PASSWORD")
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    
    # Validate required variables
    if not all([sender_email, receiver_email, email_password]):
        print("❌ Missing required email configuration!")
        print("Please check your .env file for:")
        print("- SENDER_EMAIL")
        print("- RECEIVER_EMAIL") 
        print("- EMAIL_PASSWORD")
        return False
    
    print("🔧 Testing email configuration...")
    print(f"📧 From: {sender_email}")
    print(f"📧 To: {receiver_email}")
    print(f"🌐 SMTP: {smtp_server}:{smtp_port}")
    print("-" * 50)
    
    # Create test message
    test_message = f"""
🚨 Mailware System Test Email

This is a test email sent at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

✅ Email Configuration: Working
✅ SMTP Connection: Successful
✅ Authentication: Verified

If you received this email, your Mailware email alerting system is properly configured!

---
Mailware Log Monitoring System
    """
    
    msg = MIMEText(test_message)
    msg['Subject'] = f"🧪 Mailware Test Email - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"
    msg['From'] = sender_email
    msg['To'] = receiver_email
    
    try:
        print("🔄 Connecting to SMTP server...")
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            print("🔐 Starting TLS encryption...")
            server.starttls()
            
            print("🔑 Authenticating...")
            server.login(sender_email, email_password)
            
            print("📤 Sending test email...")
            server.send_message(msg)
            
        print("✅ Test email sent successfully!")
        print(f"📬 Check your inbox at {receiver_email}")
        return True
        
    except smtplib.SMTPAuthenticationError:
        print("❌ Authentication failed!")
        print("💡 Tips:")
        print("   - For Gmail, use an App Password instead of your regular password")
        print("   - Enable 2-factor authentication and generate an App Password")
        print("   - Go to: Google Account > Security > App passwords")
        return False
        
    except smtplib.SMTPConnectError:
        print("❌ Could not connect to SMTP server!")
        print(f"💡 Check if {smtp_server}:{smtp_port} is accessible")
        return False
        
    except Exception as e:
        print(f"❌ Failed to send test email: {e}")
        return False

def check_system_health():
    """Check if all system components are working"""
    
    print("\n🏥 System Health Check")
    print("=" * 50)
    
    health_status = {
        "email_config": False,
        "elasticsearch": False,
        "log_files": False
    }
    
    # Check email configuration
    print("1. 📧 Email Configuration...")
    health_status["email_config"] = test_email_configuration()
    
    # Check Elasticsearch connection
    print("\n2. 🔍 Elasticsearch Connection...")
    try:
        from elasticsearch import Elasticsearch
        es = Elasticsearch("http://localhost:9200")
        
        if es.ping():
            print("✅ Elasticsearch is running")
            
            # Check if logs index exists
            if es.indices.exists(index="logs"):
                doc_count = es.count(index="logs")['count']
                print(f"✅ Logs index exists with {doc_count} documents")
            else:
                print("⚠️  Logs index doesn't exist yet (will be created automatically)")
            
            health_status["elasticsearch"] = True
        else:
            print("❌ Elasticsearch is not responding")
            
    except ImportError:
        print("❌ Elasticsearch library not installed")
        print("💡 Run: pip install elasticsearch")
    except Exception as e:
        print(f"❌ Elasticsearch connection failed: {e}")
        print("💡 Make sure Elasticsearch is running on http://localhost:9200")
    
    # Check log files
    print("\n3. 📝 Log Files...")
    log_files = ["app.log"]
    
    for log_file in log_files:
        if os.path.exists(log_file):
            file_size = os.path.getsize(log_file)
            print(f"✅ {log_file} exists ({file_size} bytes)")
            health_status["log_files"] = True
        else:
            print(f"⚠️  {log_file} not found")
    
    # Summary
    print("\n📊 Health Summary")
    print("-" * 30)
    
    total_checks = len(health_status)
    passed_checks = sum(health_status.values())
    
    for component, status in health_status.items():
        status_icon = "✅" if status else "❌"
        print(f"{status_icon} {component.replace('_', ' ').title()}")
    
    print(f"\n🎯 Overall Health: {passed_checks}/{total_checks} components working")
    
    if passed_checks == total_checks:
        print("🎉 All systems operational!")
    elif passed_checks > 0:
        print("⚠️  Some issues detected - check the details above")
    else:
        print("🚨 Multiple system failures detected!")
    
    return health_status

if __name__ == "__main__":
    print("🚀 Mailware Manual Email Test & System Check")
    print("=" * 60)
    
    # Run system health check
    health_status = check_system_health()
    
    print("\n" + "=" * 60)
    print("✨ Test completed!")
    
    if health_status["email_config"]:
        print("💌 Email system is ready for alerts!")
    else:
        print("🔧 Please fix email configuration before running log monitoring")