
import { db } from '../db';
import { parentingQuotesTable } from '../db/schema';
import { type GetParentingQuotesQuery, type ParentingQuote } from '../schema';
import { eq, and, ilike, type SQL } from 'drizzle-orm';

export const getParentingQuotes = async (query: GetParentingQuotesQuery): Promise<ParentingQuote[]> => {
  try {
    // Start with base query
    let baseQuery = db.select().from(parentingQuotesTable);

    // Build conditions array
    const conditions: SQL<unknown>[] = [];

    // Filter by language
    if (query.language) {
      conditions.push(eq(parentingQuotesTable.language, query.language));
    }

    // Filter by category (case-insensitive partial match)
    if (query.category) {
      conditions.push(ilike(parentingQuotesTable.category, `%${query.category}%`));
    }

    // Filter by active status (defaults to true from schema)
    conditions.push(eq(parentingQuotesTable.is_active, query.is_active));

    // Apply where conditions
    const finalQuery = conditions.length > 0
      ? baseQuery.where(conditions.length === 1 ? conditions[0] : and(...conditions))
      : baseQuery;

    // Apply pagination
    const results = await finalQuery
      .limit(query.limit)
      .offset(query.offset)
      .execute();

    return results;
  } catch (error) {
    console.error('Get parenting quotes failed:', error);
    throw error;
  }
};
