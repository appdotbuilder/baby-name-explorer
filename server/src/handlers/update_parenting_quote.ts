
import { db } from '../db';
import { parentingQuotesTable } from '../db/schema';
import { type UpdateParentingQuoteInput, type ParentingQuote } from '../schema';
import { eq } from 'drizzle-orm';

export const updateParentingQuote = async (input: UpdateParentingQuoteInput): Promise<ParentingQuote> => {
  try {
    // First, check if the parenting quote exists
    const existingQuote = await db.select()
      .from(parentingQuotesTable)
      .where(eq(parentingQuotesTable.id, input.id))
      .execute();

    if (existingQuote.length === 0) {
      throw new Error(`Parenting quote with id ${input.id} not found`);
    }

    // Prepare update data, only including fields that were provided
    const updateData: any = {
      updated_at: new Date()
    };

    if (input.quote !== undefined) {
      updateData.quote = input.quote;
    }

    if (input.author !== undefined) {
      updateData.author = input.author;
    }

    if (input.category !== undefined) {
      updateData.category = input.category;
    }

    if (input.language !== undefined) {
      updateData.language = input.language;
    }

    if (input.is_active !== undefined) {
      updateData.is_active = input.is_active;
    }

    // Update the parenting quote record
    const result = await db.update(parentingQuotesTable)
      .set(updateData)
      .where(eq(parentingQuotesTable.id, input.id))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Parenting quote update failed:', error);
    throw error;
  }
};
