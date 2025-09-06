# Admin Management — Firebase Implementation

## 1. Overview

The system allows you to:

- Add an admin
- Remove an admin
- List all admins

All operations are powered by **Firebase Firestore** collections.

---

## 2. Firestore Collections

### a) `addAdmin`

- Stores all currently added admins.
- Fields include:
  - `uid` or unique identifier
  - `name` / email
  - `timestamp` → when the admin was added
- Used to **display current admins** in the admin dashboard.

### b) `removedAdmin`

- Stores all admins who have been removed.
- Fields include:
  - `uid` / unique identifier
  - `name` / email
  - `timestamp` → when the admin was removed
- Useful for **audit logs** or rollback if needed.

---

## 3. Admin Operations

1. **Add Admin**
   - Create a new document in `addAdmin` collection with admin info and timestamp.

2. **Remove Admin**
   - Move the admin entry from `addAdmin` → `removedAdmin`.
   - Optionally delete from `addAdmin` to prevent access.

3. **List Admins**
   - Query `addAdmin` collection to display all active admins in the dashboard.

---

## 4. Notes

- Firebase handles real-time updates automatically, so any changes reflect instantly in the UI.
- Timestamps help in **tracking admin history**.
- Keep consistent document structure for both collections for easier management and querying.
