
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { babyNamesTable } from '../db/schema';
import { type CreateBabyNameInput, type UpdateBabyNameInput } from '../schema';
import { updateBabyName } from '../handlers/update_baby_name';
import { eq } from 'drizzle-orm';

// Test inputs
const testCreateInput: CreateBabyNameInput = {
  name: 'Arjun',
  meaning: 'Bright and shining',
  origin: 'Sanskrit',
  gender: 'boy',
  language: 'hindi',
  pronunciation: 'AR-jun',
  popularity_rank: 15
};

const testUpdateInput: UpdateBabyNameInput = {
  id: 1, // Will be updated with actual ID
  name: 'Updated Arjun',
  meaning: 'Updated meaning',
  origin: 'Updated origin',
  gender: 'unisex',
  language: 'english',
  pronunciation: 'Updated pronunciation',
  popularity_rank: 25
};

describe('updateBabyName', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update all fields of a baby name', async () => {
    // Create initial baby name
    const created = await db.insert(babyNamesTable)
      .values(testCreateInput)
      .returning()
      .execute();

    const updateInput = {
      ...testUpdateInput,
      id: created[0].id
    };

    const result = await updateBabyName(updateInput);

    // Verify all fields are updated
    expect(result.id).toEqual(created[0].id);
    expect(result.name).toEqual('Updated Arjun');
    expect(result.meaning).toEqual('Updated meaning');
    expect(result.origin).toEqual('Updated origin');
    expect(result.gender).toEqual('unisex');
    expect(result.language).toEqual('english');
    expect(result.pronunciation).toEqual('Updated pronunciation');
    expect(result.popularity_rank).toEqual(25);
    expect(result.created_at).toEqual(created[0].created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > created[0].updated_at).toBe(true);
  });

  it('should update only provided fields', async () => {
    // Create initial baby name
    const created = await db.insert(babyNamesTable)
      .values(testCreateInput)
      .returning()
      .execute();

    // Update only name and meaning
    const partialUpdate: UpdateBabyNameInput = {
      id: created[0].id,
      name: 'Partially Updated',
      meaning: 'New meaning only'
    };

    const result = await updateBabyName(partialUpdate);

    // Verify only specified fields are updated
    expect(result.name).toEqual('Partially Updated');
    expect(result.meaning).toEqual('New meaning only');
    // Other fields should remain unchanged
    expect(result.origin).toEqual(testCreateInput.origin);
    expect(result.gender).toEqual(testCreateInput.gender);
    expect(result.language).toEqual(testCreateInput.language);
    expect(result.pronunciation).toEqual(testCreateInput.pronunciation);
    expect(result.popularity_rank).toEqual(testCreateInput.popularity_rank);
  });

  it('should update nullable fields to null', async () => {
    // Create initial baby name
    const created = await db.insert(babyNamesTable)
      .values(testCreateInput)
      .returning()
      .execute();

    // Update nullable fields to null
    const nullUpdate: UpdateBabyNameInput = {
      id: created[0].id,
      pronunciation: null,
      popularity_rank: null
    };

    const result = await updateBabyName(nullUpdate);

    expect(result.pronunciation).toBeNull();
    expect(result.popularity_rank).toBeNull();
    // Other fields should remain unchanged
    expect(result.name).toEqual(testCreateInput.name);
    expect(result.meaning).toEqual(testCreateInput.meaning);
  });

  it('should persist changes to database', async () => {
    // Create initial baby name
    const created = await db.insert(babyNamesTable)
      .values(testCreateInput)
      .returning()
      .execute();

    const updateInput = {
      ...testUpdateInput,
      id: created[0].id
    };

    await updateBabyName(updateInput);

    // Query database to verify persistence
    const updated = await db.select()
      .from(babyNamesTable)
      .where(eq(babyNamesTable.id, created[0].id))
      .execute();

    expect(updated).toHaveLength(1);
    expect(updated[0].name).toEqual('Updated Arjun');
    expect(updated[0].meaning).toEqual('Updated meaning');
    expect(updated[0].origin).toEqual('Updated origin');
    expect(updated[0].gender).toEqual('unisex');
    expect(updated[0].language).toEqual('english');
    expect(updated[0].pronunciation).toEqual('Updated pronunciation');
    expect(updated[0].popularity_rank).toEqual(25);
    expect(updated[0].updated_at).toBeInstanceOf(Date);
  });

  it('should throw error when baby name does not exist', async () => {
    const nonExistentUpdate: UpdateBabyNameInput = {
      id: 999,
      name: 'Non-existent'
    };

    await expect(updateBabyName(nonExistentUpdate)).rejects.toThrow(/not found/i);
  });

  it('should update updated_at timestamp even with no field changes', async () => {
    // Create initial baby name
    const created = await db.insert(babyNamesTable)
      .values(testCreateInput)
      .returning()
      .execute();

    // Update with only ID (no field changes)
    const emptyUpdate: UpdateBabyNameInput = {
      id: created[0].id
    };

    const result = await updateBabyName(emptyUpdate);

    // All fields should remain the same except updated_at
    expect(result.name).toEqual(created[0].name);
    expect(result.meaning).toEqual(created[0].meaning);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > created[0].updated_at).toBe(true);
  });
});
