import { appLabels } from "../data";
import type { ShortcutEntry } from "../../shared/types";

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/ctrlorcmd/g, "cmd ctrl command control")
    .replace(/commandorcontrol/g, "cmd ctrl command control")
    .replace(/cmd/g, "command cmd")
    .replace(/ctrl/g, "control ctrl")
    .replace(/option/g, "alt option")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function compact(value: string): string {
  return normalize(value).replace(/\s+/g, "");
}

function fuzzySequence(term: string, target: string): boolean {
  const needle = compact(term);
  const haystack = compact(target);
  if (!needle) {
    return true;
  }

  let cursor = 0;
  for (const char of haystack) {
    if (char === needle[cursor]) {
      cursor += 1;
      if (cursor === needle.length) {
        return true;
      }
    }
  }

  return false;
}

function searchableFields(entry: ShortcutEntry): string[] {
  return [
    appLabels[entry.app],
    entry.app,
    entry.category,
    entry.action,
    entry.keys.join(" "),
    entry.description,
    entry.tags.join(" ")
  ];
}

export function scoreShortcut(entry: ShortcutEntry, query: string): number {
  const terms = normalize(query)
    .split(/\s+/)
    .filter(Boolean);

  if (terms.length === 0) {
    return 1;
  }

  const fields = searchableFields(entry);
  let score = 0;

  for (const term of terms) {
    let matched = false;

    for (const field of fields) {
      const normalizedField = normalize(field);
      if (normalizedField.includes(term)) {
        score += normalizedField.startsWith(term) ? 8 : 5;
        matched = true;
        break;
      }

      if (fuzzySequence(term, field)) {
        score += 2;
        matched = true;
        break;
      }
    }

    if (!matched) {
      return 0;
    }
  }

  const normalizedQuery = normalize(query);
  if (normalize(entry.action).includes(normalizedQuery)) {
    score += 12;
  }
  if (normalize(entry.keys.join(" ")).includes(normalizedQuery)) {
    score += 10;
  }
  if (normalize(appLabels[entry.app]).includes(normalizedQuery)) {
    score += 4;
  }

  return score;
}
