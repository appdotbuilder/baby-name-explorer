
import { db } from '../db';
import { appConfigTable } from '../db/schema';
import { type AppConfig } from '../schema';
import { eq } from 'drizzle-orm';

export const getAppConfigs = async (isActive?: boolean): Promise<AppConfig[]> => {
  try {
    // Apply filter conditionally using explicit query building
    if (isActive !== undefined) {
      const results = await db.select()
        .from(appConfigTable)
        .where(eq(appConfigTable.is_active, isActive))
        .execute();
      return results;
    }

    // Return all configs when no filter specified
    const results = await db.select()
      .from(appConfigTable)
      .execute();
    
    return results;
  } catch (error) {
    console.error('Failed to fetch app configs:', error);
    throw error;
  }
};
