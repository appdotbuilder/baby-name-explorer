
import { db } from '../db';
import { parentingQuotesTable } from '../db/schema';
import { type CreateParentingQuoteInput, type ParentingQuote } from '../schema';

export const createParentingQuote = async (input: CreateParentingQuoteInput): Promise<ParentingQuote> => {
  try {
    // Insert parenting quote record
    const result = await db.insert(parentingQuotesTable)
      .values({
        quote: input.quote,
        author: input.author,
        category: input.category,
        language: input.language,
        is_active: input.is_active
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Parenting quote creation failed:', error);
    throw error;
  }
};
