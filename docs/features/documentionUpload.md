# Document Upload & Storage — Firebase Implementation

## 1. Overview

- Users can **upload documents or images** through the app.  
- The files are stored in **Firebase Storage**.  
- After upload, Firebase returns a **download URL**.  
- This URL is saved in the **Firestore database** for reference.  
- Admins can later view these documents via the URL in the **admin dashboard**.

---

## 2. Workflow

1. **User Upload**
   - User selects a file (image, PDF, etc.) and uploads through the app.  
   - File is sent to Firebase Storage using the SDK.

2. **Firebase Storage**
   - File is saved in a structured path, e.g., `documents/{userId}/{timestamp}_{filename}`.  
   - Firebase generates a **public or secure download URL**.

3. **Store URL in Database**
   - The returned download URL is stored in a Firestore collection (e.g., `userDocuments`).  
   - Fields stored:
     - `userId`
     - `fileName`
     - `downloadUrl`
     - `timestamp`

4. **Admin Dashboard**
   - Admins query the Firestore collection.  
   - Using the `downloadUrl`, the document or image is displayed in the dashboard.

---

## 3. Notes

- Ensure URLs are **secure** or use Firebase rules to control access.  
- Keep consistent naming in Storage paths to prevent collisions.  
- Timestamp and `userId` in path help in easy organization and retrieval.  
- All uploaded documents are **traceable** and can be audited through Firestore records.
