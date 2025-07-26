
import { db } from '../db';
import { babyNamesTable } from '../db/schema';
import { type UpdateBabyNameInput, type BabyName } from '../schema';
import { eq } from 'drizzle-orm';

export const updateBabyName = async (input: UpdateBabyNameInput): Promise<BabyName> => {
  try {
    // Check if baby name exists
    const existingName = await db.select()
      .from(babyNamesTable)
      .where(eq(babyNamesTable.id, input.id))
      .execute();

    if (existingName.length === 0) {
      throw new Error(`Baby name with id ${input.id} not found`);
    }

    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date()
    };

    if (input.name !== undefined) {
      updateData.name = input.name;
    }
    if (input.meaning !== undefined) {
      updateData.meaning = input.meaning;  
    }
    if (input.origin !== undefined) {
      updateData.origin = input.origin;
    }
    if (input.gender !== undefined) {
      updateData.gender = input.gender;
    }
    if (input.language !== undefined) {
      updateData.language = input.language;
    }
    if (input.pronunciation !== undefined) {
      updateData.pronunciation = input.pronunciation;
    }
    if (input.popularity_rank !== undefined) {
      updateData.popularity_rank = input.popularity_rank;
    }

    // Update the record
    const result = await db.update(babyNamesTable)
      .set(updateData)
      .where(eq(babyNamesTable.id, input.id))
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Baby name update failed:', error);
    throw error;
  }
};
