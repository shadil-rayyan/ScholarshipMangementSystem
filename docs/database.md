# 📄 Internal Documentation: Database Architecture & Migration Plan

## 1. Background

When we first launched, we selected **Vercel Postgres** as our database because:

- It was seamlessly integrated with Vercel hosting  
- Minimal setup was required, letting us iterate quickly  
- Early stage → cost & performance were not major concerns  

To interact with the database, we initially explored **Prisma** but found:

- Prisma was heavyweight, with large client size and slower cold starts  
- Limited flexibility when self-hosting on VPS in the future  

Instead, we adopted **Drizzle ORM**, because:

- Lightweight and TypeScript-first  
- Schema defined in code, enabling better version control  
- Easy to adapt for Postgres, MySQL, or SQLite  
- Excellent for monolithic architecture with plans to scale  

---

## 2. Hosting Strategy

- **Short term**: continue using Vercel Postgres for staging/dev  
- **Long term**: move to self-hosted Postgres on VPS (Hetzner, DigitalOcean, etc.)  

### Benefits
- Full control over performance tuning  
- Cost efficiency at scale  
- Can integrate read replicas, caching, and partitioning later  

---

## 3. Migration Plan

1. Define new schema in Drizzle (normalized tables)  
2. Export old data → transform → load into new schema  
3. Write migration script (ETL style) with validation checks  
4. Update app code to query via Drizzle models  
5. Test on staging before switching production traffic  
