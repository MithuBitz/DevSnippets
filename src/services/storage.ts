import { getDB } from "@/utils/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { File, Paths } from "expo-file-system";

export const saveDefaultLanguage = (lang: string) =>
  AsyncStorage.setItem("default_lang", lang);
export const getDefaultLanguage = async () =>
  AsyncStorage.getItem("default_lang");

export const backupData = async () => {
  const db = await getDB();
  const snippets = await db.getAllAsync("SELECT * FROM snippets");
  const data = JSON.stringify(snippets);
  const backupFile = new File(Paths.document, "devsnippet_backup.json");
  if (!backupFile.exists) {
    backupFile.create();
  }
  backupFile.write(data);
  return backupFile.uri;
};

export const updateData = async () => {
  const backupFile = new File(Paths.document, "devsnippet_backup.json");
  if (!backupFile.exists) {
    throw new Error("Backup file not found");
  }

  const content = await backupFile.text();
  const { snippets } = JSON.parse(content);

  const db = await getDB();
  // Insert snippets into the database
  await db.withExclusiveTransactionAsync(async (txn) => {
    for (const snippet of snippets) {
      await txn.runAsync(
        `
            
            INSERT OR REPLACE INTO snippets (id, title, language, code, tags, folderId, isFavorite, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `,
        [
          snippet.id,
          snippet.title,
          snippet.language,
          snippet.code,
          snippet.tags,
          snippet.folderId,
          snippet.isFavorite,
          snippet.createdAt,
        ],
      );
    }
  });
};
