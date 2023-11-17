import AsyncStorage from "@react-native-async-storage/async-storage";
import { createNamedLogger } from "./log";
import { z } from "zod";

const MAX_RECENT_SEARCHES = 10;
const ASYNC_STORAGE_RECENT_SEARCHES_KEY = "RECENT_SEARCHES";

const logger = createNamedLogger("storage");

const recentSearchesSchema = z.array(z.string());

export interface SaveRecentSearchesCommand {
  recentSearches: string[];
}

export async function saveRecentSearches(command: SaveRecentSearchesCommand) {
  try {
    const stringRecentSearches = JSON.stringify(command.recentSearches);
    await AsyncStorage.setItem(
      ASYNC_STORAGE_RECENT_SEARCHES_KEY,
      stringRecentSearches
    );
  } catch (error) {
    logger.error("Save recent searches failed", error);
  }
}

export interface AppendRecentSearchCommand {
  recentSearch: string;
}

export async function appendRecentSearch(command: AppendRecentSearchCommand) {
  const recentSearches = await getRecentSearches();
  const recentSearchesWithoutNew = recentSearches.filter(
    (recentSearch) => recentSearch !== command.recentSearch
  );

  const recentSearchesToSave =
    recentSearchesWithoutNew.length === MAX_RECENT_SEARCHES
      ? [
          ...recentSearchesWithoutNew.slice(1, MAX_RECENT_SEARCHES - 1),
          command.recentSearch,
        ]
      : [...recentSearchesWithoutNew, command.recentSearch];

  await saveRecentSearches({ recentSearches: recentSearchesToSave });
}

export async function clearRecentSearches() {
  await saveRecentSearches({ recentSearches: [] });
}

export async function getRecentSearches(): Promise<string[]> {
  try {
    const stringRecentSearches = await AsyncStorage.getItem(
      ASYNC_STORAGE_RECENT_SEARCHES_KEY
    );
    if (!stringRecentSearches) {
      return [];
    }

    const jsonRecentSearches = JSON.parse(stringRecentSearches);
    const parsedRecentSearches = recentSearchesSchema.parse(jsonRecentSearches);

    return parsedRecentSearches;
  } catch (error) {
    logger.error("Get recent searches failed", error);
    return [];
  }
}
