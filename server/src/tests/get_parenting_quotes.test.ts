
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { parentingQuotesTable } from '../db/schema';
import { type GetParentingQuotesQuery, type CreateParentingQuoteInput } from '../schema';
import { getParentingQuotes } from '../handlers/get_parenting_quotes';

// Test data
const testQuotes: CreateParentingQuoteInput[] = [
  {
    quote: 'Children are not things to be molded, but people to be unfolded.',
    author: 'Jess Lair',
    category: 'growth',
    language: 'english',
    is_active: true
  },
  {
    quote: 'The days are long, but the years are short.',
    author: 'Gretchen Rubin',
    category: 'time',
    language: 'english',
    is_active: true
  },
  {
    quote: 'बच्चे हमारे भविष्य हैं।',
    author: null,
    category: 'motivation',
    language: 'hindi',
    is_active: true
  },
  {
    quote: 'Parenting is the hardest job in the world.',
    author: 'Unknown',
    category: 'challenges',
    language: 'english',
    is_active: false
  }
];

describe('getParentingQuotes', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  beforeEach(async () => {
    // Insert test data
    await db.insert(parentingQuotesTable).values(testQuotes).execute();
  });

  it('should return all active quotes with default parameters', async () => {
    const query: GetParentingQuotesQuery = {
      limit: 10,
      offset: 0,
      is_active: true
    };

    const result = await getParentingQuotes(query);

    expect(result).toHaveLength(3); // Only active quotes
    result.forEach(quote => {
      expect(quote.is_active).toBe(true);
      expect(quote.id).toBeDefined();
      expect(quote.created_at).toBeInstanceOf(Date);
      expect(quote.updated_at).toBeInstanceOf(Date);
    });
  });

  it('should filter by language', async () => {
    const query: GetParentingQuotesQuery = {
      language: 'hindi',
      limit: 10,
      offset: 0,
      is_active: true
    };

    const result = await getParentingQuotes(query);

    expect(result).toHaveLength(1);
    expect(result[0].language).toBe('hindi');
    expect(result[0].quote).toBe('बच्चे हमारे भविष्य हैं।');
  });

  it('should filter by category (case-insensitive)', async () => {
    const query: GetParentingQuotesQuery = {
      category: 'GROWTH',
      limit: 10,
      offset: 0,
      is_active: true
    };

    const result = await getParentingQuotes(query);

    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('growth');
    expect(result[0].author).toBe('Jess Lair');
  });

  it('should filter by partial category match', async () => {
    const query: GetParentingQuotesQuery = {
      category: 'tim',
      limit: 10,
      offset: 0,
      is_active: true
    };

    const result = await getParentingQuotes(query);

    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('time');
    expect(result[0].author).toBe('Gretchen Rubin');
  });

  it('should include inactive quotes when is_active is false', async () => {
    const query: GetParentingQuotesQuery = {
      limit: 10,
      offset: 0,
      is_active: false
    };

    const result = await getParentingQuotes(query);

    expect(result).toHaveLength(1);
    expect(result[0].is_active).toBe(false);
    expect(result[0].category).toBe('challenges');
  });

  it('should support pagination', async () => {
    const query1: GetParentingQuotesQuery = {
      limit: 2,
      offset: 0,
      is_active: true
    };

    const query2: GetParentingQuotesQuery = {
      limit: 2,
      offset: 2,
      is_active: true
    };

    const result1 = await getParentingQuotes(query1);
    const result2 = await getParentingQuotes(query2);

    expect(result1).toHaveLength(2);
    expect(result2).toHaveLength(1); // Only 3 active quotes total
    
    // Ensure no overlap
    const ids1 = result1.map(q => q.id);
    const ids2 = result2.map(q => q.id);
    expect(ids1.some(id => ids2.includes(id))).toBe(false);
  });

  it('should combine multiple filters', async () => {
    const query: GetParentingQuotesQuery = {
      language: 'english',
      category: 'time',
      limit: 10,
      offset: 0,
      is_active: true
    };

    const result = await getParentingQuotes(query);

    expect(result).toHaveLength(1);
    expect(result[0].language).toBe('english');
    expect(result[0].category).toBe('time');
    expect(result[0].is_active).toBe(true);
  });

  it('should return empty array when no matches found', async () => {
    const query: GetParentingQuotesQuery = {
      language: 'tamil',
      limit: 10,
      offset: 0,
      is_active: true
    };

    const result = await getParentingQuotes(query);

    expect(result).toHaveLength(0);
  });
});
