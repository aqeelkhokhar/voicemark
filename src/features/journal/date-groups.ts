import { copy } from '@/copy';
import { JournalEntry } from '@/features/journal';

export type EntryGroup = {
  label: string;
  entries: JournalEntry[];
};

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function groupLabelFor(createdAt: string, now: Date): string {
  const labels = copy.history.dateGroupLabels;
  const today = startOfDay(now);
  const entryDay = startOfDay(new Date(createdAt));
  const diffDays = Math.round(
    (today.getTime() - entryDay.getTime()) / (24 * 60 * 60 * 1000),
  );

  if (diffDays <= 0) return labels.today;
  if (diffDays === 1) return labels.yesterday;
  if (diffDays < 7) return labels.earlierThisWeek;
  return labels.earlier;
}

/** Groups entries (already sorted newest-first) under Appendix D date labels. */
export function groupEntriesByDate(
  entries: JournalEntry[],
  now: Date = new Date(),
): EntryGroup[] {
  const groups: EntryGroup[] = [];
  for (const entry of entries) {
    const label = groupLabelFor(entry.createdAt, now);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.entries.push(entry);
    } else {
      groups.push({ label, entries: [entry] });
    }
  }
  return groups;
}

/** Compact relative date for the Today screen's "Last reflection · " prefix. */
export function relativeDate(
  createdAt: string,
  now: Date = new Date(),
): string {
  const then = new Date(createdAt);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (
    diffHours < 24 &&
    startOfDay(now).getTime() === startOfDay(then).getTime()
  ) {
    return `${diffHours}h ago`;
  }
  const label = groupLabelFor(createdAt, now);
  if (label === copy.history.dateGroupLabels.yesterday) return label;
  return then.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}
