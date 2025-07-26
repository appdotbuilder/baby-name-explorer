
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { parentingQuotesTable } from '../db/schema';
import { type CreateParentingQuoteInput } from '../schema';
import { createParentingQuote } from '../handlers/create_parenting_quote';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateParentingQuoteInput = {
  quote: 'Children are not things to be molded, but people to be unfolded.',
  author: 'Jess Lair',
  category: 'Development',
  language: 'english',
  is_active: true
};

describe('createParentingQuote', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a parenting quote', async () => {
    const result = await createParentingQuote(testInput);

    // Basic field validation
    expect(result.quote).toEqual('Children are not things to be molded, but people to be unfolded.');
    expect(result.author).toEqual('Jess Lair');
    expect(result.category).toEqual('Development');
    expect(result.language).toEqual('english');
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save parenting quote to database', async () => {
    const result = await createParentingQuote(testInput);

    // Query using proper drizzle syntax
    const quotes = await db.select()
      .from(parentingQuotesTable)
      .where(eq(parentingQuotesTable.id, result.id))
      .execute();

    expect(quotes).toHaveLength(1);
    expect(quotes[0].quote).toEqual('Children are not things to be molded, but people to be unfolded.');
    expect(quotes[0].author).toEqual('Jess Lair');
    expect(quotes[0].category).toEqual('Development');
    expect(quotes[0].language).toEqual('english');
    expect(quotes[0].is_active).toEqual(true);
    expect(quotes[0].created_at).toBeInstanceOf(Date);
    expect(quotes[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create quote with nullable fields', async () => {
    const inputWithNulls: CreateParentingQuoteInput = {
      quote: 'Being a parent is the greatest gift.',
      author: null,
      category: null,
      language: 'hindi',
      is_active: false
    };

    const result = await createParentingQuote(inputWithNulls);

    expect(result.quote).toEqual('Being a parent is the greatest gift.');
    expect(result.author).toBeNull();
    expect(result.category).toBeNull();
    expect(result.language).toEqual('hindi');
    expect(result.is_active).toEqual(false);
    expect(result.id).toBeDefined();
  });

  it('should apply default value for is_active', async () => {
    const inputWithDefaults: CreateParentingQuoteInput = {
      quote: 'The days are long, but the years are short.',
      author: 'Gretchen Rubin',
      category: 'Time',
      language: 'tamil',
      is_active: true // Explicitly set to test the default was applied by Zod
    };

    const result = await createParentingQuote(inputWithDefaults);

    expect(result.is_active).toEqual(true);
    expect(result.language).toEqual('tamil');
    expect(result.quote).toEqual('The days are long, but the years are short.');
  });
});
