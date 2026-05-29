import * as SQLite from "expo-sqlite";

//Create a db instance
let db: SQLite.SQLiteDatabase | null = null;

export const getDB = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabaseAsync("dev-snippet.db");
    // Pragma journal_mode = WAL to allows concurrent reads and writes
    await db.execAsync(`
        PRAGMA journal_mode = WAL;

        CREATE TABLE IF NOT EXISTS snippets (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        language TEXT NOT NULL,
        code TEXT NOT NULL,
        tags TEXT NOT NULL,
        folderId TEXT,
        isFavorite INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      );
        `);
  }
  return db;
};
