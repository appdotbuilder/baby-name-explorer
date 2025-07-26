
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { parentingQuotesTable } from '../db/schema';
import { type CreateParentingQuoteInput } from '../schema';
import { deleteParentingQuote } from '../handlers/delete_parenting_quote';
import { eq } from 'drizzle-orm';

// Test input for creating a parenting quote to delete
const testInput: CreateParentingQuoteInput = {
  quote: 'Children are not things to be molded, but people to be unfolded.',
  author: 'Jess Lair',
  category: 'wisdom',
  language: 'english',
  is_active: true
};

describe('deleteParentingQuote', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete a parenting quote', async () => {
    // Create a parenting quote first
    const created = await db.insert(parentingQuotesTable)
      .values(testInput)
      .returning()
      .execute();

    const createdQuote = created[0];

    // Delete the parenting quote
    const result = await deleteParentingQuote(createdQuote.id);

    // Verify the returned data matches the deleted record
    expect(result.id).toEqual(createdQuote.id);
    expect(result.quote).toEqual('Children are not things to be molded, but people to be unfolded.');
    expect(result.author).toEqual('Jess Lair');
    expect(result.category).toEqual('wisdom');
    expect(result.language).toEqual('english');
    expect(result.is_active).toEqual(true);
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should remove parenting quote from database', async () => {
    // Create a parenting quote first
    const created = await db.insert(parentingQuotesTable)
      .values(testInput)
      .returning()
      .execute();

    const createdQuote = created[0];

    // Delete the parenting quote
    await deleteParentingQuote(createdQuote.id);

    // Verify the record no longer exists in the database
    const quotes = await db.select()
      .from(parentingQuotesTable)
      .where(eq(parentingQuotesTable.id, createdQuote.id))
      .execute();

    expect(quotes).toHaveLength(0);
  });

  it('should throw error when parenting quote does not exist', async () => {
    const nonExistentId = 999;

    // Attempt to delete a non-existent parenting quote
    await expect(deleteParentingQuote(nonExistentId)).rejects.toThrow(/not found/i);
  });

  it('should handle deletion of quote with null fields', async () => {
    // Create a parenting quote with null fields
    const minimalInput: CreateParentingQuoteInput = {
      quote: 'A simple quote without extras.',
      author: null,
      category: null,
      language: 'hindi',
      is_active: false
    };

    const created = await db.insert(parentingQuotesTable)
      .values(minimalInput)
      .returning()
      .execute();

    const createdQuote = created[0];

    // Delete the parenting quote
    const result = await deleteParentingQuote(createdQuote.id);

    // Verify the returned data includes null fields
    expect(result.id).toEqual(createdQuote.id);
    expect(result.quote).toEqual('A simple quote without extras.');
    expect(result.author).toBeNull();
    expect(result.category).toBeNull();
    expect(result.language).toEqual('hindi');
    expect(result.is_active).toEqual(false);
  });
});
