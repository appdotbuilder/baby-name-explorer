
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { babyNamesTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type CreateBabyNameInput } from '../schema';
import { deleteBabyName } from '../handlers/delete_baby_name';

// Test baby name input
const testBabyName: CreateBabyNameInput = {
  name: 'Arjun',
  meaning: 'Bright, shining',
  origin: 'Sanskrit',
  gender: 'boy',
  language: 'hindi',
  pronunciation: 'AR-jun',
  popularity_rank: 15
};

describe('deleteBabyName', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete an existing baby name', async () => {
    // Create a baby name first
    const created = await db.insert(babyNamesTable)
      .values(testBabyName)
      .returning()
      .execute();

    const createdId = created[0].id;

    // Delete the baby name
    const result = await deleteBabyName(createdId);

    // Verify the returned data matches what was deleted
    expect(result.id).toEqual(createdId);
    expect(result.name).toEqual('Arjun');
    expect(result.meaning).toEqual('Bright, shining');
    expect(result.origin).toEqual('Sanskrit');
    expect(result.gender).toEqual('boy');
    expect(result.language).toEqual('hindi');
    expect(result.pronunciation).toEqual('AR-jun');
    expect(result.popularity_rank).toEqual(15);
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should remove record from database', async () => {
    // Create a baby name first
    const created = await db.insert(babyNamesTable)
      .values(testBabyName)
      .returning()
      .execute();

    const createdId = created[0].id;

    // Delete the baby name
    await deleteBabyName(createdId);

    // Verify the record no longer exists in the database
    const records = await db.select()
      .from(babyNamesTable)
      .where(eq(babyNamesTable.id, createdId))
      .execute();

    expect(records).toHaveLength(0);
  });

  it('should throw error when trying to delete non-existent baby name', async () => {
    const nonExistentId = 99999;

    await expect(deleteBabyName(nonExistentId))
      .rejects.toThrow(/Baby name with ID 99999 not found/i);
  });

  it('should handle deletion of baby name with null optional fields', async () => {
    // Create baby name with minimal required fields
    const minimalBabyName: CreateBabyNameInput = {
      name: 'Maya',
      meaning: 'Illusion',
      origin: 'Sanskrit',
      gender: 'girl',
      language: 'tamil',
      pronunciation: null,
      popularity_rank: null
    };

    const created = await db.insert(babyNamesTable)
      .values(minimalBabyName)
      .returning()
      .execute();

    const createdId = created[0].id;

    // Delete the baby name
    const result = await deleteBabyName(createdId);

    // Verify deletion worked correctly with null fields
    expect(result.id).toEqual(createdId);
    expect(result.name).toEqual('Maya');
    expect(result.pronunciation).toBeNull();
    expect(result.popularity_rank).toBeNull();
  });
});
