# Data Management — Admin Data Handling

## 1. Current Implementation

- The `src/data` folder contains multiple `.ts` files.  
- These files store **static data for the admin side**.  
- Currently, any changes are done **manually by editing the hard-coded data**.  

## 2. Limitations

- Hard-coded data is **not secure**.  
- Updating data requires **manual code changes and redeployment**.  
- No real-time updates — admins cannot change data dynamically.  

## 3. Proposed Improvement

- Move all admin-related data to a **database (Firestore / Postgres)**.  
- Admin dashboard can **add/update/delete data** directly in the database.  
- Frontend loads data dynamically from the database instead of static files.  
- Benefits:
  - **Secure** and centralized data storage.  
  - **Real-time updates** without redeploying.  
  - Easier maintenance and scalability.

## 4. Implementation Notes

1. Replace static `.ts` imports with **API calls** to fetch data.  
2. Ensure database schemas match the current structure of the `.ts` files.  
3. Add caching or loading indicators if needed for performance.  
