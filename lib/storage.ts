import { AnalysisResponse } from './metaphysic';
import { displayDob, encodeDob, parseDisplayDob } from './dob';

const READINGS_KEY = 'borndate:saved-readings';

export type SavedReading = {
  dob: string;
  label: string;
  encodedDob: string;
  dominantElement: string;
  insight: string;
  createdAt: string;
};

function canUseStorage() {
  try {
    return typeof window !== 'undefined' && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

export function getSavedReadings(): SavedReading[] {
  if (!canUseStorage()) return [];

  try {
    const saved = window.localStorage.getItem(READINGS_KEY);
    const items: unknown = saved ? JSON.parse(saved) : [];
    if (!Array.isArray(items)) return [];
    return items.filter((item): item is SavedReading =>
      Boolean(
        item &&
          typeof item.dob === 'string' &&
          /^\d{8}$/.test(item.dob) &&
          !parseDisplayDob(item.dob).error &&
          typeof item.dominantElement === 'string'
      )
    );
  } catch (error) {
    return [];
  }
}

export function saveReading(analysis: AnalysisResponse) {
  if (!canUseStorage()) return [];

  const dominantElement =
    analysis.dominant_elements[0]?.name || analysis.core_numbers.spirit.element;
  const item: SavedReading = {
    dob: analysis.dob,
    label: `Reading ${displayDob(analysis.dob)}`,
    encodedDob: encodeDob(analysis.dob),
    dominantElement,
    insight: analysis.weekly_insight.message,
    createdAt: new Date().toISOString(),
  };

  const current = getSavedReadings().filter(
    (reading) => reading.dob !== analysis.dob
  );
  const next = [item, ...current].slice(0, 8);
  try {
    window.localStorage.setItem(READINGS_KEY, JSON.stringify(next));
  } catch {
    /* Readings still work when storage is blocked or full. */
  }
  return next;
}

export function deleteSavedReading(dob: string) {
  if (!canUseStorage()) return [];

  const next = getSavedReadings().filter((reading) => reading.dob !== dob);
  try {
    window.localStorage.setItem(READINGS_KEY, JSON.stringify(next));
  } catch {
    /* Readings still work when storage is blocked or full. */
  }
  return next;
}
