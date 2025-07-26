
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { appConfigTable } from '../db/schema';
import { type CreateAppConfigInput } from '../schema';
import { getAppConfigs } from '../handlers/get_app_configs';

// Test config inputs
const activeConfig: CreateAppConfigInput = {
  config_key: 'app_version',
  config_value: '1.0.0',
  description: 'Current app version',
  is_active: true
};

const inactiveConfig: CreateAppConfigInput = {
  config_key: 'deprecated_feature',
  config_value: 'false',
  description: 'Old feature flag',
  is_active: false
};

const configWithoutDescription: CreateAppConfigInput = {
  config_key: 'api_endpoint',
  config_value: 'https://api.example.com',
  description: null,
  is_active: true
};

describe('getAppConfigs', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no configs exist', async () => {
    const result = await getAppConfigs();
    expect(result).toEqual([]);
  });

  it('should return all configs when no filter applied', async () => {
    // Create test configs
    await db.insert(appConfigTable).values([
      activeConfig,
      inactiveConfig,
      configWithoutDescription
    ]).execute();

    const result = await getAppConfigs();

    expect(result).toHaveLength(3);
    
    // Check that all configs are returned
    const configKeys = result.map(config => config.config_key);
    expect(configKeys).toContain('app_version');
    expect(configKeys).toContain('deprecated_feature');
    expect(configKeys).toContain('api_endpoint');

    // Verify structure of returned configs
    result.forEach(config => {
      expect(config.id).toBeDefined();
      expect(config.config_key).toBeDefined();
      expect(config.config_value).toBeDefined();
      expect(typeof config.is_active).toBe('boolean');
      expect(config.created_at).toBeInstanceOf(Date);
      expect(config.updated_at).toBeInstanceOf(Date);
    });
  });

  it('should return only active configs when isActive is true', async () => {
    // Create test configs
    await db.insert(appConfigTable).values([
      activeConfig,
      inactiveConfig,
      configWithoutDescription
    ]).execute();

    const result = await getAppConfigs(true);

    expect(result).toHaveLength(2);
    
    // All returned configs should be active
    result.forEach(config => {
      expect(config.is_active).toBe(true);
    });

    // Check specific configs
    const configKeys = result.map(config => config.config_key);
    expect(configKeys).toContain('app_version');
    expect(configKeys).toContain('api_endpoint');
    expect(configKeys).not.toContain('deprecated_feature');
  });

  it('should return only inactive configs when isActive is false', async () => {
    // Create test configs
    await db.insert(appConfigTable).values([
      activeConfig,
      inactiveConfig,
      configWithoutDescription
    ]).execute();

    const result = await getAppConfigs(false);

    expect(result).toHaveLength(1);
    
    // All returned configs should be inactive
    result.forEach(config => {
      expect(config.is_active).toBe(false);
    });

    // Check specific config
    expect(result[0].config_key).toBe('deprecated_feature');
    expect(result[0].config_value).toBe('false');
    expect(result[0].description).toBe('Old feature flag');
  });

  it('should handle configs with nullable description correctly', async () => {
    await db.insert(appConfigTable).values(configWithoutDescription).execute();

    const result = await getAppConfigs();

    expect(result).toHaveLength(1);
    expect(result[0].config_key).toBe('api_endpoint');
    expect(result[0].config_value).toBe('https://api.example.com');
    expect(result[0].description).toBeNull();
    expect(result[0].is_active).toBe(true);
  });

  it('should return empty array when filtering for active configs but none exist', async () => {
    // Create only inactive config
    await db.insert(appConfigTable).values(inactiveConfig).execute();

    const result = await getAppConfigs(true);
    expect(result).toEqual([]);
  });

  it('should return empty array when filtering for inactive configs but none exist', async () => {
    // Create only active config
    await db.insert(appConfigTable).values(activeConfig).execute();

    const result = await getAppConfigs(false);
    expect(result).toEqual([]);
  });
});
