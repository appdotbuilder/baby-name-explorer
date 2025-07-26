
import { db } from '../db';
import { appConfigTable } from '../db/schema';
import { type CreateAppConfigInput, type AppConfig } from '../schema';

export const createAppConfig = async (input: CreateAppConfigInput): Promise<AppConfig> => {
  try {
    // Insert app config record
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
  } catch (error) {
    console.error('App config creation failed:', error);
    throw error;
  }
};
