
import { db } from '../db';
import { appConfigTable } from '../db/schema';
import { type AppConfig } from '../schema';
import { eq } from 'drizzle-orm';

export const deleteAppConfig = async (id: number): Promise<AppConfig> => {
  try {
    // First verify the record exists
    const existing = await db.select()
      .from(appConfigTable)
      .where(eq(appConfigTable.id, id))
      .execute();

    if (existing.length === 0) {
      throw new Error(`App config with id ${id} not found`);
    }

    // Delete the record and return it
    const result = await db.delete(appConfigTable)
      .where(eq(appConfigTable.id, id))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('App config deletion failed:', error);
    throw error;
  }
};
