import { db } from '@/db/index';
import { categories } from '@/db/schema/admin/categories';
import { eq } from 'drizzle-orm';

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url); // Get the search parameters from the URL
  const id = searchParams.get('id'); // Get the category ID from the query parameters

  if (!id) {
    return new Response(JSON.stringify({ error: 'Category ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Delete the category from the database where id matches
    await db.delete(categories).where(eq(categories.id, id));

    return new Response(
      JSON.stringify({ message: 'Category deleted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete category' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
