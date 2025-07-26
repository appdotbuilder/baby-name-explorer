
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { appConfigTable } from '../db/schema';
import { type CreateAppConfigInput, type UpdateAppConfigInput } from '../schema';
import { updateAppConfig } from '../handlers/update_app_config';
import { eq } from 'drizzle-orm';

// Helper to create test app config
const createTestAppConfig = async (input: CreateAppConfigInput) => {
  const result = await db.insert(appConfigTable)
    .values({
      config_key: input.config_key,
      config_value: input.config_value,
      description: input.description,
      is_active: input.is_active
    })
    .returning()
    .execute();
  return result[0];
};

const testConfigInput: CreateAppConfigInput = {
  config_key: 'test_key',
  config_value: 'test_value',
  description: 'Test configuration',
  is_active: true
};

describe('updateAppConfig', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should update all fields of an app config', async () => {
    const existingConfig = await createTestAppConfig(testConfigInput);

    const updateInput: UpdateAppConfigInput = {
      id: existingConfig.id,
      config_key: 'updated_key',
      config_value: 'updated_value',
      description: 'Updated description',
      is_active: false
    };

    const result = await updateAppConfig(updateInput);

    expect(result.id).toEqual(existingConfig.id);
    expect(result.config_key).toEqual('updated_key');
    expect(result.config_value).toEqual('updated_value');
    expect(result.description).toEqual('Updated description');
    expect(result.is_active).toEqual(false);
    expect(result.created_at).toEqual(existingConfig.created_at);
    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at > existingConfig.updated_at).toBe(true);
  });

  it('should update only provided fields', async () => {
    const existingConfig = await createTestAppConfig(testConfigInput);

    const updateInput: UpdateAppConfigInput = {
      id: existingConfig.id,
      config_value: 'only_value_updated'
    };

    const result = await updateAppConfig(updateInput);

    expect(result.id).toEqual(existingConfig.id);
    expect(result.config_key).toEqual(existingConfig.config_key); // Unchanged
    expect(result.config_value).toEqual('only_value_updated'); // Updated
    expect(result.description).toEqual(existingConfig.description); // Unchanged
    expect(result.is_active).toEqual(existingConfig.is_active); // Unchanged
    expect(result.updated_at > existingConfig.updated_at).toBe(true);
  });

  it('should update null fields correctly', async () => {
    const configWithNull = await createTestAppConfig({
      ...testConfigInput,
      description: null
    });

    const updateInput: UpdateAppConfigInput = {
      id: configWithNull.id,
      description: 'Now has description'
    };

    const result = await updateAppConfig(updateInput);

    expect(result.description).toEqual('Now has description');
  });

  it('should set description to null when explicitly provided', async () => {
    const existingConfig = await createTestAppConfig(testConfigInput);

    const updateInput: UpdateAppConfigInput = {
      id: existingConfig.id,
      description: null
    };

    const result = await updateAppConfig(updateInput);

    expect(result.description).toBeNull();
  });

  it('should save updated app config to database', async () => {
    const existingConfig = await createTestAppConfig(testConfigInput);

    const updateInput: UpdateAppConfigInput = {
      id: existingConfig.id,
      config_key: 'saved_key',
      is_active: false
    };

    await updateAppConfig(updateInput);

    const savedConfig = await db.select()
      .from(appConfigTable)
      .where(eq(appConfigTable.id, existingConfig.id))
      .execute();

    expect(savedConfig).toHaveLength(1);
    expect(savedConfig[0].config_key).toEqual('saved_key');
    expect(savedConfig[0].is_active).toEqual(false);
    expect(savedConfig[0].updated_at).not.toEqual(existingConfig.updated_at);
  });

  it('should throw error when app config does not exist', async () => {
    const updateInput: UpdateAppConfigInput = {
      id: 99999,
      config_key: 'nonexistent'
    };

    expect(updateAppConfig(updateInput)).rejects.toThrow(/not found/i);
  });
});
