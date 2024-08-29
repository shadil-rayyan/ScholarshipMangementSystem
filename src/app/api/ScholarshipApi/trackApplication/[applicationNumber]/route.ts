// src/app/api/ScholarshipApi/trackApplication/[applicationNumber]/route.ts
import type { NextRequest } from 'next/server';
import { ScholarshipDb, Scholarship_Table } from '@/db/schema/scholarship/scholarshipData';

export async function GET(request: NextRequest) {
  try {
    const applicationNumber = request.nextUrl.pathname.split('/').pop() || '';


    if (!applicationNumber || typeof applicationNumber !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid application ID' }), { status: 400 });
    }

    const result = await ScholarshipDb.select()
      .from(Scholarship_Table)
      .where(Scholarship_Table.applicationNumber.eq(applicationNumber))
      .execute();

    if (result.length === 0) {
      return new Response(JSON.stringify({ error: 'Application not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(result[0]), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
