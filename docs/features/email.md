# Email Notifications — NodeMailer Implementation

## 1. Overview

- Email notifications are sent using the **NodeMailer** library.  
- NodeMailer works with Gmail (or other SMTP services) via an **App Password** or service credentials.  
- Emails are triggered when a **user’s status updates** in the system.

---

## 2. Workflow

1. **API Call**
   - Whenever a user’s status changes (approved, rejected, etc.), an API endpoint is called.  
   - Example: `/api/updateStatus`.

2. **Send Email**
   - Inside the API, NodeMailer is used to construct and send the email:
     - Recipient: user’s email
     - Subject and body: based on status update
   - NodeMailer authenticates using:
     - Gmail email account
     - App Password (recommended for security)

3. **Dependencies**
   - NodeMailer is installed via npm:  
     ```bash
     npm install nodemailer
     ```
   - Ensure your Gmail account allows **App Passwords** or SMTP access.

---

## 3. Notes

- Keep email credentials secure (use `.env` variables).  
- Each status update API handles **both database update and email sending**.  
- Emails provide real-time feedback to users about their scholarship/application status.
