
import { db } from '../db';
import { parentingQuotesTable } from '../db/schema';
import { type ParentingQuote } from '../schema';
import { eq } from 'drizzle-orm';

export const deleteParentingQuote = async (id: number): Promise<ParentingQuote> => {
  try {
    // Delete the parenting quote and return the deleted record
    const result = await db.delete(parentingQuotesTable)
      .where(eq(parentingQuotesTable.id, id))
      .returning()
      .execute();

    // Check if any record was deleted
    if (result.length === 0) {
      throw new Error(`Parenting quote with id ${id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Parenting quote deletion failed:', error);
    throw error;
  }
};
