# Scholarship Tracking — Email-based Lookup

## 1. Overview

- Scholarship tracking is done using the **user’s Google email**.  
- When a user logs in with Google OAuth, we retrieve their email.  
- This email is used to **match existing scholarship records** in the database.

---

## 2. Workflow

1. **User Login**
   - User logs in via Google Sign-In.  
   - The system captures the Google email.

2. **Track Scholarship**
   - User clicks the **“Track Scholarship”** button.  
   - Backend queries the database:
     - Checks if a record exists with the same email.  
     - Returns the scholarship status and details.

3. **Display Data**
   - If a matching record is found:
     - Scholarship details are shown on the user dashboard.
   - If no record exists:
     - User is informed that no scholarship is associated with the email.

---

## 3. Notes

- The system relies entirely on **email as a unique identifier** for scholarships.  
- No additional input is needed from the user beyond Google login.  
- Ensure database emails are consistent with the email used for login.
