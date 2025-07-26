
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { babyNamesTable } from '../db/schema';
import { type CreateBabyNameInput } from '../schema';
import { createBabyName } from '../handlers/create_baby_name';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateBabyNameInput = {
  name: 'Aarav',
  meaning: 'Peaceful',
  origin: 'Sanskrit',
  gender: 'boy',
  language: 'hindi',
  pronunciation: 'AH-rahv',
  popularity_rank: 15
};

describe('createBabyName', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a baby name with all fields', async () => {
    const result = await createBabyName(testInput);

    // Basic field validation
    expect(result.name).toEqual('Aarav');
    expect(result.meaning).toEqual('Peaceful');
    expect(result.origin).toEqual('Sanskrit');
    expect(result.gender).toEqual('boy');
    expect(result.language).toEqual('hindi');
    expect(result.pronunciation).toEqual('AH-rahv');
    expect(result.popularity_rank).toEqual(15);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save baby name to database', async () => {
    const result = await createBabyName(testInput);

    // Query using proper drizzle syntax
    const babyNames = await db.select()
      .from(babyNamesTable)
      .where(eq(babyNamesTable.id, result.id))
      .execute();

    expect(babyNames).toHaveLength(1);
    expect(babyNames[0].name).toEqual('Aarav');
    expect(babyNames[0].meaning).toEqual('Peaceful');
    expect(babyNames[0].origin).toEqual('Sanskrit');
    expect(babyNames[0].gender).toEqual('boy');
    expect(babyNames[0].language).toEqual('hindi');
    expect(babyNames[0].pronunciation).toEqual('AH-rahv');
    expect(babyNames[0].popularity_rank).toEqual(15);
    expect(babyNames[0].created_at).toBeInstanceOf(Date);
    expect(babyNames[0].updated_at).toBeInstanceOf(Date);
  });

  it('should create baby name with nullable fields', async () => {
    const inputWithNulls: CreateBabyNameInput = {
      name: 'Priya',
      meaning: 'Beloved',
      origin: 'Sanskrit',
      gender: 'girl',
      language: 'tamil',
      pronunciation: null,
      popularity_rank: null
    };

    const result = await createBabyName(inputWithNulls);

    expect(result.name).toEqual('Priya');
    expect(result.meaning).toEqual('Beloved');
    expect(result.origin).toEqual('Sanskrit');
    expect(result.gender).toEqual('girl');
    expect(result.language).toEqual('tamil');
    expect(result.pronunciation).toBeNull();
    expect(result.popularity_rank).toBeNull();
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should create unisex baby name', async () => {
    const unisexInput: CreateBabyNameInput = {
      name: 'Avani',
      meaning: 'Earth',
      origin: 'Sanskrit',
      gender: 'unisex',
      language: 'gujarati',
      pronunciation: 'ah-VAH-nee',
      popularity_rank: 42
    };

    const result = await createBabyName(unisexInput);

    expect(result.name).toEqual('Avani');
    expect(result.gender).toEqual('unisex');
    expect(result.language).toEqual('gujarati');
    expect(result.id).toBeDefined();
  });

  it('should handle different languages correctly', async () => {
    const bengaliInput: CreateBabyNameInput = {
      name: 'Ananya',
      meaning: 'Unique',
      origin: 'Bengali',
      gender: 'girl',
      language: 'bengali',
      pronunciation: 'uh-NAN-ya',
      popularity_rank: 8
    };

    const result = await createBabyName(bengaliInput);

    expect(result.name).toEqual('Ananya');
    expect(result.meaning).toEqual('Unique');
    expect(result.language).toEqual('bengali');
    expect(result.id).toBeDefined();

    // Verify in database
    const saved = await db.select()
      .from(babyNamesTable)
      .where(eq(babyNamesTable.id, result.id))
      .execute();

    expect(saved[0].language).toEqual('bengali');
  });
});
