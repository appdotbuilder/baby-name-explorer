
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { babyNamesTable } from '../db/schema';
import { type GetBabyNamesQuery, type CreateBabyNameInput } from '../schema';
import { getBabyNames } from '../handlers/get_baby_names';

// Test data setup
const testBabyNames: CreateBabyNameInput[] = [
  {
    name: 'Aarav',
    meaning: 'Peaceful',
    origin: 'Sanskrit',
    gender: 'boy',
    language: 'hindi',
    pronunciation: 'AH-rav',
    popularity_rank: 1
  },
  {
    name: 'Priya',
    meaning: 'Beloved',
    origin: 'Sanskrit',
    gender: 'girl',
    language: 'hindi',
    pronunciation: 'PREE-ya',
    popularity_rank: 5
  },
  {
    name: 'Arjun',
    meaning: 'Bright',
    origin: 'Sanskrit',
    gender: 'boy',
    language: 'tamil',
    pronunciation: 'AR-jun',
    popularity_rank: 3
  },
  {
    name: 'Emma',
    meaning: 'Universal',
    origin: 'Germanic',
    gender: 'girl',
    language: 'english',
    pronunciation: 'EM-ma',
    popularity_rank: 2
  }
];

describe('getBabyNames', () => {
  beforeEach(async () => {
    await createDB();
    
    // Insert test data
    await db.insert(babyNamesTable)
      .values(testBabyNames)
      .execute();
  });

  afterEach(resetDB);

  it('should return all baby names with default pagination', async () => {
    const query: GetBabyNamesQuery = {
      limit: 50,
      offset: 0
    };

    const result = await getBabyNames(query);

    expect(result).toHaveLength(4);
    expect(result[0].name).toBeDefined();
    expect(result[0].meaning).toBeDefined();
    expect(result[0].origin).toBeDefined();
    expect(result[0].gender).toBeDefined();
    expect(result[0].language).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  it('should filter by language correctly', async () => {
    const query: GetBabyNamesQuery = {
      language: 'hindi',
      limit: 50,
      offset: 0
    };

    const result = await getBabyNames(query);

    expect(result).toHaveLength(2);
    result.forEach(name => {
      expect(name.language).toBe('hindi');
    });
  });

  it('should filter by gender correctly', async () => {
    const query: GetBabyNamesQuery = {
      gender: 'boy',
      limit: 50,
      offset: 0
    };

    const result = await getBabyNames(query);

    expect(result).toHaveLength(2);
    result.forEach(name => {
      expect(name.gender).toBe('boy');
    });
  });

  it('should filter by origin correctly', async () => {
    const query: GetBabyNamesQuery = {
      origin: 'Sanskrit',
      limit: 50,
      offset: 0
    };

    const result = await getBabyNames(query);

    expect(result).toHaveLength(3);
    result.forEach(name => {
      expect(name.origin).toBe('Sanskrit');
    });
  });

  it('should search in name and meaning', async () => {
    const query: GetBabyNamesQuery = {
      search: 'bright',
      limit: 50,
      offset: 0
    };

    const result = await getBabyNames(query);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Arjun');
    expect(result[0].meaning.toLowerCase()).toContain('bright');
  });

  it('should search by name case-insensitively', async () => {
    const query: GetBabyNamesQuery = {
      search: 'EMMA',
      limit: 50,
      offset: 0
    };

    const result = await getBabyNames(query);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Emma');
  });

  it('should apply pagination correctly', async () => {
    const query: GetBabyNamesQuery = {
      limit: 2,
      offset: 1
    };

    const result = await getBabyNames(query);

    expect(result).toHaveLength(2);
  });

  it('should combine multiple filters', async () => {
    const query: GetBabyNamesQuery = {
      language: 'hindi',
      gender: 'boy',
      limit: 50,
      offset: 0
    };

    const result = await getBabyNames(query);

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Aarav');
    expect(result[0].language).toBe('hindi');
    expect(result[0].gender).toBe('boy');
  });

  it('should return empty array when no matches found', async () => {
    const query: GetBabyNamesQuery = {
      language: 'punjabi',
      limit: 50,
      offset: 0
    };

    const result = await getBabyNames(query);

    expect(result).toHaveLength(0);
  });

  it('should handle offset beyond available records', async () => {
    const query: GetBabyNamesQuery = {
      limit: 10,
      offset: 100
    };

    const result = await getBabyNames(query);

    expect(result).toHaveLength(0);
  });
});
