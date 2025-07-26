
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { appConfigTable } from '../db/schema';
import { type CreateAppConfigInput } from '../schema';
import { deleteAppConfig } from '../handlers/delete_app_config';
import { eq } from 'drizzle-orm';

// Test input for creating app config
const testInput: CreateAppConfigInput = {
  config_key: 'test_key',
  config_value: 'test_value',
  description: 'Test configuration',
  is_active: true
};

describe('deleteAppConfig', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete an app config', async () => {
    // Create an app config first
    const created = await db.insert(appConfigTable)
      .values({
        config_key: testInput.config_key,
        config_value: testInput.config_value,
        description: testInput.description,
        is_active: testInput.is_active
      })
      .returning()
      .execute();

    const createdConfig = created[0];

    // Delete the app config
    const result = await deleteAppConfig(createdConfig.id);

    // Verify returned data
    expect(result.id).toEqual(createdConfig.id);
    expect(result.config_key).toEqual('test_key');
    expect(result.config_value).toEqual('test_value');
    expect(result.description).toEqual('Test configuration');
    expect(result.is_active).toEqual(true);
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should remove app config from database', async () => {
    // Create an app config first
    const created = await db.insert(appConfigTable)
      .values({
        config_key: testInput.config_key,
        config_value: testInput.config_value,
        description: testInput.description,
        is_active: testInput.is_active
      })
      .returning()
      .execute();

    const createdConfig = created[0];

    // Delete the app config
    await deleteAppConfig(createdConfig.id);

    // Verify it's removed from database
    const remaining = await db.select()
      .from(appConfigTable)
      .where(eq(appConfigTable.id, createdConfig.id))
      .execute();

    expect(remaining).toHaveLength(0);
  });

  it('should throw error for non-existent app config', async () => {
    // Try to delete a non-existent app config
    await expect(deleteAppConfig(999)).rejects.toThrow(/not found/i);
  });

  it('should handle config with null fields', async () => {
    // Create an app config with minimal fields
    const created = await db.insert(appConfigTable)
      .values({
        config_key: 'minimal_key',
        config_value: 'minimal_value',
        description: null,
        is_active: false
      })
      .returning()
      .execute();

    const createdConfig = created[0];

    // Delete the app config
    const result = await deleteAppConfig(createdConfig.id);

    // Verify returned data with null fields
    expect(result.id).toEqual(createdConfig.id);
    expect(result.config_key).toEqual('minimal_key');
    expect(result.config_value).toEqual('minimal_value');
    expect(result.description).toBeNull();
    expect(result.is_active).toEqual(false);
  });
});
