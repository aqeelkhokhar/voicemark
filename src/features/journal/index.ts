import * as Crypto from 'expo-crypto';

import {
  deleteAllEntries,
  deleteEntryById,
  getEntryById,
  insertEntry,
  JournalEntryRow,
  listEntriesByDate,
} from '@/lib/db';

export type JournalEntry = {
  id: string;
  createdAt: string;
  rawTranscript: string;
  editedTranscript: string;
  summary: string[] | null;
  followUp: string | null;
  mood: string | null;
  coachingStyle: string;
};

export type NewJournalEntry = {
  rawTranscript: string;
  editedTranscript: string;
  summary?: string[] | null;
  followUp?: string | null;
  mood?: string | null;
};

const DEFAULT_COACHING_STYLE = 'reflective';

function fromRow(row: JournalEntryRow): JournalEntry {
  return {
    id: row.id,
    createdAt: row.created_at,
    rawTranscript: row.raw_transcript,
    editedTranscript: row.edited_transcript,
    summary: row.summary ? (JSON.parse(row.summary) as string[]) : null,
    followUp: row.follow_up,
    mood: row.mood,
    coachingStyle: row.coaching_style,
  };
}

export const journal = {
  insert(entry: NewJournalEntry): JournalEntry {
    const row: JournalEntryRow = {
      id: Crypto.randomUUID(),
      created_at: new Date().toISOString(),
      raw_transcript: entry.rawTranscript,
      edited_transcript: entry.editedTranscript,
      summary: entry.summary ? JSON.stringify(entry.summary) : null,
      follow_up: entry.followUp ?? null,
      mood: entry.mood ?? null,
      coaching_style: DEFAULT_COACHING_STYLE,
    };
    insertEntry(row);
    return fromRow(row);
  },

  listByDate(): JournalEntry[] {
    return listEntriesByDate().map(fromRow);
  },

  getById(id: string): JournalEntry | null {
    const row = getEntryById(id);
    return row ? fromRow(row) : null;
  },

  deleteById(id: string): void {
    deleteEntryById(id);
  },

  deleteAll(): void {
    deleteAllEntries();
  },
};
