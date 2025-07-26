
import { db } from '../db';
import { babyNamesTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { type BabyName } from '../schema';

export const deleteBabyName = async (id: number): Promise<BabyName> => {
  try {
    // First, check if the record exists
    const existingRecord = await db.select()
      .from(babyNamesTable)
      .where(eq(babyNamesTable.id, id))
      .execute();

    if (existingRecord.length === 0) {
      throw new Error(`Baby name with ID ${id} not found`);
    }

    // Delete the record and return it
    const result = await db.delete(babyNamesTable)
      .where(eq(babyNamesTable.id, id))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Baby name deletion failed:', error);
    throw error;
  }
};
