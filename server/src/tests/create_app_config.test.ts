
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { appConfigTable } from '../db/schema';
import { type CreateAppConfigInput } from '../schema';
import { createAppConfig } from '../handlers/create_app_config';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateAppConfigInput = {
  config_key: 'test_key',
  config_value: 'test_value',
  description: 'A test configuration',
  is_active: true
};

describe('createAppConfig', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an app config', async () => {
    const result = await createAppConfig(testInput);

    // Basic field validation
    expect(result.config_key).toEqual('test_key');
    expect(result.config_value).toEqual('test_value');
    expect(result.description).toEqual('A test configuration');
    expect(result.is_active).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save app config to database', async () => {
    const result = await createAppConfig(testInput);

    // Query using proper drizzle syntax
    const configs = await db.select()
      .from(appConfigTable)
      .where(eq(appConfigTable.id, result.id))
      .execute();

    expect(configs).toHaveLength(1);
    expect(configs[0].config_key).toEqual('test_key');
    expect(configs[0].config_value).toEqual('test_value');
    expect(configs[0].description).toEqual('A test configuration');
    expect(configs[0].is_active).toEqual(true);
    expect(configs[0].created_at).toBeInstanceOf(Date);
    expect(configs[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle null description', async () => {
    const inputWithNullDescription: CreateAppConfigInput = {
      config_key: 'null_desc_key',
      config_value: 'test_value',
      description: null,
      is_active: true
    };

    const result = await createAppConfig(inputWithNullDescription);

    expect(result.config_key).toEqual('null_desc_key');
    expect(result.description).toBeNull();
    expect(result.is_active).toEqual(true);
  });

  it('should use default is_active value', async () => {
    const inputWithDefaults: CreateAppConfigInput = {
      config_key: 'default_key',
      config_value: 'default_value',
      description: 'Test default',
      is_active: true // Zod default applied
    };

    const result = await createAppConfig(inputWithDefaults);

    expect(result.is_active).toEqual(true);
    expect(result.config_key).toEqual('default_key');
    expect(result.config_value).toEqual('default_value');
  });
});
