
import { db } from '../db';
import { appConfigTable } from '../db/schema';
import { type UpdateAppConfigInput, type AppConfig } from '../schema';
import { eq } from 'drizzle-orm';

export const updateAppConfig = async (input: UpdateAppConfigInput): Promise<AppConfig> => {
  try {
    // Build update object with only provided fields
    const updateData: Record<string, any> = {
      updated_at: new Date()
    };

    if (input.config_key !== undefined) {
      updateData['config_key'] = input.config_key;
    }
    if (input.config_value !== undefined) {
      updateData['config_value'] = input.config_value;
    }
    if (input.description !== undefined) {
      updateData['description'] = input.description;
    }
    if (input.is_active !== undefined) {
      updateData['is_active'] = input.is_active;
    }

    // Update the app config record
    const result = await db.update(appConfigTable)
      .set(updateData)
      .where(eq(appConfigTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`App config with id ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('App config update failed:', error);
    throw error;
  }
};
