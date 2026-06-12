import { openDatabaseSync, SQLiteDatabase } from 'expo-sqlite';

export type JournalEntryRow = {
  id: string;
  created_at: string;
  raw_transcript: string;
  edited_transcript: string;
  summary: string | null;
  follow_up: string | null;
  mood: string | null;
  coaching_style: string;
};

let db: SQLiteDatabase | null = null;

export function getDb(): SQLiteDatabase {
  if (!db) {
    db = openDatabaseSync('voicemark.db');
    migrate(db);
  }
  return db;
}

function migrate(database: SQLiteDatabase) {
  database.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS entries (
      id TEXT PRIMARY KEY NOT NULL,
      created_at TEXT NOT NULL,
      raw_transcript TEXT NOT NULL,
      edited_transcript TEXT NOT NULL,
      summary TEXT,
      follow_up TEXT,
      mood TEXT,
      coaching_style TEXT NOT NULL DEFAULT 'reflective'
    );
    CREATE INDEX IF NOT EXISTS idx_entries_created_at ON entries (created_at DESC);
  `);
}

export function insertEntry(row: JournalEntryRow): void {
  getDb().runSync(
    `INSERT INTO entries (id, created_at, raw_transcript, edited_transcript, summary, follow_up, mood, coaching_style)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      row.id,
      row.created_at,
      row.raw_transcript,
      row.edited_transcript,
      row.summary,
      row.follow_up,
      row.mood,
      row.coaching_style,
    ],
  );
}

export function listEntriesByDate(): JournalEntryRow[] {
  return getDb().getAllSync<JournalEntryRow>(
    'SELECT * FROM entries ORDER BY created_at DESC',
  );
}

export function getEntryById(id: string): JournalEntryRow | null {
  return (
    getDb().getFirstSync<JournalEntryRow>(
      'SELECT * FROM entries WHERE id = ?',
      [id],
    ) ?? null
  );
}

export function deleteAllEntries(): void {
  getDb().runSync('DELETE FROM entries');
}
