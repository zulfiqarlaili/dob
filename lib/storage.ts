import { AnalysisResponse } from './api';
import { displayDob, encodeDob } from './dob';

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
  return typeof window !== 'undefined' && Boolean(window.localStorage);
}

export function getSavedReadings(): SavedReading[] {
  if (!canUseStorage()) return [];

  try {
    const saved = window.localStorage.getItem(READINGS_KEY);
    return saved ? JSON.parse(saved) : [];
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

  const current = getSavedReadings().filter((reading) => reading.dob !== analysis.dob);
  const next = [item, ...current].slice(0, 8);
  window.localStorage.setItem(READINGS_KEY, JSON.stringify(next));
  return next;
}

export function deleteSavedReading(dob: string) {
  if (!canUseStorage()) return [];

  const next = getSavedReadings().filter((reading) => reading.dob !== dob);
  window.localStorage.setItem(READINGS_KEY, JSON.stringify(next));
  return next;
}
