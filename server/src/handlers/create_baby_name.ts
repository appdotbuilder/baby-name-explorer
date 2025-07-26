
import { db } from '../db';
import { babyNamesTable } from '../db/schema';
import { type CreateBabyNameInput, type BabyName } from '../schema';

export const createBabyName = async (input: CreateBabyNameInput): Promise<BabyName> => {
  try {
    // Insert baby name record
    const result = await db.insert(babyNamesTable)
      .values({
        name: input.name,
        meaning: input.meaning,
        origin: input.origin,
        gender: input.gender,
        language: input.language,
        pronunciation: input.pronunciation,
        popularity_rank: input.popularity_rank
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Baby name creation failed:', error);
    throw error;
  }
};
