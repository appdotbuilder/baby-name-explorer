
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { parentingQuotesTable } from '../db/schema';
import { type CreateParentingQuoteInput, type UpdateParentingQuoteInput } from '../schema';
import { updateParentingQuote } from '../handlers/update_parenting_quote';
import { eq } from 'drizzle-orm';

// Test data for creating initial parenting quote
const testCreateInput: CreateParentingQuoteInput = {
  quote: 'Original quote about parenting',
  author: 'Original Author',
  category: 'motivation',
  language: 'english',
  is_active: true
};

describe('updateParentingQuote', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update all fields of a parenting quote', async () => {
    // Create initial parenting quote
    const initialQuote = await db.insert(parentingQuotesTable)
      .values(testCreateInput)
      .returning()
      .execute();

    const updateInput: UpdateParentingQuoteInput = {
      id: initialQuote[0].id,
      quote: 'Updated quote about parenting wisdom',
      author: 'Updated Author',
      category: 'wisdom',
      language: 'hindi',
      is_active: false
    };

    const result = await updateParentingQuote(updateInput);

    // Verify all updated fields
    expect(result.id).toEqual(initialQuote[0].id);
    expect(result.quote).toEqual('Updated quote about parenting wisdom');
    expect(result.author).toEqual('Updated Author');
    expect(result.category).toEqual('wisdom');
    expect(result.language).toEqual('hindi');
    expect(result.is_active).toEqual(false);
    expect(result.created_at).toEqual(initialQuote[0].created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > initialQuote[0].updated_at).toBe(true);
  });

  it('should update only provided fields', async () => {
    // Create initial parenting quote
    const initialQuote = await db.insert(parentingQuotesTable)
      .values(testCreateInput)
      .returning()
      .execute();

    const updateInput: UpdateParentingQuoteInput = {
      id: initialQuote[0].id,
      quote: 'Partially updated quote',
      is_active: false
    };

    const result = await updateParentingQuote(updateInput);

    // Verify updated fields
    expect(result.quote).toEqual('Partially updated quote');
    expect(result.is_active).toEqual(false);

    // Verify unchanged fields
    expect(result.author).toEqual(testCreateInput.author);
    expect(result.category).toEqual(testCreateInput.category);
    expect(result.language).toEqual(testCreateInput.language);
    expect(result.created_at).toEqual(initialQuote[0].created_at);
  });

  it('should update nullable fields to null', async () => {
    // Create initial parenting quote
    const initialQuote = await db.insert(parentingQuotesTable)
      .values(testCreateInput)
      .returning()
      .execute();

    const updateInput: UpdateParentingQuoteInput = {
      id: initialQuote[0].id,
      author: null,
      category: null
    };

    const result = await updateParentingQuote(updateInput);

    // Verify nullable fields are updated to null
    expect(result.author).toBeNull();
    expect(result.category).toBeNull();

    // Verify other fields remain unchanged
    expect(result.quote).toEqual(testCreateInput.quote);
    expect(result.language).toEqual(testCreateInput.language);
    expect(result.is_active).toEqual(testCreateInput.is_active);
  });

  it('should save updated parenting quote to database', async () => {
    // Create initial parenting quote
    const initialQuote = await db.insert(parentingQuotesTable)
      .values(testCreateInput)
      .returning()
      .execute();

    const updateInput: UpdateParentingQuoteInput = {
      id: initialQuote[0].id,
      quote: 'Database persistence test quote',
      language: 'tamil'
    };

    const result = await updateParentingQuote(updateInput);

    // Query database to verify persistence
    const savedQuotes = await db.select()
      .from(parentingQuotesTable)
      .where(eq(parentingQuotesTable.id, result.id))
      .execute();

    expect(savedQuotes).toHaveLength(1);
    expect(savedQuotes[0].quote).toEqual('Database persistence test quote');
    expect(savedQuotes[0].language).toEqual('tamil');
    expect(savedQuotes[0].author).toEqual(testCreateInput.author);
    expect(savedQuotes[0].updated_at).toBeInstanceOf(Date);
  });

  it('should throw error for non-existent parenting quote', async () => {
    const updateInput: UpdateParentingQuoteInput = {
      id: 999999, // Non-existent ID
      quote: 'This should fail'
    };

    await expect(updateParentingQuote(updateInput)).rejects.toThrow(/not found/i);
  });

  it('should update updated_at timestamp', async () => {
    // Create initial parenting quote
    const initialQuote = await db.insert(parentingQuotesTable)
      .values(testCreateInput)
      .returning()
      .execute();

    // Wait a moment to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 10));

    const updateInput: UpdateParentingQuoteInput = {
      id: initialQuote[0].id,
      quote: 'Timestamp test quote'
    };

    const result = await updateParentingQuote(updateInput);

    // Verify updated_at timestamp was changed
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > initialQuote[0].updated_at).toBe(true);
    expect(result.created_at).toEqual(initialQuote[0].created_at);
  });
});
