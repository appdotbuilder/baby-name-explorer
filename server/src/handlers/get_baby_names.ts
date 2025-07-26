
import { db } from '../db';
import { babyNamesTable } from '../db/schema';
import { type GetBabyNamesQuery, type BabyName } from '../schema';
import { eq, ilike, or, and, type SQL } from 'drizzle-orm';

export const getBabyNames = async (query: GetBabyNamesQuery): Promise<BabyName[]> => {
  try {
    // Build conditions array for filtering
    const conditions: SQL<unknown>[] = [];

    // Filter by language if provided
    if (query.language) {
      conditions.push(eq(babyNamesTable.language, query.language));
    }

    // Filter by gender if provided
    if (query.gender) {
      conditions.push(eq(babyNamesTable.gender, query.gender));
    }

    // Filter by origin if provided
    if (query.origin) {
      conditions.push(eq(babyNamesTable.origin, query.origin));
    }

    // Search in name or meaning if search term provided
    if (query.search) {
      conditions.push(
        or(
          ilike(babyNamesTable.name, `%${query.search}%`),
          ilike(babyNamesTable.meaning, `%${query.search}%`)
        )!
      );
    }

    // Build and execute the query in a single chain
    const results = conditions.length > 0
      ? await db.select()
          .from(babyNamesTable)
          .where(and(...conditions))
          .limit(query.limit)
          .offset(query.offset)
          .execute()
      : await db.select()
          .from(babyNamesTable)
          .limit(query.limit)
          .offset(query.offset)
          .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch baby names:', error);
    throw error;
  }
};
